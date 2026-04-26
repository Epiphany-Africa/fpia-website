'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const dropdownLinks = [
  { label: 'For Buyers', href: '/for-buyers' },
  { label: 'For Sellers', href: '/for-sellers' },
  { label: 'For Property Practitioners', href: '/for-agents' },
  { label: 'For Insurers', href: '/for-insurers' },
  { label: 'For Bond Originators', href: '/for-bond-originators' },
]

const mainLinks = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Property Passport', href: '/property-passport' },
  { label: 'Registry', href: '/verify' },
]

function navLinkStyle(active: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '38px',
    padding: '0 12px',
    border: active
      ? '1px solid rgba(201, 161, 77, 0.6)'
      : '1px solid rgba(201, 161, 77, 0.34)',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: '#ffffff',
    background: active
      ? 'rgba(201, 161, 77, 0.26)'
      : 'rgba(255, 255, 255, 0.12)',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
    textShadow: '0 1px 1px rgba(0, 0, 0, 0.18)',
  }
}

const dropdownItemBaseStyle: CSSProperties = {
  display: 'block',
  padding: '12px 14px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'none',
  color: '#ffffff',
  background: 'transparent',
  opacity: 1,
}

function dropdownItemStyle(active: boolean): CSSProperties {
  return {
    ...dropdownItemBaseStyle,
    background: active ? 'rgba(201, 161, 77, 0.14)' : 'transparent',
    color: '#ffffff',
  }
}

const mobileLinkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minHeight: '48px',
  padding: '0 14px',
  borderRadius: '14px',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#ffffff',
}

function subscribeViewport(callback: () => void) {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(max-width: 720px)')
  mediaQuery.addEventListener('change', callback)

  return () => {
    mediaQuery.removeEventListener('change', callback)
  }
}

function getViewportSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 720px)').matches
}

