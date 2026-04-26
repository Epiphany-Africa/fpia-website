import Image from 'next/image'
import Link from 'next/link'
import TrustBadge from '@/components/TrustBadge'
import { fpiaProducts } from '@/lib/products/fpiaProducts'

const productLayerOrder = [
  'seller_precert_package',
  'inspection_product',
  'upgrade_product',
] as const

const productCardButtonStyle = {
  backgroundColor: '#0B1F33',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '6px',
  padding: '12px 16px',
  fontWeight: 600,
  width: '100%',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
} as const

const audiences = [
  {
    icon: '🏠',
    title: 'Buyers',
    desc: 'Check the governed property record before you commit. FPIA reduces hidden-condition risk before transfer.',
  },
  {
    icon: '📋',
    title: 'Sellers',
    desc: 'Support price and disclosure with structured evidence, controlled issuance, and a verifiable trust signal.',
  },
  {
    icon: '🤝',
    title: 'Property Practitioners',
    desc: 'List with a governed record that reduces dispute risk, supports pricing, and keeps deals moving.',
  },
  {
    icon: '🛡️',
    title: 'Insurers',
    desc: 'Assess residential property risk against governed evidence and verification, not fragmented attachments.',
  },
  {
    icon: '🏦',
    title: 'Banks & Originators',
    desc: 'Advise, lend, and structure applications against verified property truth instead of assumptions and gaps.',
  },
  {
    icon: '⚖️',
    title: 'Property Legal Practitioners',
    desc: 'Work from one verifiable record during OTP, transfer, and registration, not disconnected claims, emails, and PDFs.',
  },
]

