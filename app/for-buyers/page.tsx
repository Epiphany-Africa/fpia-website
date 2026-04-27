import Link from 'next/link'
import TrustBadge from '@/components/TrustBadge'

export default function ForBuyers() {
  const trustOutcomes = [
    {
      trustState: 'FINAL_VERIFIED' as const,
      meaning: 'Active verified record',
      desc: 'All required certification conditions were met at the time of verification.',
    },
    {
      trustState: 'CONDITIONAL' as const,
      meaning: 'Active conditional record',
      desc: 'The property has been assessed, but recorded findings or requirements remain outstanding.',
    },
    {
      trustState: 'REVOKED' as const,
      meaning: 'Inactive revoked record',
      desc: 'A prior certificate exists, but it is no longer valid and should not be relied upon.',
    },
    {
      trustState: 'NOT_ISSUED' as const,
      meaning: 'No active record listed',
      desc: 'No verified certification record is currently listed for the property reference supplied.',
    },
  ]

  return (
    <main style={{ backgroundColor: 'var(--off-white)', color: 'var(--navy)', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero */}
      <section className="fpia-buyers-hero" style={{ backgroundColor: 'var(--navy)', padding: '100px 80px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>For Buyers</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '56px', color: 'var(--off-white)', lineHeight: 1.1, marginBottom: '24px' }}>
          Know exactly what<br />you&rsquo;re buying.
        </h1>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '24px' }} />
        <p style={{ color: '#a0aec0', fontSize: '18px', maxWidth: '560px', lineHeight: 1.7 }}>
          A FPIA certificate gives you independent, verified proof of a property&rsquo;s condition before you sign — protecting you from hidden defects and post-transfer disputes.
        </p>
      </section>

      {/* Risk section */}
      <section className="fpia-buyers-section" style={{ padding: '80px', maxWidth: '900px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>The Problem</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', marginBottom: '24px' }}>
          What you don&rsquo;t know can cost you.
        </h2>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '32px' }} />
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#444', marginBottom: '16px' }}>
          In South Africa, property is sold voetstoots — meaning the buyer accepts the property in its current condition. While sellers are obligated to disclose known defects, latent defects (those not visible or known at time of sale) frequently surface only after transfer.
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#444' }}>
          Legal recourse is expensive, slow, and rarely successful. The burden of proof falls on the buyer to demonstrate the seller had prior knowledge — a near-impossible standard in most cases.
        </p>
      </section>

      {/* What FPIA does */}
      <section className="fpia-buyers-solution" style={{ backgroundColor: 'var(--navy)', padding: '80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>The Solution</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', color: 'var(--off-white)', marginBottom: '24px' }}>
          What FPIA gives you.
        </h2>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '48px' }} />
        <div className="fpia-buyers-solution-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            { title: 'Independent Verification', body: 'Your inspector is appointed by FPIA — never by the seller. No conflict of interest, no incentive to overlook defects.' },
            { title: 'Full Condition Record', body: 'Every compliance category documented with photographic evidence, timestamped and stored on an immutable ledger.' },
            { title: 'COC Artefact Tracking', body: 'Electrical, plumbing, and gas certificates of compliance are captured and verified as part of the inspection record.' },
            { title: 'QR Verification', body: 'Scan the property QR code before making an offer. Instantly confirm the certification status without needing to log in.' },
            { title: 'OTP Period Access', body: 'During the suspensive period of your Offer to Purchase, access the full inspection report before conditions are waived.' },
            { title: '10-Year Record Retention', body: 'Your FPIA record is retained for a decade — providing a defensible paper trail if any dispute arises post-transfer.' },
          ].map((item, i) => (
            <div key={i} style={{ borderTop: '2px solid var(--gold)', paddingTop: '24px' }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--off-white)', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#a0aec0', lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust outcomes */}
      <section className="fpia-buyers-section" style={{ padding: '80px', maxWidth: '900px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Registry Outcome Reference</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', marginBottom: '16px' }}>Official trust-status definitions.</h2>
        <p style={{ fontSize: '15px', color: '#55606d', lineHeight: 1.7, maxWidth: '720px', marginBottom: '32px' }}>
          Use this reference to interpret the status shown on any FPIA property condition record.
        </p>

        <div style={{ border: '1px solid rgba(11,31,51,0.12)', backgroundColor: '#fff' }}>
          <div
            className="fpia-buyers-table-header"
            style={{
              display: 'grid',
              gridTemplateColumns: '220px minmax(0, 1fr)',
              gap: '24px',
              padding: '14px 24px',
              backgroundColor: 'rgba(11,31,51,0.03)',
              borderBottom: '1px solid rgba(11,31,51,0.08)',
            }}
          >
            <p style={{ color: '#6C7077', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
              Trust Status
            </p>
            <p style={{ color: '#6C7077', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
              Registry Meaning
            </p>
          </div>

          {trustOutcomes.map((item, i) => (
            <div
              className="fpia-buyers-table-row"
              key={item.trustState}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px minmax(0, 1fr)',
                gap: '24px',
                alignItems: 'center',
                minHeight: '96px',
                padding: '20px 24px',
                borderBottom: i < trustOutcomes.length - 1 ? '1px solid rgba(11,31,51,0.08)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', minHeight: '48px' }}>
                <TrustBadge trustState={item.trustState} variant="registry" />
              </div>

              <div>
                <p style={{ fontSize: '15px', color: 'var(--navy)', fontWeight: 600, margin: '0 0 6px 0' }}>
                  {item.meaning}
                </p>
                <p style={{ fontSize: '14px', color: '#55606d', lineHeight: 1.7, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="fpia-buyers-cta" style={{ backgroundColor: 'var(--gold)', padding: '80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', color: 'var(--navy)', marginBottom: '16px' }}>
          Verify before you sign.
        </h2>
        <p style={{ color: 'var(--navy)', marginBottom: '40px', fontSize: '16px' }}>Scan a property QR code or enter a certificate number to check status instantly.</p>
        <Link href="/verify" style={{
          backgroundColor: 'var(--navy)',
          color: 'var(--off-white)',
          padding: '14px 36px',
          fontWeight: 600,
          fontSize: '14px',
          letterSpacing: '1px',
          textDecoration: 'none',
          textTransform: 'uppercase'
        }}>Verify a Property</Link>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .fpia-buyers-hero,
          .fpia-buyers-section,
          .fpia-buyers-solution,
          .fpia-buyers-cta {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }

          .fpia-buyers-solution-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 720px) {
          .fpia-buyers-table-header,
          .fpia-buyers-table-row {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }

          .fpia-buyers-table-row {
            min-height: 0 !important;
          }
        }

        @media (max-width: 640px) {
          .fpia-buyers-hero,
          .fpia-buyers-section,
          .fpia-buyers-solution,
          .fpia-buyers-cta {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          .fpia-buyers-hero {
            padding-top: 44px !important;
            padding-bottom: 36px !important;
          }

          .fpia-buyers-section,
          .fpia-buyers-solution,
          .fpia-buyers-cta {
            padding-top: 36px !important;
            padding-bottom: 40px !important;
          }

          .fpia-buyers-solution-grid {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
          }
        }
      `}</style>
    </main>
  )
}
