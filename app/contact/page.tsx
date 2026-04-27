'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type InquiryPreset = {
  label: string
  role: string
  summary: string
  message: string
}

const INQUIRY_PRESETS: Record<string, InquiryPreset> = {
  'agency-account': {
    label: 'Property Practitioner Account',
    role: 'Property Practitioner',
    summary: 'Agency retainer pricing and onboarding.',
    message:
      "I'm interested in an FPIA property practitioner account. Please send the onboarding steps, pricing structure, and what is included in the monthly retainer.",
  },
  'insurer-pilot-a': {
    label: 'Insurer Pilot A',
    role: 'Insurer',
    summary: 'Pre-policy baseline pilot: R45,000 for 20 properties over 60 days.',
    message:
      "I'm interested in Insurer Pilot A (Pre-policy baseline, R45,000 for 20 properties over 60 days). Please send the scope, rollout requirements, and commercial terms.",
  },
  'insurer-pilot-b': {
    label: 'Insurer Pilot B',
    role: 'Insurer',
    summary: 'Claims-adjacent evidence pilot: R55,000 for 20 properties over 60 days.',
    message:
      "I'm interested in Insurer Pilot B (Claims-adjacent evidence, R55,000 for 20 properties over 60 days). Please send the pilot scope, onboarding requirements, and commercial terms.",
  },
  'insurer-pilot-custom': {
    label: 'Insurer Pilot C',
    role: 'Insurer',
    summary: 'Custom portfolio intelligence pilot for 50+ properties.',
    message:
      "I'm interested in the custom insurer portfolio intelligence pilot for 50+ properties. Please contact me to scope the cohort, data outputs, and commercial structure.",
  },
  'originator-referral': {
    label: 'Originator Referral Model',
    role: 'Bond Originator',
    summary: 'Referral programme with R500 per completed inspection.',
    message:
      "I'm interested in the FPIA originator referral model, including referral-code setup, payout terms, and onboarding steps.",
  },
  'originator-integration': {
    label: 'Originator Integration Model',
    role: 'Bond Originator',
    summary: 'Integrated pre-approval workflow and dashboard model.',
    message:
      "I'm interested in the FPIA originator integration model. Please send the onboarding process, dashboard scope, and pricing structure.",
  },
  'property-passport': {
    label: 'Property Passport',
    role: 'Homeowner',
    summary: 'Free homeowner document vault and record verification enquiry.',
    message:
      "I've created or want to create a Property Passport for my home. Please contact me about document verification, missing records, and how to turn my uploaded files into FPIA-verified records.",
  },
}

