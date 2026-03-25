'use client'
import { useState } from 'react'

const STEPS = ['Property', 'Owner & Contact', 'Agent & Docs', 'Inspection']

export default function Register() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  function next() { setStep(s => s + 1) }
  function back() { setStep(s => s - 1) }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire up to API
    setSubmitted(true)
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
      <section style={{ backgroundColor: 'var(--navy)', padding: '64px 80px 48px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Register a Property</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '48px', color: 'var(--off-white)', lineHeight: 1.1, marginBottom: '16px' }}>
          Get your property<br />
          <em style={{ color: 'var(--gold)', fontStyle: 'normal', fontWeight: 300 }}>certified.</em>
        </h1>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '32px' }} />

        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <div style={{
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
      <section style={{ padding: '56px 80px', maxWidth: '860px' }}>
        <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); next() }}>

          {/* STEP 1 — Property */}
          {step === 0 && (
            <div>
              <h2 style={stepTitleStyle}>Property Details</h2>
              <div style={gridStyle}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Street Address</label>
                  <input style={inputStyle} type="text" placeholder="e.g. 12 Jacaranda Street, Sandton" required />
                </div>
                <div>
                  <label style={labelStyle}>Suburb</label>
                  <input style={inputStyle} type="text" placeholder="e.g. Bryanston" required />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input style={inputStyle} type="text" placeholder="e.g. Johannesburg" required />
                </div>
                <div>
                  <label style={labelStyle}>Province</label>
                  <select style={inputStyle} required>
                    <option value="">Select province</option>
                    {['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Erf Number</label>
                  <input style={inputStyle} type="text" placeholder="e.g. ERF 1234" />
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
                  <input style={inputStyle} type="text" placeholder="e.g. John Smith" required />
                </div>
                <div>
                  <label style={labelStyle}>ID / Registration Number</label>
                  <input style={inputStyle} type="text" placeholder="e.g. 8001015009087" />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input style={inputStyle} type="email" placeholder="e.g. john@email.com" required />
                </div>
                <div>
                  <label style={labelStyle}>Contact Number</label>
                  <input style={inputStyle} type="tel" placeholder="e.g. 082 555 1234" required />
                </div>
              </div>

              <h2 style={{ ...stepTitleStyle, marginTop: '40px' }}>Primary Contact</h2>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Contact Name</label>
                  <input style={inputStyle} type="text" placeholder="Person to liaise with for inspection" required />
                </div>
                <div>
                  <label style={labelStyle}>Contact Number</label>
                  <input style={inputStyle} type="tel" placeholder="e.g. 011 555 1234" required />
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
                  <input style={inputStyle} type="text" placeholder="e.g. Sarah Nkosi" />
                </div>
                <div>
                  <label style={labelStyle}>Agency</label>
                  <input style={inputStyle} type="text" placeholder="e.g. Pam Golding Properties" />
                </div>
                <div>
                  <label style={labelStyle}>Agent Email</label>
                  <input style={inputStyle} type="email" placeholder="e.g. sarah@pamgolding.co.za" />
                </div>
                <div>
                  <label style={labelStyle}>Agent Contact Number</label>
                  <input style={inputStyle} type="tel" placeholder="e.g. 083 555 9876" />
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
                  <input style={inputStyle} type="date" required />
                </div>
                <div>
                  <label style={labelStyle}>Alternative Date</label>
                  <input style={inputStyle} type="date" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Additional Notes</label>
                  <textarea style={{ ...inputStyle, height: '120px', resize: 'vertical' }} placeholder="Any access instructions, gate codes, or special requirements..." />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(201,161,77,0.2)' }}>
            {step > 0 ? (
              <button type="button" onClick={back} style={backBtnStyle}>
                ← Back
              </button>
            ) : <div />}

            <button type="submit" style={nextBtnStyle}>
              {step === STEPS.length - 1 ? 'Submit Registration' : 'Next →'}
            </button>
          </div>

          {step === STEPS.length - 1 && (
            <p style={{ color: '#a0aec0', fontSize: '12px', marginTop: '16px' }}>
              By submitting this form you agree to FPIA's terms of service. An inspector will be assigned within 1 business day.
            </p>
          )}

        </form>
      </section>
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
  gridTemplateColumns: '1fr 1fr',
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