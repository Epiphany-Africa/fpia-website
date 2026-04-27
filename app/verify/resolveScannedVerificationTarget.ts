const ALLOWED_PUBLIC_HOSTS = new Set([
  'fairproperties.org.za',
  'www.fairproperties.org.za',
])

const PUBLIC_ROUTE_PATTERNS = [/^\/verify\/([^/?#]+)$/i, /^\/certificate\/([^/?#]+)$/i]

export type ScanFailureReason =
  | 'empty'
  | 'invalid-qr'
  | 'external-url'
  | 'unsupported-url'
  | 'unsupported-content'

export type ScanResolution =
  | {
      ok: true
      certificateId: string
      href: string
      source: 'id' | 'verify-url' | 'certificate-url'
    }
  | {
      ok: false
      reason: ScanFailureReason
    }

export function resolveScannedVerificationTarget(raw: string): ScanResolution {
  const trimmed = raw.trim()

  if (!trimmed) {
    return { ok: false, reason: 'empty' }
  }

  const directIdentifier = normalizeIdentifier(trimmed)
  if (directIdentifier) {
    return {
      ok: true,
      certificateId: directIdentifier,
      href: `/verify/${encodeURIComponent(directIdentifier)}`,
      source: 'id',
    }
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return { ok: false, reason: 'unsupported-content' }
  }

  if (!ALLOWED_PUBLIC_HOSTS.has(parsed.hostname.toLowerCase())) {
    return { ok: false, reason: 'external-url' }
  }

  for (const pattern of PUBLIC_ROUTE_PATTERNS) {
    const match = parsed.pathname.match(pattern)
    if (!match) continue

    const certificateId = normalizeIdentifier(decodeURIComponent(match[1] ?? ''))
    if (!certificateId) {
      return { ok: false, reason: 'unsupported-url' }
    }

    return {
      ok: true,
      certificateId,
      href: `/verify/${encodeURIComponent(certificateId)}`,
      source: pattern.source.includes('certificate') ? 'certificate-url' : 'verify-url',
    }
  }

  return { ok: false, reason: 'unsupported-url' }
}

function normalizeIdentifier(value: string): string | null {
  const normalized = value.trim().replace(/^\/+|\/+$/g, '')

  if (!normalized) return null
  if (normalized.includes(' ')) return null
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{4,}$/i.test(normalized)) return null

  return normalized
}
