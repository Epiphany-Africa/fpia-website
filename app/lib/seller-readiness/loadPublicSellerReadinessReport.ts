import { createAdminSupabaseClient } from '@/lib/server/adminSupabase'

export type PublicSellerReadinessAssessment = {
  id: string
  property_address: string
  suburb: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  property_type: string | null
  floor_area_m2: number | null
  erf_size_m2: number | null
  bedrooms: number | null
  bathrooms: number | null
  garages: number | null
  finish_tier: string | null
  expected_asking_price: number | null
  expected_price_currency: string
  selling_urgency: string | null
  assessment_status: string
  readiness_score: number | null
  buyer_negotiation_risk: string | null
  disclosure_risk_level: string | null
  visible_damage_estimate_min: number | null
  visible_damage_estimate_max: number | null
  reinstatement_estimate_amount: number | null
  reinstatement_estimate_currency: string | null
  reinstatement_estimate_basis_summary: string | null
  reinstatement_estimate_model_version: string | null
  pricing_guidance_summary: string | null
  recommended_listing_posture: string | null
  disclaimer: string
  report_reference: string | null
  report_generated_at: string | null
}

export type PublicSellerReadinessDamageItem = {
  id: string
  damage_category: string | null
  building_element: string | null
  location_on_property: string | null
  image_url: string | null
  uploaded_file_name: string | null
  visible_condition: string | null
  severity: string | null
  confidence: string | null
  specialist_required: boolean
  recommended_specialist: string | null
  estimated_cost_min: number | null
  estimated_cost_max: number | null
  cost_basis: string | null
  review_status: string
}

export type PublicSellerReadinessDocument = {
  id: string
  document_type: string
  document_status: string | null
  file_path: string | null
  file_name: string | null
  mime_type: string | null
  uploaded_at: string | null
  notes: string | null
  file_url: string | null
}

function normalizeString(value: unknown) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function toAssessment(row: Record<string, unknown>): PublicSellerReadinessAssessment {
  return {
    id: String(row.id),
    property_address: normalizeString(row.property_address) ?? 'Unknown property',
    suburb: normalizeString(row.suburb),
    city: normalizeString(row.city),
    province: normalizeString(row.province),
    postal_code: normalizeString(row.postal_code),
    property_type: normalizeString(row.property_type),
    floor_area_m2: normalizeNumber(row.floor_area_m2),
    erf_size_m2: normalizeNumber(row.erf_size_m2),
    bedrooms: normalizeNumber(row.bedrooms),
    bathrooms: normalizeNumber(row.bathrooms),
    garages: normalizeNumber(row.garages),
    finish_tier: normalizeString(row.finish_tier),
    expected_asking_price: normalizeNumber(row.expected_asking_price),
    expected_price_currency: normalizeString(row.expected_price_currency) ?? 'ZAR',
    selling_urgency: normalizeString(row.selling_urgency),
    assessment_status: normalizeString(row.assessment_status) ?? 'draft',
    readiness_score: normalizeNumber(row.readiness_score),
    buyer_negotiation_risk: normalizeString(row.buyer_negotiation_risk),
    disclosure_risk_level: normalizeString(row.disclosure_risk_level),
    visible_damage_estimate_min: normalizeNumber(row.visible_damage_estimate_min),
    visible_damage_estimate_max: normalizeNumber(row.visible_damage_estimate_max),
    reinstatement_estimate_amount: normalizeNumber(row.reinstatement_estimate_amount),
    reinstatement_estimate_currency: normalizeString(row.reinstatement_estimate_currency),
    reinstatement_estimate_basis_summary: normalizeString(row.reinstatement_estimate_basis_summary),
    reinstatement_estimate_model_version: normalizeString(row.reinstatement_estimate_model_version),
    pricing_guidance_summary: normalizeString(row.pricing_guidance_summary),
    recommended_listing_posture: normalizeString(row.recommended_listing_posture),
    disclaimer:
      normalizeString(row.disclaimer) ??
      'Indicative seller-readiness guidance only.',
    report_reference: normalizeString(row.report_reference),
    report_generated_at: normalizeString(row.report_generated_at),
  }
}

function toDamageItem(row: Record<string, unknown>): PublicSellerReadinessDamageItem {
  return {
    id: String(row.id),
    damage_category: normalizeString(row.damage_category),
    building_element: normalizeString(row.building_element),
    location_on_property: normalizeString(row.location_on_property),
    image_url: normalizeString(row.image_url),
    uploaded_file_name: normalizeString(row.uploaded_file_name),
    visible_condition: normalizeString(row.visible_condition),
    severity: normalizeString(row.severity),
    confidence: normalizeString(row.confidence),
    specialist_required: Boolean(row.specialist_required),
    recommended_specialist: normalizeString(row.recommended_specialist),
    estimated_cost_min: normalizeNumber(row.estimated_cost_min),
    estimated_cost_max: normalizeNumber(row.estimated_cost_max),
    cost_basis: normalizeString(row.cost_basis),
    review_status: normalizeString(row.review_status) ?? 'draft',
  }
}

function toDocument(
  row: Record<string, unknown>,
  supabase: ReturnType<typeof createAdminSupabaseClient>
): PublicSellerReadinessDocument {
  const filePath = normalizeString(row.file_path)

  return {
    id: String(row.id),
    document_type: normalizeString(row.document_type) ?? 'other',
    document_status: normalizeString(row.document_status),
    file_path: filePath,
    file_name: normalizeString(row.file_name),
    mime_type: normalizeString(row.mime_type),
    uploaded_at: normalizeString(row.uploaded_at),
    notes: normalizeString(row.notes),
    file_url: filePath
      ? supabase.storage.from('seller-readiness').getPublicUrl(filePath).data.publicUrl
      : null,
  }
}

export async function loadPublicSellerReadinessReport(reference: string) {
  const supabase = createAdminSupabaseClient()
  const normalizedReference = reference.trim().toUpperCase()

  const { data: assessmentRow } = await supabase
    .from('seller_readiness_assessments')
    .select('*')
    .eq('report_reference', normalizedReference)
    .eq('assessment_status', 'report_ready')
    .maybeSingle()

  if (!assessmentRow) {
    return null
  }

  const assessment = toAssessment(assessmentRow as Record<string, unknown>)

  const { data: damageRows } = await supabase
    .from('seller_readiness_damage_items')
    .select('*')
    .eq('assessment_id', assessment.id)
    .in('review_status', ['accepted', 'amended'])
    .order('created_at', { ascending: true })

  const damageItems = ((damageRows ?? []) as Record<string, unknown>[]).map(toDamageItem)

  const { data: documentRows } = await supabase
    .from('seller_readiness_documents')
    .select('*')
    .eq('assessment_id', assessment.id)
    .order('created_at', { ascending: true })

  const documents = ((documentRows ?? []) as Record<string, unknown>[]).map((row) =>
    toDocument(row, supabase)
  )

  return {
    assessment,
    damageItems,
    documents,
  }
}
