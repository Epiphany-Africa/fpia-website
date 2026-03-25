import Link from 'next/link'

const audiences = [
  {
    icon: '🏠',
    title: 'Buyers',
    desc: 'Know exactly what you\'re buying. Our certified reports reveal the full condition of a property before you sign — protecting you from hidden latent defects and unexpected costs post-transfer.',
  },
  {
    icon: '📋',
    title: 'Sellers',
    desc: 'A FPIA certification signals credibility. Preserve your asking price by demonstrating transparency and removing the uncertainty that erodes deal value during the OTP period.',
  },
  {
    icon: '🏦',
    title: 'Banks & Financiers',
    desc: 'Reduce risk exposure. Our immutable ledger provides verified condition history that supports accurate valuations and reduces post-bond disputes.',
  },
  {
    icon: '🤝',
    title: 'Estate Agents',
    desc: 'Close faster with confidence. A certified listing removes the friction of last-minute defect negotiations that collapse deals at the finish line.',
  },
  {
    icon: '⚖️',
    title: 'Conveyancers',
    desc: 'Transfer with clarity. FPIA documentation supports the legal process with independent, timestamped inspection records available on demand.',
  },
]

const steps = [
  { num: '01', title: 'Property Registered', desc: 'Seller or agent registers the property on the FPIA platform and requests an inspection.' },
  { num: '02', title: 'Independent Inspection', desc: 'A licensed FPIA inspector conducts a thorough condition assessment across all compliance categories.' },
  { num: '03', title: 'Certificate Issued', desc: 'A digital certificate is generated and recorded on the immutable ledger — time-stamped and tamper-proof.' },
  { num: '04', title: 'QR Code Activated', desc: 'A unique QR code is assigned to the property. Anyone in the transaction chain can scan to verify status instantly.' },
  { num: '05', title: 'OTP Protection', desc: 'During the suspensive period, buyers and agents access the full report — protecting the deal from defect-driven price erosion.' },
]

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
<section style={{ backgroundColor: 'var(--navy)' }} className="relative overflow-hidden">
  <div
    className="absolute inset-0 opacity-5"
    style={{
      backgroundImage: 'linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
    }}
  />
  <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '60px' }}>
    
    {/* Left — text content */}
    <div style={{ flex: 1 }}>
      <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-6 font-medium">
        Independent Property Certification · South Africa
      </p>
      <h1
        style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--off-white)' }}
        className="text-5xl md:text-7xl leading-tight max-w-3xl mb-6"
      >
        Accountability<br />
        <em style={{ color: 'var(--gold)' }}>Built In.</em>
      </h1>
      <hr className="gold-rule w-24 mb-8" />
      <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-10">
        FPIA is the independent authority that certifies properties before they transfer — protecting every party in the chain from inspection through to title deed.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/#register"
          style={{ backgroundColor: 'var(--gold)', color: 'var(--navy)' }}
          className="inline-block px-8 py-4 font-semibold tracking-wide text-sm hover:opacity-90 transition-opacity text-center"
        >
          Register a Property
        </Link>
        <Link
          href="/verify"
          style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
          className="inline-block px-8 py-4 font-medium tracking-wide text-sm hover:border-white/60 transition-colors text-center"
        >
          Verify via QR →
        </Link>
      </div>

      {/* Century 21 beta social proof */}
      <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(201,161,77,0.2)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Beta Partner</span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '16px' }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontStyle: 'italic' }}>Century 21 South Africa</span>
      </div>
    </div>

    {/* Right — FPC badge */}
    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} className="hidden md:flex">
      <img
        src="/images/fpc-badge.png"
        alt="Fair Property Certified"
        style={{ width: '260px', height: '260px', objectFit: 'contain' }}
      />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center' }}>
        Fair Property Certified™
      </p>
    </div>

  </div>
