'use client'

import Link from 'next/link'
import { useState, type CSSProperties } from 'react'

const styles = {
  sectionOffWhite: {
    backgroundColor: '#F5F3EF',
    padding: '80px 0',
  } satisfies CSSProperties,
  sectionWhite: {
    backgroundColor: '#ffffff',
    padding: '80px 0',
  } satisfies CSSProperties,
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 48px',
  } satisfies CSSProperties,
  eyebrow: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '11px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#C9A14D',
    marginBottom: '12px',
  } satisfies CSSProperties,
  h2Dark: {
    fontFamily: 'DM Serif Display, Georgia, serif',
    fontSize: '38px',
    color: '#0D1F3C',
    lineHeight: 1.2,
    marginBottom: '16px',
  } satisfies CSSProperties,
  rule: {
    width: '40px',
    height: '2px',
    backgroundColor: '#C9A14D',
    margin: '0 0 24px',
  } satisfies CSSProperties,
  bodyText: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '15px',
    lineHeight: 1.75,
    color: '#555',
    maxWidth: '560px',
    marginBottom: '48px',
  } satisfies CSSProperties,
} as const

const tiers = [
  {
    id: 'bronze',
    label: 'Bronze',
    name: 'Starter',
    threshold: '1 – 4 inspections / quarter',
    discount: 300,
    credits: 0,
    creditLabel: 'Not yet earned',
    support: 'Standard support',
    cobranding: 'FPIA badge for listings & marketing',
    reporting: null,
    featured: false,
    accentColor: '#EF9F27',
    badgeBg: '#FAC775',
    badgeText: '#633806',
  },
  {
    id: 'silver',
    label: 'Silver',
    name: 'Professional',
    threshold: '5 – 9 inspections / quarter',
    discount: 500,
    credits: 1,
    creditLabel: '1 credit per quarter',
    support: 'Priority support',
    cobranding: 'Badge + FPIA email footer co-branding',
    reporting: 'Quarterly performance summary',
    featured: true,
    accentColor: '#888780',
    badgeBg: '#D3D1C7',
    badgeText: '#2C2C2A',
  },
  {
    id: 'gold',
    label: 'Gold',
    name: 'Premier',
    threshold: '10+ inspections / quarter',
    discount: 750,
    credits: 3,
    creditLabel: '1 credit per month',
    support: 'Dedicated account contact',
    cobranding: 'Badge + dedicated agent profile page on FPIA',
    reporting: 'Monthly performance report',
    featured: false,
    accentColor: '#C9A14D',
    badgeBg: '#0D1F3C',
    badgeText: '#C9A14D',
  },
] as const

function Benefit({
  text,
  accent,
  muted = false,
}: {
  text: string
  accent: string
  muted?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        marginBottom: '10px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '13px',
        color: muted ? '#aaa' : '#333',
        lineHeight: 1.5,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: muted ? '#ccc' : accent,
          flexShrink: 0,
          marginTop: '5px',
        }}
      />
      {text}
    </div>
  )
}

