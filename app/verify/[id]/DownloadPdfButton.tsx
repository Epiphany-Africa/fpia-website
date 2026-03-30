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
const handleDownload = () => {
  const doc = new jsPDF()

  // Watermark
  doc.setTextColor(235, 235, 235)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(70)
  doc.text('FPIA', 105, 140, {
    align: 'center',
    angle: 30,
  })

  // Header
  doc.setFillColor(11, 31, 51)
  doc.rect(0, 0, 210, 30, 'F')

  doc.setTextColor(201, 161, 77)
  doc.setFontSize(10)
  doc.text('FPIA VERIFIED PROPERTY CERTIFICATE', 20, 12)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.text(`#${id}`, 20, 22)

  // Status (UPGRADED)
  doc.setTextColor(34, 139, 34)
  doc.setFontSize(18)
  doc.text(status.toUpperCase(), 20, 45)

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.text(`Status: ${status}`, 20, 55)

  // Property
  doc.text('Property:', 20, 65)
  doc.setFont('helvetica', 'bold')
  doc.text(address, 20, 73)
  doc.setFont('helvetica', 'normal')

  // Certificate details
  doc.text(`Certificate ID: ${id}`, 20, 90)
  doc.text('Issued: 30 March 2026', 20, 100)
  doc.text('Valid Until: 30 March 2027', 20, 108)

  // Hash
  doc.text('Verification Hash:', 20, 120)
  doc.setFont('courier', 'normal')
  doc.text(hash, 20, 128)
  doc.setFont('helvetica', 'normal')

  // QR (slightly adjusted)
  doc.addImage(qrCode, 'PNG', 140, 70, 50, 50)

  doc.setFontSize(10)
  doc.text('Scan to verify', 140, 125)

  // Integrity warning
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(
    'Any alteration of this certificate or its contents invalidates its authenticity.',
    20,
    145
  )

  // Footer
  doc.setTextColor(100)
  doc.text(
    'This certificate can be independently verified via the official FPIA registry.',
    20,
    155
  )
  doc.text(`${COMPANY_NAME} · South Africa`, 20, 165)

  // Signature (adjusted up slightly)
  doc.setDrawColor(0)
  doc.line(20, 175, 90, 175)

  doc.setFontSize(10)
  doc.setTextColor(0)
  doc.text('Authorised Inspector', 20, 183)

  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(COMPANY_NAME, 20, 190)

  // Save
  doc.save(`FPIA-${id}.pdf`)
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