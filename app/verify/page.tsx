'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Verify() {
  const router = useRouter()
  const [certNumber, setCertNumber] = useState('')
  const [error, setError] = useState('')
  const [quoteAddress, setQuoteAddress] = useState('')
  const [quoteName, setQuoteName] = useState('')
  const [quotePhone, setQuotePhone] = useState('')
  const [quoteEmail, setQuoteEmail] = useState('')
  const [otpDeclared, setOtpDeclared] = useState(false)
  const [quoteError, setQuoteError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!certNumber.trim()) {
      setError('Please enter a certificate number.')
      return
    }
    router.push(`/verify/${certNumber.trim()}`)
  }

  function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!otpDeclared) {
      setQuoteError('You must confirm a valid OTP is in place before requesting a quote.')
      return
    }

    const params = new URLSearchParams()
    if (quoteName.trim()) params.set('name', quoteName.trim())
    if (quoteEmail.trim()) params.set('email', quoteEmail.trim())
    if (quoteAddress.trim()) params.set('requestedProperty', quoteAddress.trim())
    if (quotePhone.trim()) params.set('phone', quotePhone.trim())
    params.set('source', 'verify-page')

    router.push(`/request-inspection?${params.toString()}`)
  }

  return (
    <main style={{ backgroundColor: 'var(--off-white)', minHeight: '100vh' }}>

      {/* Hero */}
      <section className="fpia-verify-hero" style={{ backgroundColor: 'var(--navy)', padding: '80px 80px 64px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Verify a Property</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '52px', color: 'var(--off-white)', lineHeight: 1.1, marginBottom: '16px' }}>
          Check certification<br />
          <em style={{ color: 'var(--gold)', fontStyle: 'normal', fontWeight: 300 }}>before you sign.</em>
        </h1>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '24px' }} />
        <p style={{ color: '#a0aec0', fontSize: '16px', maxWidth: '480px', lineHeight: 1.7 }}>
          Enter a valid FPIA certificate number or scan the official QR code to verify the property&rsquo;s certified status and inspection record.
        </p>
      </section>

      {/* Three options */}
      <section className="fpia-verify-options" style={{ padding: '64px 80px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '40px' }}>

        {/* Option 1 — Certificate Number */}
        <div className="fpia-verify-option" style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', padding: '40px' }}>
          <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Option 01</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', color: 'var(--navy)', marginBottom: '8px' }}>Enter Certificate Number</h2>
          <p style={{ color: '#6C7077', fontSize: '14px', lineHeight: 1.7, marginBottom: '32px' }}>
            Find the certificate number on the property listing, show board, or in your OTP documentation.
          </p>
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Certificate Number</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="e.g. ZA-2024-00142"
              value={certNumber}
              onChange={(e) => { setCertNumber(e.target.value); setError('') }}
            />

          <p style={{ fontSize: '12px', color: '#6C7077', marginTop: '-8px', marginBottom: '12px' }}>
             Try demo certificate:{' '}
          <button
              type="button"
              onClick={() => router.push('/verify/FPIA-6AF4CF0170')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                color: 'var(--gold)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              FPIA-6AF4CF0170
          </button>
        </p>

              {error && <p style={{ color: '#C62828', fontSize: '12px', marginTop: '8px' }}>{error}</p>}
            <button type="submit" style={btnStyle}>Verify Property →</button>
          </form>
        </div>

        {/* Option 2 — QR Code */}
        <div className="fpia-verify-option" style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', padding: '40px' }}>
          <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Option 02</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', color: 'var(--navy)', marginBottom: '8px' }}>Scan QR Code</h2>
          <p style={{ color: '#6C7077', fontSize: '14px', lineHeight: 1.7, marginBottom: '32px' }}>
            Use your phone camera or a QR scanner app to scan the code on the FPIA show board or listing printout.
          </p>
          <div style={{
            border: '2px dashed rgba(201,161,77,0.4)',
            backgroundColor: 'var(--off-white)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            gap: '16px',
          }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="24" height="24" rx="2" stroke="#C9A14D" strokeWidth="2" fill="none"/>
              <rect x="10" y="10" width="12" height="12" fill="#C9A14D"/>
              <rect x="36" y="4" width="24" height="24" rx="2" stroke="#C9A14D" strokeWidth="2" fill="none"/>
              <rect x="42" y="10" width="12" height="12" fill="#C9A14D"/>
              <rect x="4" y="36" width="24" height="24" rx="2" stroke="#C9A14D" strokeWidth="2" fill="none"/>
              <rect x="10" y="42" width="12" height="12" fill="#C9A14D"/>
              <rect x="36" y="36" width="4" height="4" fill="#C9A14D"/>
              <rect x="44" y="36" width="4" height="4" fill="#C9A14D"/>
              <rect x="52" y="36" width="8" height="4" fill="#C9A14D"/>
              <rect x="36" y="44" width="8" height="4" fill="#C9A14D"/>
              <rect x="48" y="44" width="4" height="4" fill="#C9A14D"/>
              <rect x="36" y="52" width="4" height="8" fill="#C9A14D"/>
              <rect x="44" y="52" width="8" height="4" fill="#C9A14D"/>
              <rect x="56" y="50" width="4" height="10" fill="#C9A14D"/>
            </svg>
            <p style={{ color: '#6C7077', fontSize: '13px', textAlign: 'center', lineHeight: 1.6 }}>
              Point your phone camera at the QR code on the property show board
            </p>
            <p style={{ color: '#a0aec0', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              QR scanner coming soon
            </p>
          </div>
        </div>

        {/* Option 3 — Get Certified */}
        <div className="fpia-verify-option fpia-verify-option-otp" style={{ backgroundColor: '#fff', border: '1px solid rgba(201,161,77,0.4)', padding: '40px', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '40px',
            backgroundColor: 'var(--gold)',
            color: 'var(--navy)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '4px 12px',
          }} className="fpia-verify-otp-flag">
            OTP Period Only
          </div>

          <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Option 03</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', color: 'var(--navy)', marginBottom: '8px' }}>Get This Property Certified</h2>
          <p style={{ color: '#6C7077', fontSize: '14px', lineHeight: 1.7, marginBottom: '32px' }}>
            Property not yet certified? As a buyer within your OTP suspensive period, you can request FPIA arrange and quote for an inspection on your behalf.
          </p>

          <form onSubmit={handleQuoteSubmit}>
            <label style={labelStyle}>Property Address</label>
            <input style={inputStyle} type="text" placeholder="e.g. 12 Jacaranda Street, Sandton" value={quoteAddress} onChange={(e) => setQuoteAddress(e.target.value)} required />

            <label style={labelStyle}>Your Full Name</label>
            <input style={inputStyle} type="text" placeholder="e.g. John Smith" value={quoteName} onChange={(e) => setQuoteName(e.target.value)} required />

            <label style={labelStyle}>Contact Number</label>
            <input style={inputStyle} type="tel" placeholder="e.g. 082 555 1234" value={quotePhone} onChange={(e) => setQuotePhone(e.target.value)} required />

            <label style={labelStyle}>Email Address</label>
            <input style={inputStyle} type="email" placeholder="e.g. john@email.com" value={quoteEmail} onChange={(e) => setQuoteEmail(e.target.value)} required />

            <div className="fpia-verify-declaration" style={{
              backgroundColor: 'var(--off-white)',
              border: '1px solid rgba(201,161,77,0.3)',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}>
              <input
                type="checkbox"
                id="otp-declaration"
                checked={otpDeclared}
                onChange={(e) => setOtpDeclared(e.target.checked)}
                style={{ marginTop: '3px', accentColor: 'var(--gold)', flexShrink: 0 }}
                required
              />
              <label htmlFor="otp-declaration" style={{ fontSize: '12px', color: 'var(--navy)', lineHeight: 1.6, cursor: 'pointer' }}>
                I confirm that I have a valid, signed Offer to Purchase for this property that is currently within its suspensive period.
              </label>
            </div>

            <p style={{ color: '#6C7077', fontSize: '12px', lineHeight: 1.6, margin: '0 0 12px 0' }}>
              This will take you to the inspection request flow with your details carried through.
            </p>

            {quoteError && <p style={{ color: '#C62828', fontSize: '12px', marginBottom: '12px' }}>{quoteError}</p>}

            <button type="submit" style={{
              ...btnStyle,
              backgroundColor: otpDeclared ? 'var(--gold)' : '#d1d5db',
              color: otpDeclared ? 'var(--navy)' : '#9ca3af',
              cursor: otpDeclared ? 'pointer' : 'not-allowed',
            }}>
              Continue to Inspection Request →
            </button>
          </form>
        </div>

      </section>

      {/* How it works strip */}
      <section className="fpia-verify-steps-strip" style={{ backgroundColor: 'var(--navy)', padding: '48px 80px', display: 'flex', gap: '64px', alignItems: 'flex-start' }}>
        {[
          { num: '01', title: 'Find the code', body: 'Certificate number is on the listing, show board, or OTP documents.' },
          { num: '02', title: 'Enter or scan', body: 'Type the number above or scan the QR code with your phone.' },
          { num: '03', title: 'See the record', body: 'Instantly view the full certification status and compliance categories.' },
        ].map((item) => (
          <div key={item.num} className="fpia-verify-step" style={{ flex: 1 }}>
            <span style={{ color: 'var(--gold)', fontSize: '24px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>{item.num}</span>
            <h3 style={{ color: 'var(--off-white)', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
            <p style={{ color: '#a0aec0', fontSize: '14px', lineHeight: 1.7 }}>{item.body}</p>
          </div>
        ))}
      </section>

      <style jsx>{`
        @media (max-width: 980px) {
          .fpia-verify-hero,
          .fpia-verify-options,
          .fpia-verify-steps-strip {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }

          .fpia-verify-options {
            grid-template-columns: 1fr !important;
          }

          .fpia-verify-steps-strip {
            flex-direction: column;
            gap: 28px !important;
          }
        }

        @media (max-width: 640px) {
          .fpia-verify-hero,
          .fpia-verify-options,
          .fpia-verify-steps-strip {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          .fpia-verify-hero {
            padding-top: 44px !important;
            padding-bottom: 36px !important;
          }

          .fpia-verify-options {
            padding-top: 32px !important;
            padding-bottom: 32px !important;
            gap: 22px !important;
          }

          .fpia-verify-option {
            padding: 22px !important;
          }

          .fpia-verify-option-otp {
            padding-top: 44px !important;
          }

          .fpia-verify-otp-flag {
            left: 18px !important;
          }

          .fpia-verify-declaration {
            flex-direction: column;
            gap: 10px !important;
          }

          .fpia-verify-steps-strip {
            padding-top: 32px !important;
            padding-bottom: 36px !important;
            gap: 22px !important;
          }
        }
      `}</style>

    </main>
  )
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
  padding: '14px 16px',
  fontSize: '15px',
  border: '1px solid #d1d5db',
  backgroundColor: '#fff',
  color: 'var(--navy)',
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: '16px',
  letterSpacing: '1px',
}

const btnStyle: React.CSSProperties = {
  backgroundColor: 'var(--gold)',
  color: 'var(--navy)',
  padding: '14px 32px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
}
