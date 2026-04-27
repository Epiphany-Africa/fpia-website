import Link from 'next/link'
import PrintLegalPositionButton from './PrintLegalPositionButton'
import {
  legalPositionSections,
  legalPositionSummary,
  legalPositionUpdatedLabel,
} from './legalPositionContent'

export default function LegalPositionDocument({
  printMode = false,
}: {
  printMode?: boolean
}) {
  return (
    <main style={{ backgroundColor: printMode ? '#ffffff' : 'var(--off-white)', color: 'var(--navy)' }}>
      <section
        className={printMode ? 'fpia-legal-print-shell' : 'fpia-legal-shell'}
        style={{
          padding: printMode ? '48px 24px 64px' : '72px 18px 84px',
        }}
      >
        <div
          className="fpia-legal-document"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            border: printMode ? 'none' : '1px solid rgba(11,31,51,0.08)',
            boxShadow: printMode ? 'none' : '0 24px 60px rgba(11,31,51,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(11,31,51,1) 0%, rgba(15,40,69,1) 100%)',
              padding: printMode ? '40px 36px 28px' : '52px 36px 34px',
            }}
          >
            <p
              style={{
                margin: '0 0 14px 0',
                color: 'var(--gold)',
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              FPIA Legal Position Statement
            </p>
            <h1
              style={{
                margin: '0 0 18px 0',
                color: 'var(--off-white)',
                fontFamily: "'DM Serif Display', serif",
                fontSize: printMode ? '42px' : '46px',
                lineHeight: 1.08,
                maxWidth: '760px',
              }}
            >
              How FPIA fits into disclosure, contracting, and property risk decisions.
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: '720px',
                color: 'rgba(255,255,255,0.72)',
                fontSize: '16px',
                lineHeight: 1.8,
              }}
            >
              {legalPositionSummary}
            </p>
          </div>

          <div
            className="fpia-legal-toolbar"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 36px',
              borderBottom: '1px solid rgba(11,31,51,0.08)',
              backgroundColor: printMode ? '#faf8f4' : '#fcfbf8',
            }}
          >
            <div style={{ display: 'grid', gap: '4px' }}>
              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#6c7077',
                }}
              >
                Institutional Use Note
              </p>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#44505d' }}>
                General information only. This statement is not legal advice and does not replace transaction-specific professional advice.
              </p>
            </div>

            <div className="fpia-legal-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {!printMode ? (
                <>
                  <Link
                    href="/legal-position/print"
                    style={secondaryActionStyle}
                  >
                    Open PDF-ready version
                  </Link>
                  <PrintLegalPositionButton />
                </>
              ) : (
                <>
                  <Link href="/legal-position" style={secondaryActionStyle}>
                    Standard page
                  </Link>
                  <PrintLegalPositionButton />
                </>
              )}
            </div>
          </div>

          <div style={{ padding: printMode ? '30px 36px 40px' : '36px 36px 46px' }}>
            <div
              className="fpia-legal-meta"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              {[
                ['Issuer', 'Fair Properties Inspection Authority'],
                ['Document Type', 'Public legal position statement'],
                ['Updated', legalPositionUpdatedLabel],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    border: '1px solid rgba(11,31,51,0.08)',
                    backgroundColor: '#ffffff',
                    padding: '14px 16px',
                  }}
                >
                  <p style={metaLabelStyle}>{label}</p>
                  <p style={metaValueStyle}>{value}</p>
                </div>
              ))}
            </div>

            {legalPositionSections.map((section) => (
              <section
                key={section.id}
                style={{
                  padding: '24px 0',
                  borderTop: '1px solid rgba(11,31,51,0.08)',
                  breakInside: 'avoid',
                  pageBreakInside: 'avoid',
                }}
              >
                <h2
                  style={{
                    margin: '0 0 14px 0',
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '30px',
                    lineHeight: 1.15,
                    color: 'var(--navy)',
                  }}
                >
                  {section.title}
                </h2>

                {'emphasis' in section && section.emphasis ? (
                  <p
                    style={{
                      margin: '0 0 16px 0',
                      fontSize: '19px',
                      lineHeight: 1.65,
                      color: '#24384d',
                    }}
                  >
                    {section.emphasis}
                  </p>
                ) : null}

                {'paragraphs' in section && section.paragraphs
                  ? section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        style={{
                          margin: '0 0 14px 0',
                          fontSize: '16px',
                          lineHeight: 1.85,
                          color: '#44505d',
                        }}
                      >
                        {paragraph}
                      </p>
                    ))
                  : null}

                {'bullets' in section && section.bullets ? (
                  <div className="fpia-legal-two-column" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px', marginTop: '12px' }}>
                    <BulletPanel title={section.bulletsTitle} items={section.bullets} />
                    <BulletPanel title={section.bulletsTitleTwo} items={section.bulletsTwo} />
                  </div>
                ) : null}
              </section>
            ))}

            <section
              style={{
                marginTop: '8px',
                padding: '24px',
                border: '1px solid rgba(201,161,77,0.28)',
                backgroundColor: '#fcfbf8',
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
              }}
            >
              <p style={metaLabelStyle}>Scope Clarifier</p>
              <p style={{ margin: '0 0 12px 0', fontSize: '15px', lineHeight: 1.8, color: '#44505d' }}>
                This statement is intended to explain FPIA’s institutional and transactional position in plain language. It is not a legal opinion on any specific dispute, property, OTP, disclosure form, supplier relationship, or statutory claim.
              </p>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.8, color: '#44505d' }}>
                Parties should obtain transaction-specific advice from their own conveyancer, attorney, broker, insurer, engineer, valuer, or other relevant professional where the facts require it.
              </p>
            </section>
          </div>
        </div>
      </section>

      <style>{`
        @media print {
          nav,
          footer,
          .fpia-legal-toolbar {
            display: none !important;
          }

          body {
            background: #ffffff !important;
          }

          .fpia-legal-print-shell,
          .fpia-legal-shell {
            padding: 0 !important;
          }

          .fpia-legal-document {
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
          }
        }

        @page {
          size: A4;
          margin: 16mm;
        }
      `}</style>

      <style>{`
        @media (max-width: 900px) {
          .fpia-legal-meta,
          .fpia-legal-two-column {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .fpia-legal-toolbar,
          .fpia-legal-actions {
            align-items: stretch !important;
          }

          .fpia-legal-toolbar,
          .fpia-legal-document > div:last-child {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }
        }
      `}</style>
    </main>
  )
}

function BulletPanel({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div
      style={{
        border: '1px solid rgba(11,31,51,0.08)',
        backgroundColor: '#ffffff',
        padding: '18px 18px 10px',
      }}
    >
      <p style={{ ...metaLabelStyle, marginBottom: '12px' }}>{title}</p>
      <ul style={{ margin: 0, paddingLeft: '18px', color: '#44505d' }}>
        {items.map((item) => (
          <li key={item} style={{ marginBottom: '10px', fontSize: '15px', lineHeight: 1.8 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

const metaLabelStyle: React.CSSProperties = {
  margin: '0 0 6px 0',
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#6c7077',
}

const metaValueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.6,
  color: 'var(--navy)',
  fontWeight: 600,
}

const secondaryActionStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  padding: '0 18px',
  border: '1px solid rgba(11,31,51,0.14)',
  backgroundColor: 'transparent',
  color: 'var(--navy)',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  textDecoration: 'none',
}
