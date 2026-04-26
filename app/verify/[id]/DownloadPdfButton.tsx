'use client'

type Props = {
  id: string
  trustState?: unknown
  address?: string
  province?: string | null
  hash?: string
  qrCode?: string
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

export default function DownloadPdfButton({ id }: Props) {
  const handleDownload = () => {
    window.location.assign(`/api/certificate-pdf/${encodeURIComponent(id)}`)
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
