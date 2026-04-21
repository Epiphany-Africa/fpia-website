import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/server/adminSupabase'
import {
  checkRegisterRateLimit,
  detectRegisterSpam,
  getClientIp,
  logRegisterIntakeFailure,
} from '@/lib/server/registerIntakeProtection'
import { writeAdminEvent } from '@/lib/server/eventLog'

type PassportDocumentInput = {
  fieldName: string
  documentType: string
  issuedAt: string | null
  expiresAt: string | null
}

const MAX_DOCUMENT_COUNT = 20
const MAX_DOCUMENT_SIZE_BYTES = 15 * 1024 * 1024
const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
])

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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidDate(value: string | null) {
  if (!value) return true
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function safeFileName(value: string) {
  return value.replace(/[^\w.\-]+/g, '_').slice(0, 140)
}

function normalizeDocuments(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.trim()) return []

  try {
    const parsed = JSON.parse(value) as unknown

    if (!Array.isArray(parsed)) return null
    if (parsed.length > MAX_DOCUMENT_COUNT) return null

    const normalizedDocuments: PassportDocumentInput[] = []

    for (const item of parsed) {
      if (!item || typeof item !== 'object') return null

      const fieldName =
        typeof item.fieldName === 'string' ? item.fieldName.trim().slice(0, 80) : ''
      const documentType =
        typeof item.documentType === 'string'
          ? item.documentType.trim().slice(0, 120)
          : ''
      const issuedAt =
        typeof item.issuedAt === 'string' && item.issuedAt.trim()
          ? item.issuedAt.trim()
          : null
      const expiresAt =
        typeof item.expiresAt === 'string' && item.expiresAt.trim()
          ? item.expiresAt.trim()
          : null

      if (!fieldName || !documentType) return null

      normalizedDocuments.push({
        fieldName,
        documentType,
        issuedAt,
        expiresAt,
      })
    }

    return normalizedDocuments
  } catch {
    return null
  }
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
          error:
            'Too many Property Passport attempts. Please wait a few minutes and try again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      )
    }

    const ownerName = normalizeRequiredString(formData.get('owner_name'), 160)
    const ownerEmail = normalizeRequiredString(formData.get('owner_email'), 200)?.toLowerCase() ?? null
    const ownerPhone = normalizeOptionalString(formData.get('owner_phone'), 40)
    const propertyAddress = normalizeRequiredString(formData.get('property_address'), 240)
    const suburb = normalizeOptionalString(formData.get('suburb'), 120)
    const city = normalizeOptionalString(formData.get('city'), 120)
    const province = normalizeOptionalString(formData.get('province'), 120)
    const postalCode = normalizeOptionalString(formData.get('postal_code'), 24)
    const notes = normalizeOptionalString(formData.get('notes'), 3000)
    const documents = normalizeDocuments(formData.get('documents'))

    const spamReason = detectRegisterSpam({
      honeypot,
      fullName: ownerName,
      email: ownerEmail,
      propertyAddress,
      notes,
      agentName: null,
      contactName: null,
    })

    if (spamReason) {
      logRegisterIntakeFailure('property_passport_spam_rejected', {
        requestId,
        clientIp,
        reason: spamReason,
      })

      return NextResponse.json(
        {
          error:
            'We could not accept that Property Passport request. Please review your details and try again.',
        },
        { status: 400 }
      )
    }

    if (!ownerName || !ownerEmail || !propertyAddress) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (documents === null) {
      return NextResponse.json(
        { error: 'Please review the uploaded document details and try again.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(ownerEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    for (const document of documents) {
      if (!isValidDate(document.issuedAt) || !isValidDate(document.expiresAt)) {
        return NextResponse.json(
          { error: 'Please provide valid document dates.' },
          { status: 400 }
        )
      }
    }

    const supabase = createAdminSupabaseClient()

    const { data: profileRow, error: profileError } = await supabase
      .from('property_passport_profiles')
      .insert({
        owner_name: ownerName,
        owner_email: ownerEmail,
        owner_phone: ownerPhone,
        property_address: propertyAddress,
        suburb,
        city,
        province,
        postal_code: postalCode,
        passport_tier: 'free',
        profile_status: 'active',
        source_channel: 'website_property_passport',
        notes,
        metadata: {
          request_id: requestId,
          document_slots_submitted: documents.length,
          client_ip: clientIp,
        },
      })
      .select('id')
      .single()

    if (profileError || !profileRow?.id) {
      logRegisterIntakeFailure('property_passport_insert_failed', {
        requestId,
        clientIp,
        code: profileError?.code ?? null,
        message: profileError?.message ?? null,
      })

      return NextResponse.json(
        {
          error: 'We could not create the Property Passport right now. Please try again shortly.',
        },
        { status: 500 }
      )
    }

    const uploadedDocuments: Array<Record<string, unknown>> = []
    const failedDocuments: Array<{ documentType: string; reason: string }> = []

    for (const [index, document] of documents.entries()) {
      const fileEntry = formData.get(document.fieldName)

      if (!(fileEntry instanceof File) || fileEntry.size <= 0) {
        continue
      }

      if (fileEntry.size > MAX_DOCUMENT_SIZE_BYTES) {
        failedDocuments.push({
          documentType: document.documentType,
          reason: 'file_too_large',
        })
        continue
      }

      if (fileEntry.type && !ALLOWED_DOCUMENT_MIME_TYPES.has(fileEntry.type)) {
        failedDocuments.push({
          documentType: document.documentType,
          reason: 'unsupported_file_type',
        })
        continue
      }

      const fileArrayBuffer = await fileEntry.arrayBuffer()
      const fileExtension = fileEntry.name.includes('.')
        ? fileEntry.name.split('.').pop()?.toLowerCase()
        : 'bin'
      const storagePath = `${profileRow.id}/${Date.now()}_${index}_${safeFileName(fileEntry.name || `passport.${fileExtension}`)}`

      const { error: uploadError } = await supabase.storage
        .from('property-passport')
        .upload(storagePath, Buffer.from(fileArrayBuffer), {
          contentType: fileEntry.type || undefined,
          upsert: false,
        })

      if (uploadError) {
        logRegisterIntakeFailure('property_passport_upload_failed', {
          requestId,
          clientIp,
          message: uploadError.message,
          storagePath,
        })
        failedDocuments.push({
          documentType: document.documentType,
          reason: 'storage_upload_failed',
        })
        continue
      }

      const insertedDocument = {
        profile_id: profileRow.id,
        document_type: document.documentType.trim() || 'Other Property Record',
        verification_status: 'uploaded_unverified',
        file_name: fileEntry.name || 'property-document',
        file_path: storagePath,
        file_url: null,
        mime_type: fileEntry.type || null,
        size_bytes: fileEntry.size || null,
        issued_at: document.issuedAt ?? null,
        expires_at: document.expiresAt ?? null,
        source_channel: 'website_property_passport',
        metadata: {
          request_id: requestId,
          original_field_name: document.fieldName,
        },
      }

      const { error: documentError } = await supabase
        .from('property_passport_documents')
        .insert(insertedDocument)

      if (documentError) {
        logRegisterIntakeFailure('property_passport_document_insert_failed', {
          requestId,
          clientIp,
          message: documentError.message,
          storagePath,
        })
        failedDocuments.push({
          documentType: document.documentType,
          reason: 'document_insert_failed',
        })
        continue
      }

      uploadedDocuments.push({
        document_type: insertedDocument.document_type,
        file_name: insertedDocument.file_name,
        size_bytes: insertedDocument.size_bytes,
      })
    }

    try {
      await writeAdminEvent(supabase as never, {
        entityType: 'property_passport_profile',
        entityId: profileRow.id,
        eventType: 'property_passport_created',
        eventLabel: 'Property Passport created',
        sourceSystem: 'fpia-website',
        eventPayload: {
          owner_email: ownerEmail,
          property_address: propertyAddress,
          suburb,
          city,
          province,
          uploaded_document_count: uploadedDocuments.length,
        },
      })
    } catch (eventError) {
      console.error('Property Passport event log failed:', eventError)
    }

    return NextResponse.json({
      ok: true,
      profileId: profileRow.id,
      uploadedDocumentCount: uploadedDocuments.length,
      failedDocumentCount: failedDocuments.length,
    })
  } catch (error) {
    logRegisterIntakeFailure('property_passport_unexpected_error', {
      requestId,
      clientIp,
      message: error instanceof Error ? error.message : 'unknown',
    })

    return NextResponse.json(
      { error: 'We could not create the Property Passport right now. Please try again shortly.' },
      { status: 500 }
    )
  }
}
