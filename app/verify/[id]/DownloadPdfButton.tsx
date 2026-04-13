'use client'

import { jsPDF } from 'jspdf'
import type { TrustOutcome } from '@/lib/certification/getCanonicalTrustState'
import { getTrustBadgeMeta } from '@/lib/certification/getTrustBadgeMeta'

const COMPANY_NAME = 'Fair Properties Inspection Authority (Pty) Ltd'

type Props = {
  id: string
  trustState: TrustOutcome
  address: string
  province?: string | null
  hash: string
  qrCode: string
  issuedDate?: string | null
  validUntil?: string | null
  inspectorName?: string | null
  inspectorRole?: string | null
  inspectorCode?: string | null
  badgeNumber?: string | null
  companyName?: string | null
  certificateType?: string | null
  recommendation?: string | null
  signatureImageUrl?: string | null
  stampImageUrl?: string | null
}

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

function getWatermarkHashLabel(hash: string) {
  if (!hash || hash === 'No active verification hash') {
    return 'HASH VERIFIED: RECORD PENDING'
  }

  const normalizedHash = hash.replace(/^sha256:/i, '')
  return `HASH VERIFIED: ${normalizedHash.slice(0, 12)}`
}

function normalizeAssetPath(
  input: string | null | undefined,
  fallback?: string | null
) {
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

function buildCertificateWatermarkSvg(hash: string) {
  const hashLabel = getWatermarkHashLabel(hash)

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520">
      <g transform="translate(600 260) rotate(28)">
        <text
          x="0"
          y="-12"
          text-anchor="middle"
          fill="rgba(60,78,98,0.077)"
          font-family="Times New Roman, serif"
          font-size="60"
          font-weight="700"
          letter-spacing="0.11em"
        >
          FAIR PROPERTY CERTIFIED<tspan dx="-1" dy="-21" font-size="26">™</tspan>
        </text>
        <text
          x="0"
          y="30"
          text-anchor="middle"
          fill="rgba(60,78,98,0.082)"
          font-family="Helvetica, Arial, sans-serif"
          font-size="14"
          font-weight="700"
          letter-spacing="0.085em"
        >
          ${hashLabel}
        </text>
      </g>
    </svg>
  `.trim()
}

export default function DownloadPdfButton({
  id,
  trustState,
  address,
  province,
  hash,
  qrCode,
  issuedDate,
  validUntil,
  inspectorName,
  inspectorRole,
  inspectorCode,
  badgeNumber,
  companyName,
  certificateType,
  signatureImageUrl,
  stampImageUrl,
}: Props) {
  const handleDownload = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
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

    const logoSrc = '/fpia-logo.png'

    const loadImageAsDataUrl = (src: string) =>
      new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('Could not create canvas context'))
            return
          }

          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
        img.src = src
      })

    const loadBlobAsDataUrl = (blob: Blob) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result
          if (typeof result === 'string') {
            resolve(result)
            return
          }

          reject(new Error('Could not convert blob to data URL'))
        }
        reader.onerror = () => reject(new Error('Could not read blob as data URL'))
        reader.readAsDataURL(blob)
      })

    const loadFetchedAssetAsDataUrl = async (src: string) => {
      const response = await fetch(src, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Failed to fetch asset: ${src}`)
      }

      return loadBlobAsDataUrl(await response.blob())
    }

    const buildAssetFetchPath = (src: string) => {
      if (src.startsWith('data:')) return src
      if (src.startsWith('/')) return src
      return `/api/public-asset?src=${encodeURIComponent(src)}`
    }

    const badgeMeta = getTrustBadgeMeta(trustState)
    const statusLabel = badgeMeta.label

    const statusColor: [number, number, number] =
      trustState === 'FINAL_VERIFIED'
        ? green
        : trustState === 'CONDITIONAL'
        ? amber
        : trustState === 'REVOKED'
        ? revokedRed
        : dangerRed

    const certificateHeading =
      trustState === 'CONDITIONAL'
        ? 'FPIA CONDITIONAL PROPERTY CERTIFICATE'
        : trustState === 'REVOKED'
        ? 'FPIA REVOKED PROPERTY CERTIFICATE'
        : trustState === 'FINAL_VERIFIED'
        ? 'FPIA VERIFIED PROPERTY RECORD'
        : 'FPIA PROPERTY INSPECTION OUTCOME'

    const issuedLabel = formatDate(issuedDate)

      const validUntilLabel =
        validUntil?.trim() ||
        (trustState === 'FINAL_VERIFIED'
        ? 'Active until revoked or superseded'
        : trustState === 'CONDITIONAL'
        ? 'Conditionally active subject to recorded conditions'
        : trustState === 'REVOKED'
        ? 'No longer valid'
        : 'Not currently applicable')

      const shortHash =
        hash.length > 36 ? `${hash.slice(0, 18)}...${hash.slice(-8)}` : hash

      const topNoteTitle =
        trustState === 'CONDITIONAL'
          ? 'CONDITIONAL NOTE'
          : trustState === 'REVOKED'
          ? 'REVOCATION NOTE'
          : trustState === 'FINAL_VERIFIED'
          ? 'CERTIFICATION NOTE'
          : 'ASSESSMENT NOTE'

      const topNoteText =
        trustState === 'CONDITIONAL'
          ? 'Conditional certification issued subject to recorded conditions.'
          : trustState === 'REVOKED'
          ? 'This certificate has been revoked and should not be relied upon.'
          : trustState === 'FINAL_VERIFIED'
          ? 'Certified record issued and active until revoked or superseded.'
          : 'No active certification is currently in force for this property.'

      const topVerificationNotice =
        'Use the official FPIA registry link or QR code for live verification.'

    const resolvedCompanyName = companyName?.trim() || COMPANY_NAME
    const resolvedInspectorName = inspectorName?.trim() || 'FPIA Inspector'
    const resolvedInspectorRole =
      inspectorRole?.trim() || 'Authorised Certification Officer'
    const demoSignatureFallback =
      id.toUpperCase() === 'ZA-2024-00142' ? '/signatures/INS-001.png' : null
    const resolvedSignatureImageUrl = normalizeAssetPath(
      signatureImageUrl,
      demoSignatureFallback ||
        (inspectorCode?.trim() ? `/signatures/${inspectorCode.trim()}.png` : null)
    )
    const resolvedStampImageUrl = normalizeAssetPath(stampImageUrl)

    const inspectorMetaParts = [inspectorCode?.trim(), badgeNumber?.trim()].filter(Boolean)
    const inspectorMeta = inspectorMetaParts.join(' | ')

    try {
      const logoDataUrl = await loadImageAsDataUrl(logoSrc)
      const watermarkSvg = buildCertificateWatermarkSvg(hash)
      const watermarkDataUrl = await loadImageAsDataUrl(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(watermarkSvg)}`
      )

      let signatureDataUrl: string | null = null
      let stampDataUrl: string | null = null

      if (resolvedSignatureImageUrl) {
        try {
          signatureDataUrl = await loadFetchedAssetAsDataUrl(
            buildAssetFetchPath(resolvedSignatureImageUrl)
          )
        } catch (error) {
          console.warn('Signature image could not be loaded:', error)
        }
      }

      if (resolvedStampImageUrl) {
        try {
          stampDataUrl = await loadFetchedAssetAsDataUrl(
            buildAssetFetchPath(resolvedStampImageUrl)
          )
        } catch (error) {
          console.warn('Stamp image could not be loaded:', error)
        }
      }

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
      doc.text(`#${id}`, 22, 58)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...black)
      doc.text('Status', 22, 76)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(...statusColor)
      doc.text(statusLabel, 44, 76)

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
      const fullAddress = [address, province].filter(Boolean).join('\n')
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
      const topVerificationLines = doc.splitTextToSize(topVerificationNotice, 38)
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

      detailRow('Certificate ID', id)
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

      if (certificateType) {
        detailRow('Certificate Type', certificateType)
      }

      const legalText1 =
        'This certificate confirms that the above property has been independently inspected and verified in accordance with FPIA standards.'
      const legalText2 =
        'Any alteration or misrepresentation of this certificate invalidates its authenticity.'

      doc.setDrawColor(...lightGrey)
      doc.line(22, y - 4, 188, y - 4)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(...grey)
      doc.text(doc.splitTextToSize(legalText1, 150), 22, y + 5)
      doc.text(doc.splitTextToSize(legalText2, 150), 22, y + 18)

      const authorityTopY = 222
      const signatureLineY = authorityTopY
      const authorityTextY = authorityTopY + 8

      const qrBoxX = 134
      const qrBoxY = 200
      const qrBoxW = 44
      const qrBoxH = 44

      if (signatureDataUrl) {
        const signatureFormat =
          resolvedSignatureImageUrl?.toLowerCase().endsWith('.jpg') ||
          resolvedSignatureImageUrl?.toLowerCase().endsWith('.jpeg')
            ? 'JPEG'
            : 'PNG'

        doc.addImage(signatureDataUrl, signatureFormat, 22, signatureLineY - 17, 58, 17)
      }

      doc.setDrawColor(...black)
      doc.line(22, signatureLineY, 90, signatureLineY)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(...black)
      doc.text(resolvedInspectorName, 22, authorityTextY)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(...grey)
      doc.text(resolvedInspectorRole, 22, authorityTextY + 5)

      if (inspectorMeta) {
        doc.text(inspectorMeta, 22, authorityTextY + 10)
      }

      doc.text(resolvedCompanyName, 22, authorityTextY + 15)

      doc.setFillColor(248, 249, 250)
      doc.setDrawColor(210, 210, 210)
      doc.setLineWidth(0.5)
      doc.roundedRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, 1.5, 1.5, 'FD')
      doc.addImage(qrCode, 'PNG', qrBoxX + 10, qrBoxY + 5, 24, 24)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(...black)
      doc.text('SCAN TO VERIFY', qrBoxX + qrBoxW / 2, qrBoxY + 34, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.4)
      doc.setTextColor(...grey)
      doc.text('LIVE RECORD', qrBoxX + qrBoxW / 2, qrBoxY + 38, { align: 'center' })

      if (stampDataUrl) {
        const stampFormat =
          resolvedStampImageUrl?.toLowerCase().endsWith('.jpg') ||
          resolvedStampImageUrl?.toLowerCase().endsWith('.jpeg')
            ? 'JPEG'
            : 'PNG'

        doc.addImage(
          stampDataUrl,
          stampFormat,
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
      doc.text(
        'This document is cryptographically anchored to the FPIA registry.',
        105,
        footerY - 3,
        { align: 'center' }
      )

      doc.setFillColor(...navy)
      doc.rect(15, footerY, 180, footerHeight, 'F')

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(210, 210, 210)
      doc.text('Verified on the official FPIA registry', 22, footerY + 5)

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...gold)
      doc.text('ACCOUNTABILITY BUILT IN', 186, footerY + 5, { align: 'right' })

      doc.save(`FPIA-${id}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF certificate:', error)
      alert('The certificate could not be generated. Please try again.')
    }
  }

  return (
    <>
      <button
        onClick={handleDownload}
        className="fpia-download-button"
        style={{
          padding: '10px 16px',
          backgroundColor: 'var(--gold)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Download Certificate
      </button>

      <style jsx>{`
        .fpia-download-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          border-radius: 6px;
          width: auto;
        }

        @media (max-width: 640px) {
          .fpia-download-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}
