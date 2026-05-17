import type { CSSProperties } from 'react'
import Link from 'next/link'

const styles = {
  sectionOffWhite: {
    background: '#F5F3EF',
    padding: '72px 48px',
  } satisfies CSSProperties,
  sectionNavy: {
    background: '#0B1F33',
    padding: '72px 48px',
  } satisfies CSSProperties,
  inner: {
    maxWidth: 960,
    margin: '0 auto',
  } satisfies CSSProperties,
  eyebrow: {
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#C9A14D',
    marginBottom: 16,
    fontFamily: 'DM Sans, sans-serif',
  } satisfies CSSProperties,
  h2Dark: {
    fontFamily: 'DM Serif Display, Georgia, serif',
    fontSize: 'clamp(30px, 4vw, 44px)',
    fontWeight: 400,
    lineHeight: 1.15,
    color: '#0B1F33',
    marginBottom: 16,
  } satisfies CSSProperties,
  h2Light: {
    fontFamily: 'DM Serif Display, Georgia, serif',
    fontSize: 'clamp(30px, 4vw, 44px)',
    fontWeight: 400,
    lineHeight: 1.15,
    color: '#F5F3EF',
    marginBottom: 16,
  } satisfies CSSProperties,
  rule: {
    width: 48,
    height: 2,
    background: '#C9A14D',
    margin: '20px 0 32px',
  } satisfies CSSProperties,
  ctaGold: {
    display: 'inline-block',
    background: '#C9A14D',
    color: '#0B1F33',
    padding: '13px 28px',
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontFamily: 'DM Sans, sans-serif',
  } satisfies CSSProperties,
  ctaOutlineNavy: {
    display: 'inline-block',
    border: '1.5px solid #0B1F33',
    color: '#0B1F33',
    padding: '13px 28px',
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontFamily: 'DM Sans, sans-serif',
  } satisfies CSSProperties,
} as const

const agentTiers = [
  {
    name: 'Starter',
    price: 'R8,500',
    inspections: 3,
    highlight: false,
    features: [
      '48-hour priority scheduling',
      'Team dashboard access',
      'Digital certificates per property',
      'QR verification on all listings',
      'Email support',
    ],
    cta: 'Register Agency',
    href: '/register?type=agent&tier=starter',
  },
  {
    name: 'Professional',
    price: 'R22,000',
    inspections: 8,
    highlight: true,
    badge: 'Most Popular',
    features: [
      '24-hour priority scheduling',
      'Shared agency dashboard',
      'Fast-track available (+R2,000)',
      'Automated certificate renewal alerts',
      'Dedicated support contact',
      'Monthly activity summary',
    ],
    cta: 'Register Agency',
    href: '/register?type=agent&tier=professional',
  },
  {
    name: 'Agency',
    price: 'R38,000',
    inspections: 15,
    highlight: false,
    features: [
      'Same-day scheduling on request',
      'Multi-branch access',
      'Dedicated inspector allocation',
      'Structured onboarding support',
      'API and workflow support',
      'Quarterly portfolio review',
    ],
    cta: 'Contact Us',
    href: '/contact?inquiry=agency-account',
  },
]

const pilotOptions = [
  {
    label: 'Pilot A',
    title: 'Pre-policy baseline',
    price: 'R45,000',
    scope: '20 properties · 60 days',
    body: 'Govern and inspect a selected cohort of properties before policy inception. Test whether a condition baseline at onboarding reduces underwriting ambiguity.',
    cta: 'Discuss Pilot A',
    href: '/contact?inquiry=insurer-pilot-a',
  },
  {
    label: 'Pilot B',
    title: 'Claims-adjacent evidence',
    price: 'R55,000',
    scope: '20 properties · 60 days',
    body: 'Run FPIA inspections on a selected cohort of active policies. Test whether prior condition records reduce friction in building-related claim categories.',
    cta: 'Discuss Pilot B',
    href: '/contact?inquiry=insurer-pilot-b',
    highlight: true,
    badge: 'Recommended starting point',
  },
  {
    label: 'Pilot C',
    title: 'Portfolio intelligence',
    price: 'Custom',
    scope: '50+ properties · 90 days',
    body: 'Geo-tag condition records across a suburb or portfolio cohort. Test whether aggregated condition data produces actionable risk signals at scale.',
    cta: 'Contact Us',
    href: '/contact?inquiry=insurer-pilot-custom',
  },
]

