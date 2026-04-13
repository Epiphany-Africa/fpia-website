'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const dropdownLinks = [
  { label: 'For Buyers', href: '/for-buyers' },
  { label: 'For Sellers', href: '/for-sellers' },
  { label: 'For Agents', href: '/for-agents' },
  { label: 'For Insurers', href: '/for-insurers' },
  { label: 'For Bond Originators', href: '/for-bond-originators' },
]

const mainLinks = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
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
      <nav className="fpia-nav-shell">
        <div className="fpia-nav-inner">
          <Link
            href="/"
            className="fpia-nav-brand"
            aria-label="FPIA home"
            onClick={() => {
              setDesktopOpen(false)
              setMobileOpen(false)
            }}
          >
            <div className="fpia-nav-logo">
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
            <div className="fpia-nav-brand-copy">
              <span className="fpia-nav-kicker">Fair Properties Inspection Authority</span>
            </div>
          </Link>

          {!isMobileViewport && (
            <div className="fpia-nav-desktop">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setDesktopOpen(false)
                  setMobileOpen(false)
                }}
                className={`fpia-nav-link ${path === link.href ? 'is-active' : ''}`}
                style={navLinkStyle(path === link.href)}
              >
                {link.label}
              </Link>
            ))}

            <div ref={dropdownRef} className="fpia-nav-dropdown">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={desktopOpen}
                onClick={() => setDesktopOpen((current) => !current)}
                className={`fpia-nav-link fpia-nav-link-button ${dropdownActive ? 'is-active' : ''}`}
                style={navLinkStyle(dropdownActive)}
              >
                For You <span className="fpia-nav-caret">▾</span>
              </button>

              {desktopOpen && (
                <div role="menu" className="fpia-nav-dropdown-panel">
                  {dropdownLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setDesktopOpen(false)
                        setMobileOpen(false)
                          }}
                          className={`fpia-nav-dropdown-item ${path === link.href ? 'is-active' : ''}`}
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
              className={`fpia-nav-link ${path === '/contact' ? 'is-active' : ''}`}
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
              className="fpia-nav-register"
            >
              Register
            </Link>
            </div>
          )}

          {isMobileViewport && (
            <button
              type="button"
              data-mobile-nav-trigger="true"
              aria-expanded={mobileOpenEffective}
              aria-label={mobileOpenEffective ? 'Close navigation' : 'Open navigation'}
              className="fpia-mobile-trigger"
              onClick={() => setMobileOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </nav>

      {mobileOpenEffective && <div className="fpia-mobile-overlay" aria-hidden="true" />}

      {isMobileViewport && (
        <div
          ref={mobilePanelRef}
          className={`fpia-mobile-panel ${mobileOpenEffective ? 'is-open' : ''}`}
          aria-hidden={!mobileOpenEffective}
        >
        <div className="fpia-mobile-panel-header">
          <div className="fpia-mobile-panel-kicker">Public Routes</div>
          <div className="fpia-mobile-panel-title">FPIA</div>
        </div>

        <div className="fpia-mobile-group">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="fpia-mobile-link"
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
            className="fpia-mobile-link"
            style={mobileLinkStyle}
            onClick={() => {
              setDesktopOpen(false)
              setMobileOpen(false)
            }}
          >
            Contact
          </Link>
        </div>

        <div className="fpia-mobile-divider" />

        <div className="fpia-mobile-section-label">For You</div>
        <div className="fpia-mobile-group">
          {dropdownLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="fpia-mobile-link"
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

        <div className="fpia-mobile-divider" />

        <Link
          href="/register"
          className="fpia-mobile-register"
          onClick={() => {
            setDesktopOpen(false)
            setMobileOpen(false)
          }}
        >
          Register a Property
        </Link>
        </div>
      )}

      <style jsx>{`
        .fpia-nav-shell {
          position: sticky;
          top: 0;
          z-index: 100;
          background:
            linear-gradient(180deg, rgba(11, 31, 51, 0.98) 0%, rgba(11, 31, 51, 0.96) 100%);
          border-bottom: 1px solid rgba(201, 161, 77, 0.18);
          backdrop-filter: blur(12px);
        }

        .fpia-nav-inner {
          max-width: 1320px;
          margin: 0 auto;
          min-height: 80px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          position: relative;
          z-index: 1;
        }

        .fpia-nav-brand {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 16px;
          text-decoration: none;
        }

        .fpia-nav-logo {
          width: 190px;
          flex-shrink: 0;
        }

        .fpia-nav-brand-copy {
          display: flex;
          flex-direction: column;
          gap: 0;
          min-width: 0;
        }

        .fpia-nav-kicker {
          font-size: 10px;
          line-height: 1.2;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(201, 161, 77, 0.82);
          white-space: nowrap;
        }

        .fpia-nav-desktop {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: flex-end;
          position: relative;
          z-index: 3;
        }

        .fpia-nav-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }

        .fpia-nav-link:hover,
        .fpia-nav-link.is-active {
          color: #ffffff;
        }

        .fpia-nav-link-button {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .fpia-nav-caret {
          font-size: 10px;
        }

        .fpia-nav-dropdown {
          position: relative;
        }

        .fpia-nav-dropdown-panel {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 236px;
          padding: 10px;
          border-radius: 18px;
          border: 1px solid rgba(201, 161, 77, 0.26);
          background: #0f2845;
          box-shadow: 0 22px 50px rgba(0, 0, 0, 0.22);
          z-index: 20;
        }

        .fpia-nav-dropdown-item {
          transition: background 0.18s ease;
        }

        .fpia-nav-dropdown-item:hover,
        .fpia-nav-dropdown-item.is-active {
          color: #fff;
        }

        .fpia-nav-register {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          background: var(--gold);
          color: var(--navy);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
        }

        .fpia-mobile-trigger {
          display: none;
          width: 44px;
          height: 44px;
          padding: 0;
          border-radius: 14px;
          border: 1px solid rgba(201, 161, 77, 0.24);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
        }

        .fpia-mobile-trigger span {
          width: 18px;
          height: 1.5px;
          border-radius: 999px;
          background: var(--gold);
        }

        .fpia-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 109;
          background: rgba(7, 18, 31, 0.42);
          backdrop-filter: blur(6px);
        }

        .fpia-mobile-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 110;
          width: min(360px, calc(100vw - 18px));
          padding: 88px 18px 24px;
          background:
            linear-gradient(180deg, rgba(11, 31, 51, 0.995) 0%, rgba(12, 35, 58, 0.985) 100%);
          border-left: 1px solid rgba(201, 161, 77, 0.16);
          box-shadow: -20px 0 48px rgba(0, 0, 0, 0.24);
          transform: translateX(100%);
          transition: transform 0.22s ease;
        }

        .fpia-mobile-panel.is-open {
          transform: translateX(0);
        }

        .fpia-mobile-panel-header {
          display: grid;
          gap: 6px;
          margin-bottom: 20px;
        }

        .fpia-mobile-panel-kicker,
        .fpia-mobile-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(201, 161, 77, 0.8);
        }

        .fpia-mobile-panel-title {
          font-size: 28px;
          line-height: 1;
          font-family: 'DM Serif Display', serif;
          color: #fff;
        }

        .fpia-mobile-group {
          display: grid;
          gap: 8px;
        }

        .fpia-mobile-link,
        .fpia-mobile-register {
          display: flex;
          align-items: center;
          min-height: 48px;
          padding: 0 14px;
          border-radius: 14px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .fpia-mobile-link {
          color: #ffffff;
        }

        .fpia-mobile-register {
          justify-content: center;
          background: var(--gold);
          color: var(--navy);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .fpia-mobile-divider {
          height: 1px;
          margin: 18px 0;
          background: linear-gradient(
            90deg,
            rgba(201, 161, 77, 0),
            rgba(201, 161, 77, 0.36) 18%,
            rgba(201, 161, 77, 0.36) 82%,
            rgba(201, 161, 77, 0)
          );
        }

        @media (max-width: 1040px) {
          .fpia-nav-inner {
            padding: 0 16px;
          }

          .fpia-nav-brand-copy {
            display: none;
          }
        }

        @media (max-width: 720px) {
          .fpia-nav-inner {
            min-height: 74px;
          }

          .fpia-nav-logo {
            width: 160px;
          }

          .fpia-nav-desktop {
            display: none;
          }

          .fpia-mobile-trigger {
            display: inline-flex;
          }
        }

        @media (max-width: 560px) {
          .fpia-nav-inner {
            min-height: 68px;
            padding: 0 14px;
          }

          .fpia-nav-logo {
            width: 138px;
          }

          .fpia-mobile-panel {
            width: min(100vw, 100vw);
            padding: 80px 16px 22px;
          }
        }
      `}</style>
    </>
  )
}
