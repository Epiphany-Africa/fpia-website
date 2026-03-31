'use client'

import Image from 'next/image'
import Link from 'next/link'

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
        >
          <Image
            src="/fpia-logo-v2.png"
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
      </div>
    </footer>
  )
}
