import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/server/adminSupabase'

function getRequiredStringValue(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function getOptionalStringValue(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const supabase = createAdminSupabaseClient()

    const application = {
      first_name: getRequiredStringValue(data.get('firstName')),
      last_name: getRequiredStringValue(data.get('lastName')),
      email: getRequiredStringValue(data.get('email'))?.toLowerCase() ?? null,
      phone: getRequiredStringValue(data.get('phone')),
      province: getRequiredStringValue(data.get('province')),
      registration_body: getRequiredStringValue(data.get('registrationBody')),
      registration_number: getRequiredStringValue(data.get('registrationNumber')),
      registration_status: getRequiredStringValue(data.get('registrationStatus')),
      qualification: getRequiredStringValue(data.get('qualification')),
      years_experience: getRequiredStringValue(data.get('yearsExperience')),
      discipline: getRequiredStringValue(data.get('discipline')),
      property_types: getRequiredStringValue(data.get('propertyTypes')),
      currently_inspecting: getRequiredStringValue(data.get('currentlyInspecting')),
      motivation: getRequiredStringValue(data.get('motivation')),
      referral: getOptionalStringValue(data.get('referral')),
      status: 'pending',
    }

    const requiredValues = [
      application.first_name,
      application.last_name,
      application.email,
      application.phone,
      application.province,
      application.registration_body,
      application.registration_number,
      application.registration_status,
      application.qualification,
      application.years_experience,
      application.discipline,
      application.property_types,
      application.currently_inspecting,
      application.motivation,
    ]

    if (requiredValues.some((value) => !value)) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 })
    }

    if (getOptionalStringValue(data.get('declaration')) !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Declaration is required.' },
        { status: 400 }
      )
    }

    // TODO: Wire cvFile and proofFile uploads to Supabase storage.
    // const cvFile = data.get('cvFile') as File | null
    // const proofFile = data.get('proofFile') as File | null

    const { error } = await supabase.from('inspector_applications').insert(application)

    if (error) {
      console.error('Inspector application insert error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inspector application error:', error)
    return NextResponse.json({ success: false, error: 'Unexpected error.' }, { status: 500 })
  }
}
