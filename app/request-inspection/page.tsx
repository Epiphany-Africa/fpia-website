'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Suburb = {
  id: string
  suburb: string
  city: string
  province: string
  postal_code: string
}

type Step = 'property' | 'contact' | 'confirm'

export default function RequestInspectionPage() {
  const [step, setStep] = useState<Step>('property')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Address autocomplete
  const [addressQuery, setAddressQuery] = useState('')
  const [streetNumber, setStreetNumber] = useState('')
  const [streetName, setStreetName] = useState('')
  const [suburbQuery, setSuburbQuery] = useState('')
  const [suburbResults, setSuburbResults] = useState<Suburb[]>([])
  const [selectedSuburb, setSelectedSuburb] = useState<Suburb | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Contact details
  const [role, setRole] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [altDate, setAltDate] = useState('')
  const [notes, setNotes] = useState('')

  // Suburb search
  useEffect(() => {
    if (suburbQuery.length < 2) {
      setSuburbResults([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('sa_suburbs')
        .select('*')
        .ilike('suburb', `%${suburbQuery}%`)
        .limit(8)

      setSuburbResults(data ?? [])
      setShowDropdown(true)
    }, 250)

    return () => clearTimeout(timer)
  }, [suburbQuery])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectSuburb(suburb: Suburb) {
    setSelectedSuburb(suburb)
    setSuburbQuery(suburb.suburb)
    setShowDropdown(false)
  }

  function fullAddress() {
    if (!selectedSuburb) return ''
    return `${streetNumber} ${streetName}, ${selectedSuburb.suburb}, ${selectedSuburb.city}, ${selectedSuburb.province}, ${selectedSuburb.postal_code}`
  }

  function canProceedStep1() {
    return streetNumber.trim() && streetName.trim() && selectedSuburb
  }

  function canProceedStep2() {
    return role && fullName.trim() && email.trim() && phone.trim() && preferredDate
  }

  async function handleSubmit() {
    setBusy(true)
    setError('')

    try {
      const res = await fetch('/api/request-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_address: fullAddress(),
          suburb: selectedSuburb?.suburb,
          city: selectedSuburb?.city,
          province: selectedSuburb?.province,
          postal_code: selectedSuburb?.postal_code,
          requestor_role: role,
          requestor_name: fullName,
          requestor_email: email,
          requestor_phone: phone,
          preferred_date: preferredDate,
          alt_date: altDate || null,
          notes: notes || null,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Something went wrong.')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message ?? 'Unexpected error.')
    } finally {
      setBusy(false)
    }
  }

  if (submitted) {
    return (
      <main style={{ backgroundColor: 'var(--navy)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: '520px' }}>
          <div style={{ fontSize: '56px', marginBottom: '24px' }}>✓</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--off-white)', marginBottom: '16px' }}>
            Inspection Requested.
          </h2>
          <p style={{ color: 'var(--slate)', fontSize: '16px', lineHeight: 1.8, marginBottom: '12px' }}>
            Your request has been lodged. You will receive a WhatsApp and email confirmation shortly.
          </p>
          <p style={{ color: 'var(--slate)', fontSize: '14px', lineHeight: 1.8 }}>
            An FPIA inspector in your area will be assigned within 48 hours.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: 'var(--navy)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '64px 80px 48px', borderBottom: '1px solid rgba(201,161,77,0.15)' }}>
        <p style={{ fontSize: '11px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
          Request an Inspection
        </p>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)', color: 'var(--off-white)', lineHeight: 1.1, maxWidth: '600px', marginBottom: '16px' }}>
          Get your property certified.
        </h1>
        <p style={{ color: 'var(--slate)', fontSize: '15px', lineHeight: 1.8, maxWidth: '520px' }}>
          Complete the form below and an FPIA inspector in your area will be assigned within 48 hours.
        </p>

        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: '32px', marginTop: '32px' }}>
          {(['property', 'contact', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: step === s ? 'var(--gold)' : 'transparent',
                border: `2px solid ${step === s ? 'var(--gold)' : 'rgba(201,161,77,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700,
                color: step === s ? 'var(--navy)' : 'rgba(201,161,77,0.5)',
              }}>
                {i + 1}
              </div>
              <span style={{
                fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
                color: step === s ? 'var(--off-white)' : 'rgba(160,174,192,0.5)',
              }}>
                {s === 'property' ? 'Property' : s === 'contact' ? 'Your Details' : 'Confirm'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '60px 80px', maxWidth: '760px' }}>

        {/* STEP 1 — Property */}
        {step === 'property' && (
          <div>
            <h2 style={stepTitleStyle}>Property Address</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Street Number</label>
                <input
                  value={streetNumber}
                  onChange={e => setStreetNumber(e.target.value)}
                  placeholder="e.g. 76"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Street Name</label>
                <input
                  value={streetName}
                  onChange={e => setStreetName(e.target.value)}
                  placeholder="e.g. Leonora Drive"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Suburb autocomplete */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <label style={labelStyle}>Suburb</label>
              <input
                value={suburbQuery}
                onChange={e => {
                  setSuburbQuery(e.target.value)
                  setSelectedSuburb(null)
                }}
                placeholder="Start typing your suburb..."
                style={inputStyle}
                autoComplete="off"
              />

              {showDropdown && suburbResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#0d2540',
                  border: '1px solid rgba(201,161,77,0.3)',
                  zIndex: 100,
                  maxHeight: '280px',
                  overflowY: 'auto',
                }}>
                  {suburbResults.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => selectSuburb(s)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(201,161,77,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(201,161,77,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div>
                        <div style={{ color: 'var(--off-white)', fontSize: '14px', fontWeight: 600 }}>{s.suburb}</div>
                        <div style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '2px' }}>{s.city}, {s.province}</div>
                      </div>
                      <div style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 600 }}>{s.postal_code}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected suburb confirmation */}
            {selectedSuburb && (
              <div style={{
                marginTop: '16px',
                padding: '14px 18px',
                border: '1px solid rgba(201,161,77,0.3)',
                backgroundColor: 'rgba(201,161,77,0.05)',
              }}>
                <p style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>
                  Full Address
                </p>
                <p style={{ color: 'var(--off-white)', fontSize: '14px', lineHeight: 1.7 }}>
                  {fullAddress()}
                </p>
              </div>
            )}

            <div style={{ marginTop: '40px' }}>
              <button
                onClick={() => canProceedStep1() && setStep('contact')}
                disabled={!canProceedStep1()}
                style={{
                  ...btnPrimaryStyle,
                  opacity: canProceedStep1() ? 1 : 0.4,
                  cursor: canProceedStep1() ? 'pointer' : 'not-allowed',
                }}
              >
                Next — Your Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Contact */}
        {step === 'contact' && (
          <div>
            <h2 style={stepTitleStyle}>Your Details</h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>I am a</label>
                <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
                  <option value="">Select your role</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Agent">Agent</option>
                  <option value="Insurer">Insurer</option>
                  <option value="Bond Originator">Bond Originator</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone / WhatsApp</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 82 000 0000" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Preferred Inspection Date</label>
                  <input type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Alternative Date</label>
                  <input type="date" value={altDate} onChange={e => setAltDate(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Access instructions, gate codes, or any special requirements..."
                  style={{ ...inputStyle, resize: 'vertical', paddingTop: '12px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
              <button onClick={() => setStep('property')} style={btnSecondaryStyle}>
                ← Back
              </button>
              <button
                onClick={() => canProceedStep2() && setStep('confirm')}
                disabled={!canProceedStep2()}
                style={{
                  ...btnPrimaryStyle,
                  opacity: canProceedStep2() ? 1 : 0.4,
                  cursor: canProceedStep2() ? 'pointer' : 'not-allowed',
                }}
              >
                Review & Confirm →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Confirm */}
        {step === 'confirm' && (
          <div>
            <h2 style={stepTitleStyle}>Confirm Your Request</h2>

            <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
              {[
                { label: 'Property Address', value: fullAddress() },
                { label: 'Role', value: role },
                { label: 'Name', value: fullName },
                { label: 'Email', value: email },
                { label: 'Phone / WhatsApp', value: phone },
                { label: 'Preferred Date', value: preferredDate },
                { label: 'Alternative Date', value: altDate || '—' },
                { label: 'Notes', value: notes || '—' },
              ].map((item) => (
                <div key={item.label} style={{
                  padding: '14px 18px',
                  border: '1px solid rgba(201,161,77,0.15)',
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr',
                  gap: '12px',
                }}>
                  <span style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', paddingTop: '2px' }}>
                    {item.label}
                  </span>
                  <span style={{ color: 'var(--off-white)', fontSize: '14px', lineHeight: 1.6 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              padding: '16px 20px',
              border: '1px solid rgba(201,161,77,0.2)',
              backgroundColor: 'rgba(201,161,77,0.04)',
              marginBottom: '32px',
            }}>
              <p style={{ color: 'var(--slate)', fontSize: '13px', lineHeight: 1.7 }}>
                By submitting, you will receive a WhatsApp and email confirmation. An FPIA inspector in your area will be assigned within 48 hours.
              </p>
            </div>

            {error && (
              <p style={{ color: '#fc8181', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setStep('contact')} style={btnSecondaryStyle}>
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={busy}
                style={{ ...btnPrimaryStyle, opacity: busy ? 0.6 : 1, cursor: busy ? 'not-allowed' : 'pointer' }}
              >
                {busy ? 'Submitting...' : 'Submit Inspection Request'}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

const stepTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-serif)',
  fontSize: '28px',
  color: 'var(--off-white)',
  marginBottom: '28px',
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

const btnPrimaryStyle: React.CSSProperties = {
  backgroundColor: 'var(--gold)',
  color: 'var(--navy)',
  border: 'none',
  padding: '14px 32px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
}

const btnSecondaryStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: 'var(--slate)',
  border: '1px solid rgba(201,161,77,0.2)',
  padding: '14px 24px',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  cursor: 'pointer',
}