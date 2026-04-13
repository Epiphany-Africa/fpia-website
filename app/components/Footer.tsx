'use client'

import Image from 'next/image'
import Link from 'next/link'
import { APP_VERSION_LABEL } from '@/lib/version'

const CURRENT_YEAR = '2026'

const footerLinks = [
  { label: 'Verify', href: '/verify' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <>
      <footer className="fpia-footer">
        <div className="fpia-footer-inner">
          <div className="fpia-footer-brand">
            <Link href="/" className="fpia-footer-logo-link" aria-label="FPIA home">
              <div className="fpia-footer-logo">
                <Image
                  src="/fpia-logo.png"
                  alt="FPIA Logo"
                  width={320}
                  height={95}
                  priority
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </Link>

            <p className="fpia-footer-copy">
              The independent authority certifying South African properties before transfer.
              Accountability built in.
            </p>
          </div>

          <div className="fpia-footer-links">
            <div className="fpia-footer-label">Public Routes</div>
            <div className="fpia-footer-link-list">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="fpia-footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="fpia-footer-meta">
          {`© ${CURRENT_YEAR} Fair Properties Inspection Authority. ${APP_VERSION_LABEL}`}
        </div>
      </footer>

      <style jsx>{`
        .fpia-footer {
          background:
            linear-gradient(180deg, rgba(11, 31, 51, 1) 0%, rgba(8, 24, 39, 1) 100%);
          color: #fff;
          padding: 48px 20px 40px;
          margin-top: 0;
        }

        .fpia-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(220px, 0.8fr);
          gap: 28px;
          align-items: start;
        }

        .fpia-footer-brand {
          display: grid;
          gap: 18px;
        }

        .fpia-footer-logo-link {
          display: inline-flex;
          width: fit-content;
          text-decoration: none;
        }

        .fpia-footer-logo {
          width: min(250px, 100%);
        }

        .fpia-footer-copy {
          max-width: 560px;
          margin: 0;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.72);
        }

        .fpia-footer-links {
          display: grid;
          gap: 8px;
          justify-items: start;
        }

        .fpia-footer-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(201, 161, 77, 0.82);
        }

        .fpia-footer-link-list {
          display: grid;
          gap: 8px;
        }

        .fpia-footer-link {
          color: rgba(255, 255, 255, 0.82);
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .fpia-footer-meta {
          max-width: 1200px;
          margin: 24px auto 0;
          padding-top: 16px;
          border-top: 1px solid rgba(201, 161, 77, 0.14);
          text-align: right;
          font-size: 11px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.54);
          letter-spacing: 0.03em;
        }

        @media (max-width: 820px) {
          .fpia-footer {
            padding: 40px 16px 34px;
          }

          .fpia-footer-inner {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .fpia-footer-copy {
            font-size: 14px;
            line-height: 1.7;
          }

          .fpia-footer-meta {
            margin-top: 20px;
            text-align: left;
          }
        }

        @media (max-width: 560px) {
          .fpia-footer-logo {
            width: min(210px, 100%);
          }

          .fpia-footer-copy {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  )
}