export function AgentPricingSection() {
  return (
    <>
      <section
        style={{
          background: '#0B1F33',
          borderLeft: '4px solid #C9A14D',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <p style={{ ...styles.eyebrow, marginBottom: 4 }}>Under an OTP deadline?</p>
          <p
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: 18,
              color: '#F5F3EF',
              margin: 0,
            }}
          >
            24-hour fast-track inspection{' '}
            <strong style={{ color: '#C9A14D' }}>R7,500 per property</strong>
          </p>
        </div>
        <a href="mailto:info@fairproperties.org.za" style={styles.ctaGold}>
          Email info@fairproperties.org.za
        </a>
      </section>

      <section style={styles.sectionOffWhite}>
        <div style={styles.inner}>
          <p style={styles.eyebrow}>Agency Access</p>
          <h2 style={styles.h2Dark}>Structured access for teams handling multiple listings.</h2>
          <div style={styles.rule} />
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: '#666',
              maxWidth: 520,
              marginBottom: 48,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Agency access gives your team priority scheduling, shared visibility,
            and a consistent way to use FPIA across listings without slowing the deal.
          </p>

          <div
            className="grid gap-4 md:gap-0.5"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              marginBottom: 24,
            }}
          >
            {agentTiers.map((tier) => (
              <div
                key={tier.name}
                style={{
                  background: tier.highlight ? '#0B1F33' : '#fff',
                  border: tier.highlight ? '2px solid #C9A14D' : 'none',
                  padding: '32px 28px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {tier.badge ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#C9A14D',
                      color: '#0B1F33',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 12px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {tier.badge}
                  </div>
                ) : null}

                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: tier.highlight ? '#C9A14D' : '#999',
                    marginBottom: 12,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {tier.name}
                </p>
                <div style={{ marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: 'DM Serif Display, Georgia, serif',
                      fontSize: 38,
                      color: tier.highlight ? '#F5F3EF' : '#0B1F33',
                      lineHeight: 1,
                    }}
                  >
                    {tier.price}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: tier.highlight ? 'rgba(245,243,239,0.4)' : '#aaa',
                      fontFamily: 'DM Sans, sans-serif',
                      marginLeft: 4,
                    }}
                  >
                    /month
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: tier.highlight ? '#C9A14D' : '#888',
                    marginBottom: 20,
                    paddingBottom: 18,
                    borderBottom: `1px solid ${tier.highlight ? 'rgba(201,161,77,0.2)' : '#f0ede8'}`,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {tier.inspections} inspections included
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto', flex: 1 }}>
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        display: 'flex',
                        gap: 8,
                        padding: '6px 0',
                        borderBottom: `1px solid ${tier.highlight ? 'rgba(255,255,255,0.06)' : '#f5f2ed'}`,
                        fontSize: 13,
                        color: tier.highlight ? 'rgba(245,243,239,0.75)' : '#555',
                        lineHeight: 1.5,
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      <span
                        style={{
                          color: '#C9A14D',
                          fontSize: 9,
                          marginTop: 4,
                          flexShrink: 0,
                        }}
                      >
                        ✦
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  style={{
                    display: 'block',
                    marginTop: 24,
                    padding: '13px 20px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    fontFamily: 'DM Sans, sans-serif',
                    background: tier.highlight ? '#C9A14D' : 'transparent',
                    color: '#0B1F33',
                    border: tier.highlight ? 'none' : '1.5px solid #0B1F33',
                  }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <p
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: '#888',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Prefer the seller standard?{' '}
            <strong style={{ color: '#0B1F33' }}>R5,500 per property</strong> before
            listing.{' '}
            <Link
              href="/register"
              style={{
                color: '#C9A14D',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Start pre-certification →
            </Link>
          </p>
        </div>
      </section>

    </>
  )
}

export function InsurerPilotSection() {
  return (
    <section style={styles.sectionNavy}>
      <div style={styles.inner}>
        <p style={styles.eyebrow}>Pilot Structure</p>
        <h2 style={styles.h2Light}>
          The strongest path is not
          <br />
          broad integration. It is a narrow pilot.
        </h2>
        <div style={styles.rule} />
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: 'rgba(245,243,239,0.65)',
            maxWidth: 560,
            marginBottom: 48,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          A pilot is designed to avoid product or underwriting rule changes, focus on
          one use case, and produce measurable learning within 60 days. Each package
          includes FPIA inspections, certificate issuance, a combined condition report,
          and a structured findings review.
        </p>

        <div
          className="grid gap-4 md:gap-0.5"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            marginBottom: 40,
          }}
        >
          {pilotOptions.map((option) => (
            <div
              key={option.label}
              style={{
                background: option.highlight
                  ? 'rgba(201,161,77,0.1)'
                  : 'rgba(245,243,239,0.04)',
                borderTop: `2px solid ${option.highlight ? '#C9A14D' : 'rgba(201,161,77,0.3)'}`,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {option.badge ? (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: 24,
                    background: '#C9A14D',
                    color: '#0B1F33',
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '3px 10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: 'DM Sans, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {option.badge}
                </div>
              ) : null}
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,161,77,0.7)',
                  marginBottom: 8,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {option.label}
              </p>
              <p
                style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 20,
                  color: '#F5F3EF',
                  marginBottom: 8,
                }}
              >
                {option.title}
              </p>
              <p
                style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 30,
                  color: '#C9A14D',
                  marginBottom: 4,
                  lineHeight: 1,
                }}
              >
                {option.price}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: 'rgba(245,243,239,0.4)',
                  fontFamily: 'DM Sans, sans-serif',
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {option.scope}
              </p>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: 'rgba(245,243,239,0.65)',
                  fontFamily: 'DM Sans, sans-serif',
                  flex: 1,
                  marginBottom: 20,
                }}
              >
                {option.body}
              </p>
              <Link
                href={option.href}
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                  background: option.highlight ? '#C9A14D' : 'transparent',
                  color: option.highlight ? '#0B1F33' : '#C9A14D',
                  border: option.highlight ? 'none' : '1px solid rgba(201,161,77,0.4)',
                }}
              >
                {option.cta}
              </Link>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'rgba(245,243,239,0.04)',
            borderLeft: '2px solid rgba(201,161,77,0.3)',
            padding: '18px 24px',
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: 'rgba(245,243,239,0.55)',
              fontFamily: 'DM Sans, sans-serif',
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            All pilot packages include FPIA inspections on selected properties,
            digital certificate issuance, full condition records stored in the FPIA
            registry, a structured findings report at 30 and 60 days, and a pilot
            review session with the FPIA team. Packages do not require product,
            underwriting, or claims-policy changes.
          </p>
        </div>
      </div>

    </section>
  )
}

