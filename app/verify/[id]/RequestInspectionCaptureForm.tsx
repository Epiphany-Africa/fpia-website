'use client'

import type { CSSProperties } from 'react'

type Props = {
  propertyReference: string
}

export default function RequestInspectionCaptureForm({
  propertyReference,
}: Props) {
  return (
    <form
      action="/request-inspection"
      method="GET"
      style={{
        display: 'grid',
        gap: '14px',
        marginTop: '18px',
        maxWidth: '620px',
      }}
    >
      <p
        style={{
          fontSize: '13px',
          color: '#6C7077',
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        If a formal inspection is required, you may provide your contact details below.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
        }}
      >
        <div>
          <label style={labelStyle} htmlFor="request-name">
            Name
          </label>
          <input
            id="request-name"
            name="name"
            type="text"
            required
            style={inputStyle}
            placeholder="Your full name"
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="request-email">
            Email
          </label>
          <input
            id="request-email"
            name="email"
            type="email"
            required
            style={inputStyle}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="request-reference">
          Property Reference
        </label>
        <input
          id="request-reference"
          name="propertyReference"
          type="text"
          readOnly
          value={propertyReference}
          style={{ ...inputStyle, backgroundColor: '#f7f7f5', color: '#475467' }}
        />
      </div>

      <div>
        <button type="submit" style={buttonStyle}>
          Request Inspection
        </button>
      </div>
    </form>
  )
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '11px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: '#6C7077',
  marginBottom: '8px',
  fontWeight: 700,
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '11px 12px',
  border: '1px solid rgba(11,31,51,0.14)',
  backgroundColor: '#fff',
  color: '#0B1F33',
  fontSize: '14px',
  boxSizing: 'border-box',
}

const buttonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 14px',
  border: '1px solid rgba(11,31,51,0.16)',
  backgroundColor: '#fff',
  color: '#0B1F33',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  cursor: 'pointer',
}
