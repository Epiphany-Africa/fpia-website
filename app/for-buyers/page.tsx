export default function ForBuyers() {
  return (
    <main style={{ backgroundColor: 'var(--off-white)', color: 'var(--navy)', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)', padding: '100px 80px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>For Buyers</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '56px', color: 'var(--off-white)', lineHeight: 1.1, marginBottom: '24px' }}>
          Know exactly what<br />you're buying.
        </h1>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '24px' }} />
        <p style={{ color: '#a0aec0', fontSize: '18px', maxWidth: '560px', lineHeight: 1.7 }}>
          A FPIA certificate gives you independent, verified proof of a property's condition before you sign — protecting you from hidden defects and post-transfer disputes.
        </p>
      </section>

      {/* Risk section */}
      <section style={{ padding: '80px', maxWidth: '900px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>The Problem</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', marginBottom: '24px' }}>
          What you don't know can cost you.
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
      <section style={{ backgroundColor: 'var(--navy)', padding: '80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>The Solution</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', color: 'var(--off-white)', marginBottom: '24px' }}>
          What FPIA gives you.
        </h2>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '48px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
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

      {/* Five statuses */}
      <section style={{ padding: '80px', maxWidth: '900px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Certification Statuses</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', marginBottom: '24px' }}>What the certificate tells you.</h2>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '40px' }} />
        {[
          { status: '✔ Certified', style: 'status-certified', desc: 'Property passed all compliance categories. Full COC artefacts on record. Safe to proceed.' },
          { status: '⚠ Conditional', style: 'status-conditional', desc: 'Minor items flagged. Conditions must be resolved before or after transfer — terms agreed in OTP.' },
          { status: '⏳ Pending', style: 'status-pending', desc: 'Inspection complete but outstanding documentation required before certificate is issued.' },
          { status: '🔄 In Progress', style: 'status-inprogress', desc: 'Inspection has been scheduled or is currently underway. Check back for the final result.' },
          { status: '✖ Not Certified', style: 'status-notcertified', desc: 'Property failed one or more compliance categories. Significant defects identified — proceed with caution.' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', borderTop: '1px solid #ddd', padding: '24px 0' }}>
            <span className={item.style} style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.status}</span>
            <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.7 }}>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--gold)', padding: '80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', color: 'var(--navy)', marginBottom: '16px' }}>
          Verify before you sign.
        </h2>
        <p style={{ color: 'var(--navy)', marginBottom: '40px', fontSize: '16px' }}>Scan a property QR code or enter a certificate number to check status instantly.</p>
        <a href="/verify" style={{
          backgroundColor: 'var(--navy)',
          color: 'var(--off-white)',
          padding: '14px 36px',
          fontWeight: 600,
          fontSize: '14px',
          letterSpacing: '1px',
          textDecoration: 'none',
          textTransform: 'uppercase'
        }}>Verify a Property</a>
      </section>

    </main>
  )
}