import { createHash, createHmac, randomBytes } from 'crypto'
import { readFile } from 'fs/promises'
import path from 'path'
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import { resolveCertificateAuthorityPresentation } from '@/lib/authority/resolveCertificateAuthorityPresentation'
import {
  getCanonicalTrustState,
  type TrustOutcome,
} from '@/lib/certification/getCanonicalTrustState'
import { getTrustBadgeMeta } from '@/lib/certification/getTrustBadgeMeta'
import { loadPublicVerificationRecord } from '@/lib/verification/loadPublicVerificationRecord'

const COMPANY_NAME = 'Fair Properties Inspection Authority (Pty) Ltd'
const ALLOWED_REMOTE_HOSTS = new Set(['lpgvjyxwouttbvpgivtu.supabase.co'])
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

function formatDate(input?: string | null) {
  if (!input) return 'Not available'

  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return 'Not available'

  return new Intl.DateTimeFormat('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function normalizeAssetPath(input: string | null | undefined, fallback?: string | null) {
  const value = input?.trim()

  if (!value) return fallback ?? null
  if (
    value.startsWith('/') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:')
  ) {
    return value
  }

  if (fallback) return fallback

  return `/${value.replace(/^\/+/, '')}`
}

function getMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.svg':
      return 'image/svg+xml'
    case '.webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}

function getImageFormat(dataUrl: string): 'PNG' | 'JPEG' | 'WEBP' {
  if (dataUrl.startsWith('data:image/jpeg')) {
    return 'JPEG'
  }

  if (dataUrl.startsWith('data:image/webp')) {
    return 'WEBP'
  }

  return 'PNG'
}

function bufferToDataUrl(buffer: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${buffer.toString('base64')}`
}

function isAllowedRemoteAsset(url: URL) {
  if (url.protocol !== 'https:') {
    return false
  }

  if (!ALLOWED_REMOTE_HOSTS.has(url.hostname)) {
    return false
  }

  return url.pathname.startsWith('/storage/v1/object/public/')
}

async function loadAssetAsDataUrl(src: string) {
  if (src.startsWith('data:')) {
    return src
  }

  if (src.startsWith('/')) {
    const resolvedPath = path.resolve(PUBLIC_DIR, `.${src}`)
    if (!resolvedPath.startsWith(PUBLIC_DIR)) {
      throw new Error('Unsupported local asset path.')
    }

    const buffer = await readFile(resolvedPath)
    return bufferToDataUrl(buffer, getMimeType(resolvedPath))
  }

  const remoteUrl = new URL(src)
  if (!isAllowedRemoteAsset(remoteUrl)) {
    throw new Error('Unsupported remote asset URL.')
  }

  const response = await fetch(remoteUrl, {
    headers: {
      Accept: 'image/*,*/*;q=0.8',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Asset could not be loaded: ${remoteUrl.toString()}`)
  }

  const bytes = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') ?? getMimeType(remoteUrl.pathname)
  return bufferToDataUrl(bytes, contentType)
}

function deriveOwnerPassword(normalizedId: string, verificationHash: string) {
  const secret = process.env.CERTIFICATE_PDF_OWNER_SECRET?.trim()

  if (secret) {
    return createHmac('sha256', secret)
      .update(`${normalizedId}:${verificationHash}`)
      .digest('hex')
  }

  return randomBytes(32).toString('hex')
}

function buildFileId(normalizedId: string, verificationHash: string) {
  return createHash('md5')
    .update(`${normalizedId}:${verificationHash}`)
    .digest('hex')
    .toUpperCase()
    .slice(0, 32)
}

function getValidUntilLabel(trustState: TrustOutcome) {
  if (trustState === 'FINAL_VERIFIED') {
    return 'Active until revoked or superseded'
  }

  if (trustState === 'CONDITIONAL') {
    return 'Conditionally active subject to recorded conditions'
  }

  if (trustState === 'SUPERSEDED') {
    return 'Superseded by a newer authority-issued record'
  }

  if (trustState === 'REVOKED') {
    return 'No longer valid'
  }

  return 'Not applicable'
}