function ValueCalculator() {
  const [inspections, setInspections] = useState(5)
  const [fee, setFee] = useState(3500)

  const tier = inspections <= 4 ? tiers[0] : inspections <= 9 ? tiers[1] : tiers[2]
  const totalSaving = tier.discount * inspections
  const creditValue = tier.credits * fee

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e8e4dd',
        borderRadius: '12px',
        padding: '32px',
        marginTop: '40px',
      }}
    >
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#C9A14D',
          marginBottom: '20px',
        }}
      >
        Value calculator
      </p>

      <div style={{ marginBottom: '24px' }}>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <label
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: '#666',
              minWidth: '180px',
            }}
          >
            Inspections per quarter
          </label>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={inspections}
            onChange={(e) => setInspections(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#C9A14D' }}
          />
          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0D1F3C',
              minWidth: '28px',
              textAlign: 'right',
            }}
          >
            {inspections}
          </span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <label
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: '#666',
              minWidth: '180px',
            }}
          >
            Avg inspection fee
          </label>
          <input
            type="range"
            min={2000}
            max={6000}
            step={100}
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#C9A14D' }}
          />
          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0D1F3C',
              minWidth: '60px',
              textAlign: 'right',
            }}
          >
            R{fee.toLocaleString()}
          </span>
        </div>
      </div>

      <div
        className="grid gap-3 md:grid-cols-3"
        style={{
          borderTop: '1px solid #e8e4dd',
          paddingTop: '24px',
        }}
      >
        {[
          {
            label: 'Your tier',
            value: tier.label,
            sub: tier.threshold,
          },
          {
            label: 'Client savings',
            value: `R${totalSaving.toLocaleString()}`,
            sub: `R${tier.discount} × ${inspections} inspections`,
          },
          {
            label: 'Credit value',
            value: tier.credits === 0 ? '—' : `R${creditValue.toLocaleString()}`,
            sub:
              tier.credits === 0
                ? 'Unlock at Silver'
                : `${tier.creditLabel} @ R${fee.toLocaleString()}`,
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: '#F5F3EF',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#888',
                margin: '0 0 6px',
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontSize: '22px',
                color: '#0D1F3C',
                margin: '0 0 4px',
              }}
            >
              {item.value}
            </p>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '11px',
                color: '#999',
                margin: 0,
              }}
            >
              {item.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AgentRewardsProgrammeSection() {
  return (
    <>
      <section style={styles.sectionOffWhite}>
        <div style={styles.inner}>
          <p style={styles.eyebrow}>Agent Rewards Programme</p>
          <h2 style={styles.h2Dark}>Earn more by referring more.</h2>
          <div style={styles.rule} />
          <p style={styles.bodyText}>
            No cash. No legal risk. Inspection credits, co-branding benefits, and
            client discounts — earned through volume. The more your clients use FPIA,
            the stronger your competitive edge.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: tier.featured ? '2px solid #0D1F3C' : '1px solid #e8e4dd',
                  borderRadius: '12px',
                  padding: '28px',
                  position: 'relative',
                }}
              >
                {tier.featured ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#0D1F3C',
                      color: '#C9A14D',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Most popular
                  </div>
                ) : null}

                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: tier.badgeBg,
                    color: tier.badgeText,
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    marginBottom: '12px',
                  }}
                >
                  {tier.label}
                </span>

                <p
                  style={{
                    fontFamily: 'DM Serif Display, Georgia, serif',
                    fontSize: '22px',
                    color: '#0D1F3C',
                    margin: '0 0 4px',
                  }}
                >
                  {tier.name}
                </p>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px',
                    color: '#888',
                    margin: '0 0 20px',
                  }}
                >
                  {tier.threshold}
                </p>

                <div
                  style={{
                    borderTop: '1px solid #f0ece6',
                    paddingTop: '20px',
                  }}
                >
                  <Benefit
                    text={`R${tier.discount} off per inspection for your clients`}
                    accent={tier.accentColor}
                  />
                  <Benefit text={tier.cobranding} accent={tier.accentColor} />
                  <Benefit text={tier.support} accent={tier.accentColor} />
                  <Benefit
                    text={tier.creditLabel}
                    accent={tier.accentColor}
                    muted={tier.credits === 0}
                  />
                  {tier.reporting ? (
                    <Benefit text={tier.reporting} accent={tier.accentColor} />
                  ) : (
                    <Benefit
                      text="No performance reporting"
                      accent={tier.accentColor}
                      muted
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: '#888',
              lineHeight: 1.7,
              marginTop: '24px',
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderLeft: '3px solid #C9A14D',
              borderRadius: '0 6px 6px 0',
            }}
          >
            Credits are gifted inspections — the agent awards them to a client at no
            cost. No cash flows from FPIA to the agent, keeping the arrangement fully
            compliant with Section 34A of the Estate Agency Affairs Act. Agents also
            benefit from documented cover: recommending independent verification
            protects them against post-transfer defect disputes.
          </p>
        </div>
      </section>

      <section style={styles.sectionWhite}>
        <div style={styles.inner}>
          <p style={styles.eyebrow}>See the numbers</p>
          <h2 style={styles.h2Dark}>What&apos;s it worth to you?</h2>
          <div style={styles.rule} />
          <p style={styles.bodyText}>
            Adjust the sliders to see what your tier unlocks based on your quarterly
            referral volume.
          </p>
          <ValueCalculator />
        </div>
      </section>

      <section
        style={{
          backgroundColor: '#F5F3EF',
          padding: '48px 0',
          borderTop: '1px solid #e8e4dd',
        }}
      >
        <div
          style={{
            ...styles.inner,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontSize: '24px',
                color: '#0D1F3C',
                margin: '0 0 6px',
              }}
            >
              Ready to join the programme?
            </p>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#666',
                margin: 0,
              }}
            >
              Enroll takes less than 5 minutes. No upfront cost.
            </p>
          </div>
          <Link
            href="/contact?inquiry=agent-rewards"
            style={{
              display: 'inline-block',
              backgroundColor: '#0D1F3C',
              color: '#C9A14D',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              padding: '14px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            Enroll now
          </Link>
        </div>
      </section>
    </>
  )
}