export function BondOriginatorProgrammeSection() {
  return (
    <section style={styles.sectionOffWhite}>
      <div style={styles.inner}>
        <p style={styles.eyebrow}>Originator Access</p>
        <h2 style={styles.h2Dark}>
          Use FPIA earlier
          <br />
          in the application process.
        </h2>
        <div style={styles.rule} />
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: '#666',
            maxWidth: 540,
            marginBottom: 48,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          FPIA can be introduced as an early property-check step for clients who
          need clearer condition records before finance and transfer move too far.
          Two operating approaches are available depending on how your firm works.
        </p>

        <div
          className="grid gap-4 md:gap-0.5"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderTop: '2px solid #C9A14D',
              padding: '32px 28px',
            }}
          >
            <p style={styles.eyebrow}>Client Workflow</p>
            <p
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontSize: 22,
                color: '#0B1F33',
                marginBottom: 12,
              }}
            >
              Introduce FPIA when independent verification is needed
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: '#666',
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: 24,
              }}
            >
              Use this route when a client needs an independent property condition
              record before the application progresses too far. No system change is
              required.
            </p>
            <div
              style={{
                borderTop: '1px solid #f0ede8',
                paddingTop: 16,
                marginBottom: 24,
              }}
            >
              {[
                'Independent condition record before transfer',
                'No change to your existing process',
                'Useful for older or higher-risk stock',
                'Direct scheduling through FPIA',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    gap: 8,
                    padding: '5px 0',
                    fontSize: 13,
                    color: '#555',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <span style={{ color: '#C9A14D', fontSize: 9, marginTop: 4 }}>✦</span>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/contact?inquiry=originator-referral" style={styles.ctaOutlineNavy}>
              Discuss Workflow
            </Link>
          </div>

          <div
            style={{
              background: '#0B1F33',
              borderTop: '2px solid #C9A14D',
              padding: '32px 28px',
            }}
          >
            <p style={styles.eyebrow}>Structured Rollout</p>
            <p
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontSize: 22,
                color: '#F5F3EF',
                marginBottom: 12,
              }}
            >
              Add FPIA to a consistent firm workflow
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: 'rgba(245,243,239,0.65)',
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: 24,
              }}
            >
              For firms that want FPIA referenced more consistently at application
              stage. This model is for teams that want a repeatable operating
              approach rather than one-off use.
            </p>
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 16,
                marginBottom: 24,
              }}
            >
              {[
                'Shared operating approach for the team',
                'Direct ledger reference for bond file',
                'Dedicated support contact',
                'Volume-based commercial structure',
                'Workflow review with FPIA',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    gap: 8,
                    padding: '5px 0',
                    fontSize: 13,
                    color: 'rgba(245,243,239,0.72)',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <span style={{ color: '#C9A14D', fontSize: 9, marginTop: 4 }}>✦</span>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/contact?inquiry=originator-integration" style={styles.ctaGold}>
              Discuss Rollout
            </Link>
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: '#999',
            fontFamily: 'DM Sans, sans-serif',
            textAlign: 'center',
          }}
        >
          Both models can sit alongside existing bond origination processes without
          forcing a full workflow change.
        </p>
      </div>

    </section>
  )
}

