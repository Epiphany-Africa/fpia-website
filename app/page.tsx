import Link from 'next/link'

const audiences = [
  {
    icon: '🏠',
    title: 'Buyers',
    desc: 'Avoid hidden defects before you sign. See the full condition of a property upfront — no surprises, no unexpected costs after transfer.',
  },
  {
    icon: '📋',
    title: 'Sellers',
    desc: 'Protect your asking price with proof. A certified property builds trust, removes doubt, and prevents last-minute renegotiation.',
  },
  {
    icon: '🏦',
    title: 'Banks & Financiers',
    desc: 'Lend with verified property data. Reduce risk with independently verified condition reports that support accurate valuations.',
  },
  {
    icon: '🤝',
    title: 'Estate Agents',
    desc: 'Stop deals collapsing at the last minute. Certified listings remove friction and keep transactions moving forward with confidence.',
  },
  {
    icon: '⚖️',
    title: 'Conveyancers',
    desc: 'Eliminate disputes during transfer. Access timestamped inspection records that provide clarity and accountability at every step.',
  },
]

const steps = [
  { num: '01', title: 'Property Registered', desc: 'The property is submitted on the FPIA platform and scheduled for inspection.' },
  { num: '02', title: 'Independent Inspection', desc: 'A licensed FPIA inspector conducts a full condition assessment across all compliance categories.' },
  { num: '03', title: 'Certificate Issued', desc: 'A digital certificate is generated and securely recorded — time-stamped and tamper-proof.' },
  { num: '04', title: 'QR Code Activated', desc: 'A unique QR code allows instant verification by any party in the transaction.' },
  { num: '05', title: 'OTP Protection', desc: 'Secure access during the suspensive period ensures controlled, trusted information sharing.' },
]

