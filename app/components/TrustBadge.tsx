import type { CSSProperties } from 'react'
import type { TrustOutcome } from '@/lib/certification/getCanonicalTrustState'
import { getTrustBadgeMeta } from '@/lib/certification/getTrustBadgeMeta'

type Props = {
  trustState: TrustOutcome
  variant?: 'default' | 'compact' | 'registry'
}

export default function TrustBadge({
  trustState,
  variant = 'default',
}: Props) {
  const meta = getTrustBadgeMeta(trustState)
  const compact = variant === 'compact'
  const registry = variant === 'registry'

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: compact ? 'row' : 'column',
    alignItems: compact ? 'center' : 'flex-start',
    gap: compact ? '10px' : registry ? '7px' : '8px',
    padding: compact ? '8px 12px' : registry ? '10px 12px' : '12px 14px',
    minWidth: compact ? 'auto' : registry ? '100%' : '220px',
    width: registry ? '100%' : 'auto',
    borderRadius: '6px',
    border: `1px solid ${meta.borderColor}`,
    backgroundColor: meta.backgroundColor,
  }

  const labelStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: compact ? '0' : registry ? '5px 9px' : '6px 10px',
    borderRadius: compact ? '0' : '999px',
    fontSize: compact ? '13px' : registry ? '11px' : '12px',
    fontWeight: 800,
    letterSpacing: registry ? '1.2px' : '1.4px',
    textTransform: 'uppercase',
    color: meta.textColor,
    backgroundColor: compact ? 'transparent' : '#fff',
    border: compact ? 'none' : `1px solid ${meta.borderColor}`,
    whiteSpace: 'nowrap',
  }

  const dotStyle: CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '999px',
    backgroundColor: meta.accentColor,
    flexShrink: 0,
  }

  const descriptorStyle: CSSProperties = {
    margin: 0,
    fontSize: compact ? '12px' : registry ? '12px' : '13px',
    lineHeight: registry ? 1.4 : 1.45,
    color: '#475467',
    fontWeight: compact ? 600 : registry ? 500 : 500,
  }

  return (
    <div
      title={meta.tooltip}
      aria-label={`${meta.label}. ${meta.tooltip}`}
      style={containerStyle}
    >
      <div style={labelStyle}>
        <span aria-hidden="true" style={dotStyle} />
        <span>{meta.label}</span>
      </div>
      <p style={descriptorStyle}>{meta.descriptor}</p>
    </div>
  )
}
