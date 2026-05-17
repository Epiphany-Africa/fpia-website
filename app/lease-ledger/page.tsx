import Link from 'next/link'

export default function LeaseLedgerPage() {
  return (
    <main style={{ backgroundColor: 'var(--off-white)', color: 'var(--navy)', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="ll-hero" style={{ backgroundColor: 'var(--navy)', padding: '100px 80px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
          Lease Ledger by FPIA
        </p>
        <h1 className="ll-hero-headline" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '62px', color: 'var(--off-white)', lineHeight: 1.08, marginBottom: '28px', maxWidth: '780px' }}>
          Lease Ledger
        </h1>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '28px' }} />
        <p style={{ color: '#a0aec0', fontSize: '18px', maxWidth: '580px', lineHeight: 1.75, marginBottom: '40px' }}>
          Tenancy condition accountability from move-in to handover closure. Lease Ledger captures move-in baselines, move-out condition, handover comparison, dispute support, deposit dispute support, and governed closure in one evidence-backed workflow.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'For Landlords', href: '/lease-ledger#landlords' },
            { label: 'For Tenants', href: '/lease-ledger#tenants' },
            { label: 'For Estate Agents', href: '/lease-ledger#estate-agents' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{
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
              textDecoration: 'none',
              transition: 'transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
            }}>
              {item.label}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
          <Link href="/lease-ledger/one-pager" style={{
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
            textTransform: 'uppercase',
          }}>
            Open Commercial One-Pager
          </Link>
          <Link href="/api/lease-ledger-one-pager-pdf" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '46px',
            padding: '0 18px',
            border: '1px solid rgba(201,161,77,0.34)',
            color: 'var(--off-white)',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}>
            Download PDF Leave-Behind
          </Link>
        </div>
      </section>

      {/* ── Lifecycle strip ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--navy)', borderTop: '1px solid rgba(201, 161, 77, 0.12)', padding: '40px 80px' }}>
        <p style={{ color: 'rgba(201, 161, 77, 0.7)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px' }}>
          Tenancy Lifecycle
        </p>
        <div className="ll-lifecycle" style={{ display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', rowGap: '16px' }}>
          {[
            { label: 'Record Created',     dot: '#94a3b8' },
            { label: 'Move-In Baseline',   dot: '#3b82f6' },
            { label: 'Tenancy Active',     dot: '#22c55e' },
            { label: 'Move-Out Recorded',  dot: '#f59e0b' },
            { label: 'Handover Compared',  dot: '#8b5cf6' },
            { label: 'Closed',             dot: '#C9A14D' },
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

      {/* ── Coverage ─────────────────────────────────────────────────────── */}
      <section className="ll-coverage" style={{ backgroundColor: '#ffffff', padding: '88px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
          What Lease Ledger Covers
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--navy)', marginBottom: '16px' }}>
          The governed tenancy accountability workflow.
        </h2>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '52px' }} />
        <div className="ll-coverage-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '18px' }}>
          {[
            {
              title: 'Move-In Baseline',
              body: 'Create the opening condition record with dated inspection findings and evidence-backed starting context.',
            },
            {
              title: 'Move-Out Record',
              body: 'Capture the outgoing condition in a structured way so the tenancy close-out is based on record, not recollection.',
            },
            {
              title: 'Handover Comparison',
              body: 'Compare move-in and move-out records area by area and preserve the operational conclusion behind each change.',
            },
            {
              title: 'Dispute Support',
              body: 'Flag contested issues, preserve context, and prepare the record for downstream review without implying legal adjudication.',
            },
            {
              title: 'Governed Closure',
              body: 'Close the handover with the full lifecycle preserved under a governed record and audit trail.',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{ border: '1px solid rgba(11, 31, 51, 0.1)', backgroundColor: 'var(--off-white)', padding: '24px' }}
            >
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: 'var(--navy)', marginBottom: '12px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#55606d', lineHeight: 1.75, margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Commercial model ─────────────────────────────────────────────── */}
      <section className="ll-commercial" style={{ backgroundColor: 'var(--off-white)', padding: '88px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Commercial Model
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--navy)', marginBottom: '16px' }}>
          How Lease Ledger is engaged.
        </h2>
        <p style={{ color: '#55606d', fontSize: '16px', maxWidth: '760px', lineHeight: 1.8, margin: '0 0 44px 0' }}>
          Lease Ledger is the tenancy accountability layer inside FPIA. It can be engaged as a one-off workflow service, a portfolio or agency operating layer, or a managed institutional rollout. Pricing is discussed directly so the commercial structure can match the tenancy volume, workflow responsibility, and reporting needs of the user.
        </p>
        <div className="ll-commercial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px' }}>
          {[
            {
              title: 'One-off workflow services',
              items: [
                'Move-In Baseline Record',
                'Move-Out Condition Record',
                'Handover Comparison Summary',
                'Deposit Dispute Support Pack',
              ],
              body: 'Use Lease Ledger for a specific tenancy event where a governed record, comparison, or support output is required.',
              ctaLabel: 'Request Lease Ledger Access',
              ctaHref: '/contact?topic=lease-ledger&intent=one-off-workflow',
            },
            {
              title: 'Portfolio / agency access',
              items: [
                'Recurring workflow access for agencies and rental managers',
                'Monthly workflow capacity planning',
                'Portfolio oversight and reporting',
                'Governed handover support across multiple records',
              ],
              body: 'Run Lease Ledger as part of your normal tenancy operations with structured oversight instead of ad hoc move-in and move-out handling.',
              ctaLabel: 'Book a Lease Ledger Demo',
              ctaHref: '/contact?topic=lease-ledger&intent=portfolio-agency-demo',
            },
            {
              title: 'Institutional / managed use',
              items: [
                'Larger landlord or managed-portfolio rollout discussion',
                'Pilot or staged implementation support',
                'Access, reporting, and governance configuration',
                'Structured operating model for internal teams',
              ],
              body: 'Discuss a managed Lease Ledger rollout where multiple users, properties, or reporting obligations need a more formal operating layer.',
              ctaLabel: 'Talk to us about portfolio rollout',
              ctaHref: '/contact?topic=lease-ledger&intent=institutional-rollout',
            },
          ].map((tier) => (
            <div
              key={tier.title}
              style={{ backgroundColor: '#ffffff', border: '1px solid rgba(11, 31, 51, 0.1)', padding: '34px' }}
            >
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: 'var(--navy)', margin: '0 0 14px 0' }}>
                {tier.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#55606d', lineHeight: 1.75, margin: '0 0 18px 0' }}>
                {tier.body}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'grid', gap: '10px' }}>
                {tier.items.map((item) => (
                  <li key={item} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.ctaHref}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '44px',
                  padding: '0 18px',
                  border: '1px solid rgba(11,31,51,0.16)',
                  backgroundColor: 'var(--navy)',
                  color: 'var(--off-white)',
                  textDecoration: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {tier.ctaLabel}
              </Link>
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
              id: 'landlords',
              title: 'Landlords',
              tagline: 'Protect your asset.',
              bullets: [
                'Documented proof of property condition at move-in',
                'Evidence-backed comparison at move-out',
                'Governed dispute support for downstream review',
                'Full audit trail for every tenancy lifecycle event',
              ],
              body: 'Lease Ledger gives landlords a governed move-in baseline, a controlled move-out record, and a structured handover outcome that can support deposit-related discussions without pretending to adjudicate the dispute.',
            },
            {
              id: 'tenants',
              title: 'Tenants',
              tagline: 'Protect your tenancy record.',
              bullets: [
                'Independent condition record before you move in',
                'Move-out comparison based on facts, not memory',
                'Dispute pathway built into the process',
                'Transparent record you can reference at any time',
              ],
              body: 'Lease Ledger helps tenants start from a fair recorded baseline, reduces the risk of unfair condition attribution, and preserves the evidence trail if a handover issue needs external review.',
            },
            {
              id: 'estate-agents',
              title: 'Estate Agents',
              tagline: 'Govern your mandates.',
              bullets: [
                'Structured workflow from draft to handover closed',
                'Inspection and evidence linked to each record',
                'Controlled state machine — no ad hoc status changes',
                'Registry integration ties records to the property',
              ],
              body: 'Lease Ledger gives estate agents and rental managers a cleaner operational handover process, more consistent portfolio records, and lower friction when condition questions arise between parties.',
            },
          ].map((card) => (
            <div id={card.id} key={card.title} style={{ borderTop: '3px solid var(--gold)', paddingTop: '28px', scrollMarginTop: '112px' }}>
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
              <p style={{ fontSize: '14px', color: '#55606d', lineHeight: 1.75, margin: '22px 0 0 0' }}>
                {card.body}
              </p>
              <div style={{ marginTop: '24px' }}>
                <Link
                  href={
                    card.id === 'landlords'
                      ? '/contact?topic=lease-ledger&intent=landlord-access'
                      : card.id === 'tenants'
                        ? '/contact?topic=lease-ledger&intent=tenant-guidance'
                        : '/contact?topic=lease-ledger&intent=estate-agent-demo'
                  }
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '42px',
                    padding: '0 16px',
                    border: '1px solid rgba(11,31,51,0.14)',
                    backgroundColor: 'var(--navy)',
                    color: 'var(--off-white)',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {card.id === 'landlords'
                    ? 'Request Lease Ledger Access'
                    : card.id === 'tenants'
                      ? 'Ask Your Agent About Lease Ledger'
                      : 'Book a Lease Ledger Demo'}
                </Link>
              </div>
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
            { step: '01', title: 'Create record',       body: 'Open a new Lease Ledger entry and link it to a registered property, lessee, and landlord or manager.' },
            { step: '02', title: 'Schedule move-in',    body: 'Advance the record to Move-In Scheduled and confirm inspection date and parties.' },
            { step: '03', title: 'Capture condition',   body: 'Record the move-in inspection with photographic evidence and structured findings.' },
            { step: '04', title: 'Active tenancy',      body: 'The record remains active throughout the lease — a live reference for all parties.' },
            { step: '05', title: 'Move-out inspection', body: 'Capture the outgoing condition, compare it against the move-in baseline, and preserve the evidence trail.' },
            { step: '06', title: 'Handover review',     body: 'Complete the comparison, prepare dispute support where needed, and close the handover with a governed audit trail.' },
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
              body: 'When a dispute is flagged, the record enters a controlled support state with full context preserved for downstream review — facts, not recollections.',
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
        <div style={{ marginTop: '28px' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid rgba(11, 31, 51, 0.1)', padding: '32px 36px', borderTop: '3px solid var(--gold)' }}>
            <p style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px' }}>
              Supporting Capability
            </p>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '24px', color: 'var(--navy)', marginBottom: '14px' }}>
              Early Tenant Observations
            </h3>
            <p style={{ fontSize: '14px', color: '#55606d', lineHeight: 1.75, margin: 0, maxWidth: '860px' }}>
              Lease Ledger can include a governed post-move-in observation window that allows early tenancy issues to be submitted and reviewed without rewriting the original move-in record. This improves fairness, strengthens the evidentiary environment, and reduces avoidable friction later in the tenancy.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section id="request-access" className="ll-cta" style={{ backgroundColor: 'var(--gold)', padding: '88px 80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--navy)', marginBottom: '18px' }}>
          Bring Lease Ledger into the tenancy workflow.
        </h2>
        <p style={{ color: 'var(--navy)', fontSize: '16px', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.7, opacity: 0.8 }}>
          Lease Ledger is available as part of the FPIA authority platform. It provides the governed evidentiary record and support summary, not a legal ruling, automated liability decision, or deposit outcome engine.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link href="/contact?topic=lease-ledger&intent=walkthrough" style={{
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
            Request a Lease Ledger Walkthrough
          </Link>
          <Link href="/contact?topic=lease-ledger&intent=portfolio-rollout" style={{
            display: 'inline-block',
            border: '1px solid rgba(11,31,51,0.18)',
            color: 'var(--navy)',
            padding: '14px 28px',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '2px',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}>
            Talk to us about portfolio rollout
          </Link>
          <Link href="/lease-ledger/one-pager" style={{
            display: 'inline-block',
            border: '1px solid rgba(11,31,51,0.18)',
            color: 'var(--navy)',
            padding: '14px 28px',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '2px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(255,255,255,0.16)',
          }}>
            Open Commercial One-Pager
          </Link>
        </div>
      </section>

      {/* ── Footer strip ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--navy)', borderTop: '1px solid rgba(201, 161, 77, 0.12)', padding: '32px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: 'var(--off-white)' }}>Lease Ledger</span>
          <span style={{ color: 'rgba(201, 161, 77, 0.7)', fontSize: '12px', marginLeft: '10px' }}>by FPIA</span>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Evidence-backed tenancy records — governed, linked, defensible.
        </p>
      </section>

      <style>{`
        .ll-hero a:hover {
          transform: translateY(-1px);
          background: rgba(201, 161, 77, 0.18) !important;
          border-color: rgba(201, 161, 77, 0.62) !important;
        }

        @media (max-width: 980px) {
          .ll-hero, .ll-coverage, .ll-commercial, .ll-who, .ll-how, .ll-features, .ll-cta {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
          .ll-commercial-grid,
          .ll-who-grid,
          .ll-how-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .ll-coverage-grid {
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
          .ll-hero, .ll-coverage, .ll-commercial, .ll-who, .ll-how, .ll-features, .ll-cta {
            padding-left: 18px !important;
            padding-right: 18px !important;
            padding-top: 52px !important;
            padding-bottom: 52px !important;
          }
          .ll-hero-headline {
            font-size: 38px !important;
          }
          .ll-coverage-grid,
          .ll-commercial-grid,
          .ll-who-grid,
          .ll-how-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </main>
  )
}
