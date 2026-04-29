import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminSupabaseClient } from '@/lib/server/adminSupabase'
import {
  checkRegisterRateLimit,
  getClientIp,
  logRegisterIntakeFailure,
} from '@/lib/server/registerIntakeProtection'
import { writeAdminEvent } from '@/lib/server/eventLog'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const INSPECTOR_APPLICATION_BUCKET = 'inspector-applications'
const CV_MIME_TYPES = new Set(['application/pdf'])
const PROOF_MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png'])

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const OPS_EMAIL = process.env.OPS_EMAIL ?? process.env.SUPPORT_EMAIL ?? null

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

function safeFileName(value: string) {
  return value.replace(/[^\w.\-]+/g, '_').slice(0, 140)
}

async function ensureBucket(
  supabase: ReturnType<typeof createAdminSupabaseClient>
) {
  const existingBucket = await supabase.storage.getBucket(INSPECTOR_APPLICATION_BUCKET)

  if (existingBucket.data && !existingBucket.error) {
    const updatedBucket = await supabase.storage.updateBucket(
      INSPECTOR_APPLICATION_BUCKET,
      {
        public: false,
        fileSizeLimit: MAX_FILE_SIZE_BYTES,
        allowedMimeTypes: Array.from(
          new Set([...CV_MIME_TYPES, ...PROOF_MIME_TYPES])
        ),
      }
    )

    return !updatedBucket.error
  }

  const createdBucket = await supabase.storage.createBucket(
    INSPECTOR_APPLICATION_BUCKET,
    {
      public: false,
      fileSizeLimit: MAX_FILE_SIZE_BYTES,
      allowedMimeTypes: Array.from(
        new Set([...CV_MIME_TYPES, ...PROOF_MIME_TYPES])
      ),
    }
  )

  return !createdBucket.error || /already exists/i.test(createdBucket.error.message ?? '')
}

async function uploadFile(input: {
  supabase: ReturnType<typeof createAdminSupabaseClient>
  applicationId: string
  folder: 'cv' | 'proof'
  file: File
}) {
  const { supabase, applicationId, folder, file } = input
  const filePath = `${applicationId}/${folder}/${Date.now()}_${safeFileName(
    file.name || folder
  )}`
  const arrayBuffer = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from(INSPECTOR_APPLICATION_BUCKET)
    .upload(filePath, Buffer.from(arrayBuffer), {
      contentType: file.type || undefined,
      upsert: false,
    })

  if (error) {
    throw new Error(error.message ?? `Failed to upload ${folder} file.`)
  }

  return filePath
}