export function CertificateRenewalBanner() {
  return (
    <section
      style={{
        background: '#F5F3EF',
        borderTop: '3px solid #C9A14D',
        padding: '32px 48px',
      }}
    >
      <div
        className="flex flex-wrap items-start justify-between gap-5 sm:items-center"
        style={{
          maxWidth: 1120,
          margin: '0 auto',
        }}
      >
        <div>
          <p style={{ ...styles.eyebrow, marginBottom: 8 }}>Certificate Renewal</p>
          <p
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: 22,
              color: '#0B1F33',
              marginBottom: 8,
            }}
          >
            FPIA certificates are valid for 12 months.
          </p>
          <p
            style={{
              fontSize: 14,
              color: '#666',
              fontFamily: 'DM Sans, sans-serif',
              maxWidth: 460,
              lineHeight: 1.6,
            }}
          >
            Renew before expiry to maintain a continuous, unbroken condition record,
            protecting your property&apos;s verified status and market value.
          </p>
        </div>
        <div
          className="flex flex-col items-start gap-2 sm:items-end"
          style={{
          }}
        >
          <div
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: 30,
              color: '#0B1F33',
              lineHeight: 1,
            }}
          >
            R2,500
            <span
              style={{
                fontSize: 13,
                color: '#888',
                fontFamily: 'DM Sans, sans-serif',
                marginLeft: 6,
              }}
            >
                renewal inspection
              </span>
            </div>
          <Link href="/contact?inquiry=renewal" style={styles.ctaOutlineNavy}>
            Renew Certificate
          </Link>
        </div>
      </div>

    </section>
  )
}
