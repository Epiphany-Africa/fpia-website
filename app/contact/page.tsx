'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    // Simulate submission — wire to backend/email in next phase
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    setBusy(false)
  }

  return (
    
          <main style={{ backgroundColor: 'var(--navy)', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{
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
            Whether you&rsquo;re a buyer, seller, agent, or insurer — we&rsquo;re here to help you understand what FPIA certification means for your transaction.
          </p>
        </section>

        {/* Content */}
        <section style={{
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
                title: 'Agent Partnerships',
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
                { label: 'Stephen van der Merwe', value: '+27 74 273 7869' },
                { label: 'Rolise Bester', value: '+27 63 029 7665' },
                { label: 'Andy Wille', value: '+27 71 474 6449' },
                { label: 'Email', value: 'info@fairproperties.org.za' },
              ].map((c) => (
                <div key={c.label} style={{ marginBottom: '12px' }}>
                  <span style={{ color: 'var(--slate)', fontSize: '13px' }}>{c.label}: </span>
                  <span style={{ color: 'var(--off-white)', fontSize: '13px', fontWeight: 600 }}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div>
            {submitted ? (
              <div style={{
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
      </main>     
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