async function updateStoredFilePaths(input: {
  supabase: ReturnType<typeof createAdminSupabaseClient>
  applicationId: string
  cvFilePath: string | null
  proofFilePath: string | null
}) {
  const { supabase, applicationId, cvFilePath, proofFilePath } = input

  const primaryUpdate = await supabase
    .from('inspector_applications')
    .update({
      cv_file_path: cvFilePath,
      proof_file_path: proofFilePath,
    })
    .eq('id', applicationId)

  if (!primaryUpdate.error) {
    return
  }

  if (
    /cv_file_path|proof_file_path/i.test(primaryUpdate.error.message ?? '')
  ) {
    const fallbackUpdate = await supabase
      .from('inspector_applications')
      .update({
        cv_url: cvFilePath,
        proof_url: proofFilePath,
      })
      .eq('id', applicationId)

    if (!fallbackUpdate.error) {
      return
    }

    throw new Error(
      fallbackUpdate.error.message ?? 'Failed to store uploaded file paths.'
    )
  }

  throw new Error(primaryUpdate.error.message ?? 'Failed to store uploaded file paths.')
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  const clientIp = getClientIp(request.headers)

  try {
    const rateLimit = checkRegisterRateLimit(clientIp)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            'Too many inspector application attempts. Please wait a few minutes and try again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      )
    }

    const formData = await request.formData()

    const firstName = normalizeRequiredString(formData.get('firstName'), 120)
    const lastName = normalizeRequiredString(formData.get('lastName'), 120)
    const email =
      normalizeRequiredString(formData.get('email'), 200)?.toLowerCase() ?? null
    const phone = normalizeRequiredString(formData.get('phone'), 40)
    const province = normalizeRequiredString(formData.get('province'), 120)
    const registrationBody = normalizeRequiredString(
      formData.get('registrationBody'),
      80
    )
    const registrationNumber = normalizeRequiredString(
      formData.get('registrationNumber'),
      120
    )
    const registrationStatus = normalizeRequiredString(
      formData.get('registrationStatus'),
      80
    )
    const qualification = normalizeRequiredString(
      formData.get('qualification'),
      240
    )
    const yearsExperience = normalizeRequiredString(
      formData.get('yearsExperience'),
      40
    )
    const discipline = normalizeRequiredString(formData.get('discipline'), 120)
    const propertyTypes = normalizeRequiredString(formData.get('propertyTypes'), 400)
    const currentlyInspecting = normalizeRequiredString(
      formData.get('currentlyInspecting'),
      40
    )
    const motivation = normalizeRequiredString(formData.get('motivation'), 3000)
    const referral = normalizeOptionalString(formData.get('referral'), 120)
    const declaration = normalizeOptionalString(formData.get('declaration'), 10)

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !province ||
      !registrationBody ||
      !registrationNumber ||
      !registrationStatus ||
      !qualification ||
      !yearsExperience ||
      !discipline ||
      !propertyTypes ||
      !currentlyInspecting ||
      !motivation
    ) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    if (declaration !== 'true') {
      return NextResponse.json(
        { error: 'Please confirm the declaration before submitting.' },
        { status: 400 }
      )
    }

    const cvFile = formData.get('cvFile')
    const proofFile = formData.get('proofFile')

    if (!(cvFile instanceof File) || cvFile.size <= 0) {
      return NextResponse.json({ error: 'CV is required.' }, { status: 400 })
    }

    if (cvFile.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'The CV file must be 5MB or smaller.' },
        { status: 400 }
      )
    }

    if (!CV_MIME_TYPES.has(cvFile.type)) {
      return NextResponse.json(
        { error: 'The CV must be uploaded as a PDF.' },
        { status: 400 }
      )
    }

    if (proofFile instanceof File && proofFile.size > 0) {
      if (proofFile.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: 'Proof of registration must be 5MB or smaller.' },
          { status: 400 }
        )
      }

      if (!PROOF_MIME_TYPES.has(proofFile.type)) {
        return NextResponse.json(
          {
            error:
              'Proof of registration must be uploaded as PDF, JPG, or PNG.',
          },
          { status: 400 }
        )
      }
    }

    const supabase = createAdminSupabaseClient()

    const { data: applicationRow, error: applicationError } = await supabase
      .from('inspector_applications')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        province,
        registration_body: registrationBody,
        registration_number: registrationNumber,
        registration_status: registrationStatus,
        qualification,
        years_experience: yearsExperience,
        discipline,
        property_types: propertyTypes,
        currently_inspecting: currentlyInspecting,
        motivation,
        referral,
        status: 'submitted',
      })
      .select('id')
      .single()

    if (applicationError || !applicationRow?.id) {
      throw new Error(
        applicationError?.message ?? 'Failed to create inspector application.'
      )
    }

    const applicationId = applicationRow.id
    let cvFilePath: string | null = null
    let proofFilePath: string | null = null

    const bucketReady = await ensureBucket(supabase)

    if (!bucketReady) {
      throw new Error('Document storage is unavailable right now. Please try again shortly.')
    }

    try {
      cvFilePath = await uploadFile({
        supabase,
        applicationId,
        folder: 'cv',
        file: cvFile,
      })

      if (proofFile instanceof File && proofFile.size > 0) {
        proofFilePath = await uploadFile({
          supabase,
          applicationId,
          folder: 'proof',
          file: proofFile,
        })
      }

      await updateStoredFilePaths({
        supabase,
        applicationId,
        cvFilePath,
        proofFilePath,
      })
    } catch (uploadError) {
      if (cvFilePath || proofFilePath) {
        await supabase.storage
          .from(INSPECTOR_APPLICATION_BUCKET)
          .remove([cvFilePath, proofFilePath].filter(Boolean) as string[])
      }

      await supabase.from('inspector_applications').delete().eq('id', applicationId)
      throw uploadError
    }

    try {
      await writeAdminEvent(supabase as never, {
        entityType: 'inspector_application',
        entityId: applicationId,
        eventType: 'inspector_application_submitted',
        eventLabel: 'Inspector application submitted',
        sourceSystem: 'fpia-website',
        eventPayload: {
          request_id: requestId,
          first_name: firstName,
          last_name: lastName,
          email,
          province,
          discipline,
          registration_body: registrationBody,
          registration_status: registrationStatus,
          cv_uploaded: Boolean(cvFilePath),
          proof_uploaded: Boolean(proofFilePath),
        },
      })
    } catch (eventError) {
      console.error('Inspector application event log failed:', eventError)
    }

    if (resend && OPS_EMAIL) {
      try {
        await resend.emails.send({
          from: 'FPIA Website <info@fairproperties.org.za>',
          to: OPS_EMAIL,
          subject: `Inspector application submitted — ${firstName} ${lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 32px;">
              <h1 style="color: #0B1F33;">Inspector Application Submitted</h1>
              <p style="color: #666;">Application ID: ${applicationId}</p>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Province:</strong> ${province}</p>
              <p><strong>Discipline:</strong> ${discipline}</p>
              <p><strong>Registration:</strong> ${registrationBody} / ${registrationNumber}</p>
              <p><strong>Registration status:</strong> ${registrationStatus}</p>
              <p><strong>Property types:</strong> ${propertyTypes}</p>
              <p><strong>Currently inspecting:</strong> ${currentlyInspecting}</p>
              <p><strong>Referral:</strong> ${referral ?? 'Not provided'}</p>
              <p><strong>CV uploaded:</strong> ${cvFilePath ? 'Yes' : 'No'}</p>
              <p><strong>Proof uploaded:</strong> ${proofFilePath ? 'Yes' : 'No'}</p>
              <p style="white-space: pre-wrap;"><strong>Motivation:</strong> ${motivation}</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Inspector application ops email failed:', emailError)
      }
    } else {
      logRegisterIntakeFailure('inspector_application_email_not_configured', {
        requestId,
        has_resend: Boolean(resend),
        has_ops_email: Boolean(OPS_EMAIL),
      })
    }

    return NextResponse.json({ ok: true, applicationId })
  } catch (error) {
    logRegisterIntakeFailure('inspector_application_unexpected_error', {
      requestId,
      clientIp,
      message: error instanceof Error ? error.message : 'unknown',
    })

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'We could not submit your application right now. Please try again shortly.',
      },
      { status: 500 }
    )
  }
}
