type CertificateAuthorityRecord = {
  full_name?: string | null
  inspector_code?: string | null
  badge_number?: string | null
  title?: string | null
  company_name?: string | null
  status?: string | null
}

type CertificateAuthorityAssets = {
  full_name?: string | null
  signature_image_url?: string | null
  stamp_image_url?: string | null
}

type LegacyInspectorRecord = {
  full_name?: string | null
  inspector_code?: string | null
  badge_number?: string | null
  company_name?: string | null
  signature_file_path?: string | null
  stamp_file_path?: string | null
}

type CertificateRecord = {
  inspector_name?: string | null
  inspector_id?: string | null
  inspector_title?: string | null
  signature_name?: string | null
  signature_image_url?: string | null
  stamp_image_url?: string | null
}

export type AuthorityConfidence =
  | 'verified_active_authority'
  | 'legacy_issuer_only'
  | 'inactive_authority'
  | 'unresolved_issuer_linkage'
  | 'missing_issuer_data'

const DEMO_CERTIFICATE_ID = 'ZA-2024-00142'
const OFFICIAL_AUTHORITY_COMPANY = 'Fair Properties Inspection Authority'

function normalizeAssetPath(input: string | null | undefined, fallback?: string | null) {
  const value = input?.trim()

  if (!value) return fallback ?? null
  if (
    value.startsWith('/') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:')
  ) {
    return value
  }

  if (fallback) return fallback

  return `/${value.replace(/^\/+/, '')}`
}

export function resolveCertificateAuthorityPresentation(args: {
  normalizedId: string
  authority?: CertificateAuthorityRecord | null
  authorityAssets?: CertificateAuthorityAssets | null
  legacyInspector?: LegacyInspectorRecord | null
  certificate?: CertificateRecord | null
}) {
  const { normalizedId, authority, authorityAssets, legacyInspector, certificate } = args
  const isDemoCertificate = normalizedId === DEMO_CERTIFICATE_ID
  const normalizedAuthorityStatus =
    typeof authority?.status === 'string' ? authority.status.trim().toLowerCase() : null
  const hasLegacyIssuerData = Boolean(
    legacyInspector?.full_name ??
      legacyInspector?.inspector_code ??
      legacyInspector?.badge_number ??
      legacyInspector?.company_name ??
      certificate?.signature_name ??
      certificate?.inspector_name ??
      certificate?.inspector_id
  )

  let authorityConfidence: AuthorityConfidence

  if (isDemoCertificate || normalizedAuthorityStatus === 'active') {
    authorityConfidence = 'verified_active_authority'
  } else if (authority) {
    authorityConfidence = 'inactive_authority'
  } else if (hasLegacyIssuerData) {
    authorityConfidence = 'legacy_issuer_only'
  } else if (certificate) {
    authorityConfidence = 'unresolved_issuer_linkage'
  } else {
    authorityConfidence = 'missing_issuer_data'
  }

  const authorityName =
    authority?.full_name ??
    authorityAssets?.full_name ??
    legacyInspector?.full_name ??
    certificate?.signature_name ??
    certificate?.inspector_name ??
    (isDemoCertificate ? 'Stephanus van der Merwe' : 'Issuer identity could not be verified')

  const authorityTitle =
    authority?.title ??
    certificate?.inspector_title ??
    (isDemoCertificate ? 'Authorised Certification Officer' : 'Authority record required')

  const authorityCode =
    authority?.inspector_code ??
    legacyInspector?.inspector_code ??
    certificate?.inspector_id ??
    (isDemoCertificate ? 'FPIA-INS-014' : 'Not available')

  const authorityBadgeNumber =
    authority?.badge_number ??
    legacyInspector?.badge_number ??
    (isDemoCertificate ? 'SACPCMP Reg.' : null)

  const authorityCompanyName =
    authorityConfidence === 'verified_active_authority'
      ? authority?.company_name ?? OFFICIAL_AUTHORITY_COMPANY
      : authorityConfidence === 'inactive_authority'
      ? authority?.company_name ?? 'Authority registry record not active'
      : authorityConfidence === 'legacy_issuer_only'
      ? legacyInspector?.company_name ?? 'Legacy inspector / certificate record'
      : authorityConfidence === 'unresolved_issuer_linkage'
      ? 'Authority linkage unresolved'
      : 'Issuer data missing'

  const authorityRegistryText =
    authorityConfidence === 'verified_active_authority'
      ? 'Verified active authority registry identity'
      : authorityConfidence === 'legacy_issuer_only'
      ? 'Legacy issuer information only'
      : authorityConfidence === 'inactive_authority'
      ? `Authority registry record found, status: ${authority?.status ?? 'not confirmed'}`
      : authorityConfidence === 'unresolved_issuer_linkage'
      ? 'Current active authority linkage could not be fully confirmed'
      : 'Issuer identity not available in this public record'

  const authorityConfidenceLabel =
    authorityConfidence === 'verified_active_authority'
      ? 'Verified Active Authority'
      : authorityConfidence === 'legacy_issuer_only'
      ? 'Legacy Issuer Information Only'
      : authorityConfidence === 'inactive_authority'
      ? 'Authority Record Not Active'
      : authorityConfidence === 'unresolved_issuer_linkage'
      ? 'Authority Linkage Unresolved'
      : 'Issuer Data Missing'

  const authoritySupportNote =
    authorityConfidence === 'verified_active_authority'
      ? null
      : authorityConfidence === 'legacy_issuer_only'
      ? 'Issuer details were recovered from legacy or incomplete records. Current active authority linkage could not be fully confirmed from this public record.'
      : authorityConfidence === 'inactive_authority'
      ? 'The linked authority record is not currently active. Read this record together with the trust status and certificate details.'
      : authorityConfidence === 'unresolved_issuer_linkage'
      ? 'Current active authority linkage could not be fully confirmed from this public record. This verification record should be read together with the trust status and certificate details.'
      : 'Issuer data is missing from this public record.'

  const authoritySectionLabel =
    authorityConfidence === 'verified_active_authority' ? 'Verified Authority' : 'Issuer Record'

  const authorityOfficeLabel =
    authorityConfidence === 'verified_active_authority' || authorityConfidence === 'inactive_authority'
      ? 'Authority Office'
      : authorityConfidence === 'legacy_issuer_only'
      ? 'Legacy Issuer Source'
      : 'Issuer Record Status'

  const signatureFallback =
    isDemoCertificate
      ? '/signatures/INS-001.png'
      : authorityCode !== 'Not available'
      ? `/signatures/${authorityCode}.png`
      : null

  const resolvedSignatureImageUrl = normalizeAssetPath(
    authorityAssets?.signature_image_url ??
      legacyInspector?.signature_file_path ??
      certificate?.signature_image_url,
    signatureFallback
  )

  const resolvedStampImageUrl =
    normalizeAssetPath(
      authorityAssets?.stamp_image_url ??
        legacyInspector?.stamp_file_path ??
        certificate?.stamp_image_url,
      '/stamps/FPIA-OFFICIAL.png'
    ) ?? '/stamps/FPIA-OFFICIAL.png'

  return {
    isDemoCertificate,
    authorityConfidence,
    authorityConfidenceLabel,
    authorityName,
    authorityOfficeLabel,
    authorityTitle,
    authorityCode,
    authorityBadgeNumber,
    authorityCompanyName,
    authorityRegistryText,
    authoritySectionLabel,
    authoritySupportNote,
    resolvedSignatureImageUrl,
    resolvedStampImageUrl,
    showStrongAuthorityFraming: authorityConfidence === 'verified_active_authority',
  }
}
