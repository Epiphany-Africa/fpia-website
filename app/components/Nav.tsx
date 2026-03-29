'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const dropdownLinks = [
  { label: 'For Buyers', href: '/for-buyers' },
  { label: 'For Sellers', href: '/for-sellers' },
  { label: 'For Agents', href: '/for-agents' },
  { label: 'For Insurers', href: '/for-insurers' },
  { label: 'For Bond Originators', href: '/for-bond-originators' },
]

const mainLinks = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  const dropdownActive = dropdownLinks.some(l => l.href === path)

  return (
    <nav style={{
      backgroundColor: 'var(--navy)',
      padding: '0 80px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '80px',
      borderBottom: '1px solid rgba(201,161,77,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Image
          src="/images/fpia-logo.svg"
          alt="FPIA"
          width={320}
          height={90}
          style={{ objectFit: 'contain', width: 'auto', height: '64px' }}
        />
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>

        {mainLinks.map((link) => (
          <Link key={link.href} href={link.href} style={{
            textDecoration: 'none',
            fontSize: '12px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: path === link.href ? 'var(--gold)' : '#a0aec0',
            borderBottom: path === link.href ? '2px solid var(--gold)' : '2px solid transparent',
            paddingBottom: '4px',
          }}>
            {link.label}
          </Link>
        ))}

        {/* Dropdown */}
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: dropdownActive ? 'var(--gold)' : '#a0aec0',
            borderBottom: dropdownActive ? '2px solid var(--gold)' : '2px solid transparent',
            paddingBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            For You <span style={{ fontSize: '10px' }}>▾</span>
          </button>

          {open && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0d2540',
              border: '1px solid rgba(201,161,77,0.2)',
              minWidth: '200px',
              paddingTop: '8px',
              paddingBottom: '8px',
              marginTop: '12px',
              zIndex: 200,
            }}>
              <div style={{
                position: 'absolute',
                top: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '10px',
                height: '10px',
                backgroundColor: '#0d2540',
                border: '1px solid rgba(201,161,77,0.2)',
                borderBottom: 'none',
                borderRight: 'none',
                rotate: '45deg',
              }} />
              {dropdownLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{
                  display: 'block',
                  padding: '10px 24px',
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: path === link.href ? 'var(--gold)' : '#a0aec0',
                  backgroundColor: path === link.href ? 'rgba(201,161,77,0.08)' : 'transparent',
                  whiteSpace: 'nowrap',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <Link href="/register" style={{
          backgroundColor: 'var(--gold)',
          color: 'var(--navy)',
          padding: '8px 20px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Register
        </Link>
      </div>
    </nav>
  )
}