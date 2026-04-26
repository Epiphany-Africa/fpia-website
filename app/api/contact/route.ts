import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminSupabaseClient } from '@/lib/server/adminSupabase'
import {
  checkRegisterRateLimit,
  detectRegisterSpam,
  getClientIp,
  logRegisterIntakeFailure,
} from '@/lib/server/registerIntakeProtection'
import { writeAdminEvent } from '@/lib/server/eventLog'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const OPS_EMAIL = process.env.OPS_EMAIL ?? process.env.SUPPORT_EMAIL ?? null
const CONTACT_ERROR_MESSAGE =
  'We could not send your message right now. Please try again shortly.'

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

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  const clientIp = getClientIp(request.headers)

  try {
    const body = await request.json()
    const honeypot = normalizeOptionalString(body?.company_website, 240)
    const rateLimit = checkRegisterRateLimit(clientIp)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many contact requests. Please wait a few minutes and try again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      )
    }

    const inquiry = normalizeOptionalString(body?.inquiry, 80)
    const name = normalizeRequiredString(body?.name, 160)
    const email = normalizeRequiredString(body?.email, 200)?.toLowerCase() ?? null
    const phone = normalizeOptionalString(body?.phone, 40)
    const role = normalizeRequiredString(body?.role, 80)
    const message = normalizeRequiredString(body?.message, 4000)

    const spamReason = detectRegisterSpam({
      honeypot,
      fullName: name,
      email,
      propertyAddress: inquiry,
      notes: message,
      agentName: null,
      contactName: null,
    })

    if (spamReason) {
      logRegisterIntakeFailure('contact_spam_rejected', {
        requestId,
        clientIp,
        reason: spamReason,
      })

      return NextResponse.json(
        {
          error: 'We could not accept that message. Please review your details and try again.',
        },
        { status: 400 }
      )
    }

    if (!name || !email || !role || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()

    try {
      await writeAdminEvent(supabase as never, {
        entityType: 'website_contact',
        entityId: null,
        eventType: 'contact_request_submitted',
        eventLabel: 'Website contact request submitted',
        sourceSystem: 'fpia-website',
        eventPayload: {
          request_id: requestId,
          inquiry,
          name,
          email,
          phone,
          role,
          message,
          client_ip: clientIp,
        },
      })
    } catch (eventError) {
      console.error('Website contact event log failed:', eventError)
    }

    if (resend && OPS_EMAIL) {
      const safeInquiry = inquiry ? escapeHtml(inquiry) : 'general'
      const safeName = escapeHtml(name)
      const safeEmail = escapeHtml(email)
      const safeRole = escapeHtml(role)
      const safePhone = phone ? escapeHtml(phone) : 'Not provided'
      const safeMessage = escapeHtml(message)

      try {
        await resend.emails.send({
          from: 'FPIA Website <info@fairproperties.org.za>',
          to: OPS_EMAIL,
          subject: `Website enquiry — ${safeRole}${inquiry ? ` (${safeInquiry})` : ''}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px;">
              <h1 style="color: #0B1F33;">New Website Enquiry</h1>
              <p style="color: #666; margin-bottom: 24px;">Request ID: ${escapeHtml(requestId)}</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Inquiry</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeInquiry}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeName}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Role</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeRole}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeEmail}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safePhone}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 10px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${safeMessage}</td></tr>
              </table>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Website contact email failed:', emailError)
      }
    } else {
      logRegisterIntakeFailure('contact_email_delivery_not_configured', {
        requestId,
        has_resend: Boolean(resend),
        has_ops_email: Boolean(OPS_EMAIL),
      })
    }

    return NextResponse.json({ ok: true, requestId })
  } catch (error) {
    logRegisterIntakeFailure('contact_unexpected_error', {
      requestId,
      clientIp,
      message: error instanceof Error ? error.message : 'unknown',
    })

    return NextResponse.json({ error: CONTACT_ERROR_MESSAGE }, { status: 500 })
  }
}
