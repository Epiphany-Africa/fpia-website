'use client'

import { jsPDF } from 'jspdf'

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

    // Title
    doc.setFontSize(18)
    doc.text('FPIA Property Certification', 20, 20)

    // Status
    doc.setFontSize(14)
    doc.text(`Status: ${status}`, 20, 35)

    // Property
    doc.setFontSize(12)
    doc.text(`Property: ${address}`, 20, 50)

    // Certificate ID
    doc.text(`Certificate ID: ${id}`, 20, 60)

    // Hash
    doc.text(`Verification Hash: ${hash}`, 20, 70)

    // QR Code
    doc.addImage(qrCode, 'PNG', 20, 80, 50, 50)

    // Footer
    doc.setFontSize(10)
    doc.text(
      'Scan QR code to verify this property record on the official FPIA registry.',
      20,
      140
    )

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