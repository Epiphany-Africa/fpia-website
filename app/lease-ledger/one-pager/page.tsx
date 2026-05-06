import Link from 'next/link'
import { leaseLedgerOnePager } from '@/lib/leaseLedger/onePagerContent'

export default function LeaseLedgerOnePagerPage() {
  return (
    <main style={{ backgroundColor: 'var(--off-white)', color: 'var(--navy)' }}>
      <section style={{ backgroundColor: 'var(--navy)', padding: '72px 80px 56px' }} className="llop-hero">
        <div className="llop-shell" style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Commercial One-Pager
          </p>
          <div className="llop-hero-grid" style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'start' }}>
            <div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '56px', lineHeight: 1.04, color: 'var(--off-white)', margin: '0 0 18px 0' }}>
                {leaseLedgerOnePager.title}
              </h1>
              <p style={{ color: 'var(--gold)', fontSize: '17px', margin: '0 0 18px 0' }}>
                {leaseLedgerOnePager.subtitle}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '16px', lineHeight: 1.8, maxWidth: '760px', margin: 0 }}>
                {leaseLedgerOnePager.overview}
              </p>
            </div>
            <div style={{ display: 'grid', gap: '10px', minWidth: '240px' }}>
              <Link href="/api/lease-ledger-one-pager-pdf" style={primaryButtonStyle}>
                Download PDF
              </Link>
              <Link href={leaseLedgerOnePager.walkthroughHref} style={secondaryButtonStyle}>
                Request Walkthrough
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 80px 40px' }} className="llop-section">
        <div className="llop-shell" style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="llop-principles" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
            {leaseLedgerOnePager.principles.map((item) => (
              <div key={item} style={{ backgroundColor: '#ffffff', border: '1px solid rgba(11,31,51,0.1)', padding: '22px 24px' }}>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#44505c' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 80px' }} className="llop-section">
        <div className="llop-shell" style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <p style={sectionKickerStyle}>What Lease Ledger Covers</p>
          <h2 style={sectionTitleStyle}>The full tenancy accountability workflow.</h2>
          <div className="llop-five-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '16px' }}>
            {leaseLedgerOnePager.workflowCoverage.map((item) => (
              <div key={item.title} style={panelStyle}>
                <h3 style={panelTitleStyle}>{item.title}</h3>
                <p style={panelBodyStyle}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 80px' }} className="llop-section">
        <div className="llop-shell" style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <p style={sectionKickerStyle}>Commercial Model</p>
          <h2 style={sectionTitleStyle}>How Lease Ledger is engaged.</h2>
          <div className="llop-three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' }}>
            {leaseLedgerOnePager.commercialModel.map((item) => (
              <div key={item.title} style={panelStyle}>
                <h3 style={panelTitleStyle}>{item.title}</h3>
                <p style={panelBodyStyle}>{item.body}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0 0', display: 'grid', gap: '10px' }}>
                  {item.bullets.map((bullet) => (
                    <li key={bullet} style={{ display: 'flex', gap: '10px', color: '#334155', fontSize: '14px', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>—</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 80px 80px' }} className="llop-section">
        <div className="llop-shell" style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="llop-bottom-grid" style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'minmax(0,1.2fr) minmax(300px,0.8fr)' }}>
            <div style={{ ...panelStyle, backgroundColor: '#ffffff' }}>
              <p style={sectionKickerStyle}>Who It Serves</p>
              <h2 style={{ ...sectionTitleStyle, marginBottom: '20px' }}>Audience pathways</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {leaseLedgerOnePager.audiences.map((audience) => (
                  <div key={audience.title} style={{ paddingLeft: '18px', borderLeft: '2px solid rgba(201,161,77,0.34)' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                      {audience.title}
                    </p>
                    <p style={{ margin: 0, color: '#55606d', fontSize: '14px', lineHeight: 1.75 }}>
                      {audience.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...panelStyle, backgroundColor: 'var(--navy)', borderColor: 'rgba(201,161,77,0.18)' }}>
              <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 14px 0', fontWeight: 700 }}>
                Next Step
              </p>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '34px', lineHeight: 1.1, color: 'var(--off-white)', margin: '0 0 16px 0' }}>
                Use the one-pager as the commercial leave-behind.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px', lineHeight: 1.8, margin: '0 0 20px 0' }}>
                {leaseLedgerOnePager.closing}
              </p>
              <div style={{ display: 'grid', gap: '10px' }}>
                <Link href={leaseLedgerOnePager.walkthroughHref} style={primaryButtonStyle}>
                  Request Lease Ledger Walkthrough
                </Link>
                <Link href={leaseLedgerOnePager.rolloutHref} style={secondaryButtonStyle}>
                  Talk to us about portfolio rollout
                </Link>
                <Link href="/api/lease-ledger-one-pager-pdf" style={ghostButtonStyle}>
                  Download PDF leave-behind
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .llop-hero,
          .llop-section {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }

          .llop-hero-grid,
          .llop-principles,
          .llop-five-grid,
          .llop-three-grid,
          .llop-bottom-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .llop-hero,
          .llop-section {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          .llop-hero {
            padding-top: 48px !important;
            padding-bottom: 42px !important;
          }

          .llop-hero-grid,
          .llop-principles,
          .llop-five-grid,
          .llop-three-grid,
          .llop-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}

const sectionKickerStyle = {
  color: 'var(--gold)',
  fontSize: '11px',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px 0',
}

const sectionTitleStyle = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: '40px',
  color: 'var(--navy)',
  margin: '0 0 28px 0',
}

const panelStyle = {
  backgroundColor: 'var(--off-white)',
  border: '1px solid rgba(11,31,51,0.1)',
  padding: '28px',
}

const panelTitleStyle = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: '24px',
  color: 'var(--navy)',
  margin: '0 0 12px 0',
}

const panelBodyStyle = {
  margin: 0,
  fontSize: '14px',
  color: '#55606d',
  lineHeight: 1.8,
}

const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '46px',
  padding: '0 18px',
  backgroundColor: 'var(--gold)',
  color: 'var(--navy)',
  textDecoration: 'none',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
}

const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '46px',
  padding: '0 18px',
  backgroundColor: 'transparent',
  border: '1px solid rgba(201,161,77,0.36)',
  color: 'var(--off-white)',
  textDecoration: 'none',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
}

const ghostButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  padding: '0 18px',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: 'var(--off-white)',
  textDecoration: 'none',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
}
