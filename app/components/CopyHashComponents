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
        padding: '4px 8px',
        border: '1px solid rgba(201,161,77,0.4)',
        background: 'transparent',
        color: 'var(--gold)',
        cursor: 'pointer',
      }}
    >
      Copy
    </button>
  )
}