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
const PASSPORT_BUCKET = 'property-passport'
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const OPS_EMAIL = process.env.OPS_EMAIL ?? process.env.SUPPORT_EMAIL ?? null

type AdminSupabaseClient = ReturnType<typeof createAdminSupabaseClient>
type UploadedDocumentSummary = {
  document_type: string
  file_name: string
  size_bytes: number | null
  file_path: string
}
type FailedDocumentSummary = {
  documentType: string
  reason: string
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

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildPassportReference(profileId: string) {
  return `PP-${profileId.slice(0, 8).toUpperCase()}`
}

function isMissingTableError(error: { code?: string | null; message?: string | null } | null) {
  if (!error) return false
  return (
    error.code === 'PGRST205' ||
    /could not find the table/i.test(error.message ?? '')
  )
}

async function ensurePassportBucket(supabase: AdminSupabaseClient) {
  const existingBucket = await supabase.storage.getBucket(PASSPORT_BUCKET)

  if (existingBucket.data && !existingBucket.error) {
    return true
  }

  const message = existingBucket.error?.message?.toLowerCase() ?? ''
  const shouldAttemptCreate =
    !message ||
    message.includes('not found') ||
    message.includes('does not exist') ||
    message.includes('bucket')

  if (!shouldAttemptCreate) {
    console.error('Property Passport bucket lookup failed:', existingBucket.error)
    return false
  }

  const createdBucket = await supabase.storage.createBucket(PASSPORT_BUCKET, {
    public: false,
    fileSizeLimit: MAX_DOCUMENT_SIZE_BYTES,
    allowedMimeTypes: Array.from(ALLOWED_DOCUMENT_MIME_TYPES),
  })

  if (
    createdBucket.error &&
    !/already exists/i.test(createdBucket.error.message ?? '')
  ) {
    console.error('Property Passport bucket creation failed:', createdBucket.error)
    return false
  }

  return true
}

async function uploadPassportDocuments(input: {
  supabase: AdminSupabaseClient
  formData: FormData
  documents: PassportDocumentInput[]
  profileId: string
  persistDocumentRows: boolean
  requestId: string
  clientIp: string
}) {
  const {
    supabase,
    formData,
    documents,
    profileId,
    persistDocumentRows,
    requestId,
    clientIp,
  } = input
  const uploadedDocuments: UploadedDocumentSummary[] = []
  const failedDocuments: FailedDocumentSummary[] = []
  const bucketReady = await ensurePassportBucket(supabase)

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

    if (!bucketReady) {
      failedDocuments.push({
        documentType: document.documentType,
        reason: 'storage_bucket_unavailable',
      })
      continue
    }

    const fileArrayBuffer = await fileEntry.arrayBuffer()
    const fileExtension = fileEntry.name.includes('.')
      ? fileEntry.name.split('.').pop()?.toLowerCase()
      : 'bin'
    const storagePath = `${profileId}/${Date.now()}_${index}_${safeFileName(fileEntry.name || `passport.${fileExtension}`)}`

    const { error: uploadError } = await supabase.storage
      .from(PASSPORT_BUCKET)
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

    const uploadedDocument = {
      document_type: document.documentType.trim() || 'Other Property Record',
      file_name: fileEntry.name || 'property-document',
      size_bytes: fileEntry.size || null,
      file_path: storagePath,
    }

    if (persistDocumentRows) {
      const { error: documentError } = await supabase
        .from('property_passport_documents')
        .insert({
          profile_id: profileId,
          document_type: uploadedDocument.document_type,
          verification_status: 'uploaded_unverified',
          file_name: uploadedDocument.file_name,
          file_path: uploadedDocument.file_path,
          file_url: null,
          mime_type: fileEntry.type || null,
          size_bytes: uploadedDocument.size_bytes,
          issued_at: document.issuedAt ?? null,
          expires_at: document.expiresAt ?? null,
          source_channel: 'website_property_passport',
          metadata: {
            request_id: requestId,
            original_field_name: document.fieldName,
          },
        })

      if (documentError && !isMissingTableError(documentError)) {
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
    }

    uploadedDocuments.push(uploadedDocument)
  }

  return {
    uploadedDocuments,
    failedDocuments,
  }
}

async function notifyPassportOps(input: {
  requestId: string
  profileId: string
  persistedProfile: boolean
  ownerName: string
  ownerEmail: string
  ownerPhone: string | null
  propertyAddress: string
  suburb: string | null
  city: string | null
  province: string | null
  postalCode: string | null
  notes: string | null
  uploadedDocuments: UploadedDocumentSummary[]
  failedDocuments: FailedDocumentSummary[]
}) {
  if (!resend || !OPS_EMAIL) {
    return
  }

  const safe = {
    requestId: escapeHtml(input.requestId),
    reference: escapeHtml(buildPassportReference(input.profileId)),
    ownerName: escapeHtml(input.ownerName),
    ownerEmail: escapeHtml(input.ownerEmail),
    ownerPhone: escapeHtml(input.ownerPhone ?? 'Not provided'),
    propertyAddress: escapeHtml(input.propertyAddress),
    suburb: escapeHtml(input.suburb ?? 'Not provided'),
    city: escapeHtml(input.city ?? 'Not provided'),
    province: escapeHtml(input.province ?? 'Not provided'),
    postalCode: escapeHtml(input.postalCode ?? 'Not provided'),
    notes: escapeHtml(input.notes ?? 'None provided'),
    storageMode: input.persistedProfile ? 'Persisted profile' : 'Fallback capture',
  }

  const uploadedMarkup =
    input.uploadedDocuments.length > 0
      ? input.uploadedDocuments
          .map(
            (document) =>
              `<li><strong>${escapeHtml(document.document_type)}</strong> — ${escapeHtml(document.file_name)} (${document.size_bytes ?? 0} bytes)<br/><span style="color:#666;">${escapeHtml(document.file_path)}</span></li>`
          )
          .join('')
      : '<li>No files stored</li>'

  const failedMarkup =
    input.failedDocuments.length > 0
      ? input.failedDocuments
          .map(
            (document) =>
              `<li><strong>${escapeHtml(document.documentType)}</strong> — ${escapeHtml(document.reason)}</li>`
          )
          .join('')
      : '<li>No upload issues</li>'

  await resend.emails.send({
    from: 'FPIA Website <info@fairproperties.org.za>',
    to: OPS_EMAIL,
    subject: `Property Passport created — ${safe.reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 720px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #0B1F33;">Property Passport Submission</h1>
        <p style="color: #666;">Request ID: ${safe.requestId}</p>
        <p style="color: #666;">Reference: ${safe.reference}</p>
        <p style="color: #666;">Mode: ${safe.storageMode}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 160px;">Owner</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safe.ownerName}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safe.ownerEmail}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safe.ownerPhone}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Property</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safe.propertyAddress}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Area</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${safe.suburb}, ${safe.city}, ${safe.province}, ${safe.postalCode}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Notes</td><td style="padding: 10px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${safe.notes}</td></tr>
        </table>
        <h2 style="color: #0B1F33; margin-top: 28px;">Stored Documents</h2>
        <ul style="line-height: 1.7;">${uploadedMarkup}</ul>
        <h2 style="color: #0B1F33; margin-top: 28px;">Upload Issues</h2>
        <ul style="line-height: 1.7;">${failedMarkup}</ul>
      </div>
    `,
  })
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

    const persistedProfile = Boolean(profileRow?.id && !profileError)
    const fallbackProfileId = requestId.replace(/-/g, '')
    const profileId = profileRow?.id ?? fallbackProfileId

    if ((profileError || !profileRow?.id) && !isMissingTableError(profileError)) {
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

    const { uploadedDocuments, failedDocuments } = await uploadPassportDocuments({
      supabase,
      formData,
      documents,
      profileId,
      persistDocumentRows: persistedProfile,
      requestId,
      clientIp,
    })

    try {
      await writeAdminEvent(supabase as never, {
        entityType: 'property_passport_profile',
        entityId: profileId,
        eventType: 'property_passport_created',
        eventLabel: 'Property Passport created',
        sourceSystem: 'fpia-website',
        eventPayload: {
          request_id: requestId,
          request_reference: buildPassportReference(profileId),
          owner_email: ownerEmail,
          property_address: propertyAddress,
          suburb,
          city,
          province,
          uploaded_document_count: uploadedDocuments.length,
          failed_document_count: failedDocuments.length,
          persisted_profile: persistedProfile,
          uploaded_documents: uploadedDocuments,
          failed_documents: failedDocuments,
        },
      })
    } catch (eventError) {
      console.error('Property Passport event log failed:', eventError)
    }

    try {
      await notifyPassportOps({
        requestId,
        profileId,
        persistedProfile,
        ownerName,
        ownerEmail,
        ownerPhone,
        propertyAddress,
        suburb,
        city,
        province,
        postalCode,
        notes,
        uploadedDocuments,
        failedDocuments,
      })
    } catch (emailError) {
      console.error('Property Passport ops email failed:', emailError)
    }

    return NextResponse.json({
      ok: true,
      profileId,
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