function getCertificateHeading(trustState: TrustOutcome) {
  if (trustState === 'CONDITIONAL') {
    return 'FPIA CONDITIONAL PROPERTY CERTIFICATE'
  }

  if (trustState === 'REVOKED') {
    return 'FPIA REVOKED PROPERTY CERTIFICATE'
  }

  if (trustState === 'FINAL_VERIFIED') {
    return 'FPIA VERIFIED PROPERTY RECORD'
  }

  return 'FPIA PROPERTY INSPECTION OUTCOME'
}

function getTopNoteTitle(trustState: TrustOutcome) {
  if (trustState === 'CONDITIONAL') {
    return 'CONDITIONAL NOTE'
  }

  if (trustState === 'REVOKED') {
    return 'REVOCATION NOTE'
  }

  if (trustState === 'FINAL_VERIFIED') {
    return 'CERTIFICATION NOTE'
  }

  return 'ASSESSMENT NOTE'
}

function getTopNoteText(trustState: TrustOutcome) {
  if (trustState === 'CONDITIONAL') {
    return 'Conditional certification issued subject to recorded conditions.'
  }

  if (trustState === 'REVOKED') {
    return 'This certificate has been revoked and should not be relied upon.'
  }

  if (trustState === 'FINAL_VERIFIED') {
    return 'Certified record issued and active until revoked or superseded.'
  }

  return 'No active certification is currently in force for this property.'
}

