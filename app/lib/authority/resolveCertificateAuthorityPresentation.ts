type CertificateAuthorityRecord = {
  full_name?: string | null
  inspector_code?: string | null
  badge_number?: string | null
  title?: string | null
  company_name?: string | null
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

  const authorityCompanyName = OFFICIAL_AUTHORITY_COMPANY

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
    authorityName,
    authorityTitle,
    authorityCode,
    authorityBadgeNumber,
    authorityCompanyName,
    resolvedSignatureImageUrl,
    resolvedStampImageUrl,
  }
}
