'use client'

type CopyHashButtonProps = {
  value: string
}

export default function CopyHashButton({ value }: CopyHashButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch (error) {
      console.error('Failed to copy hash:', error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        fontSize: '11px',
        padding: '6px 12px',
        border: '1px solid rgba(201,161,77,0.35)',
        backgroundColor: 'rgba(201,161,77,0.06)',
        color: 'var(--gold)',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 700,
        lineHeight: 1,
        height: '28px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        marginLeft: '4px',
      }}
    >
      Copy
    </button>
  )
}