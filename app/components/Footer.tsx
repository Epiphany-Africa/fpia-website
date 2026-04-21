'use client'

import Image from 'next/image'
import Link from 'next/link'
import { APP_VERSION_LABEL } from '@/lib/version'

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--navy)',
        color: 'white',
        padding: '56px 80px 48px',
        marginTop: '0',
      }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            width: 'fit-content',
          }}
          aria-label="FPIA home"
        >
          <Image
            src="/fpia-logo.png"
            alt="FPIA Logo"
            width={320}
            height={95}
            priority
            style={{
              objectFit: 'contain',
              width: 'auto',
              height: '72px',
              display: 'block',
            }}
          />
        </Link>

        <p
          style={{
            maxWidth: '560px',
            fontSize: '18px',
            lineHeight: 1.8,
            color: '#d7dce2',
            margin: 0,
          }}
        >
          The independent authority certifying South African properties before
          transfer. Accountability built in.
        </p>

        <p
          style={{
            margin: 0,
            paddingTop: '14px',
            borderTop: '1px solid rgba(201,161,77,0.14)',
            fontSize: '11px',
            letterSpacing: '0.04em',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.54)',
          }}
        >
          © 2026 Fair Properties Inspection Authority. {APP_VERSION_LABEL}
        </p>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          footer {
            padding: 44px 32px 40px !important;
          }
        }

        @media (max-width: 640px) {
          footer {
            padding: 36px 18px 34px !important;
          }
        }
      `}</style>
    </footer>
  )
}
