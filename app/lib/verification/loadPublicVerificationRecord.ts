import { createAdminSupabaseClient } from '@/lib/server/adminSupabase'
import { getDemoVerificationRecord } from '@/lib/demo/demoVerificationRecord'

const supabase = createAdminSupabaseClient()

export type RegistryRow = {
  id: string
  property_id: string
  inspector_id: string | null
  report_code: string
  property_code: string | null
  issued_at: string | null
  status: string | null
  is_locked: boolean | null
  report_hash: string | null
  locked_at: string | null
  workflow_status: string | null
  lock_status?: string | null
  inspector_signed_off_by?: string | null
  inspector_signed_off_at?: string | null
  reviewed_by?: string | null
  reviewed_at: string | null
  certified_by?: string | null
  certified_at: string | null
  final_hash: string | null
  review_outcome: string | null
  review_notes?: string | null
  submitted_for_review_at: string | null
  certificate_number: string | null
}

export type PropertyRow = {
  id: string
  title?: string | null
  address: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  status?: string | null
  transaction_stage?: string | null
  property_type?: string | null
  notes?: string | null
  risk_score?: number | null
  created_at?: string | null
  unit_number?: string | null
  complex_name?: string | null
  estate_name?: string | null
  building_name?: string | null
}

export type CertificateSnapshot = {
  checklist?: unknown
  inspector?: {
    inspector_name?: string | null
  } | null
} | null

export type CertificateRow = {
  id: string
  case_id: string
  issued_by: string | null
  issued_by_user_id?: string | null
  issued_by_role?: string | null
  authority_registry_id?: string | null
  issued_at: string | null
  certificate_type: string | null
  inspection_status: string | null
  verification_ref: string | null
  recommendation: string | null
  snapshot: CertificateSnapshot
  certificate_state: string | null
  revoked_at: string | null
  revoked_reason: string | null
  inspector_name: string | null
  inspector_id?: string | null
  inspector_title?: string | null
  signature_name?: string | null
  integrity_hash: string | null
  hash_version?: string | null
  signature_image_url?: string | null
  stamp_image_url?: string | null
  certificate_number: string | null
  trust_score?: number | null
  fail_items: number | null
  material_items: number | null
  observation_items: number | null
}

export type CaseRow = {
  id: string
  property_address: string | null
  status: string | null
  compliance_stage: string | null
  unit_number: string | null
  scheme_name: string | null
  created_at?: string | null
}

export type AuditLogRow = {
  id: string
  property_id?: string | null
  event_type: string | null
  status_label?: string | null
  event_message?: string | null
  previous_hash?: string | null
  new_hash?: string | null
  created_at: string
  report_id?: string | null
  action?: string | null
  performed_by?: string | null
}

export type CaseEventRow = {
  id: string
  event_type: string | null
  event_label: string | null
  created_at: string
}

export type AuthorityRegistryRow = {
  id: string
  auth_user_id: string
  full_name: string | null
  inspector_code: string | null
  badge_number: string | null
  title: string | null
  company_name: string | null
  status: string | null
  issued_at: string | null
  created_at: string | null
  updated_at?: string | null
}

export type AuthorityAssetsRow = {
  id: string
  full_name: string | null
  signature_image_url: string | null
  stamp_image_url: string | null
}

export type LegacyInspectorRow = {
  id: string
  full_name: string | null
  inspector_code: string | null
  badge_number: string | null
  company_name: string | null
  signature_file_path: string | null
  stamp_file_path: string | null
  is_active: boolean | null
  created_at: string | null
}

export type LoadedPublicVerificationRecord = {
  normalizedId: string
  registry: RegistryRow | null
  property: PropertyRow | null
  certificate: CertificateRow | null
  caseRecord: CaseRow | null
  auditRows: AuditLogRow[]
  caseEvents: CaseEventRow[]
  authority: AuthorityRegistryRow | null
  authorityAssets: AuthorityAssetsRow | null
  legacyInspector: LegacyInspectorRow | null
  verificationReference: string
  verificationUrl: string
  embedBadgeUrl: string
  issuerIdentityWarning: string | null
}

