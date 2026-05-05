'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const audienceLinks = [
  { label: 'For Buyers', href: '/for-buyers' },
  { label: 'For Sellers', href: '/for-sellers' },
  { label: 'For Property Practitioners', href: '/for-agents' },
  { label: 'For Insurers', href: '/for-insurers' },
  { label: 'For Bond Originators', href: '/for-bond-originators' },
  { label: 'For Inspectors', href: '/for-inspectors' },
]

const desktopMainLinks = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works', lines: ['How It', 'Works'], minWidth: 82 },
  { label: 'Property Passport', href: '/property-passport', lines: ['Property', 'Passport'], minWidth: 92 },
  { label: 'Registry', href: '/verify' },
  { label: 'LeaseLedger', href: '/lease-ledger' },
]

const mobilePrimaryLinks = [
  { label: 'Home', href: '/' },
  { label: 'Request Inspection', href: '/request-inspection' },
  { label: 'Register Property', href: '/register' },
  { label: 'Property Passport', href: '/property-passport' },
  { label: 'Verify Certificate', href: '/verify' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'LeaseLedger', href: '/lease-ledger' },
  { label: 'Contact', href: '/contact' },
]

const utilityLinks = [
  { label: 'Admin Login', href: '/admin' },
  { label: 'Agency Accounts', href: '/contact?inquiry=agency-account' },
  { label: 'Certificate Renewal', href: '/contact?inquiry=renewal' },
]

function navLinkStyle(
  active: boolean,
  options?: {
    stacked?: boolean
    minWidth?: number
  }
): CSSProperties {
  const stacked = options?.stacked ?? false

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: stacked ? '38px' : '32px',
    minWidth: options?.minWidth ? `${options.minWidth}px` : undefined,
    padding: stacked ? '5px 10px' : '0 10px',
    border: active
      ? '1px solid rgba(201, 161, 77, 0.46)'
      : '1px solid rgba(201, 161, 77, 0.22)',
    borderRadius: '999px',
    fontSize: stacked ? '9px' : '10px',
    fontWeight: 700,
    letterSpacing: stacked ? '0.09em' : '0.1em',
    lineHeight: stacked ? 1.02 : 1.08,
    whiteSpace: stacked ? 'normal' : 'nowrap',
    textAlign: 'center',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: '#ffffff',
    background: active
      ? 'rgba(201, 161, 77, 0.17)'
      : 'rgba(255, 255, 255, 0.06)',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
    textShadow: '0 1px 1px rgba(0, 0, 0, 0.18)',
  }
}

const stackedLabelStyle: CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',
  lineHeight: 1.02,
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

function mobileLinkStyle(active: boolean, emphasis: 'default' | 'primary' = 'default'): CSSProperties {
  if (emphasis === 'primary') {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '48px',
      padding: '0 14px',
      borderRadius: '14px',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      background: 'var(--gold)',
      color: 'var(--navy)',
    }
  }

  return {
    display: 'flex',
    alignItems: 'center',
    minHeight: '48px',
    padding: '0 14px',
    borderRadius: '14px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    border: active
      ? '1px solid rgba(201, 161, 77, 0.36)'
      : '1px solid rgba(255, 255, 255, 0.12)',
    background: active ? 'rgba(201, 161, 77, 0.14)' : 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
  }
}

function subscribeViewport(callback: () => void) {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(max-width: 1023px)')
  mediaQuery.addEventListener('change', callback)

  return () => {
    mediaQuery.removeEventListener('change', callback)
  }
}

function getViewportSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 1023px)').matches
}

