'use client'

import Image from 'next/image'
import Link from 'next/link'
import { APP_VERSION_LABEL } from '@/lib/version'

const primaryLinks = [
  { label: 'Request Inspection', href: '/request-inspection' },
  { label: 'Register Property', href: '/register' },
  { label: 'Property Passport', href: '/property-passport' },
  { label: 'Verify Certificate', href: '/verify' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
]

const audienceLinks = [
  { label: 'For Buyers', href: '/for-buyers' },
  { label: 'For Sellers', href: '/for-sellers' },
  { label: 'For Property Practitioners', href: '/for-agents' },
  { label: 'For Insurers', href: '/for-insurers' },
  { label: 'For Bond Originators', href: '/for-bond-originators' },
]

const utilityLinks = [
  { label: 'Admin Login', href: '/admin' },
  { label: 'Agency Accounts', href: '/contact?inquiry=agency-account' },
  { label: 'Certificate Renewal', href: '/contact?inquiry=renewal' },
]

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
          The accountability layer for residential property — governed evidence,
          controlled issuance, and verification built in.
        </p>

        <div
          className="fpia-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) repeat(3, minmax(0, 0.8fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          <div
            style={{
              border: '1px solid rgba(201,161,77,0.18)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              padding: '18px 20px',
            }}
          >
            <p
              style={{
                margin: '0 0 10px 0',
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              Live Access
            </p>
            <p style={{ margin: '0 0 14px 0', fontSize: '14px', lineHeight: 1.7, color: '#d7dce2' }}>
              Move directly into the registry, property intake, or admin workspace from any page.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Link href="/verify" style={primaryChipStyle}>
                Open Registry
              </Link>
              <Link href="/admin" style={secondaryChipStyle}>
                Admin Login
              </Link>
            </div>
          </div>

          <FooterLinkGroup title="Primary" links={primaryLinks} />
          <FooterLinkGroup title="For You" links={audienceLinks} />
          <FooterLinkGroup title="Utilities" links={utilityLinks} />
        </div>

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
        .fpia-footer-link:hover {
          color: #ffffff !important;
          opacity: 1 !important;
        }

        @media (max-width: 900px) {
          footer {
            padding: 44px 32px 40px !important;
          }

          .fpia-footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          footer {
            padding: 36px 18px 34px !important;
          }

          .fpia-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string
  links: Array<{ label: string; href: string }>
}) {
  return (
    <div>
      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
        }}
      >
        {title}
      </p>
      <div style={{ display: 'grid', gap: '10px' }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="fpia-footer-link"
            style={{
              color: 'rgba(255,255,255,0.72)',
              textDecoration: 'none',
              fontSize: '14px',
              lineHeight: 1.5,
              opacity: 0.96,
              transition: 'color 0.2s ease, opacity 0.2s ease',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

const primaryChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '40px',
  padding: '0 14px',
  backgroundColor: 'var(--gold)',
  color: 'var(--navy)',
  textDecoration: 'none',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
}

const secondaryChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '40px',
  padding: '0 14px',
  border: '1px solid rgba(201,161,77,0.34)',
  color: 'var(--off-white)',
  textDecoration: 'none',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
}
