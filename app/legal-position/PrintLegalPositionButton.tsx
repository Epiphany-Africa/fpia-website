'use client'

export default function PrintLegalPositionButton({
  label = 'Print / Save as PDF',
}: {
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '44px',
        padding: '0 18px',
        border: '1px solid rgba(11,31,51,0.14)',
        backgroundColor: '#ffffff',
        color: 'var(--navy)',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}
