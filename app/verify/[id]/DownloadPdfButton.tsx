'use client'

import { jsPDF } from 'jspdf'

const COMPANY_NAME = 'Fair Properties Inspection Authority (Pty) Ltd'

type Props = {
  id: string
  status: string
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

export default function DownloadPdfButton({
  id,
  status,
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
  recommendation,
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

    const loadRemoteImageAsDataUrl = (src: string) =>
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
        img.onerror = () => reject(new Error(`Failed to load remote image: ${src}`))
        img.src = src
      })

    const safeStatus = status.trim().toLowerCase()
    const statusLabel =
      safeStatus === 'certified'
        ? 'CERTIFIED'
        : safeStatus === 'pending'
        ? 'PENDING'
        : 'NOT CERTIFIED'

    const statusColor: [number, number, number] =
      safeStatus === 'certified'
        ? green
        : safeStatus === 'pending'
        ? [21, 101, 192]
        : [198, 40, 40]

    const issuedLabel = formatDate(issuedDate)
    const validUntilLabel =
      validUntil?.trim() ||
      (safeStatus === 'certified'
        ? 'Active until revoked or superseded'
        : 'Not currently applicable')

    const shortHash =
      hash.length > 36 ? `${hash.slice(0, 18)}...${hash.slice(-8)}` : hash

    const resolvedCompanyName = companyName?.trim() || COMPANY_NAME
    const resolvedInspectorName = inspectorName?.trim() || 'FPIA Inspector'
    const resolvedInspectorRole =
      inspectorRole?.trim() || 'Authorised Certification Officer'

    const inspectorMetaParts = [inspectorCode?.trim(), badgeNumber?.trim()].filter(Boolean)
    const inspectorMeta = inspectorMetaParts.join(' | ')

    try {
      const logoDataUrl = await loadImageAsDataUrl(logoSrc)

      let signatureDataUrl: string | null = null
      let stampDataUrl: string | null = null

      if (signatureImageUrl) {
        try {
          signatureDataUrl = signatureImageUrl.startsWith('/')
            ? await loadImageAsDataUrl(signatureImageUrl)
            : await loadRemoteImageAsDataUrl(signatureImageUrl)
        } catch (error) {
          console.warn('Signature image could not be loaded:', error)
        }
      }

      if (stampImageUrl) {
        try {
          stampDataUrl = stampImageUrl.startsWith('/')
            ? await loadImageAsDataUrl(stampImageUrl)
            : await loadRemoteImageAsDataUrl(stampImageUrl)
        } catch (error) {
          console.warn('Stamp image could not be loaded:', error)
        }
      }

      doc.setFillColor(248, 248, 248)
      doc.rect(0, 0, 210, 297, 'F')

      doc.setFillColor(255, 255, 255)
      doc.roundedRect(15, 20, 180, 245, 2, 2, 'F')

      doc.setFillColor(...navy)
      doc.rect(15, 20, 180, 40, 'F')

      doc.addImage(logoDataUrl, 'PNG', 22, 24, 64, 18)

      doc.setTextColor(...gold)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text('FPIA VERIFIED PROPERTY CERTIFICATE', 22, 52)

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

      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(220, 220, 220)
      doc.roundedRect(138, 66, 40, 42, 1.5, 1.5, 'FD')
      doc.addImage(qrCode, 'PNG', 144, 71, 28, 28)

      doc.setTextColor(...black)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.text('Scan to verify', 158, 101, { align: 'center' })
      doc.text('authenticity', 158, 105, { align: 'center' })

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

        y += Math.max(9, lines.length * 4 + 1)
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

      const boxX = 132
      const boxY = 214
      const boxW = 48
      const boxH = 40

      if (signatureDataUrl) {
        const signatureFormat =
          signatureImageUrl?.toLowerCase().endsWith('.jpg') ||
          signatureImageUrl?.toLowerCase().endsWith('.jpeg')
            ? 'JPEG'
            : 'PNG'

        doc.addImage(signatureDataUrl, signatureFormat, 22, signatureLineY - 14, 42, 12)
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
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.5)
      doc.roundedRect(boxX, boxY, boxW, boxH, 1.5, 1.5, 'FD')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...black)
      doc.text('VERIFICATION NOTICE', boxX + 4, boxY + 7)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.2)
      doc.setTextColor(...grey)
      const verificationNotice =
        'Verification can be performed via the official FPIA registry.'
      const verificationLines = doc.splitTextToSize(verificationNotice, boxW - 8)
      doc.text(verificationLines, boxX + 4, boxY + 13)

      const noteHeadingY = boxY + 24
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...black)
      doc.text('CERTIFICATION NOTE', boxX + 4, noteHeadingY)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.2)
      doc.setTextColor(...grey)
      const noteText =
        recommendation?.trim() ||
        'Certified record issued and active until revoked or superseded.'
      const noteLines = doc.splitTextToSize(noteText, boxW - 8)
      doc.text(noteLines, boxX + 4, noteHeadingY + 5)

      if (stampDataUrl) {
        const stampFormat =
          stampImageUrl?.toLowerCase().endsWith('.jpg') ||
          stampImageUrl?.toLowerCase().endsWith('.jpeg')
            ? 'JPEG'
            : 'PNG'

        doc.addImage(
          stampDataUrl,
          stampFormat,
          98,
          signatureLineY - 4,
          24,
          24,
          undefined,
          'NONE',
          45
        )
      }

      const footerY = 257
      const footerHeight = 8

      doc.setFillColor(...navy)
      doc.rect(15, footerY, 180, footerHeight, 'F')

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(210, 210, 210)
      doc.text('Verified on the official FPIA registry', 22, footerY + 5.2)

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...gold)
      doc.text('ACCOUNTABILITY BUILT IN', 186, footerY + 5.2, { align: 'right' })

      doc.save(`FPIA-${id}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF certificate:', error)
      alert('The certificate could not be generated. Please try again.')
    }
  }

  return (
    <button
      onClick={handleDownload}
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
  )
}