export default function Nav() {
  const path = usePathname()
  const [desktopOpenPath, setDesktopOpenPath] = useState<string | null>(null)
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const isMobileViewport = useSyncExternalStore(
    subscribeViewport,
    getViewportSnapshot,
    () => false
  )
  const desktopOpen = desktopOpenPath === path
  const mobileOpen = mobileOpenPath === path
  const mobileOpenEffective = isMobileViewport && mobileOpen

  const dropdownActive = audienceLinks.some((link) => link.href === path)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setDesktopOpenPath(null)
      }

      if (isMobileViewport && !mobilePanelRef.current?.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-mobile-nav-trigger="true"]')) {
          setMobileOpenPath(null)
        }
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDesktopOpenPath(null)
        setMobileOpenPath(null)
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
        <div className="relative z-[1] mx-auto flex min-h-[58px] max-w-[1320px] items-center justify-between gap-3 px-[14px] sm:min-h-[62px] sm:px-4 lg:grid lg:min-h-[64px] lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-4 lg:px-5 xl:min-h-[66px] xl:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center no-underline lg:justify-self-start"
            aria-label="FPIA home"
            onClick={() => {
              setDesktopOpenPath(null)
              setMobileOpenPath(null)
            }}
          >
            <div className="w-[118px] flex-shrink-0 sm:w-[130px] lg:w-[144px] xl:w-[150px]">
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
          </Link>

          <div className="relative z-[3] hidden items-center justify-self-center lg:flex lg:gap-[6px] xl:gap-[8px]">
            {desktopMainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setDesktopOpenPath(null)
                  setMobileOpenPath(null)
                }}
                className={`inline-flex items-center justify-center rounded-full text-[10px] font-bold uppercase transition-colors ${
                  path === link.href ? 'is-active' : ''
                }`}
                style={navLinkStyle(path === link.href, {
                  stacked: Boolean(link.lines),
                  minWidth: link.minWidth,
                })}
              >
                {link.lines ? (
                  <span style={stackedLabelStyle}>
                    {link.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                ) : (
                  link.label
                )}
              </Link>
            ))}

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={desktopOpen}
                onClick={() =>
                  setDesktopOpenPath((current) => (current === path ? null : path))
                }
                className={`inline-flex cursor-pointer items-center justify-center gap-1 rounded-full text-[10px] font-bold uppercase ${
                  dropdownActive ? 'is-active' : ''
                }`}
                style={navLinkStyle(dropdownActive, {
                  stacked: true,
                  minWidth: 64,
                })}
              >
                <span style={stackedLabelStyle}>
                  <span>For</span>
                  <span>You</span>
                </span>
                <span className="ml-[1px] text-[9px]">▾</span>
              </button>

              {desktopOpen && (
                <div
                  role="menu"
                  className="absolute left-1/2 top-[calc(100%+10px)] z-20 min-w-[228px] -translate-x-1/2 rounded-[16px] border border-[rgba(201,161,77,0.24)] bg-[#0f2845] p-[8px] shadow-[0_20px_46px_rgba(0,0,0,0.2)]"
                >
                  {audienceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setDesktopOpenPath(null)
                        setMobileOpenPath(null)
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
                setDesktopOpenPath(null)
                setMobileOpenPath(null)
              }}
              className={`inline-flex items-center justify-center rounded-full text-[10px] font-bold uppercase ${
                path === '/contact' ? 'is-active' : ''
              }`}
              style={navLinkStyle(path === '/contact', { minWidth: 68 })}
            >
              Contact
            </Link>
          </div>

          <Link
            href="/register"
            onClick={() => {
              setDesktopOpenPath(null)
              setMobileOpenPath(null)
            }}
            className="hidden min-h-[36px] items-center justify-center justify-self-end whitespace-nowrap rounded-full border border-[rgba(201,161,77,0.46)] bg-[var(--gold)] px-[14px] text-[10px] font-bold uppercase tracking-[0.12em] no-underline text-[var(--navy)] shadow-[0_8px_18px_rgba(0,0,0,0.12)] lg:inline-flex xl:px-[15px]"
          >
            Register
          </Link>

          <button
            type="button"
            data-mobile-nav-trigger="true"
            aria-expanded={mobileOpenEffective}
            aria-label={mobileOpenEffective ? 'Close navigation' : 'Open navigation'}
            className="inline-flex h-[38px] w-[38px] items-center justify-center gap-[5px] rounded-[12px] border border-[rgba(201,161,77,0.24)] bg-[rgba(255,255,255,0.03)] lg:hidden"
            onClick={() =>
              setMobileOpenPath((current) => (current === path ? null : path))
            }
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
          className="fixed inset-y-0 right-0 z-[110] w-[min(100vw,380px)] border-l border-[rgba(201,161,77,0.16)] p-4 pt-20 shadow-[-20px_0_48px_rgba(0,0,0,0.24)] lg:hidden"
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
            {mobilePrimaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={mobileLinkStyle(path === link.href)}
                onClick={() => {
                  setDesktopOpenPath(null)
                  setMobileOpenPath(null)
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

          <div
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'rgba(201, 161, 77, 0.8)' }}
          >
            For You
          </div>
          <div className="grid gap-2">
            {audienceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={mobileLinkStyle(path === link.href)}
                onClick={() => {
                  setDesktopOpenPath(null)
                  setMobileOpenPath(null)
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

          <div
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'rgba(201, 161, 77, 0.8)' }}
          >
            Utilities
          </div>
          <div className="grid gap-2">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={mobileLinkStyle(path === link.href)}
                onClick={() => {
                  setDesktopOpenPath(null)
                  setMobileOpenPath(null)
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
            href="/request-inspection"
            className="flex min-h-12 items-center justify-center rounded-[14px] px-[14px] no-underline"
            style={mobileLinkStyle(false, 'primary')}
            onClick={() => {
              setDesktopOpenPath(null)
              setMobileOpenPath(null)
            }}
          >
            Request Inspection
          </Link>
        </div>
      ) : null}
    </>
  )
}
