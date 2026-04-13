'use client'

import { useState } from 'react'

type ActionType =
  | 'request_reinspection'

type Props = {
  certificateRef: string
  propertyId?: string | null
  registryId?: string | null
}

const actionLabels: Record<ActionType, string> = {
  request_reinspection: 'Request Reinspection',
}

export default function ConditionalActionPanel({
  certificateRef,
  propertyId,
  registryId,
}: Props) {
  const activeAction: ActionType = 'request_reinspection'
  const [requesterName, setRequesterName] = useState('')
  const [requesterEmail, setRequesterEmail] = useState('')
  const [requesterPhone, setRequesterPhone] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const res = await fetch('/api/certificate-action-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateRef,
          propertyId,
          registryId,
          requestType: activeAction,
          requesterName,
          requesterEmail,
          requesterPhone,
          company_website: companyWebsite,
          message,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Submission failed.')
      }

      setSuccessMessage('Your request has been submitted successfully.')
      setRequesterName('')
      setRequesterEmail('')
      setRequesterPhone('')
      setCompanyWebsite('')
      setMessage('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Submission failed.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#fff',
          border: '1px solid rgba(183,121,31,0.18)',
          borderRadius: '4px',
          display: 'grid',
          gap: '12px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 700,
            color: '#B7791F',
          }}
        >
          {actionLabels[activeAction]}
        </p>

        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--navy)' }}>
          Request an official follow-up inspection once remedial work has been completed.
        </p>

        <input
          value={requesterName}
          onChange={(e) => setRequesterName(e.target.value)}
          placeholder="Your full name"
          required
          style={inputStyle}
        />

        <input
          value={requesterEmail}
          onChange={(e) => setRequesterEmail(e.target.value)}
          placeholder="Your email address"
          type="email"
          required
          style={inputStyle}
        />

        <input
          value={requesterPhone}
          onChange={(e) => setRequesterPhone(e.target.value)}
          placeholder="Your phone number"
          style={inputStyle}
        />

        <div style={honeypotWrapStyle} aria-hidden="true">
          <input
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            style={inputStyle}
          />
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share the work completed and any preferred dates for reinspection"
          rows={5}
          style={{ ...inputStyle, resize: 'vertical' as const }}
        />

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="submit" disabled={isSubmitting} style={buttonPrimary}>
            {isSubmitting ? 'Submitting...' : 'Request Reinspection'}
          </button>
        </div>

        {successMessage && (
          <p style={{ margin: 0, color: '#2E7D32', fontWeight: 600 }}>
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p style={{ margin: 0, color: '#C62828', fontWeight: 600 }}>
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid rgba(11,31,51,0.18)',
  borderRadius: '4px',
  fontSize: '14px',
  color: 'var(--navy)',
  backgroundColor: '#fff',
}

const buttonPrimary: React.CSSProperties = {
  padding: '10px 16px',
  backgroundColor: 'var(--gold)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 700,
  cursor: 'pointer',
}

const honeypotWrapStyle: React.CSSProperties = {
  position: 'absolute',
  left: '-9999px',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
}

