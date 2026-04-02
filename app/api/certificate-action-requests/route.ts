import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      certificateRef,
      propertyId,
      registryId,
      requestType,
      requesterName,
      requesterEmail,
      requesterPhone,
      message,
    } = body ?? {}

    if (!certificateRef || !requestType || !requesterName || !requesterEmail) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    const allowedTypes = new Set([
      'submit_remediation',
      'request_reinspection',
      'upgrade_to_certified',
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
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to submit request.' },
      { status: 500 }
    )
  }
}