export default function Nav() {
  const path = usePathname()
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const isMobileViewport = useSyncExternalStore(
    subscribeViewport,
    getViewportSnapshot,
    () => false
  )
  const mobileOpenEffective = isMobileViewport && mobileOpen

  const dropdownActive = dropdownLinks.some((link) => link.href === path)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setDesktopOpen(false)
      }

      if (isMobileViewport && !mobilePanelRef.current?.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-mobile-nav-trigger="true"]')) {
          setMobileOpen(false)
        }
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDesktopOpen(false)
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileViewport])

  useEffect(() => {
    document.body.style.overflow = mobileOpenEffective ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpenEffective])

  return (
    <>
      <nav
        className="sticky top-0 z-[100] border-b border-[rgba(201,161,77,0.18)] backdrop-blur-[12px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(11, 31, 51, 0.98) 0%, rgba(11, 31, 51, 0.96) 100%)',
        }}
      >
        <div className="relative z-[1] mx-auto flex min-h-[70px] max-w-[1320px] items-center justify-between gap-4 px-[14px] sm:min-h-[74px] sm:px-4 md:min-h-[80px] md:px-5">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 no-underline sm:gap-4"
            aria-label="FPIA home"
            onClick={() => {
              setDesktopOpen(false)
              setMobileOpen(false)
            }}
          >
            <div className="w-[138px] flex-shrink-0 sm:w-[160px] md:w-[190px]">
              <Image
                src="/fpia-logo.png"
                alt="FPIA Logo"
                width={420}
                height={120}
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div className="hidden min-[1040px]:flex min-w-0 flex-col">
              <span
                className="whitespace-nowrap text-[10px] uppercase leading-[1.2] tracking-[0.18em]"
                style={{ color: 'rgba(201, 161, 77, 0.82)' }}
              >
                Fair Properties Inspection Authority
              </span>
            </div>
          </Link>

          <div className="relative z-[3] hidden items-center justify-end gap-[10px] md:flex">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setDesktopOpen(false)
                  setMobileOpen(false)
                }}
                className={`inline-flex min-h-[38px] items-center justify-center rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  path === link.href ? 'is-active' : ''
                }`}
                style={navLinkStyle(path === link.href)}
              >
                {link.label}
              </Link>
            ))}

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={desktopOpen}
                onClick={() => setDesktopOpen((current) => !current)}
                className={`inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.12em] ${
                  dropdownActive ? 'is-active' : ''
                }`}
                style={navLinkStyle(dropdownActive)}
              >
                For You <span className="text-[10px]">▾</span>
              </button>

              {desktopOpen && (
                <div
                  role="menu"
                  className="absolute left-1/2 top-[calc(100%+12px)] z-20 min-w-[236px] -translate-x-1/2 rounded-[18px] border border-[rgba(201,161,77,0.26)] bg-[#0f2845] p-[10px] shadow-[0_22px_50px_rgba(0,0,0,0.22)]"
                >
                  {dropdownLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setDesktopOpen(false)
                        setMobileOpen(false)
                      }}
                      className={`${path === link.href ? 'is-active' : ''} block rounded-xl px-[14px] py-3 text-[12px] font-bold text-white no-underline transition-colors`}
                      style={dropdownItemStyle(path === link.href)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={() => {
                setDesktopOpen(false)
                setMobileOpen(false)
              }}
              className={`inline-flex min-h-[38px] items-center justify-center rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.12em] ${
                path === '/contact' ? 'is-active' : ''
              }`}
              style={navLinkStyle(path === '/contact')}
            >
              Contact
            </Link>

            <Link
              href="/register"
              onClick={() => {
                setDesktopOpen(false)
                setMobileOpen(false)
              }}
              className="inline-flex min-h-[42px] items-center justify-center whitespace-nowrap rounded-full bg-[var(--gold)] px-[18px] text-[11px] font-bold uppercase tracking-[0.14em] no-underline text-[var(--navy)]"
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            data-mobile-nav-trigger="true"
            aria-expanded={mobileOpenEffective}
            aria-label={mobileOpenEffective ? 'Close navigation' : 'Open navigation'}
            className="inline-flex h-11 w-11 items-center justify-center gap-[5px] rounded-[14px] border border-[rgba(201,161,77,0.24)] bg-[rgba(255,255,255,0.03)] md:hidden"
            onClick={() => setMobileOpen((current) => !current)}
            style={{ flexDirection: 'column' }}
          >
            <span className="h-[1.5px] w-[18px] rounded-full bg-[var(--gold)]" />
            <span className="h-[1.5px] w-[18px] rounded-full bg-[var(--gold)]" />
            <span className="h-[1.5px] w-[18px] rounded-full bg-[var(--gold)]" />
          </button>
        </div>
      </nav>

      {mobileOpenEffective && (
        <div
          className="fixed inset-0 z-[109] bg-[rgba(7,18,31,0.42)] backdrop-blur-[6px]"
          aria-hidden="true"
        />
      )}

      {mobileOpenEffective ? (
        <div
          ref={mobilePanelRef}
          className="fixed inset-y-0 right-0 z-[110] w-[min(100vw,360px)] border-l border-[rgba(201,161,77,0.16)] p-4 pt-20 shadow-[-20px_0_48px_rgba(0,0,0,0.24)] md:hidden"
          aria-hidden={!mobileOpenEffective}
          style={{
            background:
              'linear-gradient(180deg, rgba(11, 31, 51, 0.995) 0%, rgba(12, 35, 58, 0.985) 100%)',
          }}
        >
          <div className="mb-5 grid gap-1.5">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'rgba(201, 161, 77, 0.8)' }}
            >
              Public Routes
            </div>
            <div
              className="text-[28px] leading-none text-white"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              FPIA
            </div>
          </div>

          <div className="grid gap-2">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={mobileLinkStyle}
                onClick={() => {
                  setDesktopOpen(false)
                  setMobileOpen(false)
                }}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              style={mobileLinkStyle}
              onClick={() => {
                setDesktopOpen(false)
                setMobileOpen(false)
              }}
            >
              Contact
            </Link>
          </div>

          <div
            className="my-[18px] h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(201, 161, 77, 0), rgba(201, 161, 77, 0.36) 18%, rgba(201, 161, 77, 0.36) 82%, rgba(201, 161, 77, 0))',
            }}
          />

          <div
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'rgba(201, 161, 77, 0.8)' }}
          >
            For You
          </div>
          <div className="grid gap-2">
            {dropdownLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={mobileLinkStyle}
                onClick={() => {
                  setDesktopOpen(false)
                  setMobileOpen(false)
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div
            className="my-[18px] h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(201, 161, 77, 0), rgba(201, 161, 77, 0.36) 18%, rgba(201, 161, 77, 0.36) 82%, rgba(201, 161, 77, 0))',
            }}
          />

          <Link
            href="/register"
            className="flex min-h-12 items-center justify-center rounded-[14px] bg-[var(--gold)] px-[14px] text-[13px] font-bold uppercase tracking-[0.12em] no-underline text-[var(--navy)]"
            onClick={() => {
              setDesktopOpen(false)
              setMobileOpen(false)
            }}
          >
            Register a Property
          </Link>
        </div>
      ) : null}
    </>
  )
}