export async function buildProtectedCertificatePdf(id: string) {
  const record = await loadPublicVerificationRecord(id)
  const {
    normalizedId,
    registry,
    property,
    certificate,
    caseRecord,
    authority,
    authorityAssets,
    legacyInspector,
    verificationUrl,
  } = record

  if (!registry && !certificate) {
    throw new Error('Certificate record not found.')
  }

  const trustState = getCanonicalTrustState({
    certificateState: certificate?.certificate_state,
    caseStatus: registry?.status ?? caseRecord?.status,
    complianceStage: caseRecord?.compliance_stage,
    inspectionStatus: certificate?.inspection_status,
    reviewOutcome: registry?.review_outcome,
    workflowStatus: registry?.workflow_status,
    revokedAt: certificate?.revoked_at,
    isLocked: registry?.is_locked,
  })

  const verificationHash =
    certificate?.integrity_hash ??
    registry?.final_hash ??
    registry?.report_hash ??
    'No active verification hash'

  const identityParts = [
    caseRecord?.unit_number,
    caseRecord?.scheme_name,
    property?.unit_number,
    property?.building_name,
    property?.complex_name,
    property?.estate_name,
  ].filter(Boolean)

  const addressLine1 = identityParts.join(' ')
  const addressLine2 = property?.address ?? caseRecord?.property_address ?? ''
  const propertyAddress =
    addressLine1 || addressLine2
      ? [addressLine1, addressLine2].filter(Boolean).join('\n')
      : trustState === 'NOT_ISSUED'
      ? 'No active certified property record found'
      : 'Unknown property'

  const provinceParts = [
    property?.city,
    property?.province,
    property?.postal_code,
  ].filter(Boolean)

  const propertyProvince =
    provinceParts.length > 0
      ? provinceParts.join(', ')
      : caseRecord
      ? 'Case record only'
      : trustState === 'NOT_ISSUED'
      ? 'Registry lookup only'
      : 'Location not available'

  const {
    authorityName,
    authorityTitle,
    authorityCode,
    authorityBadgeNumber,
    authorityCompanyName,
    resolvedSignatureImageUrl,
    resolvedStampImageUrl,
  } = resolveCertificateAuthorityPresentation({
    normalizedId,
    authority,
    authorityAssets,
    legacyInspector,
    certificate,
  })

  const documentId =
    registry?.certificate_number ??
    registry?.report_code ??
    certificate?.certificate_number ??
    certificate?.verification_ref ??
    normalizedId

  const ownerPassword = deriveOwnerPassword(normalizedId, verificationHash)
  const fileId = buildFileId(normalizedId, verificationHash)
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 180,
    margin: 1,
  })

  const logoDataUrl = await loadAssetAsDataUrl('/fpia-logo.png')
  const watermarkDataUrl = await loadAssetAsDataUrl('/fpia-watermark.png')

  const signatureDataUrl = resolvedSignatureImageUrl
    ? await loadAssetAsDataUrl(normalizeAssetPath(resolvedSignatureImageUrl) as string).catch(
        () => null
      )
    : null

  const stampDataUrl = resolvedStampImageUrl
    ? await loadAssetAsDataUrl(normalizeAssetPath(resolvedStampImageUrl) as string).catch(
        () => null
      )
    : null

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
    encryption: {
      userPassword: '',
      ownerPassword,
      userPermissions: [],
    },
  })

  doc.setFileId(fileId)
  doc.setDocumentProperties({
    title: `FPIA ${documentId}`,
    subject: 'Protected FPIA certificate',
    author: authorityName,
    creator: 'FPIA Protected PDF Service',
    keywords: 'FPIA, certificate, protected, encrypted',
  })

  const navy: [number, number, number] = [11, 31, 51]
  const gold: [number, number, number] = [201, 161, 77]
  const green: [number, number, number] = [34, 139, 34]
  const amber: [number, number, number] = [183, 121, 31]
  const revokedRed: [number, number, number] = [122, 28, 28]
  const dangerRed: [number, number, number] = [198, 40, 40]
  const grey: [number, number, number] = [110, 110, 110]
  const lightGrey: [number, number, number] = [235, 235, 235]
  const black: [number, number, number] = [0, 0, 0]

  const badgeMeta = getTrustBadgeMeta(trustState)
  const statusColor: [number, number, number] =
    trustState === 'FINAL_VERIFIED'
      ? green
      : trustState === 'CONDITIONAL'
      ? amber
      : trustState === 'REVOKED'
      ? revokedRed
      : dangerRed

  const certificateHeading = getCertificateHeading(trustState)
  const topNoteTitle = getTopNoteTitle(trustState)
  const topNoteText = getTopNoteText(trustState)
  const validUntilLabel = getValidUntilLabel(trustState)
  const issuedLabel = formatDate(registry?.issued_at ?? certificate?.issued_at)
  const shortHash =
    verificationHash.length > 36
      ? `${verificationHash.slice(0, 18)}...${verificationHash.slice(-8)}`
      : verificationHash

  const inspectorMetaParts = [authorityCode?.trim(), authorityBadgeNumber?.trim()].filter(Boolean)
  const inspectorMeta = inspectorMetaParts.join(' | ')

  doc.setFillColor(248, 248, 248)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFillColor(255, 255, 255)
  doc.roundedRect(15, 20, 180, 245, 2, 2, 'F')

  doc.addImage(watermarkDataUrl, 'PNG', 14, 120, 182, 82)

  doc.setFillColor(...navy)
  doc.rect(15, 20, 180, 40, 'F')

  doc.addImage(logoDataUrl, 'PNG', 22, 24, 64, 18)

  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(certificateHeading, 22, 52)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.text(`#${documentId}`, 22, 58)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...black)
  doc.text('Status', 22, 76)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(...statusColor)
  doc.text(badgeMeta.label, 44, 76)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...grey)
  doc.text(badgeMeta.descriptor, 44, 81)

  doc.setTextColor(...black)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Property:', 22, 88)

  doc.setFont('times', 'bold')
  doc.setFontSize(13)
  const fullAddress = [propertyAddress, propertyProvince].filter(Boolean).join('\n')
  const addressLines = fullAddress
    .split('\n')
    .flatMap((line) => doc.splitTextToSize(line, 105))
  doc.text(addressLines, 22, 96)

  const topBoxCenterX = 156

  doc.setTextColor(...black)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.2)
  doc.text('VERIFICATION', topBoxCenterX, 75.2, { align: 'center' })
  doc.text('NOTICE', topBoxCenterX, 78.4, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.6)
  doc.setTextColor(...grey)
  const topVerificationLines = doc.splitTextToSize(
    'Use the official FPIA registry link or QR code for live verification.',
    38
  )
  doc.text(topVerificationLines, topBoxCenterX, 81.5, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.2)
  doc.setTextColor(...black)
  doc.text(topNoteTitle, topBoxCenterX, 90.2, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.6)
  doc.setTextColor(...grey)
  const topNoteLines = doc.splitTextToSize(topNoteText, 38)
  doc.text(topNoteLines, topBoxCenterX, 93.5, { align: 'center' })

  doc.setDrawColor(210, 210, 210)
  doc.line(20, 116, 190, 116)

  doc.setTextColor(...grey)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('CERTIFICATE DETAILS', 22, 124)

  const labelX = 22
  const valueX = 78
  let y = 133

  const detailRow = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...black)
    doc.text(label, labelX, y)

    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(value, 105)
    doc.text(lines, valueX, y)

    y += Math.max(8, lines.length * 4)
  }

  detailRow('Certificate ID', documentId)
  detailRow('Issued', issuedLabel)
  detailRow('Valid Until', validUntilLabel)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...black)
  doc.text('Verification Hash', labelX, y)

  doc.setFont('courier', 'normal')
  doc.setFontSize(9)
  doc.text(shortHash, valueX, y)
  y += 10

  if (certificate?.certificate_type) {
    detailRow('Certificate Type', certificate.certificate_type)
  }

  doc.setDrawColor(...lightGrey)
  doc.line(22, y - 4, 188, y - 4)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...grey)
  doc.text(
    doc.splitTextToSize(
      'This certificate confirms that the above property has been independently inspected and verified in accordance with FPIA standards.',
      150
    ),
    22,
    y + 5
  )
  doc.text(
    doc.splitTextToSize(
      'PDF permissions restrict copying, editing, annotation, and extraction in compliant PDF viewers. Any alteration invalidates authenticity and must be checked against the live registry.',
      150
    ),
    22,
    y + 18
  )

  const authorityTopY = 222
  const signatureLineY = authorityTopY
  const authorityTextY = authorityTopY + 8
  const qrBoxX = 134
  const qrBoxY = 200
  const qrBoxW = 44
  const qrBoxH = 44

  if (signatureDataUrl) {
    doc.addImage(
      signatureDataUrl,
      getImageFormat(signatureDataUrl),
      22,
      signatureLineY - 17,
      58,
      17
    )
  }

  doc.setDrawColor(...black)
  doc.line(22, signatureLineY, 90, signatureLineY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...black)
  doc.text(authorityName, 22, authorityTextY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...grey)
  doc.text(authorityTitle, 22, authorityTextY + 5)

  if (inspectorMeta) {
    doc.text(inspectorMeta, 22, authorityTextY + 10)
  }

  doc.text(authorityCompanyName?.trim() || COMPANY_NAME, 22, authorityTextY + 15)

  doc.setFillColor(248, 249, 250)
  doc.setDrawColor(210, 210, 210)
  doc.setLineWidth(0.5)
  doc.roundedRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, 1.5, 1.5, 'FD')
  doc.addImage(qrCodeDataUrl, 'PNG', qrBoxX + 10, qrBoxY + 5, 24, 24)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...black)
  doc.text('SCAN TO VERIFY', qrBoxX + qrBoxW / 2, qrBoxY + 34, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.4)
  doc.setTextColor(...grey)
  doc.text('LIVE RECORD', qrBoxX + qrBoxW / 2, qrBoxY + 38, { align: 'center' })

  if (stampDataUrl) {
    doc.addImage(
      stampDataUrl,
      getImageFormat(stampDataUrl),
      94,
      signatureLineY - 6,
      22,
      22,
      undefined,
      'FAST',
      45
    )
  }

  const footerY = 257
  const footerHeight = 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(...grey)
  doc.text('This document is cryptographically anchored to the FPIA registry.', 105, footerY - 3, {
    align: 'center',
  })

  doc.setFillColor(...navy)
  doc.rect(15, footerY, 180, footerHeight, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(210, 210, 210)
  doc.text('Verified on the official FPIA registry', 22, footerY + 5)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...gold)
  doc.text('ACCOUNTABILITY BUILT IN', 186, footerY + 5, { align: 'right' })

  return {
    documentId,
    pdfBytes: Buffer.from(doc.output('arraybuffer')),
  }
}
