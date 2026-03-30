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

    // Header
    doc.setFillColor(11, 31, 51)
    doc.rect(0, 0, 210, 30, 'F')

    doc.setTextColor(201, 161, 77)
    doc.setFontSize(10)
    doc.text('FPIA VERIFIED PROPERTY CERTIFICATE', 20, 12)

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text(`#${id}`, 20, 22)

    // Status
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text(`Status: ${status}`, 20, 45)

    // Property
    doc.setFontSize(12)
    doc.text('Property:', 20, 60)
    doc.setFont('helvetica', 'bold')
    doc.text(address, 20, 68)
    doc.setFont('helvetica', 'normal')

    // Certificate details
    doc.text(`Certificate ID: ${id}`, 20, 85)
    doc.setFontSize(11)
    doc.setTextColor(0)
    doc.text('Issued: 30 March 2026', 20, 95)
    doc.text('Valid Until: 30 March 2027', 20, 103)

    // Hash
    doc.text('Verification Hash:', 20, 115)
    doc.setFont('courier', 'normal')
    doc.text(hash, 20, 123)
    doc.setFont('helvetica', 'normal')

    // QR
    doc.addImage(qrCode, 'PNG', 140, 60, 50, 50)

    // QR label
    doc.setFontSize(10)
    doc.text('Scan to verify', 140, 115)

    // Integrity warning
    doc.setFontSize(9)
    doc.setTextColor(120)
    doc.text(
      'Any alteration of this certificate or its contents invalidates its authenticity.',
      20,
      145
    )

    // Footer
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(
      'This certificate can be independently verified via the official FPIA registry.',
      20,
      155
    )
    doc.text(
      'Fair Properties Inspection Authority (FPIA) · South Africa',
      20,
      165
    )

    // Signature block
    doc.setDrawColor(200)
    doc.line(20, 180, 80, 180)

    doc.setFontSize(10)
    doc.setTextColor(0)
    doc.text('Authorised Inspector', 20, 188)

    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text('Fair Properties Inspection Authority (FPIA)', 20, 200)

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