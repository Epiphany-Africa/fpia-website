import Link from 'next/link'

export default function HowItWorks() {
  return (
    <main style={{ backgroundColor: 'var(--off-white)', color: 'var(--navy)', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero */}
      <section className="fpia-process-hero" style={{ backgroundColor: 'var(--navy)', padding: '100px 80px 80px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>The Process</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '56px', color: 'var(--off-white)', lineHeight: 1.1, marginBottom: '24px' }}>
          How FPIA Works.
        </h1>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '24px' }} />
        <p style={{ color: '#a0aec0', fontSize: '18px', maxWidth: '560px', lineHeight: 1.7 }}>
          A transparent, end-to-end certification process designed to protect every party — from first inspection through to title deed transfer.
        </p>
      </section>

      {/* Steps */}
      <section className="fpia-process-steps" style={{ padding: '80px' }}>
        {[
          {
            num: '01',
            title: 'Property Registered',
            body: 'The seller or listing property practitioner registers the property on the FPIA platform. Basic property details, ownership confirmation, and contact information are captured at this stage. A unique property ID is assigned immediately.',
            note: 'Takes less than 10 minutes to complete online.'
          },
          {
            num: '02',
            title: 'Independent Inspection Scheduled',
            body: 'FPIA assigns a licensed, independent inspector — registered with SACPCMP or equivalent body. The inspection is booked within 3 business days and covers all compliance categories including electrical, plumbing, structural, and pest.',
            note: 'No conflict of interest: inspectors are never appointed by the seller.'
          },
          {
            num: '03',
            title: 'Condition Assessment Conducted',
            body: 'The inspector conducts a thorough on-site assessment. Each compliance category is scored and documented with photographic evidence. COC artefacts are captured and timestamped directly into the FPIA ledger during the inspection.',
            note: 'Full photographic and documentary record retained for 10 years.'
          },
          {
            num: '04',
            title: 'Certificate Issued & Ledger Recorded',
            body: 'A digital FPIA Certificate is generated upon inspection completion. The registry records one of four canonical trust outcomes: Verified, Conditional, Revoked, or Not Certified. The record is written to the immutable ledger — tamper-proof and timestamped.',
            note: 'Certificate is valid for 12 months from date of issue.'
          },
          {
            num: '05',
            title: 'QR Code Activated',
            body: 'A unique QR code is linked to the property certificate. Buyers, property practitioners, banks, and property legal practitioners can scan the code at any point to verify the current certification status in real time — no login required.',
            note: 'QR codes are publicly verifiable at fairproperties.org.za/verify'
          },
          {
            num: '06',
            title: 'OTP Period Protection',
            body: 'During the suspensive condition period of the Offer to Purchase, all parties have access to the full FPIA report. This eliminates last-minute defect discoveries that erode deal value or collapse transactions at the finish line.',
            note: 'Property legal practitioners receive a direct ledger reference for transfer documentation.'
          },
        ].map((step, i) => (
          <div key={i} className="fpia-process-step-row" style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: '40px',
            borderTop: '1px solid #ddd',
            padding: '48px 0',
            maxWidth: '900px'
          }}>
            <div style={{ color: 'var(--gold)', fontFamily: "'DM Serif Display', serif", fontSize: '48px' }}>{step.num}</div>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: 'var(--navy)', marginBottom: '16px' }}>{step.title}</h2>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#444', marginBottom: '16px' }}>{step.body}</p>
              <p style={{ fontSize: '13px', color: 'var(--gold)', fontStyle: 'italic' }}>✦ {step.note}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="fpia-process-cta" style={{ backgroundColor: 'var(--navy)', padding: '80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '40px', color: 'var(--off-white)', marginBottom: '16px' }}>
          Ready to certify your property?
        </h2>
        <p style={{ color: '#a0aec0', marginBottom: '40px', fontSize: '16px' }}>Start the process today — our team will contact you within 1 business day.</p>
        <Link href="/register" style={{
          backgroundColor: 'var(--gold)',
          color: 'var(--navy)',
          padding: '14px 36px',
          fontWeight: 600,
          fontSize: '14px',
          letterSpacing: '1px',
          textDecoration: 'none',
          textTransform: 'uppercase'
        }}>Register a Property</Link>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .fpia-process-hero,
          .fpia-process-steps,
          .fpia-process-cta {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
        }

        @media (max-width: 720px) {
          .fpia-process-step-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 28px 0 !important;
          }
        }

        @media (max-width: 640px) {
          .fpia-process-hero,
          .fpia-process-steps,
          .fpia-process-cta {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          .fpia-process-hero {
            padding-top: 44px !important;
            padding-bottom: 36px !important;
          }

          .fpia-process-steps,
          .fpia-process-cta {
            padding-top: 36px !important;
            padding-bottom: 40px !important;
          }
        }
      `}</style>
    </main>
  )
}
