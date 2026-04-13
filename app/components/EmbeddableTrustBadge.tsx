import type { CSSProperties } from 'react'
import type { TrustOutcome } from '@/lib/certification/getCanonicalTrustState'
import { getTrustBadgeMeta } from '@/lib/certification/getTrustBadgeMeta'

type Props = {
  trustState: TrustOutcome
  verificationUrl: string
  verificationReference: string
}

export default function EmbeddableTrustBadge({
  trustState,
  verificationUrl,
  verificationReference,
}: Props) {
  const meta = getTrustBadgeMeta(trustState)

  return (
    <a
      href={verificationUrl}
      target="_blank"
      rel="noreferrer"
      style={containerStyle}
      aria-label={`FPIA ${meta.label} badge. Opens the official verification record.`}
    >
      <span style={eyebrowStyle}>Official FPIA Record</span>

      <div style={badgeRowStyle}>
        <span
          aria-hidden="true"
          style={{ ...dotStyle, backgroundColor: meta.accentColor }}
        />
        <span style={{ ...badgeTextStyle, color: meta.textColor }}>{meta.label}</span>
      </div>

      <p style={descriptorStyle}>{meta.descriptor}</p>
      <p style={referenceStyle}>{verificationReference}</p>
      <span style={linkLabelStyle}>Verify record</span>
    </a>
  )
}

const containerStyle: CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  minWidth: '280px',
  maxWidth: '320px',
  padding: '14px 16px',
  borderRadius: '8px',
  border: '1px solid rgba(11,31,51,0.12)',
  backgroundColor: '#ffffff',
  color: '#0B1F33',
  textDecoration: 'none',
  fontFamily: '"DM Sans", Arial, sans-serif',
  boxSizing: 'border-box',
}

const eyebrowStyle: CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
  color: '#6C7077',
}

const badgeRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
}

const dotStyle: CSSProperties = {
  width: '10px',
  height: '10px',
  borderRadius: '999px',
  flexShrink: 0,
}

const badgeTextStyle: CSSProperties = {
  fontSize: '14px',
  fontWeight: 800,
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
}

const descriptorStyle: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: '#475467',
  lineHeight: 1.45,
}

const referenceStyle: CSSProperties = {
  margin: 0,
  fontSize: '12px',
  color: '#0B1F33',
  fontFamily: '"DM Mono", monospace',
  lineHeight: 1.4,
  wordBreak: 'break-all',
}

const linkLabelStyle: CSSProperties = {
  marginTop: '2px',
  fontSize: '12px',
  fontWeight: 700,
  color: '#0B1F33',
  textDecoration: 'underline',
}
