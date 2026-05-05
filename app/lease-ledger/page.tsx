import Link from 'next/link'

export default function LeaseLedgerPage() {
  return (
    <main style={{ backgroundColor: 'var(--off-white)', color: 'var(--navy)', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="ll-hero" style={{ backgroundColor: 'var(--navy)', padding: '100px 80px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
          LeaseLedger by FPIA
        </p>
        <h1 className="ll-hero-headline" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '62px', color: 'var(--off-white)', lineHeight: 1.08, marginBottom: '28px', maxWidth: '780px' }}>
          Move in with confidence.<br />
          <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Move out with proof.</em>
        </h1>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '28px' }} />
        <p style={{ color: '#a0aec0', fontSize: '18px', maxWidth: '580px', lineHeight: 1.75, marginBottom: '40px' }}>
          LeaseLedger captures every move-in, move-out, and handover with evidence-backed records — protecting landlords, tenants, and agents alike.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['For Landlords', 'For Tenants', 'For Estate Agents'].map((label) => (
            <span key={label} style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px solid rgba(201, 161, 77, 0.46)',
              background: 'rgba(201, 161, 77, 0.10)',
              color: 'var(--gold)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Lifecycle strip ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--navy)', borderTop: '1px solid rgba(201, 161, 77, 0.12)', padding: '40px 80px' }}>
        <p style={{ color: 'rgba(201, 161, 77, 0.7)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px' }}>
          Tenancy Lifecycle
        </p>
        <div className="ll-lifecycle" style={{ display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', rowGap: '16px' }}>
          {[
            { label: 'Draft',              dot: '#94a3b8' },
            { label: 'Move-In Scheduled', dot: '#3b82f6' },
            { label: 'Active',             dot: '#22c55e' },
            { label: 'Move-Out',           dot: '#f59e0b' },
            { label: 'Comparison',         dot: '#8b5cf6' },
            { label: 'Handover Closed',    dot: '#C9A14D' },
          ].map((stage, i, arr) => (
            <div key={stage.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: stage.dot, flexShrink: 0, boxShadow: `0 0 8px ${stage.dot}88` }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  {stage.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span style={{ display: 'inline-block', width: '32px', height: '1px', background: 'rgba(201, 161, 77, 0.24)', margin: '0 10px', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────── */}
      <section className="ll-who" style={{ backgroundColor: '#ffffff', padding: '88px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Who It&rsquo;s For
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--navy)', marginBottom: '16px' }}>
          Built for every party in the tenancy.
        </h2>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '52px' }} />
        <div className="ll-who-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            {
              title: 'Landlords',
              tagline: 'Protect your asset.',
              bullets: [
                'Documented proof of property condition at move-in',
                'Evidence-backed comparison at move-out',
                'Defensible deposit deduction records',
                'Full audit trail for every tenancy lifecycle event',
              ],
            },
            {
              title: 'Tenants',
              tagline: 'Protect your deposit.',
              bullets: [
                'Independent condition record before you move in',
                'Move-out comparison based on facts, not memory',
                'Dispute pathway built into the process',
                'Transparent record you can reference at any time',
              ],
            },
            {
              title: 'Estate Agents',
              tagline: 'Govern your mandates.',
              bullets: [
                'Structured workflow from draft to handover closed',
                'Inspection and evidence linked to each record',
                'Controlled state machine — no ad hoc status changes',
                'Registry integration ties records to the property',
              ],
            },
          ].map((card) => (
            <div key={card.title} style={{ borderTop: '3px solid var(--gold)', paddingTop: '28px' }}>
              <p style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
                {card.title}
              </p>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '24px', color: 'var(--navy)', marginBottom: '20px' }}>
                {card.tagline}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
                {card.bullets.map((b) => (
                  <li key={b} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#444', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>—</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="ll-how" style={{ backgroundColor: 'var(--navy)', padding: '88px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
          How It Works
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--off-white)', marginBottom: '16px' }}>
          Six stages. One governed record.
        </h2>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '52px' }} />
        <div className="ll-how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
          {[
            { step: '01', title: 'Create record',       body: 'Open a new LeaseLedger entry and link it to a registered property, lessee, and landlord.' },
            { step: '02', title: 'Schedule move-in',    body: 'Advance the record to Move-In Scheduled and confirm inspection date and parties.' },
            { step: '03', title: 'Capture condition',   body: 'Record the move-in inspection with photographic evidence and structured findings.' },
            { step: '04', title: 'Active tenancy',      body: 'The record remains active throughout the lease — a live reference for all parties.' },
            { step: '05', title: 'Move-out inspection', body: 'Capture the outgoing condition and compare against the move-in baseline.' },
            { step: '06', title: 'Handover closed',     body: 'Formalise the comparison outcome and close the handover with a full audit trail.' },
          ].map((item) => (
            <div key={item.step} style={{ borderTop: '1px solid rgba(201, 161, 77, 0.3)', paddingTop: '24px' }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(201, 161, 77, 0.7)', letterSpacing: '2px', marginBottom: '10px' }}>
                {item.step}
              </p>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--off-white)', marginBottom: '10px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#a0aec0', lineHeight: 1.7, margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="ll-features" style={{ backgroundColor: 'var(--off-white)', padding: '88px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Features
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--navy)', marginBottom: '16px' }}>
          What makes LeaseLedger different.
        </h2>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '52px' }} />
        <div className="ll-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {[
            {
              kicker: 'Evidence',
              title: 'Inspection-backed records',
              body: 'Every condition record is tied to structured inspection findings and photographic evidence. No assertion without proof.',
            },
            {
              kicker: 'Governance',
              title: 'Controlled state machine',
              body: 'Status transitions follow a defined lifecycle. No record can skip stages or revert without a governed reason — every action is logged.',
            },
            {
              kicker: 'Registry',
              title: 'Linked to property registry',
              body: 'LeaseLedger records are linked to properties in the FPIA registry — a single source of truth for condition history across transfers and tenancies.',
            },
            {
              kicker: 'Disputes',
              title: 'Built-in dispute pathway',
              body: 'When a dispute is flagged, the record enters a controlled resolution state with full context preserved — facts, not recollections.',
            },
          ].map((card) => (
            <div key={card.kicker} style={{ backgroundColor: '#ffffff', border: '1px solid rgba(11, 31, 51, 0.1)', padding: '36px', borderRadius: '4px' }}>
              <p style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px' }}>
                {card.kicker}
              </p>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: 'var(--navy)', marginBottom: '14px' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#55606d', lineHeight: 1.75, margin: 0 }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="ll-cta" style={{ backgroundColor: 'var(--gold)', padding: '88px 80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--navy)', marginBottom: '18px' }}>
          Ready to govern your tenancies?
        </h2>
        <p style={{ color: 'var(--navy)', fontSize: '16px', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.7, opacity: 0.8 }}>
          LeaseLedger is available as part of the FPIA authority platform. Get in touch to discuss access for your agency or practice.
        </p>
        <Link href="/contact" style={{
          display: 'inline-block',
          backgroundColor: 'var(--navy)',
          color: 'var(--off-white)',
          padding: '14px 40px',
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '2px',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}>
          Get in Touch
        </Link>
      </section>

      {/* ── Footer strip ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--navy)', borderTop: '1px solid rgba(201, 161, 77, 0.12)', padding: '32px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: 'var(--off-white)' }}>LeaseLedger</span>
          <span style={{ color: 'rgba(201, 161, 77, 0.7)', fontSize: '12px', marginLeft: '10px' }}>by FPIA</span>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Evidence-backed tenancy records — governed, linked, defensible.
        </p>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .ll-hero, .ll-who, .ll-how, .ll-features, .ll-cta {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
          .ll-who-grid, .ll-how-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .ll-features-grid {
            grid-template-columns: 1fr !important;
          }
          .ll-lifecycle {
            gap: 0 !important;
          }
        }

        @media (max-width: 640px) {
          .ll-hero, .ll-who, .ll-how, .ll-features, .ll-cta {
            padding-left: 18px !important;
            padding-right: 18px !important;
            padding-top: 52px !important;
            padding-bottom: 52px !important;
          }
          .ll-hero-headline {
            font-size: 38px !important;
          }
          .ll-who-grid, .ll-how-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </main>
  )
}
