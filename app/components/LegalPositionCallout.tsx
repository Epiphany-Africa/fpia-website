import Link from 'next/link'

export default function LegalPositionCallout({
  title = 'Legal Position',
  body = 'Read FPIA’s legal position on voetstoots, disclosure, and OTP conditions.',
  href = '/legal-position',
  compact = false,
}: {
  title?: string
  body?: string
  href?: string
  compact?: boolean
}) {
  return (
    <aside
      style={{
        border: '1px solid rgba(201,161,77,0.24)',
        backgroundColor: compact ? 'rgba(255,255,255,0.04)' : 'rgba(201,161,77,0.08)',
        padding: compact ? '18px' : '24px',
      }}
    >
      <p
        style={{
          margin: '0 0 8px 0',
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: compact ? '14px' : '15px',
          lineHeight: 1.7,
          color: compact ? 'rgba(255,255,255,0.76)' : '#44505d',
        }}
      >
        {body}{' '}
        <Link
          href={href}
          style={{
            color: compact ? 'var(--gold)' : 'var(--navy)',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Read the statement →
        </Link>
      </p>
    </aside>
  )
}
