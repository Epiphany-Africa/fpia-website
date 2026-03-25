import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const audiences = [
    { label: 'For Buyers', href: '/for-buyers' },
    { label: 'For Sellers', href: '/for-sellers' },
    { label: 'For Agents', href: '/for-agents' },
    { label: 'For Insurers', href: '/for-insurers' },
    { label: 'For Bond Originators', href: '/for-bond-originators' },
  ]

  const company = [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Verify a Property', href: '/verify' },
    { label: 'Register a Property', href: '/register' },
  ]

  return (
    <footer style={{
      backgroundColor: 'var(--navy)',
      borderTop: '1px solid rgba(201,161,77,0.2)',
      padding: '64px 80px 32px',
    }}>
      {/* Top Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '48px',
        gap: '40px',
      }}>

        {/* Brand */}
        <div style={{ maxWidth: '280px' }}>
          <Image
            src="/images/fpia-logo.svg"
            alt="FPIA"
            width={200}
            height={60}
            style={{ objectFit: 'contain', width: 'auto', height: '40px', marginBottom: '16px' }}
          />
          <p style={{ color: '#a0aec0', fontSize: '13px', lineHeight: '1.8' }}>
            The independent authority certifying South African properties before transfer.
            Accountability built in.
          </p>
        </div>

        {/* Audiences */}
        <div>
          <p style={{
            color: 'var(--gold)',
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Who We Serve
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {audiences.map((link) => (
              <Link key={link.href} href={link.href} style={{
                color: '#a0aec0',
                fontSize: '13px',
                textDecoration: 'none',
                letterSpacing: '0.5px',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <p style={{
            color: 'var(--gold)',
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Platform
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {company.map((link) => (
              <Link key={link.href} href={link.href} style={{
                color: '#a0aec0',
                fontSize: '13px',
                textDecoration: 'none',
                letterSpacing: '0.5px',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Block */}
        <div style={{
          backgroundColor: 'rgba(201,161,77,0.08)',
          border: '1px solid rgba(201,161,77,0.2)',
          padding: '28px',
          maxWidth: '220px',
        }}>
          <p style={{ color: 'white', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
            Ready to certify?
          </p>
          <p style={{ color: '#a0aec0', fontSize: '12px', marginBottom: '20px', lineHeight: '1.6' }}>
            Register your property today and receive your FPIA certificate.
          </p>
          <Link href="/register" style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--navy)',
            padding: '10px 20px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Register Now
          </Link>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{ color: '#4a5568', fontSize: '12px' }}>
          © {new Date().getFullYear()} Fair Properties Inspection Authorities. All rights reserved.
        </p>
        <p style={{ color: '#4a5568', fontSize: '12px', letterSpacing: '1px' }}>
          FAIR PROPERTY CERTIFIED™
        </p>
      </div>
    </footer>
  )
}
