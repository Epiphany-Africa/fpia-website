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
import { SELLER_READINESS_DISCLAIMER } from '@/lib/seller-readiness/disclaimers'

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const MAX_DAMAGE_ITEMS = 16
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const SELLER_READINESS_BUCKET = 'seller-readiness'
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const OPS_EMAIL = process.env.OPS_EMAIL ?? process.env.SUPPORT_EMAIL ?? null

type DamageItemInput = {
  fieldName: string
  damageCategory: string | null
  locationOnProperty: string | null
  sellerNotes: string | null
  uploadedFileName: string | null
}

function normalizeRequiredString(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > maxLength) return null
  return trimmed
}

function normalizeOptionalString(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, maxLength)
}

function normalizeOptionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function safeFileName(value: string) {
  return value.replace(/[^\w.\-]+/g, '_').slice(0, 140)
}

function parseDamageItems(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.trim()) return []

  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed) || parsed.length > MAX_DAMAGE_ITEMS) return null

    return parsed.map((entry) => {
      const item = (entry ?? {}) as Record<string, unknown>
      return {
        fieldName:
          typeof item.fieldName === 'string' ? item.fieldName.trim().slice(0, 80) : '',
        damageCategory:
          typeof item.damageCategory === 'string' ? item.damageCategory.trim().slice(0, 80) : null,
        locationOnProperty:
          typeof item.locationOnProperty === 'string'
            ? item.locationOnProperty.trim().slice(0, 160)
            : null,
        sellerNotes:
          typeof item.sellerNotes === 'string' ? item.sellerNotes.trim().slice(0, 3000) : null,
        uploadedFileName:
          typeof item.uploadedFileName === 'string'
            ? item.uploadedFileName.trim().slice(0, 200)
            : null,
      } satisfies DamageItemInput
    })
  } catch {
    return null
  }
}