const steps = [
  { num: '01', title: 'Truth Enters', desc: 'An inspection or governed intake event creates the initial property record.' },
  { num: '02', title: 'Evidence Is Structured', desc: 'Condition findings, compliance artefacts, and supporting records are organised into one accountable file.' },
  { num: '03', title: 'Authority Governs', desc: 'Issuance status and trust outcomes are applied under FPIA authority controls.' },
  { num: '04', title: 'Verification Checks', desc: 'Any party can verify certificate status and registry truth before they act.' },
  { num: '05', title: 'Registry Persists', desc: 'The property record remains durable, referenceable, and usable across future transactions.' },
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
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 sm:px-6 md:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-[60px]">
          <div className="flex-1">
            <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-6 font-medium">Governed Property Accountability · South Africa</p>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--off-white)' }} className="mb-6 max-w-3xl text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              The accountability layer<br />
            <em style={{ color: 'var(--gold)' }}>for residential property.</em>
            </h1>

            <p className="mb-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              FPIA gives buyers, sellers, property practitioners, lenders, insurers, and property legal practitioners one governed source of truth for residential property — so decisions are made on evidence, not assumption.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/request-inspection" style={{ backgroundColor: 'var(--gold)', color: 'var(--navy)' }} className="inline-block px-8 py-4 font-semibold tracking-wide text-sm hover:opacity-90 transition-opacity text-center">
                Request Inspection →
              </Link>
              <Link href="/verify" style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white' }} className="inline-block px-8 py-4 font-medium tracking-wide text-sm hover:border-white/60 transition-colors text-center">
                Verify Certificate
              </Link>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              <Link href="/contact?message=I%27d%20like%20to%20request%20access%20to%20FPIA%20for%20my%20organisation." className="font-semibold text-[var(--gold)] transition-opacity hover:opacity-80">
                Request Access →
              </Link>
              <Link href="/how-it-works" className="font-semibold text-white/70 transition-opacity hover:text-white">
                Learn How It Works →
              </Link>
            </div>
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(201,161,77,0.2)' }} className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>National Partner</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '16px' }}>|</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontStyle: 'italic' }}>Century 21 South Africa</span>
            </div>
          </div>
          <div style={{ flexShrink: 0 }} className="flex flex-col items-center gap-4 lg:min-w-[250px]">
            <div
              style={{
                width: 'min(270px, 64vw)',
                height: 'min(270px, 64vw)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '999px',
                background: 'radial-gradient(circle at center, rgba(11,31,51,0.94) 0%, var(--navy) 72%)',
                boxShadow: '0 0 0 1px rgba(201,161,77,0.08)',
              }}
            >
              <Image
                src="/images/fpia-badge.svg"
                alt="Fair Properties Inspection Authority certification seal"
                width={320}
                height={320}
                style={{
                  width: 'min(226px, 56vw)',
                  height: 'min(226px, 56vw)',
                  objectFit: 'contain',
                  filter: 'saturate(0.98) brightness(0.98) contrast(1.02)',
                }}
              />
            </div>
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
              Residential property breaks when accountability is missing.
          </h2>

            <p style={{ color: 'var(--slate)' }} className="text-base max-w-2xl leading-relaxed mb-12">
              Most transactions still run on fragmented disclosure, unstructured evidence, and late-stage discovery. FPIA closes that gap with governed property truth.
            </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          'Truth enters too late',
          'Evidence stays fragmented',
          'Verification arrives under pressure',
          'No durable registry record',
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
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-3 px-5 text-center text-[11px] font-semibold uppercase tracking-widest text-navy sm:px-6 md:flex md:flex-wrap md:justify-center md:gap-8 md:text-xs">
          {['Inspection enters truth', 'Evidence structures truth', 'Authority governs truth', 'Verification checks truth', 'Registry persists truth'].map(t => (
            <span key={t}>✦ {t}</span>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: 'white' }} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">
            Accountability System
          </p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-4xl md:text-5xl mb-4">
            One accountability system. Multiple controlled outcomes.
          </h2>
          <p style={{ color: 'var(--slate)' }} className="text-base max-w-3xl leading-relaxed mb-12">
            Inspection is how truth enters. Evidence is how truth is structured. Authority issuance is how truth is governed. Verification is how truth is checked. Registry is how truth persists.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {productLayerOrder
              .flatMap((productId) => {
                const product = fpiaProducts.find((item) => item.id === productId)
                return product ? [product] : []
              })
              .map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid rgba(11,31,51,0.1)',
                  backgroundColor: '#fff',
                }}
                className="p-8 flex flex-col h-full"
              >
                <div className="mb-[18px] md:min-h-[128px]">
                  <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">
                    {product.certificateOutcome}
                  </p>
                  <h3
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      color: 'var(--navy)',
                      lineHeight: 1.08,
                      letterSpacing: '-0.01em',
                      textWrap: 'balance',
                    }}
                    className="text-[1.65rem] mb-3"
                  >
                    {product.name}
                  </h3>
                  <p style={{ color: 'var(--slate)' }} className="text-[13px] leading-6">
                    {product.usageSubheading}
                  </p>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <p
                    style={{ color: 'var(--gold)' }}
                    className="text-[11px] tracking-[0.22em] uppercase mb-2 font-medium"
                  >
                    {product.priceLabel}
                  </p>
                  <p
                    style={{ color: 'var(--navy)', lineHeight: 0.95 }}
                    className="text-[2.2rem] font-semibold mb-3"
                  >
                    {product.price}
                  </p>
                  <p style={{ color: 'var(--slate)' }} className="text-sm leading-relaxed">
                    {product.valueMicrocopy}
                  </p>
                </div>

                <div className="md:min-h-[112px]">
                  <p style={{ color: 'var(--slate)' }} className="text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '18px',
                    borderTop: '1px solid rgba(11,31,51,0.08)',
                  }}
                >
                  <p
                    style={{ color: 'rgba(11,31,51,0.55)' }}
                    className="text-[10px] tracking-[0.22em] uppercase mb-2 font-medium"
                  >
                    Controlled In System
                  </p>
                  <p style={{ color: 'var(--slate)' }} className="text-[13px] leading-6 mb-5">
                    {product.systemTrigger}
                  </p>
                  <Link
                    href={product.ctaHref}
                    style={productCardButtonStyle}
                    className="inline-flex items-center justify-center text-sm hover:bg-[#0E2A47]"
                  >
                    {product.ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
            Most property transactions rely on incomplete disclosure, missing records, and trust that often breaks when accountability is needed most.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div style={{ border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }} className="p-8">
              <h3 style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Mono, monospace' }} className="text-xs tracking-widest uppercase mb-6">Without FPIA</h3>
              <ul className="space-y-4">
                {[
                  'Property risk surfaces too late in the process',
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
                  'Verified property context is established before key decisions',
                  'Transparent records are available to all parties',
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
            FPIA doesn&rsquo;t just certify properties — it installs accountability across the transaction.
          </p>
        </div>
      </section>

      {/* ── REAL WORLD SCENARIO ── */}
      <section style={{ backgroundColor: 'var(--off-white)' }} className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">Real World Impact</p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-4xl md:text-5xl mb-10 md:mb-16">
            A typical property deal — before FPIA.
          </h2>
          <div className="flex flex-col gap-8">
            <div style={{ backgroundColor: 'white', border: '1px solid rgba(11,31,51,0.1)' }} className="p-8">
              <h3 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }} className="text-xl mb-6">Without a governed record</h3>
              <p style={{ color: 'var(--slate)' }} className="text-sm leading-relaxed mb-6">
                A buyer signs an offer on a property that appears to be in good condition. Weeks into the process, during the suspensive period:
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  {[
                    'Critical condition evidence appears late and under pressure',
                    'The buyer requests a price reduction',
                    'The seller disputes the evidence and timing',
                    'The deal stalls',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--slate)' }}>
                      <span style={{ color: '#e05555', marginTop: '2px', flexShrink: 0 }}>✕</span> {item}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-[rgba(11,31,51,0.08)] pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                  <p style={{ color: 'var(--navy)', fontFamily: 'DM Mono, monospace' }} className="text-xs tracking-widest uppercase mb-3">The Result</p>
                  <ul className="space-y-2">
                    {['The buyer walks away', 'The seller relists at a lower price', 'The property practitioner loses the deal', 'Weeks are lost — and trust is broken'].map(item => (
                      <li key={item} className="text-sm" style={{ color: '#e05555' }}>— {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--navy)', border: '1px solid rgba(201,161,77,0.2)' }} className="p-8">
              <h3 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--gold)' }} className="text-xl mb-6">With FPIA in place</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  {[
                    'An FPIA inspection creates the initial truth record',
                    'Evidence and compliance items are structured in one governed file',
                    'Issuance and verification status are recorded under authority control',
                    'The full condition is visible before decisions are locked in',
                    'The price reflects verified reality',
                    'No surprises emerge during OTP',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      <span style={{ color: 'var(--gold)', marginTop: '2px', flexShrink: 0 }}>✦</span> {item}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-[rgba(201,161,77,0.2)] pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
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
            See governed property truth in action.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-base max-w-2xl leading-relaxed mb-10">
            Explore a live FPIA record and see how evidence, issuance, verification, and registry logic appear to every party in the chain.
          </p>
          <div className="grid sm:grid-cols-4 gap-4 mb-10">
            {['Evidence record', 'Issuance status', 'Registry verification', 'Authority credentials'].map(item => (
              <div key={item} style={{ border: '1px solid rgba(201,161,77,0.2)', backgroundColor: 'rgba(255,255,255,0.03)' }} className="px-5 py-4 flex items-center gap-3">
                <span style={{ color: 'var(--gold)' }}>✦</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ border: '1px solid rgba(201,161,77,0.3)', backgroundColor: 'rgba(255,255,255,0.03)' }} className="overflow-hidden">
            <div style={{ backgroundColor: 'rgba(201,161,77,0.1)', borderBottom: '1px solid rgba(201,161,77,0.2)' }} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--gold)' }} className="text-lg tracking-widest">FPIA CERTIFICATE</span>
              <span className="text-white/40 text-xs font-mono">#ZA-2024-00142</span>
            </div>
            <div className="grid gap-8 p-5 md:grid-cols-3 md:p-6">
              <div>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Property</p>
                <p style={{ color: 'var(--off-white)' }} className="font-semibold text-lg">14 Protea Avenue, Sandton</p>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Gauteng, 2196</p>
                <TrustBadge trustState="FINAL_VERIFIED" variant="compact" />
              </div>
              <div>
                <table className="w-full text-xs">
                  <tbody>
                    {[
                      ['Inspection Date', '14 March 2024'],
                      ['Inspector', 'Stephanus van der Merwe — SACPCMP Reg.'],
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
                <div style={{ border: '1px dashed rgba(201,161,77,0.3)', backgroundColor: 'rgba(255,255,255,0.03)' }} className="mb-6 flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center">
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
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link href="/verify/ZA-2024-00142" style={{ backgroundColor: 'var(--gold)', color: 'var(--navy)' }} className="inline-block px-6 py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity">
                      Verify Property →
                    </Link>
                    <Link href="/certificate/ZA-2024-00142" style={{ border: '1px solid rgba(201,161,77,0.35)', color: 'var(--off-white)' }} className="inline-block px-6 py-3 text-sm font-semibold tracking-wide hover:border-[rgba(201,161,77,0.6)] transition-colors">
                      View Certificate
                    </Link>
                  </div>
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
            FPIA creates one governed source of truth for residential property — reducing dispute risk, pricing friction, and information asymmetry across the transaction.
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
            From truth entering the system to governed verification.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-base max-w-xl mb-2">
            Five steps to establish accountable residential property truth.
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
            The governed property record — your proof of property truth.
          </h2>
          <hr className="gold-rule w-16 mb-12" />
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <p style={{ color: 'var(--slate)' }} className="text-base leading-relaxed mb-6">
                Every governed property record captures condition, supporting evidence, issuance status, and verification pathways — all controlled and instantly accessible.
              </p>
              <ul className="space-y-3">
                {['Timestamped evidence record', 'Compliance category breakdown', 'COC artefact tracking', 'Unique verification route per property', 'Tamper-proof ledger entry', 'Four canonical trust outcomes'].map(item => (
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
            <div style={{ border: '1px solid rgba(11,31,51,0.15)', backgroundColor: 'white' }} className="overflow-hidden shadow-xl">
              <div style={{ backgroundColor: 'var(--navy)' }} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <span style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--gold)' }} className="text-lg tracking-widest">FPIA CERTIFICATE</span>
                <span className="text-white/50 text-xs font-mono">#ZA-2024-00142</span>
              </div>
              <hr className="gold-rule" />
              <div className="p-5 sm:p-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Property</p>
                    <p style={{ color: 'var(--navy)' }} className="font-semibold">14 Protea Avenue, Sandton</p>
                    <p className="text-sm text-slate-500">Gauteng, 2196</p>
                  </div>
                  <TrustBadge trustState="FINAL_VERIFIED" variant="compact" />
                </div>
                <table className="w-full text-xs mb-6">
                  <tbody>
                    {[['Inspection Date', '14 March 2024'], ['Inspector', 'Stephanus van der Merwe — SACPCMP Reg.'], ['Certificate Valid', '12 months'], ['Ledger Entry', 'Block #88,241']].map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid rgba(11,31,51,0.06)' }}>
                        <td className="py-2 text-slate-500 pr-4">{k}</td>
                        <td style={{ color: 'var(--navy)' }} className="py-2 font-medium">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ backgroundColor: 'var(--off-white)', border: '1px dashed rgba(11,31,51,0.2)' }} className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center">
                  <div style={{ width: 64, height: 64, backgroundColor: 'white', padding: '4px', flexShrink: 0 }}>
                    {qrCode}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>Scan to verify</p>
                    <p className="text-xs text-slate-400 mt-1">fairproperties.org.za/verify/ZA-2024-00142</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSE OUT ── */}
      <section
        id="register"
        style={{
          backgroundColor: 'var(--off-white)',
          borderTop: '1px solid rgba(11,31,51,0.08)',
        }}
        className="py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            style={{
              backgroundColor: 'var(--navy)',
              border: '1px solid rgba(201,161,77,0.18)',
            }}
            className="grid gap-8 px-6 py-8 md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] md:px-10 md:py-10"
          >
            <div>
              <p style={{ color: 'var(--gold)' }} className="text-xs tracking-widest uppercase mb-3 font-medium">
                Next Move
              </p>
              <h2
                style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--off-white)' }}
                className="text-3xl leading-tight sm:text-4xl md:text-5xl mb-4"
              >
                Put accountability into the transaction before the deal gets tested.
              </h2>
              <p
                style={{ color: 'rgba(255,255,255,0.68)' }}
                className="max-w-2xl text-base leading-relaxed mb-6"
              >
                Start with an inspection, request access for your team, or verify an existing certificate before assumptions become exposure.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/request-inspection"
                  style={{ backgroundColor: 'var(--gold)', color: 'var(--navy)' }}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
                >
                  Request Inspection
                </Link>
                <Link
                  href="/contact?message=I%27d%20like%20to%20request%20access%20to%20FPIA%20for%20my%20organisation."
                  style={{ border: '1px solid rgba(201,161,77,0.32)', color: 'var(--off-white)' }}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide hover:border-[rgba(201,161,77,0.62)] transition-colors"
                >
                  Request Access
                </Link>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderLeft: '2px solid rgba(201,161,77,0.24)',
              }}
              className="flex flex-col justify-between gap-6 p-6"
            >
              <div>
                <p style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }} className="text-xs tracking-widest uppercase mb-4">
                  What Happens Next
                </p>
                <div className="space-y-3">
                  {[
                    'Truth enters through inspection or controlled intake',
                    'Evidence is structured under the FPIA standard',
                    'Issuance and verification status persist in the registry',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.76)' }}>
                      <span style={{ color: 'var(--gold)', marginTop: '2px' }}>✦</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <p style={{ color: 'rgba(255,255,255,0.52)' }} className="text-xs leading-relaxed mb-3">
                  Need to talk first? Use the partnership and enquiry routes for insurers,
                  agencies, and bond originators.
                </p>
                <Link
                  href="/contact"
                  style={{ color: 'var(--gold)' }}
                  className="text-sm font-semibold tracking-wide hover:opacity-80 transition-opacity"
                >
                  Open Contact →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
