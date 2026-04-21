import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { allocateInspectionRequest } from '@/lib/requests/allocateInspectionRequest'
import type { SupabaseLike } from '@/lib/requests/allocateInspectionRequest'
import {
  checkRegisterRateLimit,
  detectRegisterSpam,
  getClientIp,
  logRegisterIntakeFailure,
} from '@/lib/server/registerIntakeProtection'
import { writeAdminEvent, writeAssignmentLog } from '@/lib/server/eventLog'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)
const OPS_EMAIL = process.env.OPS_EMAIL ?? process.env.SUPPORT_EMAIL ?? null
const REQUEST_ERROR_MESSAGE =
  'We could not submit your inspection request right now. Please try again shortly.'

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

function isValidDate(value: string | null) {
  if (!value) return true
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error'
}

function formatDistance(distanceKm: number | null) {
  if (distanceKm === null || !Number.isFinite(distanceKm)) return 'distance unavailable'
  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`
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
          error: 'Too many inspection requests. Please wait a few minutes and try again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      )
    }

    const propertyAddress = normalizeRequiredString(body?.property_address, 240)
    const suburb = normalizeOptionalString(body?.suburb, 120)
    const city = normalizeOptionalString(body?.city, 120)
    const province = normalizeOptionalString(body?.province, 120)
    const postalCode = normalizeOptionalString(body?.postal_code, 20)
    const requestorRole = normalizeRequiredString(body?.requestor_role, 80)
    const requestorName = normalizeRequiredString(body?.requestor_name, 120)
    const requestorEmail = normalizeRequiredString(body?.requestor_email, 200)?.toLowerCase()
    const requestorPhone = normalizeRequiredString(body?.requestor_phone, 40)
    const preferredDate = normalizeRequiredString(body?.preferred_date, 10)
    const altDate = normalizeOptionalString(body?.alt_date, 10)
    const notes = normalizeOptionalString(body?.notes, 2000)
    const spamReason = detectRegisterSpam({
      honeypot,
      fullName: requestorName,
      email: requestorEmail ?? null,
      propertyAddress,
      notes,
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
        {
          error:
            'We could not accept that inspection request. Please review your details and try again.',
        },
        { status: 400 }
      )
    }

    if (
      !propertyAddress ||
      !requestorRole ||
      !requestorName ||
      !requestorEmail ||
      !requestorPhone ||
      !preferredDate
    ) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!isValidEmail(requestorEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    if (!isValidDate(preferredDate) || !isValidDate(altDate)) {
      return NextResponse.json({ error: 'Please provide valid inspection dates.' }, { status: 400 })
    }

    const { data: inspectionRequest, error: insertError } = await supabase
      .from('inspection_requests')
      .insert({
        property_address: propertyAddress,
        suburb,
        city,
        province,
        postal_code: postalCode,
        requestor_role: requestorRole,
        requestor_name: requestorName,
        requestor_email: requestorEmail,
        requestor_phone: requestorPhone,
        preferred_date: preferredDate,
        alt_date: altDate,
        notes,
        status: 'Pending',
      })
      .select('id')
      .single()

    if (insertError || !inspectionRequest?.id) {
      logRegisterIntakeFailure('insert_failed', {
        requestId,
        clientIp,
        code: insertError?.code ?? null,
        message: insertError?.message ?? null,
      })

      return NextResponse.json({ error: REQUEST_ERROR_MESSAGE }, { status: 500 })
    }

    const inspectionRequestId = inspectionRequest.id

    try {
      await writeAdminEvent(supabase as never, {
        entityType: 'inspection_request',
        entityId: inspectionRequestId,
        eventType: 'inspection_request_submitted',
        eventLabel: 'Inspection request submitted',
        sourceSystem: 'fpia-website',
        eventPayload: {
          property_address: propertyAddress,
          suburb,
          city,
          province,
          requestor_role: requestorRole,
          preferred_date: preferredDate,
        },
      })
    } catch (eventError) {
      console.error('Inspection request event log failed:', eventError)
    }

    const allocation = await allocateInspectionRequest({
      supabase: supabase as unknown as SupabaseLike,
      propertyAddress,
      suburb,
      city,
      province,
      postalCode,
    })

    let assignedInspectorPhone = allocation.assignedInspector?.phone ?? null

    if (!assignedInspectorPhone && allocation.assignedInspector?.auth_user_id) {
      const { data: profileRow } = await supabase
        .from('user_profiles')
        .select('phone')
        .eq('id', allocation.assignedInspector.auth_user_id)
        .maybeSingle()

      assignedInspectorPhone =
        typeof profileRow?.phone === 'string' && profileRow.phone.trim().length > 0
          ? profileRow.phone.trim()
          : null
    }

    try {
      await supabase
        .from('inspection_requests')
        .update({
          assigned_inspector_id: allocation.assignedInspector?.id ?? null,
          assigned_inspector_name: allocation.assignedInspector?.full_name ?? null,
          assigned_inspector_code: allocation.assignedInspector?.inspector_code ?? null,
          assigned_inspector_phone: assignedInspectorPhone,
          allocation_status: allocation.allocationStatus,
          assignment_distance_km: allocation.assignedInspector?.distanceKm ?? null,
          assignment_expires_at: allocation.assignmentExpiresAt,
          lookup_latitude: allocation.lookupCoordinates?.latitude ?? null,
          lookup_longitude: allocation.lookupCoordinates?.longitude ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', inspectionRequestId)
    } catch (allocationPersistenceError) {
      console.error('Allocation persistence failed:', allocationPersistenceError)
    }

    try {
      if (allocation.invitedInspectors.length > 0) {
        for (const [index, invitedInspector] of allocation.invitedInspectors.entries()) {
          await writeAssignmentLog(supabase as never, {
            inspectionRequestId,
            inspectorId: invitedInspector.id,
            assignmentStatus: 'awaiting_inspector_acceptance',
            distanceKm: invitedInspector.distanceKm ?? null,
            rankPosition: index + 1,
            expiresAt: allocation.assignmentExpiresAt,
            metadata: {
              dispatch_stage: allocation.dispatchStage,
              within_radius: invitedInspector.withinRadius,
              inspector_count: allocation.inspectorCount,
              lookup_latitude: allocation.lookupCoordinates?.latitude ?? null,
              lookup_longitude: allocation.lookupCoordinates?.longitude ?? null,
              next_wave_available: allocation.nextWaveAvailable,
            },
          })
        }
      } else {
        await writeAssignmentLog(supabase as never, {
          inspectionRequestId,
          inspectorId: null,
          assignmentStatus: allocation.allocationStatus,
          distanceKm: null,
          rankPosition: null,
          expiresAt: null,
          metadata: {
            dispatch_stage: allocation.dispatchStage,
            inspector_count: allocation.inspectorCount,
            lookup_latitude: allocation.lookupCoordinates?.latitude ?? null,
            lookup_longitude: allocation.lookupCoordinates?.longitude ?? null,
          },
        })
      }

      await writeAdminEvent(supabase as never, {
        entityType: 'inspection_request',
        entityId: inspectionRequestId,
        eventType: 'inspection_request_allocated',
        eventLabel: 'Inspection request allocated',
        sourceSystem: 'fpia-website',
        eventPayload: {
          allocation_status: allocation.allocationStatus,
          assigned_inspector_id: allocation.assignedInspector?.id ?? null,
          assigned_inspector_code: allocation.assignedInspector?.inspector_code ?? null,
          distance_km: allocation.assignedInspector?.distanceKm ?? null,
          inspector_count: allocation.inspectorCount,
          invited_inspector_count: allocation.invitedInspectors.length,
          dispatch_stage: allocation.dispatchStage,
          next_wave_available: allocation.nextWaveAvailable,
        },
      })
    } catch (eventError) {
      console.error('Inspection allocation event log failed:', eventError)
    }

    const safeRequestorName = escapeHtml(requestorName)
    const safePropertyAddress = escapeHtml(propertyAddress)
    const safePreferredDate = escapeHtml(preferredDate)
    const safeAltDate = altDate ? escapeHtml(altDate) : null
    const safeProvince = province ? escapeHtml(province) : 'Not provided'
    const safeRequestorRole = escapeHtml(requestorRole)
    const safeRequestorEmail = escapeHtml(requestorEmail)
    const safeRequestorPhone = escapeHtml(requestorPhone)
    const safeNotes = notes ? escapeHtml(notes) : null
    const safeAssignedInspectorName = allocation.assignedInspector
      ? escapeHtml(allocation.assignedInspector.full_name)
      : null
    const safeAssignedInspectorCode = allocation.assignedInspector?.inspector_code
      ? escapeHtml(allocation.assignedInspector.inspector_code)
      : null
    const safeDistance = allocation.assignedInspector
      ? escapeHtml(formatDistance(allocation.assignedInspector.distanceKm))
      : null
    const assignmentDeadline = allocation.assignmentExpiresAt
      ? new Intl.DateTimeFormat('en-ZA', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(allocation.assignmentExpiresAt))
      : null

    const emailPayloads = [
      resend.emails.send({
        from: 'FPIA <inspections@fairproperties.org.za>',
        to: requestorEmail,
        subject: 'Your FPIA Inspection Request Has Been Received',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1F33; color: #f7f3eb; padding: 40px;">
            <h1 style="color: #C9A14D; font-size: 28px; margin-bottom: 8px;">Inspection Request Received</h1>
            <p style="color: #a0aec0; margin-bottom: 32px;">Fair Properties Inspection Authority</p>
            
            <p style="line-height: 1.8; margin-bottom: 24px;">Dear ${safeRequestorName},</p>
            
            <p style="line-height: 1.8; margin-bottom: 24px;">
              Your inspection request for <strong style="color: #C9A14D;">${safePropertyAddress}</strong> has been successfully lodged with FPIA.
            </p>

            <div style="border: 1px solid rgba(201,161,77,0.3); padding: 24px; margin-bottom: 24px;">
              <p style="color: #C9A14D; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">Request Details</p>
              <p style="margin: 8px 0;"><strong>Reference:</strong> FPIA-REQ-${inspectionRequestId.slice(0, 8).toUpperCase()}</p>
              <p style="margin: 8px 0;"><strong>Property:</strong> ${safePropertyAddress}</p>
              <p style="margin: 8px 0;"><strong>Preferred Date:</strong> ${safePreferredDate}</p>
              ${safeAltDate ? `<p style="margin: 8px 0;"><strong>Alternative Date:</strong> ${safeAltDate}</p>` : ''}
            </div>

            <p style="line-height: 1.8; margin-bottom: 24px;">
              ${
                allocation.invitedInspectors.length > 1
                  ? `A local panel of <strong style="color: #C9A14D;">${allocation.invitedInspectors.length} authorised inspectors</strong> has been invited to accept this request. The first inspector to confirm will secure the booking.`
                  : allocation.assignedInspector
                  ? `Your nearest authorised active inspector, <strong style="color: #C9A14D;">${safeAssignedInspectorName}</strong>, has been invited to accept this request.`
                  : 'Your request has been logged for backend allocation. Local inspectors will be invited first, and the wider active panel will be used if no nearby inspector accepts.'
              }
            </p>

            ${
              allocation.assignedInspector
                ? `
            <div style="border: 1px solid rgba(201,161,77,0.3); padding: 24px; margin-bottom: 24px;">
              <p style="color: #C9A14D; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">Dispatch Status</p>
              <p style="margin: 8px 0;"><strong>Lead Inspector:</strong> ${safeAssignedInspectorName}</p>
              ${safeAssignedInspectorCode ? `<p style="margin: 8px 0;"><strong>Inspector ID:</strong> ${safeAssignedInspectorCode}</p>` : ''}
              ${safeDistance ? `<p style="margin: 8px 0;"><strong>Distance:</strong> ${safeDistance}</p>` : ''}
              <p style="margin: 8px 0;"><strong>Invited Inspectors:</strong> ${allocation.invitedInspectors.length}</p>
              ${assignmentDeadline ? `<p style="margin: 8px 0;"><strong>Acceptance Deadline:</strong> ${escapeHtml(assignmentDeadline)}</p>` : ''}
            </div>`
                : ''
            }

            <p style="line-height: 1.8; margin-bottom: 8px;">If you have any questions, please contact us:</p>
            <p style="margin: 4px 0; color: #C9A14D;">+27 74 273 7869</p>
            <p style="margin: 4px 0; color: #C9A14D;">info@fairproperties.org.za</p>

            <hr style="border: none; border-top: 1px solid rgba(201,161,77,0.2); margin: 32px 0;" />
            <p style="color: #a0aec0; font-size: 12px;">Fair Properties Inspection Authority · Accountability Built In · fairproperties.org.za</p>
          </div>
        `,
      }),
    ]

    if (OPS_EMAIL) {
      emailPayloads.push(
        resend.emails.send({
          from: 'FPIA System <onboarding@resend.dev>',
          to: OPS_EMAIL,
          subject: `New Inspection Request — ${safePropertyAddress}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
              <h1 style="color: #0B1F33;">New Inspection Request</h1>
              <p style="color: #666; margin-bottom: 32px;">Reference: FPIA-REQ-${inspectionRequestId.slice(0, 8).toUpperCase()}</p>

              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 160px;">Property</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safePropertyAddress}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Province</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeProvince}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Requestor</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeRequestorName} (${safeRequestorRole})</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeRequestorEmail}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeRequestorPhone}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Date</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safePreferredDate}</td></tr>
                ${safeAltDate ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Alt Date</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeAltDate}</td></tr>` : ''}
                ${safeNotes ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Notes</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeNotes}</td></tr>` : ''}
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Allocation Status</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(allocation.allocationStatus)}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Dispatch Stage</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(allocation.dispatchStage)}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Invited Inspectors</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${allocation.invitedInspectors.length}</td></tr>
                ${
                  safeAssignedInspectorName
                    ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Assigned Inspector</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeAssignedInspectorName}${safeAssignedInspectorCode ? ` (${safeAssignedInspectorCode})` : ''}</td></tr>`
                    : ''
                }
                ${safeDistance ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Distance</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safeDistance}</td></tr>` : ''}
                ${assignmentDeadline ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Acceptance Deadline</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(assignmentDeadline)}</td></tr>` : ''}
              </table>

              <div style="margin-top: 32px; padding: 16px; background: #f9f9f9; border-left: 4px solid #C9A14D;">
                <p style="margin: 0; font-size: 13px; color: #666;">Log in to the FPIA platform to review the dispatch state, confirm the booking, or manually reassign if required.</p>
                <a href="https://admin.fairproperties.org.za/login" style="display: inline-block; margin-top: 12px; background: #0B1F33; color: #fff; padding: 10px 20px; text-decoration: none; font-size: 13px;">Open FPIA Platform →</a>
              </div>
            </div>
          `,
        })
      )
    } else {
      logRegisterIntakeFailure('ops_email_missing', {
        requestId,
      })
    }

    if (allocation.invitedInspectors.length > 0) {
      for (const invitedInspector of allocation.invitedInspectors) {
        let invitedInspectorEmail: string | null = null

        if (invitedInspector.auth_user_id) {
          try {
            const { data: authUser } = await supabase.auth.admin.getUserById(invitedInspector.auth_user_id)
            invitedInspectorEmail = authUser.user?.email ?? null
          } catch (authLookupError) {
            console.error('Invited inspector email lookup failed:', authLookupError)
          }
        }

        if (!invitedInspectorEmail) {
          continue
        }

        emailPayloads.push(
          resend.emails.send({
            from: 'FPIA Dispatch <inspections@fairproperties.org.za>',
            to: invitedInspectorEmail,
            subject: `Inspection Dispatch Awaiting Acceptance — ${safePropertyAddress}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1F33; color: #f7f3eb; padding: 40px;">
              <h1 style="color: #C9A14D; font-size: 28px; margin-bottom: 8px;">Inspection Dispatch Awaiting Acceptance</h1>
              <p style="color: #a0aec0; margin-bottom: 32px;">Fair Properties Inspection Authority</p>

              <p style="line-height: 1.8; margin-bottom: 24px;">
                A property inspection request has been routed to you as part of the active ${escapeHtml(allocation.dispatchStage.replaceAll('_', ' '))} dispatch panel.
              </p>

              <div style="border: 1px solid rgba(201,161,77,0.3); padding: 24px; margin-bottom: 24px;">
                <p style="color: #C9A14D; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">Dispatch Details</p>
                <p style="margin: 8px 0;"><strong>Reference:</strong> FPIA-REQ-${inspectionRequestId.slice(0, 8).toUpperCase()}</p>
                <p style="margin: 8px 0;"><strong>Property:</strong> ${safePropertyAddress}</p>
                <p style="margin: 8px 0;"><strong>Requested Date:</strong> ${safePreferredDate}</p>
                ${safeAltDate ? `<p style="margin: 8px 0;"><strong>Alternative Date:</strong> ${safeAltDate}</p>` : ''}
                ${
                  invitedInspector.distanceKm !== null
                    ? `<p style="margin: 8px 0;"><strong>Distance:</strong> ${escapeHtml(formatDistance(invitedInspector.distanceKm))}</p>`
                    : ''
                }
                ${assignmentDeadline ? `<p style="margin: 8px 0;"><strong>Acceptance Deadline:</strong> ${escapeHtml(assignmentDeadline)}</p>` : ''}
              </div>

              <p style="line-height: 1.8; margin-bottom: 24px;">
                Accept the request inside the current dispatch window. The first invited inspector to confirm secures the booking, after which the rest of the panel is closed.
              </p>
            </div>
          `,
          })
        )
      }
    }

    const emailResults = await Promise.allSettled(emailPayloads)

    for (const result of emailResults) {
      if (result.status === 'rejected') {
        console.error('Email delivery failed:', result.reason)
      }
    }

    return NextResponse.json({
      ok: true,
      requestId: inspectionRequestId,
      allocationStatus: allocation.allocationStatus,
      assignedInspectorId: allocation.assignedInspector?.id ?? null,
    })
  } catch (error: unknown) {
    logRegisterIntakeFailure('unexpected_error', {
      requestId,
      clientIp,
      message: getErrorMessage(error),
    })

    return NextResponse.json({ error: REQUEST_ERROR_MESSAGE }, { status: 500 })
  }
}