async function ensureBucket(supabase: ReturnType<typeof createAdminSupabaseClient>) {
  const existingBucket = await supabase.storage.getBucket(SELLER_READINESS_BUCKET)
  if (existingBucket.data && !existingBucket.error) return true

  const createdBucket = await supabase.storage.createBucket(SELLER_READINESS_BUCKET, {
    public: true,
    fileSizeLimit: MAX_IMAGE_SIZE_BYTES,
    allowedMimeTypes: Array.from(ALLOWED_IMAGE_TYPES),
  })

  return !createdBucket.error || /already exists/i.test(createdBucket.error.message ?? '')
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  const clientIp = getClientIp(request.headers)

  try {
    const formData = await request.formData()
    const honeypot = normalizeOptionalString(formData.get('company_website'), 240)
    const rateLimit = checkRegisterRateLimit(clientIp)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many Seller Readiness attempts. Please wait a few minutes and try again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      )
    }

    const sellerName = normalizeRequiredString(formData.get('seller_name'), 160)
    const sellerEmail =
      normalizeRequiredString(formData.get('seller_email'), 200)?.toLowerCase() ?? null
    const sellerPhone = normalizeOptionalString(formData.get('seller_phone'), 40)
    const propertyAddress = normalizeRequiredString(formData.get('property_address'), 240)
    const suburb = normalizeOptionalString(formData.get('suburb'), 120)
    const city = normalizeOptionalString(formData.get('city'), 120)
    const province = normalizeOptionalString(formData.get('province'), 120)
    const postalCode = normalizeOptionalString(formData.get('postal_code'), 24)
    const propertyType = normalizeOptionalString(formData.get('property_type'), 120)
    const floorArea = normalizeOptionalNumber(formData.get('floor_area_m2'))
    const erfSize = normalizeOptionalNumber(formData.get('erf_size_m2'))
    const bedrooms = normalizeOptionalNumber(formData.get('bedrooms'))
    const bathrooms = normalizeOptionalNumber(formData.get('bathrooms'))
    const garages = normalizeOptionalNumber(formData.get('garages'))
    const finishTier = normalizeOptionalString(formData.get('finish_tier'), 20)
    const expectedAskingPrice = normalizeOptionalNumber(formData.get('expected_asking_price'))
    const sellingUrgency = normalizeOptionalString(formData.get('selling_urgency'), 40)
    const notes = normalizeOptionalString(formData.get('notes'), 4000)
    const damageItems = parseDamageItems(formData.get('damage_items'))

    const spamReason = detectRegisterSpam({
      honeypot,
      fullName: sellerName,
      email: sellerEmail,
      propertyAddress,
      notes,
      agentName: null,
      contactName: null,
    })

    if (spamReason) {
      logRegisterIntakeFailure('seller_readiness_spam_rejected', {
        requestId,
        clientIp,
        reason: spamReason,
      })

      return NextResponse.json(
        { error: 'We could not accept that submission. Please review your details and try again.' },
        { status: 400 }
      )
    }

    if (!sellerName || !sellerEmail || !propertyAddress) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!isValidEmail(sellerEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    if (damageItems === null) {
      return NextResponse.json(
        { error: 'Please review the visible damage items and try again.' },
        { status: 400 }
      )
    }

    const supabase = createAdminSupabaseClient()
    const bucketReady = await ensureBucket(supabase)

    const { data: assessmentRow, error: assessmentError } = await supabase
      .from('seller_readiness_assessments')
      .insert({
        seller_name: sellerName,
        seller_email: sellerEmail,
        seller_phone: sellerPhone,
        property_address: propertyAddress,
        suburb,
        city,
        province,
        postal_code: postalCode,
        property_type: propertyType,
        floor_area_m2: floorArea,
        erf_size_m2: erfSize,
        bedrooms,
        bathrooms,
        garages,
        finish_tier: finishTier,
        expected_asking_price: expectedAskingPrice,
        expected_price_currency: 'ZAR',
        selling_urgency: sellingUrgency,
        assessment_status: 'submitted',
        disclaimer: SELLER_READINESS_DISCLAIMER,
        notes,
      })
      .select('id')
      .single()

    if (assessmentError || !assessmentRow?.id) {
      logRegisterIntakeFailure('seller_readiness_insert_failed', {
        requestId,
        clientIp,
        message: assessmentError?.message ?? null,
      })

      return NextResponse.json(
        { error: 'We could not submit the Seller Readiness Assessment right now. Please try again shortly.' },
        { status: 500 }
      )
    }

    const uploadedDamageItems: Record<string, unknown>[] = []

    for (const [index, item] of damageItems.entries()) {
      const fileEntry = formData.get(item.fieldName)

      let imagePath: string | null = null
      let imageUrl: string | null = null

      if (fileEntry instanceof File && fileEntry.size > 0) {
        if (fileEntry.size > MAX_IMAGE_SIZE_BYTES) {
          return NextResponse.json(
            { error: 'Each image must be 10MB or smaller.' },
            { status: 400 }
          )
        }

        if (!ALLOWED_IMAGE_TYPES.has(fileEntry.type)) {
          return NextResponse.json(
            { error: 'Only JPEG, PNG, and WEBP images are supported.' },
            { status: 400 }
          )
        }

        if (bucketReady) {
          imagePath = `${assessmentRow.id}/${Date.now()}_${index}_${safeFileName(fileEntry.name || 'damage-image')}`
          const arrayBuffer = await fileEntry.arrayBuffer()
          const { error: uploadError } = await supabase.storage
            .from(SELLER_READINESS_BUCKET)
            .upload(imagePath, Buffer.from(arrayBuffer), {
              contentType: fileEntry.type || undefined,
              upsert: false,
            })

          if (!uploadError) {
            imageUrl = supabase.storage
              .from(SELLER_READINESS_BUCKET)
              .getPublicUrl(imagePath).data.publicUrl
          }
        }
      }

      const { error: itemError } = await supabase
        .from('seller_readiness_damage_items')
        .insert({
          assessment_id: assessmentRow.id,
          image_path: imagePath,
          image_url: imageUrl,
          uploaded_file_name: item.uploadedFileName,
          damage_category: item.damageCategory,
          location_on_property: item.locationOnProperty,
          seller_notes: item.sellerNotes,
          review_status: 'draft',
          confidence: 'low',
          specialist_required: false,
          limitation_disclaimer: bucketReady
            ? null
            : 'Image storage bucket was unavailable at intake. Authority review may require manual file follow-up.',
        })

      if (itemError) {
        return NextResponse.json(
          { error: itemError.message ?? 'Failed to save damage item.' },
          { status: 500 }
        )
      }

      uploadedDamageItems.push({
        damage_category: item.damageCategory,
        location_on_property: item.locationOnProperty,
        uploaded_file_name: item.uploadedFileName,
        image_path: imagePath,
        image_url: imageUrl,
      })
    }

    try {
      await writeAdminEvent(supabase as never, {
        entityType: 'seller_readiness_assessment',
        entityId: assessmentRow.id,
        eventType: 'seller_readiness_submitted',
        eventLabel: 'Seller readiness submitted',
        sourceSystem: 'fpia-website',
        eventPayload: {
          request_id: requestId,
          seller_name: sellerName,
          seller_email: sellerEmail,
          property_address: propertyAddress,
          suburb,
          city,
          province,
          expected_asking_price: expectedAskingPrice,
          selling_urgency: sellingUrgency,
          uploaded_damage_item_count: uploadedDamageItems.length,
        },
      })
    } catch (eventError) {
      console.error('Seller readiness event log failed:', eventError)
    }

    if (resend && OPS_EMAIL) {
      try {
        await resend.emails.send({
          from: 'FPIA Website <info@fairproperties.org.za>',
          to: OPS_EMAIL,
          subject: `Seller Readiness submitted — ${propertyAddress}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 32px;">
              <h1 style="color: #0B1F33;">Seller Readiness Submission</h1>
              <p style="color: #666;">Assessment ID: ${assessmentRow.id}</p>
              <p><strong>Seller:</strong> ${sellerName}</p>
              <p><strong>Email:</strong> ${sellerEmail}</p>
              <p><strong>Property:</strong> ${propertyAddress}</p>
              <p><strong>Location:</strong> ${[suburb, city, province, postalCode].filter(Boolean).join(', ')}</p>
              <p><strong>Expected Asking Price:</strong> ${expectedAskingPrice ?? 'Not provided'}</p>
              <p><strong>Selling Urgency:</strong> ${sellingUrgency ?? 'Not provided'}</p>
              <p><strong>Uploaded damage items:</strong> ${uploadedDamageItems.length}</p>
              <p><strong>Storage bucket ready:</strong> ${bucketReady ? 'Yes' : 'No'}</p>
              <p style="white-space: pre-wrap;"><strong>Notes:</strong> ${notes ?? 'None provided'}</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Seller readiness ops email failed:', emailError)
      }
    }

    return NextResponse.json({
      ok: true,
      assessmentId: assessmentRow.id,
      message:
        'Your Seller Readiness Assessment has been received. FPIA will review the submitted evidence and prepare the Pre-Listing Property Readiness Report.',
    })
  } catch (error) {
    logRegisterIntakeFailure('seller_readiness_unexpected_error', {
      requestId,
      clientIp,
      message: error instanceof Error ? error.message : 'unknown',
    })

    return NextResponse.json(
      { error: 'We could not submit the Seller Readiness Assessment right now. Please try again shortly.' },
      { status: 500 }
    )
  }
}
