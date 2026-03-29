import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      property_address,
      suburb,
      city,
      province,
      postal_code,
      requestor_role,
      requestor_name,
      requestor_email,
      requestor_phone,
      preferred_date,
      alt_date,
      notes,
    } = body

    // 1 — Create inspection request in Supabase
    const { data: inspectionRequest, error: insertError } = await supabase
      .from('inspection_requests')
      .insert({
        property_address,
        suburb,
        city,
        province,
        postal_code,
        requestor_role,
        requestor_name,
        requestor_email,
        requestor_phone,
        preferred_date,
        alt_date,
        notes,
        status: 'Pending',
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    const requestId = inspectionRequest.id

    // 2 — Find inspectors in this province
    const { data: inspectors } = await supabase
      .from('inspectors')
      .select('id, full_name, inspector_code, company_name')
      .eq('is_active', true)

    const inspectorList = inspectors ?? []

    // 3 — Send confirmation email to requestor
    await resend.emails.send({
      from: 'FPIA <inspections@fairproperties.org.za>',
      to: requestor_email,
      subject: 'Your FPIA Inspection Request Has Been Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1F33; color: #f7f3eb; padding: 40px;">
          <h1 style="color: #C9A14D; font-size: 28px; margin-bottom: 8px;">Inspection Request Received</h1>
          <p style="color: #a0aec0; margin-bottom: 32px;">Fair Properties Inspection Authorities</p>
          
          <p style="line-height: 1.8; margin-bottom: 24px;">Dear ${requestor_name},</p>
          
          <p style="line-height: 1.8; margin-bottom: 24px;">
            Your inspection request for <strong style="color: #C9A14D;">${property_address}</strong> has been successfully lodged with FPIA.
          </p>

          <div style="border: 1px solid rgba(201,161,77,0.3); padding: 24px; margin-bottom: 24px;">
            <p style="color: #C9A14D; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">Request Details</p>
            <p style="margin: 8px 0;"><strong>Reference:</strong> FPIA-REQ-${requestId.slice(0, 8).toUpperCase()}</p>
            <p style="margin: 8px 0;"><strong>Property:</strong> ${property_address}</p>
            <p style="margin: 8px 0;"><strong>Preferred Date:</strong> ${preferred_date}</p>
            ${alt_date ? `<p style="margin: 8px 0;"><strong>Alternative Date:</strong> ${alt_date}</p>` : ''}
          </div>

          <p style="line-height: 1.8; margin-bottom: 24px;">
            An FPIA inspector in your area will be assigned within <strong>48 hours</strong>. You will receive a confirmation with your inspection date and time once assigned.
          </p>

          <p style="line-height: 1.8; margin-bottom: 8px;">If you have any questions, please contact us:</p>
          <p style="margin: 4px 0; color: #C9A14D;">+27 74 273 7869</p>
          <p style="margin: 4px 0; color: #C9A14D;">info@fairproperties.org.za</p>

          <hr style="border: none; border-top: 1px solid rgba(201,161,77,0.2); margin: 32px 0;" />
          <p style="color: #a0aec0; font-size: 12px;">Fair Properties Inspection Authorities · Accountability Built In · fairproperties.org.za</p>
        </div>
      `,
    })

    // 4 — Send notification email to FPIA admin
    await resend.emails.send({
      from: 'FPIA System <onboarding@resend.dev>',
      to: 'stephen@epiphanyafrica.com',
      subject: `New Inspection Request — ${property_address}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h1 style="color: #0B1F33;">New Inspection Request</h1>
          <p style="color: #666; margin-bottom: 32px;">Reference: FPIA-REQ-${requestId.slice(0, 8).toUpperCase()}</p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 160px;">Property</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${property_address}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Province</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${province}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Requestor</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${requestor_name} (${requestor_role})</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${requestor_email}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${requestor_phone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Date</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${preferred_date}</td></tr>
            ${alt_date ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Alt Date</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${alt_date}</td></tr>` : ''}
            ${notes ? `<tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Notes</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${notes}</td></tr>` : ''}
            <tr><td style="padding: 10px; font-weight: bold;">Inspectors in DB</td><td style="padding: 10px;">${inspectorList.length} active</td></tr>
          </table>

          <div style="margin-top: 32px; padding: 16px; background: #f9f9f9; border-left: 4px solid #C9A14D;">
            <p style="margin: 0; font-size: 13px; color: #666;">Log in to the FPIA platform to assign an inspector and confirm the date.</p>
            <a href="https://fpia-mvp.vercel.app/login" style="display: inline-block; margin-top: 12px; background: #0B1F33; color: #fff; padding: 10px 20px; text-decoration: none; font-size: 13px;">Open FPIA Platform →</a>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true, requestId })

  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json({ error: err.message ?? 'Unexpected error' }, { status: 500 })
  }
}