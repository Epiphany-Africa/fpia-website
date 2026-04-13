'use client'
import { useState } from 'react'
import { getFpiaProduct } from '@/lib/products/fpiaProducts'

const STEPS = ['Property', 'Owner & Contact', 'Agent & Docs', 'Inspection']

export default function Register() {
  const sellerPackage = getFpiaProduct('seller_precert_package')
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function next() { setStep(s => s + 1) }
  function back() { setStep(s => s - 1) }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const form = new FormData(e.currentTarget)

    const payload = {
      street_address: form.get('street_address'),
      suburb: form.get('suburb'),
      city: form.get('city'),
      province: form.get('province'),
      erf_number: form.get('erf_number'),
      full_name: form.get('full_name'),
      id_number: form.get('id_number'),
      email: form.get('email'),
      phone: form.get('phone'),
      role_in_transaction: form.get('role_in_transaction'),
      contact_name: form.get('contact_name'),
      contact_phone: form.get('contact_phone'),
      agent_name: form.get('agent_name'),
      agency: form.get('agency'),
      agent_email: form.get('agent_email'),
      agent_phone: form.get('agent_phone'),
      transaction_type: form.get('transaction_type'),
      preferred_date: form.get('preferred_date'),
      alternative_date: form.get('alternative_date'),
      additional_notes: form.get('additional_notes'),
      company_website: form.get('company_website'),
    }

    try {
      const response = await fetch('/api/register-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json().catch(() => ({}))) as {
        error?: string
      }

      if (!response.ok) {
        setError(result.error ?? `Failed to submit registration (status ${response.status}).`)
        setSubmitting(false)
        return
      }

      setSubmitting(false)
      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main style={{ backgroundColor: 'var(--navy)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ fontSize: '56px', marginBottom: '24px', color: 'var(--gold)' }}>✓</div>
          <h2 style={{ color: 'var(--off-white)', fontFamily: "'DM Serif Display', serif", fontSize: '36px', marginBottom: '16px' }}>Registration Received.</h2>
          <p style={{ color: '#a0aec0', fontSize: '16px', lineHeight: 1.8 }}>
            Thank you for registering your property with FPIA. Our team will be in touch within 1 business day to confirm your inspection date.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: 'var(--off-white)', minHeight: '100vh' }}>

      {/* Hero */}
      <section className="fpia-register-hero" style={{ backgroundColor: 'var(--navy)', padding: '64px 80px 48px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Register a Property</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '48px', color: 'var(--off-white)', lineHeight: 1.1, marginBottom: '16px' }}>
          Get your property<br />
          <em style={{ color: 'var(--gold)', fontStyle: 'normal', fontWeight: 300 }}>certified.</em>
        </h1>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '32px' }} />

        <div
          className="fpia-register-product-card"
          style={{
            maxWidth: '620px',
            border: '1px solid rgba(201,161,77,0.2)',
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: '18px 20px',
            marginBottom: '32px',
          }}
        >
          <p style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            {sellerPackage.certificateOutcome}
          </p>
          <p style={{ color: 'var(--off-white)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
            {sellerPackage.name}
          </p>
          <p style={{ color: '#a0aec0', fontSize: '12px', marginBottom: '12px' }}>
            {sellerPackage.usageSubheading}
          </p>
          <p style={{ color: 'var(--gold)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            {sellerPackage.priceLabel}
          </p>
          <p style={{ color: 'var(--off-white)', fontSize: '26px', fontWeight: 700, marginBottom: '8px' }}>
            {sellerPackage.price}
          </p>
          <p style={{ color: 'var(--off-white)', fontSize: '13px', lineHeight: 1.6, marginBottom: '10px' }}>
            {sellerPackage.valueMicrocopy}
          </p>
          <p style={{ color: '#a0aec0', fontSize: '14px', lineHeight: 1.7, marginBottom: '10px' }}>
            {sellerPackage.description}
          </p>
          <p style={{ color: 'rgba(201,161,77,0.85)', fontSize: '12px', lineHeight: 1.7, margin: 0 }}>
            {sellerPackage.systemTrigger}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="fpia-register-progress" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {STEPS.map((label, i) => (
            <div key={i} className="fpia-register-progress-step" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: i < step ? 'var(--gold)' : i === step ? 'var(--gold)' : 'transparent',
                border: i <= step ? '2px solid var(--gold)' : '2px solid #3F5E7B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: i <= step ? 'var(--navy)' : '#3F5E7B',
                flexShrink: 0,
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '11px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: i === step ? 'var(--off-white)' : i < step ? 'var(--gold)' : '#3F5E7B',
              }}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="fpia-register-progress-divider" style={{
                  width: '40px',
                  height: '1px',
                  backgroundColor: i < step ? 'var(--gold)' : '#3F5E7B',
                  marginLeft: '4px',
                  marginRight: '4px',
                }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="fpia-register-form-shell" style={{ padding: '56px 80px', maxWidth: '860px' }}>
        <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); next() }}>
          <input
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />

          {/* STEP 1 — Property */}
          {step === 0 && (
            <div>
              <h2 style={stepTitleStyle}>Property Details</h2>
              <div style={gridStyle}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Street Address</label>
                  <input name="street_address" style={inputStyle} type="text" placeholder="e.g. 12 Jacaranda Street, Sandton" required />
                </div>
                <div>
                  <label style={labelStyle}>Suburb</label>
                  <input name="suburb" style={inputStyle} type="text" placeholder="e.g. Bryanston" required />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input name="city" style={inputStyle} type="text" placeholder="e.g. Johannesburg" required />
                </div>
                <div>
                  <label style={labelStyle}>Province</label>
                  <select name="province" style={inputStyle} required>
                    <option value="">Select province</option>
                    {['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Erf Number</label>
                  <input name="erf_number" style={inputStyle} type="text" placeholder="e.g. ERF 1234" />
                </div>
                <div>
                  <label style={labelStyle}>Transaction Type</label>
                  <select name="transaction_type" style={inputStyle} defaultValue="Pre Listing" required>
                    {['Pre Listing', 'Active Listing', 'Pre Purchase', 'Post Purchase', 'Transfer Follow-Up', 'Compliance Review'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Owner & Contact */}
          {step === 1 && (
            <div>
              <h2 style={stepTitleStyle}>Seller / Owner Details</h2>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input name="full_name" style={inputStyle} type="text" placeholder="e.g. John Smith" required />
                </div>
                <div>
                  <label style={labelStyle}>ID / Registration Number</label>
                  <input name="id_number" style={inputStyle} type="text" placeholder="e.g. 8001015009087" />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input name="email" style={inputStyle} type="email" placeholder="e.g. john@email.com" required />
                </div>
                <div>
                  <label style={labelStyle}>Contact Number</label>
                  <input name="phone" style={inputStyle} type="tel" placeholder="e.g. 082 555 1234" required />
                </div>
                <div>
                  <label style={labelStyle}>Role In Transaction</label>
                  <select name="role_in_transaction" style={inputStyle} defaultValue="Seller / Owner" required>
                    {['Seller / Owner', 'Estate Agent', 'Buyer', 'Conveyancer', 'Other Representative'].map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 style={{ ...stepTitleStyle, marginTop: '40px' }}>Primary Contact</h2>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Contact Name</label>
                  <input name="contact_name" style={inputStyle} type="text" placeholder="Person to liaise with for inspection" required />
                </div>
                <div>
                  <label style={labelStyle}>Contact Number</label>
                  <input name="contact_phone" style={inputStyle} type="tel" placeholder="e.g. 011 555 1234" required />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Agent & Docs */}
          {step === 2 && (
            <div>
              <h2 style={stepTitleStyle}>Agent Details <span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 400 }}>(Optional)</span></h2>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Agent Name</label>
                  <input name="agent_name" style={inputStyle} type="text" placeholder="e.g. Sarah Nkosi" />
                </div>
                <div>
                  <label style={labelStyle}>Agency</label>
                  <input name="agency" style={inputStyle} type="text" placeholder="e.g. Pam Golding Properties" />
                </div>
                <div>
                  <label style={labelStyle}>Agent Email</label>
                  <input name="agent_email" style={inputStyle} type="email" placeholder="e.g. sarah@pamgolding.co.za" />
                </div>
                <div>
                  <label style={labelStyle}>Agent Contact Number</label>
                  <input name="agent_phone" style={inputStyle} type="tel" placeholder="e.g. 083 555 9876" />
                </div>
              </div>

              <h2 style={{ ...stepTitleStyle, marginTop: '40px' }}>Documents <span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 400 }}>(Optional)</span></h2>
              <div style={gridStyle}>
                {['Title Deed', 'Electrical COC', 'Gas COC', 'Entomology Compliance', 'Electric Fence Compliance'].map((doc) => (
                  <div key={doc}>
                    <label style={labelStyle}>{doc}</label>
                    <input style={{ ...inputStyle, padding: '10px 16px', cursor: 'pointer' }} type="file" accept=".pdf,.jpg,.png" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 — Inspection */}
          {step === 3 && (
            <div>
              <h2 style={stepTitleStyle}>Preferred Inspection Date</h2>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Preferred Date</label>
                  <input name="preferred_date" style={inputStyle} type="date" required />
                </div>
                <div>
                  <label style={labelStyle}>Alternative Date</label>
                  <input name="alternative_date" style={inputStyle} type="date" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Additional Notes</label>
                  <textarea name="additional_notes" style={{ ...inputStyle, height: '120px', resize: 'vertical' }} placeholder="Any access instructions, gate codes, or special requirements..." />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="fpia-register-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(201,161,77,0.2)' }}>
            {step > 0 ? (
              <button type="button" onClick={back} style={backBtnStyle}>
                ← Back
              </button>
            ) : <div />}

            <button type="submit" disabled={submitting} style={nextBtnStyle}>
              {step === STEPS.length - 1 ? (submitting ? 'Submitting...' : 'Submit Registration') : 'Next →'}
            </button>
          </div>

          {error && (
            <p style={{ color: '#b42318', fontSize: '13px', marginTop: '16px' }}>
              {error}
            </p>
          )}

          {step === STEPS.length - 1 && (
            <p style={{ color: '#a0aec0', fontSize: '12px', marginTop: '16px' }}>
              By submitting this form you agree to FPIA&rsquo;s terms of service. An inspector will be assigned within 1 business day.
            </p>
          )}

        </form>
      </section>
      <style jsx>{`
        @media (max-width: 980px) {
          .fpia-register-hero,
          .fpia-register-form-shell {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
        }

        @media (max-width: 720px) {
          .fpia-register-progress {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px !important;
          }

          .fpia-register-progress-step {
            width: 100%;
            flex-wrap: wrap;
          }

          .fpia-register-progress-divider {
            display: none;
          }

          .fpia-register-actions {
            flex-direction: column-reverse;
            align-items: stretch !important;
            gap: 12px !important;
          }
        }

        @media (max-width: 640px) {
          .fpia-register-hero,
          .fpia-register-form-shell {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          .fpia-register-hero {
            padding-top: 44px !important;
            padding-bottom: 36px !important;
          }

          .fpia-register-form-shell {
            padding-top: 32px !important;
            padding-bottom: 40px !important;
          }

          .fpia-register-product-card {
            padding: 16px !important;
          }
        }
      `}</style>
    </main>
  )
}

const stepTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--navy)',
  marginBottom: '24px',
  paddingBottom: '12px',
  borderBottom: '1px solid rgba(201,161,77,0.3)',
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '24px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--navy)',
  marginBottom: '8px',
  fontWeight: 600,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  backgroundColor: '#fff',
  color: 'var(--navy)',
  outline: 'none',
  boxSizing: 'border-box',
}

const nextBtnStyle: React.CSSProperties = {
  backgroundColor: 'var(--gold)',
  color: 'var(--navy)',
  padding: '14px 40px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  border: 'none',
  cursor: 'pointer',
}

const backBtnStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: 'var(--navy)',
  padding: '14px 24px',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  border: '1px solid #d1d5db',
  cursor: 'pointer',
}
