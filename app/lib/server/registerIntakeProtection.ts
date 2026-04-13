const DEFAULT_WINDOW_MS = Number(process.env.REGISTER_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000)
const DEFAULT_MAX_REQUESTS = Number(process.env.REGISTER_RATE_LIMIT_MAX ?? 6)
const registerRateLimitStore = new Map<string, number[]>()

type RateLimitResult =
  | { allowed: true; retryAfterSeconds: 0 }
  | { allowed: false; retryAfterSeconds: number }

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  return 'unknown'
}

export function checkRegisterRateLimit(clientIp: string): RateLimitResult {
  const now = Date.now()
  const recentHits = (registerRateLimitStore.get(clientIp) ?? []).filter(
    (timestamp) => now - timestamp < DEFAULT_WINDOW_MS
  )

  if (recentHits.length >= DEFAULT_MAX_REQUESTS) {
    const oldestHit = recentHits[0] ?? now
    const retryAfterMs = Math.max(DEFAULT_WINDOW_MS - (now - oldestHit), 1000)
    registerRateLimitStore.set(clientIp, recentHits)

    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    }
  }

  recentHits.push(now)
  registerRateLimitStore.set(clientIp, recentHits)

  return {
    allowed: true,
    retryAfterSeconds: 0,
  }
}

function countUrls(value: string | null | undefined) {
  if (!value) return 0
  const matches = value.match(/https?:\/\/|www\./gi)
  return matches ? matches.length : 0
}

function hasRepeatedCharacters(value: string | null | undefined) {
  if (!value) return false
  return /(.)\1{5,}/.test(value)
}

function looksLikeNoise(value: string | null | undefined) {
  if (!value) return false
  return /^[^a-zA-Z0-9\s]+$/.test(value) || /[<>$%{}[\]]/.test(value)
}

export function detectRegisterSpam(payload: {
  honeypot: string | null
  fullName: string | null
  email: string | null
  propertyAddress: string | null
  notes: string | null
  agentName: string | null
  contactName: string | null
}) {
  if (payload.honeypot) {
    return 'honeypot'
  }

  const urlCount =
    countUrls(payload.fullName) +
    countUrls(payload.propertyAddress) +
    countUrls(payload.notes) +
    countUrls(payload.agentName) +
    countUrls(payload.contactName)

  if (urlCount > 1) {
    return 'too_many_urls'
  }

  if (
    hasRepeatedCharacters(payload.fullName) ||
    hasRepeatedCharacters(payload.propertyAddress) ||
    hasRepeatedCharacters(payload.notes)
  ) {
    return 'repeated_characters'
  }

  if (
    looksLikeNoise(payload.fullName) ||
    looksLikeNoise(payload.propertyAddress) ||
    looksLikeNoise(payload.contactName)
  ) {
    return 'noise_payload'
  }

  return null
}

export function logRegisterIntakeFailure(
  event: string,
  metadata: Record<string, unknown>
) {
  console.error('[register-intake]', {
    event,
    ...metadata,
  })
}
