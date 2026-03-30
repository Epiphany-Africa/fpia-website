'use client'

import { useState } from 'react'

type CopyHashButtonProps = {
  value: string
}

export default function CopyHashButton({ value }: CopyHashButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 1200)
    } catch (error) {
      console.error('Failed to copy hash:', error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        fontSize: '10px',
        padding: '5px 10px',
        border: '1px solid rgba(201,161,77,0.35)',
        backgroundColor: copied
          ? 'rgba(46,125,50,0.1)'
          : 'rgba(201,161,77,0.06)',
        color: copied ? '#2E7D32' : 'var(--gold)',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 700,
        height: '26px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}