export async function loadPublicVerificationRecord(
  id: string
): Promise<LoadedPublicVerificationRecord> {
  const normalizedId = id.toUpperCase()
  const demoRecord = getDemoVerificationRecord(normalizedId)

  let registry: RegistryRow | null = null
  let property: PropertyRow | null = null
  let certificate: CertificateRow | null = null
  let caseRecord: CaseRow | null = null
  let auditRows: AuditLogRow[] = []
  let caseEvents: CaseEventRow[] = []
  let authority: AuthorityRegistryRow | null = null
  let authorityAssets: AuthorityAssetsRow | null = null
  let legacyInspector: LegacyInspectorRow | null = null

  if (demoRecord) {
    registry = demoRecord.registry as RegistryRow
    property = demoRecord.property as PropertyRow
    certificate = demoRecord.certificate as CertificateRow
    caseRecord = demoRecord.caseRecord as CaseRow
    auditRows = demoRecord.auditRows as AuditLogRow[]
    caseEvents = demoRecord.caseEvents as CaseEventRow[]
    authority = {
      id: demoRecord.inspector.id,
      auth_user_id: 'demo-authority-user',
      full_name: demoRecord.inspector.full_name,
      inspector_code: demoRecord.inspector.inspector_code,
      badge_number: demoRecord.inspector.badge_number,
      title: demoRecord.certificate.inspector_title ?? 'Authorised Certification Officer',
      company_name: demoRecord.inspector.company_name,
      status: demoRecord.inspector.is_active ? 'active' : 'inactive',
      issued_at: demoRecord.registry.issued_at,
      created_at: demoRecord.inspector.created_at,
    }
    authorityAssets = {
      id: 'demo-authority-assets',
      full_name: demoRecord.inspector.full_name,
      signature_image_url:
        demoRecord.certificate.signature_image_url ??
        demoRecord.inspector.signature_file_path,
      stamp_image_url:
        demoRecord.certificate.stamp_image_url ?? demoRecord.inspector.stamp_file_path,
    }
    legacyInspector = {
      id: demoRecord.inspector.id,
      full_name: demoRecord.inspector.full_name,
      inspector_code: demoRecord.inspector.inspector_code,
      badge_number: demoRecord.inspector.badge_number,
      company_name: demoRecord.inspector.company_name,
      signature_file_path: demoRecord.inspector.signature_file_path,
      stamp_file_path: demoRecord.inspector.stamp_file_path,
      is_active: demoRecord.inspector.is_active,
      created_at: demoRecord.inspector.created_at,
    }
  } else {
    const { data: certificateData } = await supabase
      .from('issued_certificates')
      .select('*')
      .or(`certificate_number.eq.${normalizedId},verification_ref.eq.${normalizedId}`)
      .order('issued_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    certificate = (certificateData as CertificateRow | null) ?? null

    if (certificate?.certificate_number) {
      const { data: registryData } = await supabase
        .from('report_registry')
        .select('*')
        .eq('certificate_number', certificate.certificate_number)
        .maybeSingle()

      registry = (registryData as RegistryRow | null) ?? null
    }

    if (!registry) {
      const { data: registryFallback } = await supabase
        .from('report_registry')
        .select('*')
        .or(`certificate_number.eq.${normalizedId},report_code.eq.${normalizedId}`)
        .maybeSingle()

      registry = (registryFallback as RegistryRow | null) ?? null
    }

    if (registry) {
      const [{ data: propertyData }, { data: auditData }] = await Promise.all([
        supabase.from('properties').select('*').eq('id', registry.property_id).maybeSingle(),
        supabase
          .from('report_audit_log')
          .select('*')
          .eq('report_id', registry.id)
          .order('created_at', { ascending: true }),
      ])

      property = (propertyData as PropertyRow | null) ?? null
      auditRows = (auditData as AuditLogRow[] | null) ?? []

      if (!certificate) {
        const { data: registryCertificateData } = await supabase
          .from('issued_certificates')
          .select('*')
          .or(
            registry.certificate_number
              ? `certificate_number.eq.${registry.certificate_number},verification_ref.eq.${registry.report_code}`
              : `verification_ref.eq.${registry.report_code}`
          )
          .order('issued_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        certificate = (registryCertificateData as CertificateRow | null) ?? null
      }
    }

    if (certificate?.case_id) {
      const [{ data: caseData }, { data: caseEventsData }] = await Promise.all([
        supabase
          .from('cases')
          .select(
            'id, property_address, status, compliance_stage, unit_number, scheme_name, created_at'
          )
          .eq('id', certificate.case_id)
          .maybeSingle(),
        supabase
          .from('case_events')
          .select('id, event_type, event_label, created_at')
          .eq('case_id', certificate.case_id)
          .order('created_at', { ascending: true }),
      ])

      caseRecord = (caseData as CaseRow | null) ?? null
      caseEvents = (caseEventsData as CaseEventRow[] | null) ?? []
    }

    const authorityRegistryId = certificate?.authority_registry_id ?? null
    const authorityUserId =
      certificate?.issued_by_user_id ?? certificate?.issued_by ?? null

    if (authorityRegistryId || authorityUserId) {
      const authorityQuery = supabase
        .from('authority_registry')
        .select(
          'id, auth_user_id, full_name, inspector_code, badge_number, title, company_name, status, issued_at, created_at, updated_at'
        )

      const { data: authorityData } = authorityRegistryId
        ? await authorityQuery.eq('id', authorityRegistryId).maybeSingle()
        : await authorityQuery.eq('auth_user_id', authorityUserId as string).maybeSingle()

      authority = (authorityData as AuthorityRegistryRow | null) ?? null

      if (authority?.auth_user_id) {
        const { data: assetData } = await supabase
          .from('user_profiles')
          .select('id, full_name, signature_image_url, stamp_image_url')
          .eq('id', authority.auth_user_id)
          .maybeSingle()

        authorityAssets = (assetData as AuthorityAssetsRow | null) ?? null
      }
    }

    const legacyInspectorId = registry?.inspector_id ?? null
    const legacyInspectorCode = certificate?.inspector_id ?? null
    const legacyInspectorName = certificate?.inspector_name ?? null

    if (legacyInspectorId) {
      const { data: inspectorById } = await supabase
        .from('inspectors')
        .select(
          'id, full_name, inspector_code, badge_number, company_name, signature_file_path, stamp_file_path, is_active, created_at'
        )
        .eq('id', legacyInspectorId)
        .maybeSingle()

      legacyInspector = (inspectorById as LegacyInspectorRow | null) ?? null
    }

    if (!legacyInspector && legacyInspectorCode) {
      const { data: inspectorByCode } = await supabase
        .from('inspectors')
        .select(
          'id, full_name, inspector_code, badge_number, company_name, signature_file_path, stamp_file_path, is_active, created_at'
        )
        .eq('inspector_code', legacyInspectorCode)
        .maybeSingle()

      legacyInspector = (inspectorByCode as LegacyInspectorRow | null) ?? null
    }

    if (!legacyInspector && legacyInspectorName) {
      const { data: inspectorByName } = await supabase
        .from('inspectors')
        .select(
          'id, full_name, inspector_code, badge_number, company_name, signature_file_path, stamp_file_path, is_active, created_at'
        )
        .eq('full_name', legacyInspectorName)
        .maybeSingle()

      legacyInspector = (inspectorByName as LegacyInspectorRow | null) ?? null
    }
  }

  const verificationReference =
    certificate?.verification_ref ??
    registry?.report_code ??
    registry?.certificate_number ??
    certificate?.certificate_number ??
    id

  return {
    normalizedId,
    registry,
    property,
    certificate,
    caseRecord,
    auditRows,
    caseEvents,
    authority,
    authorityAssets,
    legacyInspector,
    verificationReference,
    verificationUrl: `https://www.fairproperties.org.za/verify/${id}`,
    embedBadgeUrl: `https://www.fairproperties.org.za/embed/badge/${id}`,
    issuerIdentityWarning:
      certificate && !authority && !legacyInspector
        ? 'Issuer identity could not be verified'
        : null,
  }
}
