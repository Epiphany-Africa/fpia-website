'use client'

import { useState } from 'react'

type ActionType =
  | 'submit_remediation'
  | 'request_reinspection'
  | 'upgrade_to_certified'

type Props = {
  certificateRef: string
  propertyId?: string | null
  registryId?: string | null
}

const actionLabels: Record<ActionType, string> = {
  submit_remediation: 'Submit Proof of Remediation',
  request_reinspection: 'Request Reinspection',
  upgrade_to_certified: 'Upgrade to Certified',
}

export default function ConditionalActionPanel({
  certificateRef,
  propertyId,
  registryId,
}: Props) {
  const [activeAction, setActiveAction] = useState<ActionType | null>(null)
  const [requesterName, setRequesterName] = useState('')
  const [requesterEmail, setRequesterEmail] = useState('')
  const [requesterPhone, setRequesterPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!activeAction) return

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
      setMessage('')
      setActiveAction(null)
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
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginTop: '16px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveAction('submit_remediation')}
          style={buttonPrimary}
        >
          Submit Proof of Remediation
        </button>

        <button
          type="button"
          onClick={() => setActiveAction('request_reinspection')}
          style={buttonAmberOutline}
        >
          Request Reinspection
        </button>

        <button
          type="button"
          onClick={() => setActiveAction('upgrade_to_certified')}
          style={buttonNavyOutline}
        >
          Upgrade to Certified
        </button>
      </div>

      {activeAction && (
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

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide details, evidence summary, or next steps requested"
            rows={5}
            style={{ ...inputStyle, resize: 'vertical' as const }}
          />

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="submit" disabled={isSubmitting} style={buttonPrimary}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveAction(null)
                setErrorMessage('')
              }}
              style={buttonNavyOutline}
            >
              Cancel
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
      )}
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

const buttonAmberOutline: React.CSSProperties = {
  padding: '10px 16px',
  backgroundColor: '#fff',
  color: '#B7791F',
  border: '1px solid #B7791F',
  borderRadius: '4px',
  fontWeight: 700,
  cursor: 'pointer',
}

const buttonNavyOutline: React.CSSProperties = {
  padding: '10px 16px',
  backgroundColor: '#fff',
  color: 'var(--navy)',
  border: '1px solid rgba(11,31,51,0.18)',
  borderRadius: '4px',
  fontWeight: 700,
  cursor: 'pointer',
}