function ContactPageForm() {
  const searchParams = useSearchParams()
  const inquiryKey = searchParams.get('inquiry')?.trim().toLowerCase() ?? ''
  const inquiryPreset = INQUIRY_PRESETS[inquiryKey] ?? null

  const [name, setName] = useState(() => searchParams.get('name')?.trim() ?? '')
  const [email, setEmail] = useState(() => searchParams.get('email')?.trim() ?? '')
  const [phone, setPhone] = useState(() => searchParams.get('phone')?.trim() ?? '')
  const [role, setRole] = useState(
    () => searchParams.get('role')?.trim() ?? inquiryPreset?.role ?? ''
  )
  const [message, setMessage] = useState(
    () => searchParams.get('message')?.trim() ?? inquiryPreset?.message ?? ''
  )
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setBusy(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiry: inquiryKey || null,
          name,
          email,
          phone,
          role,
          message,
          company_website: companyWebsite,
        }),
      })

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string
      }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Could not send your message right now.')
      }

      setSubmitted(true)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Could not send your message right now.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <main style={{ backgroundColor: 'var(--navy)', minHeight: '100vh' }}>

        {/* Hero */}
        <section className="fpia-contact-hero" style={{
          padding: '80px 80px 60px',
          borderBottom: '1px solid rgba(201,161,77,0.15)',
        }}>
          <p style={{
            fontSize: '11px',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '16px',
          }}>
            Get In Touch
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(36px, 5vw, 58px)',
            color: 'var(--off-white)',
            lineHeight: 1.1,
            maxWidth: '700px',
            marginBottom: '20px',
          }}>
            Let&rsquo;s talk about your property.
          </h1>
          <p style={{
            color: 'var(--slate)',
            fontSize: '16px',
            lineHeight: 1.8,
            maxWidth: '560px',
          }}>
            Whether you&rsquo;re a buyer, seller, property practitioner, or insurer — we&rsquo;re here to help you understand what FPIA certification means for your transaction.
          </p>
          {inquiryPreset ? (
            <div
              style={{
                marginTop: '24px',
                maxWidth: '560px',
                padding: '16px 18px',
                border: '1px solid rgba(201,161,77,0.22)',
                backgroundColor: 'rgba(201,161,77,0.06)',
              }}
            >
              <p style={{ ...labelStyle, color: 'var(--gold)', marginBottom: '6px' }}>
                Selected enquiry
              </p>
              <p
                style={{
                  color: 'var(--off-white)',
                  fontSize: '18px',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                {inquiryPreset.label}
              </p>
              <p style={{ color: 'var(--slate)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                {inquiryPreset.summary}
              </p>
            </div>
          ) : null}
        </section>

        {/* Content */}
        <section className="fpia-contact-content" style={{
          padding: '80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          maxWidth: '1200px',
        }}>

          {/* Left — Info */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              color: 'var(--off-white)',
              marginBottom: '32px',
            }}>
              How we can help
            </h2>

            {[
              {
                title: 'Book an Inspection',
                desc: 'Request a certified FPIA property inspection for your suspensive period or pre-listing assessment.',
              },
              {
                title: 'Property Practitioner Partnerships',
                desc: 'Enquire about integrating FPIA certification into your listings and offering buyers verified property condition.',
              },
              {
                title: 'Insurer & Originator Enquiries',
                desc: 'Find out how FPIA data supports underwriting, valuations, and bond decisions.',
              },
              {
                title: 'General Questions',
                desc: 'Not sure where to start? Send us a message and we will point you in the right direction.',
              },
            ].map((item) => (
              <div key={item.title} style={{
                marginBottom: '32px',
                paddingLeft: '20px',
                borderLeft: '2px solid rgba(201,161,77,0.3)',
              }}>
                <p style={{
                  color: 'var(--gold)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                  {item.title}
                </p>
                <p style={{
                  color: 'var(--slate)',
                  fontSize: '15px',
                  lineHeight: 1.7,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}

            {/* Direct contact */}
            <div style={{
              marginTop: '48px',
              padding: '28px',
              border: '1px solid rgba(201,161,77,0.2)',
              backgroundColor: 'rgba(201,161,77,0.04)',
            }}>
              <p style={{
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '16px',
              }}>
                Direct Contact
              </p>
              {[
                {
                  label: 'Stephen van der Merwe',
                  value: '+27 74 273 7869',
                  href: 'tel:+27742737869',
                },
                {
                  label: 'Rolise Bester',
                  value: '+27 63 029 7665',
                  href: 'tel:+27630297665',
                },
                {
                  label: 'Andy Wille',
                  value: '+27 71 474 6449',
                  href: 'tel:+27714746449',
                },
                {
                  label: 'Email',
                  value: 'info@fairproperties.org.za',
                  href: 'mailto:info@fairproperties.org.za',
                },
              ].map((c) => (
                <div key={c.label} style={{ marginBottom: '12px' }}>
                  <span style={{ color: 'var(--slate)', fontSize: '13px' }}>{c.label}: </span>
                  <Link
                    href={c.href}
                    style={{
                      color: 'var(--off-white)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {c.value}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div>
            {submitted ? (
              <div className="fpia-contact-success" style={{
                padding: '48px',
                border: '1px solid rgba(201,161,77,0.3)',
                backgroundColor: 'rgba(201,161,77,0.05)',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: '32px',
                  marginBottom: '16px',
                }}>✓</p>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  color: 'var(--off-white)',
                  marginBottom: '12px',
                }}>
                  Message received.
                </h3>
                <p style={{ color: 'var(--slate)', lineHeight: 1.7 }}>
                  We&rsquo;ll be in touch within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '28px',
                  color: 'var(--off-white)',
                  marginBottom: '8px',
                }}>
                  Send us a message
                </h2>
                {inquiryPreset ? (
                  <p style={{ color: 'var(--slate)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                    This form is prefilled for <strong style={{ color: 'var(--off-white)' }}>{inquiryPreset.label}</strong>.
                    Adjust the details below before sending if needed.
                  </p>
                ) : null}

                {/* Role selector */}
                <div>
                  <label style={labelStyle}>I am a</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    style={inputStyle}
                  >
                    <option value="">Select your role</option>
                    <option value="Homeowner">Homeowner</option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                    <option value="Property Practitioner">Property Practitioner</option>
                    <option value="Insurer">Insurer</option>
                    <option value="Bond Originator">Bond Originator</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="fpia-contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Your name"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27 82 000 0000"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell us about your property or enquiry..."
                    style={{ ...inputStyle, resize: 'vertical', paddingTop: '12px' }}
                  />
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                  }}
                  aria-hidden="true"
                >
                  <label style={labelStyle}>Company website</label>
                  <input
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    style={inputStyle}
                  />
                </div>

                {error ? (
                  <p style={{ color: '#fc8181', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={busy}
                  style={{
                    backgroundColor: busy ? 'rgba(201,161,77,0.5)' : 'var(--gold)',
                    color: 'var(--navy)',
                    border: 'none',
                    padding: '14px 32px',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    cursor: busy ? 'not-allowed' : 'pointer',
                    width: '100%',
                  }}
                >
                  {busy ? 'Sending...' : 'Send Message'}
                </button>

                <p style={{ color: 'var(--slate)', fontSize: '12px', lineHeight: 1.6 }}>
                  We respond within one business day. Your details are never shared or sold.
                </p>
              </form>
            )}
          </div>
        </section>
        <style jsx>{`
          @media (max-width: 980px) {
            .fpia-contact-hero,
            .fpia-contact-content {
              padding-left: 32px !important;
              padding-right: 32px !important;
            }

            .fpia-contact-content {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }

          @media (max-width: 640px) {
            .fpia-contact-hero,
            .fpia-contact-content {
              padding-left: 18px !important;
              padding-right: 18px !important;
            }

            .fpia-contact-hero {
              padding-top: 44px !important;
              padding-bottom: 36px !important;
            }

            .fpia-contact-content {
              padding-top: 32px !important;
              padding-bottom: 44px !important;
              gap: 28px !important;
            }

            .fpia-contact-form-row {
              grid-template-columns: 1fr !important;
            }

            .fpia-contact-success {
              padding: 28px 22px !important;
            }
          }
        `}</style>
      </main>     
  )
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            backgroundColor: 'var(--navy)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--slate)' }}>
            Loading contact form...
          </p>
        </main>
      }
    >
      <ContactPageForm />
    </Suspense>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201,161,77,0.25)',
  color: 'var(--off-white)',
  padding: '12px 16px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}
