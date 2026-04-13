'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'

type Props = {
  verifyUrl: string
  verificationReference: string
  embedUrl: string
}

type CopyState = 'idle' | 'link' | 'reference' | 'embed'

export default function ShareRecordPanel({
  verifyUrl,
  verificationReference,
  embedUrl,
}: Props) {
  const [copied, setCopied] = useState<CopyState>('idle')

  const shareText =
    `This is an official FPIA property condition record. ` +
    `Share this link to verify the status independently.\n\n${verifyUrl}`

  const embedSnippet = `<iframe src="${embedUrl}" title="FPIA property verification badge" width="320" height="140" style="border:0;overflow:hidden;" loading="lazy"></iframe>`

  async function handleCopy(value: string, mode: CopyState) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(mode)

      window.setTimeout(() => {
        setCopied('idle')
      }, 1200)
    } catch (error) {
      console.error('Failed to copy share value:', error)
    }
  }

  return (
    <div>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--navy)',
          lineHeight: 1.7,
          margin: '0 0 18px 0',
          maxWidth: '640px',
        }}
      >
        This is an official FPIA property condition record. Share this link to verify the
        status independently.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          marginBottom: '18px',
        }}
      >
        <button
          onClick={() => handleCopy(verifyUrl, 'link')}
          style={buttonStyle(copied === 'link')}
        >
          {copied === 'link' ? 'Link Copied' : 'Copy Link'}
        </button>

        <button
          onClick={() => handleCopy(verificationReference, 'reference')}
          style={buttonStyle(copied === 'reference')}
        >
          {copied === 'reference'
            ? 'Reference Copied'
            : 'Copy Verification Reference'}
        </button>

        <button
          onClick={() => handleCopy(embedSnippet, 'embed')}
          style={buttonStyle(copied === 'embed')}
        >
          {copied === 'embed' ? 'HTML Copied' : 'Copy HTML Snippet'}
        </button>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
        >
          Share via WhatsApp
        </a>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div>
          <p style={metaLabelStyle}>Verify URL</p>
          <p style={metaValueStyle}>{verifyUrl}</p>
        </div>

        <div>
          <p style={metaLabelStyle}>Verification Reference</p>
          <p style={metaValueStyle}>{verificationReference}</p>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <p style={metaLabelStyle}>Listing Embed HTML</p>
          <p style={metaValueStyle}>{embedSnippet}</p>
        </div>
      </div>
    </div>
  )
}

function buttonStyle(copied: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 220px',
    minHeight: '44px',
    padding: '10px 14px',
    border: '1px solid rgba(11,31,51,0.16)',
    backgroundColor: copied ? 'rgba(46,125,50,0.08)' : '#fff',
    color: copied ? '#2E7D32' : 'var(--navy)',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    textAlign: 'center',
  }
}

const linkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '1 1 220px',
  minHeight: '44px',
  padding: '10px 14px',
  border: '1px solid rgba(11,31,51,0.16)',
  color: 'var(--navy)',
  textDecoration: 'none',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  textAlign: 'center',
}

const metaLabelStyle: CSSProperties = {
  fontSize: '11px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: '#6C7077',
  margin: '0 0 8px 0',
  fontWeight: 700,
}

const metaValueStyle: CSSProperties = {
  fontSize: '13px',
  color: 'var(--navy)',
  lineHeight: 1.6,
  margin: 0,
  wordBreak: 'break-all',
}