const qrCode = (
  <svg viewBox="0 0 21 21" width="56" height="56" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
    <rect width="21" height="21" fill="white"/>
    <rect x="0" y="0" width="7" height="7" fill="#0B1F33"/>
    <rect x="1" y="1" width="5" height="5" fill="white"/>
    <rect x="2" y="2" width="3" height="3" fill="#0B1F33"/>
    <rect x="14" y="0" width="7" height="7" fill="#0B1F33"/>
    <rect x="15" y="1" width="5" height="5" fill="white"/>
    <rect x="16" y="2" width="3" height="3" fill="#0B1F33"/>
    <rect x="0" y="14" width="7" height="7" fill="#0B1F33"/>
    <rect x="1" y="15" width="5" height="5" fill="white"/>
    <rect x="2" y="16" width="3" height="3" fill="#0B1F33"/>
    <rect x="8" y="0" width="1" height="1" fill="#0B1F33"/>
    <rect x="10" y="0" width="1" height="1" fill="#0B1F33"/>
    <rect x="9" y="2" width="1" height="1" fill="#0B1F33"/>
    <rect x="11" y="2" width="1" height="1" fill="#0B1F33"/>
    <rect x="8" y="4" width="2" height="1" fill="#0B1F33"/>
    <rect x="9" y="6" width="1" height="1" fill="#0B1F33"/>
    <rect x="11" y="6" width="2" height="1" fill="#0B1F33"/>
    <rect x="0" y="8" width="1" height="1" fill="#0B1F33"/>
    <rect x="2" y="8" width="3" height="1" fill="#0B1F33"/>
    <rect x="7" y="8" width="1" height="1" fill="#0B1F33"/>
    <rect x="9" y="8" width="2" height="1" fill="#0B1F33"/>
    <rect x="13" y="8" width="1" height="1" fill="#0B1F33"/>
    <rect x="15" y="8" width="2" height="1" fill="#0B1F33"/>
    <rect x="1" y="10" width="2" height="1" fill="#0B1F33"/>
    <rect x="5" y="10" width="1" height="1" fill="#0B1F33"/>
    <rect x="8" y="10" width="1" height="1" fill="#0B1F33"/>
    <rect x="10" y="10" width="3" height="1" fill="#0B1F33"/>
    <rect x="15" y="10" width="1" height="1" fill="#0B1F33"/>
    <rect x="0" y="12" width="1" height="1" fill="#0B1F33"/>
    <rect x="3" y="12" width="2" height="1" fill="#0B1F33"/>
    <rect x="7" y="12" width="2" height="1" fill="#0B1F33"/>
    <rect x="11" y="12" width="1" height="1" fill="#0B1F33"/>
    <rect x="14" y="12" width="2" height="1" fill="#0B1F33"/>
    <rect x="8" y="14" width="1" height="1" fill="#0B1F33"/>
    <rect x="10" y="14" width="2" height="1" fill="#0B1F33"/>
    <rect x="8" y="16" width="3" height="1" fill="#0B1F33"/>
    <rect x="13" y="16" width="2" height="1" fill="#0B1F33"/>
    <rect x="9" y="18" width="1" height="1" fill="#0B1F33"/>
    <rect x="12" y="18" width="1" height="1" fill="#0B1F33"/>
    <rect x="15" y="18" width="3" height="1" fill="#0B1F33"/>
    <rect x="8" y="20" width="2" height="1" fill="#0B1F33"/>
    <rect x="11" y="20" width="1" height="1" fill="#0B1F33"/>
  </svg>
)

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-7xl mx-auto px-6 py-4 md:py-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '60px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-6 font-medium">Independent Property Certification · South Africa</p>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--off-white)' }} className="text-5xl md:text-7xl leading-tight max-w-3xl mb-6">
              Know the true condition<br />
            <em style={{ color: 'var(--gold)' }}>before you commit.</em>
            </h1>

            <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-6">
              Independent inspection, certified reports, and real-time verification that prevent failed deals, hidden defects, and post-transfer disputes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/verify/demo" style={{ backgroundColor: 'var(--gold)', color: 'var(--navy)' }} className="inline-block px-8 py-4 font-semibold tracking-wide text-sm hover:opacity-90 transition-opacity text-center">
                Verify a Property →
              </Link>
              <Link href="/#register" style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white' }} className="inline-block px-8 py-4 font-medium tracking-wide text-sm hover:border-white/60 transition-colors text-center">
                Register a Property
              </Link>
            </div>
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(201,161,77,0.2)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Beta Partner</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '16px' }}>|</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontStyle: 'italic' }}>Century 21 South Africa</span>
            </div>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} className="hidden md:flex">
            <img src="/images/fpc-badge.png" alt="Fair Property Certified" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center' }}>Fair Property Certified™</p>
          </div>
        </div>
      </section>

      {/* ── PROBLEM SECTION ── */}
      <section style={{ backgroundColor: 'var(--off-white)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
            <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">
              Why FPIA is necessary
            </p>

          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-4xl md:text-5xl mb-4">
              Most property deals fail for the same reason.
          </h2>

            <p style={{ color: 'var(--slate)' }} className="text-base max-w-2xl leading-relaxed mb-12">
              Incomplete disclosure, late-stage inspections, and unverified property information create avoidable risk for buyers, sellers, agents, and financiers.
            </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          'Defects discovered too late',
          'Price renegotiations collapse deals',
          'Buyers inherit hidden costs',
          'No single verified source of truth',
        ].map((item) => (
        <div
          key={item}
          style={{ border: '1px solid rgba(11,31,51,0.1)', backgroundColor: 'white' }}
          className="p-6"
        >
          <p style={{ color: 'var(--navy)' }} className="text-sm font-medium">
            {item}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── TRUST BAR ── */}
      <section style={{ backgroundColor: 'var(--gold)' }} className="py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 text-navy text-xs font-semibold tracking-widest uppercase">
          {['Independent Inspection', 'Tamper-Proof Records', 'QR Verified', 'OTP Secured', 'Full Chain Transparency'].map(t => (
            <span key={t}>✦ {t}</span>
          ))}
        </div>
      </section>

      {/* ── WITHOUT FPIA ── */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">The Risk</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--off-white)' }} className="text-4xl md:text-5xl mb-4">
            What happens without FPIA?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-base max-w-2xl leading-relaxed mb-16">
            Most property transactions rely on incomplete information, late-stage inspections, and trust that often breaks when it matters most.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }} className="p-8">
              <h3 style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }} className="text-xs tracking-widest uppercase mb-6">Without FPIA</h3>
              <ul className="space-y-4">
                {[
                  'Defects only discovered late in the process',
                  'Deals collapse during OTP or just before transfer',
                  'Price renegotiations erode seller value',
                  'Buyers inherit hidden repair costs',
                  'Disputes arise after transfer with no clear accountability',
                  'No single verified source of truth',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ color: '#e05555', marginTop: '2px' }}>✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ border: '1px solid rgba(201,161,77,0.3)', backgroundColor: 'rgba(201,161,77,0.05)' }} className="p-8">
              <h3 style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }} className="text-xs tracking-widest uppercase mb-6">With FPIA</h3>
              <ul className="space-y-4">
                {[
                  'Full condition verified before listing or offer',
                  'Transparent reports available to all parties',
                  'Deals progress with confidence and fewer delays',
                  'Pricing supported by verified property condition',
                  'Tamper-proof record protects all stakeholders',
                  'One trusted, independent standard',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    <span style={{ color: 'var(--gold)', marginTop: '2px' }}>✦</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p style={{ borderTop: '1px solid rgba(201,161,77,0.2)', paddingTop: '32px', color: 'var(--gold)', fontFamily: 'DM Serif Display, serif' }} className="text-xl md:text-2xl">
            FPIA doesn't just certify properties — it prevents transaction failure.
          </p>
        </div>
      </section>

      {/* ── REAL WORLD SCENARIO ── */}
      <section style={{ backgroundColor: 'var(--off-white)' }} className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">Real World Impact</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-4xl md:text-5xl mb-16">
            A typical property deal — before FPIA.
          </h2>
          <div className="flex flex-col gap-8">
            <div style={{ backgroundColor: 'white', border: '1px solid rgba(11,31,51,0.1)' }} className="p-8">
              <h3 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-xl mb-6">Without FPIA</h3>
              <p style={{ color: 'var(--slate)' }} className="text-sm leading-relaxed mb-6">
                A buyer signs an offer on a property that appears to be in good condition. Weeks into the process, during the suspensive period:
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  {[
                    'A late inspection reveals structural cracks and electrical compliance issues',
                    'The buyer requests a price reduction',
                    'The seller disputes the findings',
                    'The deal stalls',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--slate)' }}>
                      <span style={{ color: '#e05555', marginTop: '2px', flexShrink: 0 }}>✕</span> {item}
                    </li>
                  ))}
                </ul>
                <div style={{ borderLeft: '1px solid rgba(11,31,51,0.08)', paddingLeft: '24px' }}>
                  <p style={{ color: 'var(--navy)', fontFamily: 'DM Mono, monospace' }} className="text-xs tracking-widest uppercase mb-3">The Result</p>
                  <ul className="space-y-2">
                    {['The buyer walks away', 'The seller relists at a lower price', 'The agent loses the deal', 'Weeks are lost — and trust is broken'].map(item => (
                      <li key={item} className="text-sm" style={{ color: '#e05555' }}>— {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--navy)', border: '1px solid rgba(201,161,77,0.2)' }} className="p-8">
              <h3 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--gold)' }} className="text-xl mb-6">Now with FPIA</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  {[
                    'An independent FPIA inspection is completed',
                    'All defects and compliance items are documented',
                    'A certified report is issued and recorded',
                    'They see the full condition upfront',
                    'The price reflects verified reality',
                    'No surprises emerge during OTP',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      <span style={{ color: 'var(--gold)', marginTop: '2px', flexShrink: 0 }}>✦</span> {item}
                    </li>
                  ))}
                </ul>
                <div style={{ borderLeft: '1px solid rgba(201,161,77,0.2)', paddingLeft: '24px' }}>
                  <p style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }} className="text-xs tracking-widest uppercase mb-3">The Result</p>
                  <ul className="space-y-2">
                    {['Faster agreement', 'No renegotiation', 'Smooth transfer', 'Protected value for all parties'].map(item => (
                      <li key={item} className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>✦ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <p style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(11,31,51,0.1)', fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-xl md:text-2xl">
            Certainty upfront changes everything downstream.
          </p>
        </div>
      </section>

      {/* ── LIVE DEMO ── */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">See It In Action</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--off-white)' }} className="text-4xl md:text-5xl mb-4">
            See a certified property in action.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-base max-w-2xl leading-relaxed mb-10">
            Explore a real FPIA-certified property and experience how verification works across the transaction chain.
          </p>
          <div className="grid sm:grid-cols-4 gap-4 mb-10">
            {['Full inspection record', 'Certification status', 'Ledger verification', 'Inspector credentials'].map(item => (
              <div key={item} style={{ border: '1px solid rgba(201,161,77,0.2)', backgroundColor: 'rgba(255,255,255,0.03)' }} className="px-5 py-4 flex items-center gap-3">
                <span style={{ color: 'var(--gold)' }}>✦</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid rgba(201,161,77,0.3)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <div style={{ backgroundColor: 'rgba(201,161,77,0.1)', borderBottom: '1px solid rgba(201,161,77,0.2)' }} className="px-6 py-4 flex items-center justify-between">
              <span style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--gold)' }} className="text-lg tracking-widest">FPIA CERTIFICATE</span>
              <span className="text-white/40 text-xs font-mono">#ZA-2024-00142</span>
            </div>
            <div className="p-6 grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Property</p>
                <p style={{ color: 'var(--off-white)' }} className="font-semibold text-lg">14 Protea Avenue, Sandton</p>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Gauteng, 2196</p>
                <span className="status-certified text-xs font-semibold px-3 py-1 rounded-full">✔ Certified</span>
              </div>
              <div>
                <table className="w-full text-xs">
                  <tbody>
                    {[
                      ['Inspection Date', '14 March 2024'],
                      ['Inspector', 'S. van der Merwe — SACPCMP Reg.'],
                      ['Certificate Valid', '12 months'],
                      ['Ledger Entry', 'Block #88,241'],
                    ].map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td className="py-2 pr-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</td>
                        <td className="py-2 font-medium" style={{ color: 'var(--off-white)' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col justify-between">
                <div style={{ border: '1px dashed rgba(201,161,77,0.3)', backgroundColor: 'rgba(255,255,255,0.03)' }} className="p-4 flex items-center gap-4 mb-6">
                  <div style={{ width: 64, height: 64, backgroundColor: 'white', padding: '4px', flexShrink: 0 }}>
                    {qrCode}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--off-white)' }}>Scan to verify</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>fairproperties.org.za/verify/ZA-2024-00142</p>
                  </div>
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }} className="text-xs mb-4">
                    This is the exact experience your buyers will have.
                  </p>
                  <Link href="/verify/ZA-2024-00142" style={{ backgroundColor: 'var(--gold)', color: 'var(--navy)' }} className="inline-block px-6 py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity">
                    View Verified Property →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOLD DIVIDER ── */}
      <div style={{ backgroundColor: 'var(--off-white)', padding: '28px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ height: '3px', backgroundColor: 'var(--gold)', width: '156px' }} />
      </div>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ backgroundColor: 'var(--off-white)' }} className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">Who We Serve</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-4xl md:text-5xl mb-2">
            One standard. Total certainty.
          </h2>
          <hr className="gold-rule w-16 mb-6" />
          <p style={{ color: 'var(--slate)' }} className="text-base max-w-2xl leading-relaxed mb-12">
            FPIA creates a single, verified version of the truth — eliminating hidden defects, disputes, and deal risk across the entire property transaction chain.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map(a => (
              <div key={a.title} style={{ border: '1px solid rgba(11,31,51,0.1)', backgroundColor: 'white' }} className="p-8 hover:shadow-lg transition-shadow">
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
            From inspection to certification — in days, not weeks.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-base max-w-xl mb-2">
            Five steps to complete property certainty.
          </p>
          <hr className="gold-rule w-16 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute h-px" style={{ backgroundColor: 'var(--steel)', zIndex: 0, top: '22px', left: '48px', right: '-100%' }} />
                )}
                <div style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }} className="text-3xl font-medium mb-3">{s.num}</div>
                <h3 className="text-white font-semibold text-sm mb-2">{s.title}</h3>
                <p style={{ color: 'var(--slate)' }} className="text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/how-it-works" style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }} className="inline-block px-8 py-3 text-sm tracking-wide hover:bg-gold hover:text-navy transition-colors font-medium">
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
            The FPIA Certificate — your proof of property truth.
          </h2>
          <hr className="gold-rule w-16 mb-12" />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p style={{ color: 'var(--slate)' }} className="text-base leading-relaxed mb-6">
                Every certified property receives a digital record that captures its full condition — independently verified and instantly accessible.
              </p>
              <ul className="space-y-3">
                {['Timestamped inspection record', 'Compliance category breakdown', 'COC artefact tracking', 'Unique QR code per property', 'Tamper-proof ledger entry', 'Five-status certification system'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'var(--navy)' }}>
                    <span style={{ color: 'var(--gold)' }}>✦</span> {item}
                  </li>
                ))}
              </ul>
              <p style={{ color: 'var(--slate)' }} className="text-sm mt-6 mb-2 italic">
                This is what every verified property looks like.
              </p>
              <Link href="/verify" style={{ backgroundColor: 'var(--navy)', color: 'white' }} className="inline-block mt-8 px-8 py-4 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity">
                Verify a Property Now
              </Link>
            </div>
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
                    {[['Inspection Date', '14 March 2024'], ['Inspector', 'S. van der Merwe — SACPCMP Reg.'], ['Certificate Valid', '12 months'], ['Ledger Entry', 'Block #88,241']].map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid rgba(11,31,51,0.06)' }}>
                        <td className="py-2 text-slate-500 pr-4">{k}</td>
                        <td style={{ color: 'var(--navy)' }} className="py-2 font-medium">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ backgroundColor: 'var(--off-white)', border: '1px dashed rgba(11,31,51,0.2)' }} className="p-4 flex items-center gap-4">
                  <div style={{ width: 64, height: 64, backgroundColor: 'white', padding: '4px', flexShrink: 0 }}>
                    {qrCode}
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
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-4xl md:text-5xl mb-4">
            Protect your property transaction before it's too late.
          </h2>
          <p style={{ color: 'rgba(11,31,51,0.7)' }} className="text-base mb-8 max-w-lg mx-auto">
            Join sellers, agents, and buyers using FPIA to prevent costly surprises, failed deals, and post-transfer disputes.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="Your email address" style={{ border: '1px solid rgba(11,31,51,0.3)', color: 'var(--navy)' }} className="flex-1 px-4 py-3 text-sm bg-white/80 focus:outline-none focus:border-navy placeholder-slate-400" />
            <button type="submit" style={{ backgroundColor: 'var(--navy)', color: 'white' }} className="px-6 py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap">
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