import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  checkRegisterRateLimit,
  detectRegisterSpam,
  getClientIp,
  logRegisterIntakeFailure,
} from '@/lib/server/registerIntakeProtection'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const REQUEST_ERROR_MESSAGE =
  'We could not submit your request right now. Please try again shortly.'

function normalizeRequiredString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > maxLength) return null
  return trimmed
}

function normalizeOptionalString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, maxLength)
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID()
  const clientIp = getClientIp(req.headers)

  try {
    const body = await req.json()
    const honeypot = normalizeOptionalString(body?.company_website, 240)
    const rateLimit = checkRegisterRateLimit(clientIp)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait a few minutes and try again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      )
    }

    const certificateRef = normalizeRequiredString(body?.certificateRef, 120)
    const propertyId = normalizeOptionalString(body?.propertyId, 120)
    const registryId = normalizeOptionalString(body?.registryId, 120)
    const requestType = normalizeRequiredString(body?.requestType, 60)
    const requesterName = normalizeRequiredString(body?.requesterName, 120)
    const requesterEmail = normalizeRequiredString(body?.requesterEmail, 200)?.toLowerCase()
    const requesterPhone = normalizeOptionalString(body?.requesterPhone, 40)
    const message = normalizeOptionalString(body?.message, 2000)
    const spamReason = detectRegisterSpam({
      honeypot,
      fullName: requesterName,
      email: requesterEmail ?? null,
      propertyAddress: certificateRef,
      notes: message,
      agentName: null,
      contactName: null,
    })

    if (spamReason) {
      logRegisterIntakeFailure('spam_rejected', {
        requestId,
        clientIp,
        reason: spamReason,
      })

      return NextResponse.json(
        { error: 'We could not accept that request. Please review your details and try again.' },
        { status: 400 }
      )
    }

    if (!certificateRef || !requestType || !requesterName || !requesterEmail) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(requesterEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const allowedTypes = new Set([
      'request_reinspection',
    ])

    if (!allowedTypes.has(requestType)) {
      return NextResponse.json(
        { error: 'Invalid request type.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('certificate_action_requests')
      .insert({
        certificate_ref: certificateRef,
        property_id: propertyId || null,
        registry_id: registryId || null,
        request_type: requestType,
        requester_name: requesterName,
        requester_email: requesterEmail,
        requester_phone: requesterPhone || null,
        message: message || null,
        status: 'submitted',
      })

    if (error) {
      logRegisterIntakeFailure('insert_failed', {
        requestId,
        clientIp,
        code: error.code ?? null,
        message: error.message,
      })

      return NextResponse.json(
        { error: REQUEST_ERROR_MESSAGE },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    logRegisterIntakeFailure('unexpected_error', {
      requestId,
      clientIp,
      message: error instanceof Error ? error.message : 'unknown',
    })

    return NextResponse.json(
      { error: REQUEST_ERROR_MESSAGE },
      { status: 500 }
    )
  }
}
