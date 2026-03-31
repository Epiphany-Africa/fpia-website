'use client'

import { jsPDF } from 'jspdf'

const COMPANY_NAME = 'Fair Properties Inspection Authority (Pty) Ltd'

type Props = {
  id: string
  status: string
  address: string
  hash: string
  qrCode: string
}

export default function DownloadPdfButton({
  id,
  status,
  address,
  hash,
  qrCode,
}: Props) {
  const handleDownload = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()

    const navy: [number, number, number] = [11, 31, 51]
    const gold: [number, number, number] = [201, 161, 77]
    const green: [number, number, number] = [34, 139, 34]
    const grey: [number, number, number] = [110, 110, 110]
    const lightGrey: [number, number, number] = [235, 235, 235]
    const black: [number, number, number] = [0, 0, 0]

    const watermarkSrc = '/fpia-watermark.png'

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

          ctx.globalAlpha = 0.12
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
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

    const validUntil =
      safeStatus === 'certified' ? '30 March 2027' : 'Not currently applicable'

    const issuedDate = '30 March 2026'
    const shortHash = hash.length > 28 ? `${hash.slice(0, 28)}...` : hash

    try {
      const watermarkDataUrl = await loadImageAsDataUrl(watermarkSrc)

      // Background
      doc.setFillColor(248, 248, 248)
      doc.rect(0, 0, 210, 297, 'F')

      // Main certificate panel
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(15, 20, 180, 245, 2, 2, 'F')

      // Header band
      doc.setFillColor(...navy)
      doc.rect(15, 20, 180, 26, 'F')

      doc.setTextColor(...gold)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('FPIA VERIFIED PROPERTY CERTIFICATE', 22, 30)

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(13)
      doc.text(`#${id}`, 22, 39)

      // Subtle watermark seal - bottom right
      doc.addImage(watermarkDataUrl, 'PNG', 146, 198, 40, 40)

    // Status block (final layout)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...black)
      doc.text('Status', 22, 62)

      // Certified to the right of Status
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(...statusColor)
      doc.text(statusLabel, 50, 62)

      // Property block
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('Property:', 22, 86)

      doc.setFont('times', 'bold')
      doc.setFontSize(14)
      doc.text(address, 22, 96)

      // QR block
      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(220, 220, 220)
      doc.roundedRect(140, 58, 42, 52, 1.5, 1.5, 'FD')
      doc.addImage(qrCode, 'PNG', 146, 64, 30, 30)

      doc.setTextColor(...black)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.text('Scan to verify', 161, 98, { align: 'center' })
      doc.text('authenticity', 161, 102, { align: 'center' })

      // Certificate details section
      doc.setDrawColor(230, 230, 230)
      doc.line(22, 110, 188, 110)

      doc.setTextColor(...grey)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.text('CERTIFICATE DETAILS', 22, 118)

      const labelX = 22
      const valueX = 78
      let y = 128

      const detailRow = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(...black)
        doc.text(label, labelX, y)

        doc.setFont('helvetica', 'normal')
        doc.text(value, valueX, y)
        y += 11
      }

      detailRow('Certificate ID', id)
      detailRow('Issued', issuedDate)
      detailRow('Valid Until', validUntil)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(...black)
      doc.text('Verification Hash', labelX, y)

      doc.setFont('courier', 'normal')
      doc.setFontSize(9)
      doc.text(shortHash, valueX, y)
      y += 14

      // Legal text
      doc.setDrawColor(...lightGrey)
      doc.line(22, y - 4, 188, y - 4)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...grey)

      const legalText1 =
        'This certificate confirms that the above property has been independently inspected and verified in accordance with FPIA standards.'
      const legalText2 =
        'Any alteration or misrepresentation of this certificate invalidates its authenticity.'
      const legalText3 =
        'Verification can be performed via the official FPIA registry.'

      doc.text(doc.splitTextToSize(legalText1, 150), 22, y + 5)
      doc.text(doc.splitTextToSize(legalText2, 150), 22, y + 20)
      doc.text(doc.splitTextToSize(legalText3, 150), 22, y + 33)

      // Signature block
      doc.setDrawColor(...black)
      doc.line(22, 232, 88, 232)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(...black)
      doc.text('Authorised Certification Officer', 22, 240)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(...grey)
      doc.text(COMPANY_NAME, 22, 247)

      // Footer strip
      doc.setFillColor(...navy)
      doc.rect(15, 252, 180, 13, 'F')

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(210, 210, 210)
      doc.text('Verified on the official FPIA registry', 22, 260)

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...gold)
      doc.text('ACCOUNTABILITY BUILT IN', 188, 260, { align: 'right' })

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