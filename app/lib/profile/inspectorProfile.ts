export type InspectorProfileRole = 'admin' | 'inspector' | 'user'

export type InspectorProfileRecord = {
  id: string
  auth_user_id: string | null
  full_name: string
  inspector_code: string
  title: string | null
  company_name: string
  signature_file_path: string | null
  stamp_file_path: string | null
  badge_number: string
  is_active: boolean
  created_at?: string | null
}

export type InspectorProfile = {
  profileId: string | null
  userId: string
  role: InspectorProfileRole
  fullName: string
  inspectorId: string
  title: string
  company: string
  signatureImageUrl: string | null
  stampImageUrl: string | null
  badgeNumber: string
  isActive: boolean
}

export type CertificateIssuanceIdentity = {
  issued_by: string
  inspector_id: string
  inspector_name: string
  inspector_title: string
  signature_name: string
  signature_image_url: string | null
  stamp_image_url: string | null
}

export function normalizeRole(input: unknown): InspectorProfileRole {
  return input === 'admin' || input === 'inspector' ? input : 'user'
}

function normalizeText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() || fallback : fallback
}

export function toInspectorProfile(args: {
  userId: string
  role: unknown
  row?: InspectorProfileRecord | null
  userFullName?: string | null
}) {
  const { userId, role, row, userFullName } = args

  return {
    profileId: row?.id ?? null,
    userId,
    role: normalizeRole(role),
    fullName: normalizeText(row?.full_name, normalizeText(userFullName, '')),
    inspectorId: normalizeText(row?.inspector_code),
    title: normalizeText(row?.title, 'Authorised Certification Officer'),
    company: normalizeText(row?.company_name, 'Fair Properties Inspection Authority'),
    signatureImageUrl: row?.signature_file_path ?? null,
    stampImageUrl: row?.stamp_file_path ?? null,
    badgeNumber: normalizeText(row?.badge_number),
    isActive: row?.is_active ?? true,
  } satisfies InspectorProfile
}

export function buildIssuedCertificateIdentity(profile: InspectorProfile): CertificateIssuanceIdentity {
  return {
    issued_by: profile.userId,
    inspector_id: profile.inspectorId,
    inspector_name: profile.fullName,
    inspector_title: profile.title,
    signature_name: profile.fullName,
    signature_image_url: profile.signatureImageUrl,
    stamp_image_url: profile.stampImageUrl,
  }
}
