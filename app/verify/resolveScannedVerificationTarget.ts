const PRODUCTION_PUBLIC_HOSTS = new Set([
  'fairproperties.org.za',
  'www.fairproperties.org.za',
])

const PUBLIC_ROUTE_PATTERNS = [/^\/verify\/([^/?#]+)$/i, /^\/certificate\/([^/?#]+)$/i]

export type ScanFailureReason =
  | 'empty'
  | 'invalid-qr'
  | 'invalid-security-data'
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

  const securedPayload = parseSecureQrPayload(trimmed)
  if (securedPayload) {
    if (!securedPayload.ok) {
      return { ok: false, reason: 'invalid-security-data' }
    }

    return resolveScannedVerificationTarget(securedPayload.target)
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

  if (!getAllowedPublicHosts().has(parsed.hostname.toLowerCase())) {
    return { ok: false, reason: 'external-url' }
  }

  const hash = parsed.searchParams.get('hash')
  const signature = parsed.searchParams.get('signature')
  if ((hash && !isValidHash(hash)) || (signature && !isValidSignature(signature))) {
    return { ok: false, reason: 'invalid-security-data' }
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

function parseSecureQrPayload(raw: string):
  | { ok: true; target: string }
  | { ok: false }
  | null {
  try {
    const parsed = JSON.parse(raw) as unknown

    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    const candidate = parsed as Record<string, unknown>
    const target = getPayloadTarget(candidate)
    const hash = typeof candidate.hash === 'string' ? candidate.hash.trim() : null
    const signature =
      typeof candidate.signature === 'string' ? candidate.signature.trim() : null

    if (!target && !hash && !signature) {
      return null
    }

    if (!target || (!hash && !signature)) {
      return { ok: false }
    }

    if ((hash && !isValidHash(hash)) || (signature && !isValidSignature(signature))) {
      return { ok: false }
    }

    return { ok: true, target }
  } catch {
    return null
  }
}

function getPayloadTarget(payload: Record<string, unknown>) {
  const targetKeys = ['verificationTarget', 'verificationUrl', 'url', 'certificateId']

  for (const key of targetKeys) {
    const value = payload[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return null
}

function isValidHash(value: string) {
  return /^(sha256:)?[a-f0-9]{64}$/i.test(value.trim())
}

function isValidSignature(value: string) {
  return /^[A-Za-z0-9_-]{32,512}$/.test(value.trim())
}

function normalizeIdentifier(value: string): string | null {
  const normalized = value.trim().replace(/^\/+|\/+$/g, '')

  if (!normalized) return null
  if (normalized.includes(' ')) return null
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{4,}$/i.test(normalized)) return null

  return normalized
}

function getAllowedPublicHosts() {
  const hosts = new Set(PRODUCTION_PUBLIC_HOSTS)
  const configuredHost = getConfiguredPublicHost()

  if (configuredHost) {
    hosts.add(configuredHost)
  }

  if (typeof window !== 'undefined' && window.location.hostname) {
    hosts.add(window.location.hostname.toLowerCase())
  }

  return hosts
}

function getConfiguredPublicHost() {
  const rawOrigin = process.env.NEXT_PUBLIC_FPIA_PUBLIC_ORIGIN?.trim()

  if (!rawOrigin) {
    return null
  }

  try {
    return new URL(rawOrigin).hostname.toLowerCase()
  } catch {
    return null
  }
}
