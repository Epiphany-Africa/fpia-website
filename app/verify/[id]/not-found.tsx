import Link from 'next/link'

export default function VerificationRecordNotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #f4f5f2 0%, #ecefe8 100%)',
        color: 'var(--navy)',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: 'clamp(48px, 10vw, 96px) clamp(18px, 5vw, 28px)',
        }}
      >
        <section
          style={{
            backgroundColor: '#fff',
            border: '1px solid rgba(11,31,51,0.1)',
            padding: 'clamp(24px, 5vw, 36px)',
          }}
        >
          <p
            style={{
              margin: '0 0 14px 0',
              fontSize: '11px',
              letterSpacing: '2.2px',
              textTransform: 'uppercase',
              color: '#6C7077',
              fontWeight: 700,
            }}
          >
            Verification Unresolved
          </p>
          <h1
            style={{
              margin: '0 0 12px 0',
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(30px, 6vw, 38px)',
              lineHeight: 1.1,
              color: 'var(--navy)',
            }}
          >
            No FPIA verification record was found for this reference.
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '15px',
              lineHeight: 1.75,
              color: '#55606d',
              maxWidth: '620px',
            }}
          >
            Please check the reference and try again, or contact FPIA if you
            believe this is an error.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '24px',
            }}
          >
            <Link
              href="/verify"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 18px',
                backgroundColor: 'var(--navy)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Verify Another Property
            </Link>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 18px',
                border: '1px solid rgba(11,31,51,0.12)',
                color: 'var(--navy)',
                textDecoration: 'none',
                fontWeight: 700,
                backgroundColor: '#fbfbfa',
              }}
            >
              Return To FPIA
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
