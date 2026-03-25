'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Verify() {
  const router = useRouter()
  const [certNumber, setCertNumber] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!certNumber.trim()) {
      setError('Please enter a certificate number.')
      return
    }
    router.push(`/verify/${certNumber.trim()}`)
  }

  return (
    <main style={{ backgroundColor: 'var(--off-white)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)', padding: '80px 80px 64px' }}>
        <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Verify a Property</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '52px', color: 'var(--off-white)', lineHeight: 1.1, marginBottom: '16px' }}>
          Check certification<br />
          <em style={{ color: 'var(--gold)', fontStyle: 'normal', fontWeight: 300 }}>before you sign.</em>
        </h1>
        <hr style={{ border: 'none', borderTop: '2px solid var(--gold)', width: '60px', marginBottom: '24px' }} />
        <p style={{ color: '#a0aec0', fontSize: '16px', maxWidth: '480px', lineHeight: 1.7 }}>
          Enter the certificate number from the property listing, or scan the QR code on the FPIA show board to verify instantly.
        </p>
      </section>

      {/* Two options */}
      <section style={{ padding: '64px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1000px' }}>

        {/* Option 1 — Certificate Number */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          padding: '40px',
        }}>
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
              onChange={(e) => {
                setCertNumber(e.target.value)
                setError('')
              }}
            />
            {error && (
              <p style={{ color: '#C62828', fontSize: '12px', marginTop: '8px' }}>{error}</p>
            )}
            <button type="submit" style={btnStyle}>
              Verify Property →
            </button>
          </form>
        </div>

        {/* Option 2 — QR Code */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          padding: '40px',
        }}>
          <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Option 02</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', color: 'var(--navy)', marginBottom: '8px' }}>Scan QR Code</h2>
          <p style={{ color: '#6C7077', fontSize: '14px', lineHeight: 1.7, marginBottom: '32px' }}>
            Use your phone camera or a QR scanner app to scan the code on the FPIA show board or listing printout.
          </p>

          {/* QR Placeholder */}
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
            {/* QR icon */}
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

      </section>

      {/* How it works strip */}
      <section style={{ backgroundColor: 'var(--navy)', padding: '48px 80px', display: 'flex', gap: '64px', alignItems: 'flex-start' }}>
        {[
          { num: '01', title: 'Find the code', body: 'Certificate number is on the listing, show board, or OTP documents.' },
          { num: '02', title: 'Enter or scan', body: 'Type the number above or scan the QR code with your phone.' },
          { num: '03', title: 'See the record', body: 'Instantly view the full certification status and compliance categories.' },
        ].map((item) => (
          <div key={item.num} style={{ flex: 1 }}>
            <span style={{ color: 'var(--gold)', fontSize: '24px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>{item.num}</span>
            <h3 style={{ color: 'var(--off-white)', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
            <p style={{ color: '#a0aec0', fontSize: '14px', lineHeight: 1.7 }}>{item.body}</p>
          </div>
        ))}
      </section>

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