</section>

      {/* ── TRUST BAR ── */}
      <section style={{ backgroundColor: 'var(--gold)' }} className="py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 text-navy text-xs font-semibold tracking-widest uppercase">
          {['Independent Inspection', 'Immutable Ledger', 'QR Verified', 'OTP Protection', 'Full Chain Transparency'].map(t => (
            <span key={t}>✦ {t}</span>
          ))}
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ backgroundColor: 'var(--off-white)' }} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">Who We Serve</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-4xl md:text-5xl mb-2">
            Every Party. One Standard.
          </h2>
          <hr className="gold-rule w-16 mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map(a => (
              <div
                key={a.title}
                style={{ border: '1px solid rgba(11,31,51,0.1)', backgroundColor: 'white' }}
                className="p-8 hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-4">{a.icon}</div>
                <h3 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-xl mb-3">{a.title}</h3>
                <p style={{ color: 'var(--slate)' }} className="text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS TEASER ── */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">The Process</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--off-white)' }} className="text-4xl md:text-5xl mb-2">
            Five Steps to Certainty.
          </h2>
          <hr className="gold-rule w-16 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px" style={{ backgroundColor: 'var(--steel)', zIndex: 0 }} />
                )}
                <div style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }} className="text-3xl font-medium mb-3">{s.num}</div>
                <h3 className="text-white font-semibold text-sm mb-2">{s.title}</h3>
                <p style={{ color: 'var(--slate)' }} className="text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/how-it-works"
              style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}
              className="inline-block px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-navy transition-colors font-medium"
            >
              Full Process Detail →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATE PREVIEW ── */}
      <section style={{ backgroundColor: 'var(--off-white)' }} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">What You Get</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-4xl md:text-5xl mb-2">
            The FPIA Certificate.
          </h2>
          <hr className="gold-rule w-16 mb-12" />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p style={{ color: 'var(--slate)' }} className="text-base leading-relaxed mb-6">
                Every registered property receives a digital certificate that captures the full inspection record — status, compliance categories, COC artefacts, and a QR code anyone can scan to verify authenticity in real time.
              </p>
              <ul className="space-y-3">
                {[
                  'Timestamped inspection record',
                  'Compliance category breakdown',
                  'COC artefact tracking',
                  'Unique QR code per property',
                  'Tamper-proof ledger entry',
                  'Five-status certification system',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'var(--navy)' }}>
                    <span style={{ color: 'var(--gold)' }}>✦</span> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/verify"
                style={{ backgroundColor: 'var(--navy)', color: 'white' }}
                className="inline-block mt-8 px-8 py-4 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
              >
                Verify a Property Now
              </Link>
            </div>

            {/* Certificate mockup */}
            <div style={{ border: '1px solid rgba(11,31,51,0.15)', backgroundColor: 'white' }} className="shadow-xl">
              <div style={{ backgroundColor: 'var(--navy)' }} className="px-6 py-4 flex items-center justify-between">
                <span style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--gold)' }} className="text-lg tracking-widest">FPIA CERTIFICATE</span>
                <span className="text-white/50 text-xs font-mono">#ZA-2024-00142</span>
              </div>
              <hr className="gold-rule" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Property</p>
                    <p style={{ color: 'var(--navy)' }} className="font-semibold">14 Protea Avenue, Sandton</p>
                    <p className="text-sm text-slate-500">Gauteng, 2196</p>
                  </div>
                  <span className="status-certified text-xs font-semibold px-3 py-1 rounded-full">✔ Certified</span>
                </div>
                <table className="w-full text-xs mb-6">
                  <tbody>
                    {[
                      ['Inspection Date', '14 March 2024'],
                      ['Inspector', 'J. Botha — SACPCMP Reg.'],
                      ['Certificate Valid', '12 months'],
                      ['Ledger Entry', 'Block #88,241'],
                    ].map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid rgba(11,31,51,0.06)' }}>
                        <td className="py-2 text-slate-500 pr-4">{k}</td>
                        <td style={{ color: 'var(--navy)' }} className="py-2 font-medium">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ backgroundColor: 'var(--off-white)', border: '1px dashed rgba(11,31,51,0.2)' }} className="p-4 flex items-center gap-4">
                  <div style={{ width: 64, height: 64, backgroundColor: 'var(--navy)' }} className="flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">QR</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>Scan to verify</p>
                    <p className="text-xs text-slate-400 mt-1">fpia.co.za/verify/ZA-2024-00142</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REGISTER CTA ── */}
      <section id="register" style={{ backgroundColor: 'var(--gold)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2
            style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }}
            className="text-4xl md:text-5xl mb-4"
          >
            Ready to Certify Your Property?
          </h2>
          <p style={{ color: 'rgba(11,31,51,0.7)' }} className="text-base mb-8 max-w-lg mx-auto">
            Join the growing number of sellers and agents using FPIA to protect their listings and their buyers.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              style={{ border: '1px solid rgba(11,31,51,0.3)', color: 'var(--navy)' }}
              className="flex-1 px-4 py-3 text-sm bg-white/80 focus:outline-none focus:border-navy placeholder-slate-400"
            />
            <button
              type="submit"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
              className="px-6 py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Register Now
            </button>
          </form>
          <p style={{ color: 'rgba(11,31,51,0.5)' }} className="text-xs mt-4">
            No commitment. Our team will contact you within 1 business day.
          </p>
        </div>
      </section>
    </>
  )
}