import Link from 'next/link'
import DownloadPdfButton from '../../verify/[id]/DownloadPdfButton'
import CopyHashButton from '../../verify/[id]/CopyHashButton'
import RequestInspectionCaptureForm from '../../verify/[id]/RequestInspectionCaptureForm'
import ShareRecordPanel from '../../verify/[id]/ShareRecordPanel'
import QRCode from 'qrcode'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import TrustBadge from '@/components/TrustBadge'
import { resolveCertificateAuthorityPresentation } from '@/lib/authority/resolveCertificateAuthorityPresentation'
import { getCanonicalTrustState, type TrustOutcome } from '@/lib/certification/getCanonicalTrustState'
import { getConditionalExplanation } from '@/lib/certification/getConditionalExplanation'
import { getFpiaProduct } from '@/lib/products/fpiaProducts'
import {
  loadPublicVerificationRecord,
  type RegistryRow,
  type CertificateRow,
  type AuditLogRow,
  type CaseEventRow,
} from '@/lib/verification/loadPublicVerificationRecord'

type AuditItem = {
  label: string
  value: string
}

type CategoryItem = {
  name: string
  status: 'Pass' | 'Conditional' | 'Fail'
}

function formatDate(input: string | null | undefined) {
  if (!input) return 'Not available'

  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return 'Not available'

  return new Intl.DateTimeFormat('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(input: string | null | undefined) {
  if (!input) return 'Not available'

  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return 'Not available'

  return new Intl.DateTimeFormat('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function getWatermarkHashLabel(hash: string | null | undefined) {
  if (!hash || hash === 'No active verification hash') {
    return 'HASH VERIFIED: RECORD PENDING'
  }

  const normalizedHash = hash.replace(/^sha256:/i, '')
  return `HASH VERIFIED: ${normalizedHash.slice(0, 12)}`
}

function buildAuditTrail(
  registry: RegistryRow | null,
  auditRows: AuditLogRow[] | null,
  certificate?: CertificateRow | null,
  caseEvents?: CaseEventRow[] | null
): AuditItem[] {
  const rows = auditRows ?? []
  const events = caseEvents ?? []

  if (!registry && events.length > 0) {
    return events
      .map((event) => ({
        label: event.event_label ?? event.event_type ?? 'Case Event',
        value: formatDateTime(event.created_at),
      }))
      .slice(-3)
  }

  if (!registry && certificate) {
    return [
      { label: 'Certificate Issued', value: formatDateTime(certificate.issued_at) },
      { label: 'Certificate Reference', value: certificate.verification_ref ?? 'Not available' },
      { label: 'Current Status', value: certificate.inspection_status ?? 'Not available' },
    ]
  }

  if (!registry && rows.length === 0) {
    return [
      { label: 'Lookup Performed', value: formatDateTime(new Date().toISOString()) },
      { label: 'Registry Match', value: 'No active certification found' },
      { label: 'Last Verified', value: formatDateTime(new Date().toISOString()) },
    ]
  }

  const preferred = rows
    .map((row) => ({
      label:
        row.event_type === 'REPORT_SUBMITTED'
          ? 'Report Submitted'
          : row.event_type === 'REPORT_APPROVED'
          ? 'Report Approved'
          : row.event_type === 'REPORT_CERTIFIED'
          ? 'Report Certified'
          : row.event_type === 'REPORT_RELOCKED'
          ? 'Report Re-Locked'
          : row.event_type === 'CERTIFICATION_INVALIDATED'
          ? 'Certification Invalidated'
          : row.event_type ?? 'Registry Event',
      value: formatDateTime(row.created_at),
    }))
    .slice(-3)

  if (preferred.length > 0) return preferred

  return [
    {
      label: 'Record Created',
      value: formatDateTime(registry?.issued_at ?? registry?.submitted_for_review_at),
    },
    {
      label: 'Record Locked',
      value: formatDateTime(registry?.locked_at),
    },
    {
      label: 'Last Verified',
      value: formatDateTime(registry?.certified_at ?? registry?.reviewed_at),
    },
  ]
}

function buildCategories(
  certificate: CertificateRow | null,
  trustState: TrustOutcome
): CategoryItem[] {
  const checklist = certificate?.snapshot?.checklist

  if (Array.isArray(checklist) && checklist.length > 0) {
    const grouped = new Map<string, CategoryItem['status']>()

    for (const item of checklist) {
      const section = String(item?.section ?? 'General')
      const result = String(item?.result ?? '').toLowerCase()

      let mapped: CategoryItem['status'] = 'Conditional'
      if (result === 'pass') mapped = 'Pass'
      if (result === 'fail') mapped = 'Fail'
      if (result === 'observation') mapped = 'Conditional'

      const existing = grouped.get(section)

      if (!existing) {
        grouped.set(section, mapped)
        continue
      }

      if (existing === 'Fail') continue
      if (existing === 'Conditional' && mapped === 'Pass') continue

      if (mapped === 'Fail') {
        grouped.set(section, 'Fail')
      } else if (mapped === 'Conditional') {
        grouped.set(section, 'Conditional')
      }
    }

    return Array.from(grouped.entries()).map(([name, groupedStatus]) => ({
      name,
      status: groupedStatus,
    }))
  }

  if (trustState === 'REVOKED') {
    return [{ name: 'Certification Status', status: 'Fail' }]
  }

  if (trustState === 'NOT_ISSUED') {
    return [{ name: 'Certification Status', status: 'Fail' }]
  }

  if (trustState === 'CONDITIONAL') {
    return [{ name: 'Certification Status', status: 'Conditional' }]
  }

  return [{ name: 'Certification Status', status: 'Pass' }]
}

export default async function VerifyProperty({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const {
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
    verificationUrl,
    embedBadgeUrl,
    issuerIdentityWarning,
  } = await loadPublicVerificationRecord(id)

  const trustState = getCanonicalTrustState({
    certificateState: certificate?.certificate_state,
    caseStatus: registry?.status ?? caseRecord?.status,
    complianceStage: caseRecord?.compliance_stage,
    inspectionStatus: certificate?.inspection_status,
    reviewOutcome: registry?.review_outcome,
    workflowStatus: registry?.workflow_status,
    revokedAt: certificate?.revoked_at,
    isLocked: registry?.is_locked,
  })

  const conditionalExplanation =
    trustState === 'CONDITIONAL'
      ? getConditionalExplanation({
          checklist: certificate?.snapshot?.checklist,
          failItems: certificate?.fail_items,
          materialItems: certificate?.material_items,
          observationItems: certificate?.observation_items,
          recommendation: certificate?.recommendation,
        })
      : null

  const verificationHash =
    registry?.final_hash ??
    registry?.report_hash ??
    certificate?.integrity_hash ??
    'No active verification hash'

  const hashDisplay =
    verificationHash.length > 36
      ? `${verificationHash.slice(0, 10)}...${verificationHash.slice(-3)}`
      : verificationHash
  const watermarkHashLabel = getWatermarkHashLabel(verificationHash)

  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 180,
    margin: 1,
  })

  const auditTrail = buildAuditTrail(registry, auditRows, certificate, caseEvents)
  const categories = buildCategories(certificate, trustState)

  const identityParts = [
    caseRecord?.unit_number,
    caseRecord?.scheme_name,
    property?.unit_number,
    property?.building_name,
    property?.complex_name,
    property?.estate_name,
  ].filter(Boolean)

  const addressLine1 = identityParts.join(' ')
  const addressLine2 = property?.address ?? caseRecord?.property_address ?? ''

  const propertyAddress =
    addressLine1 || addressLine2
      ? [addressLine1, addressLine2].filter(Boolean).join('\n')
      : trustState === 'NOT_ISSUED'
      ? 'No active certified property record found'
      : 'Unknown property'

  const provinceParts = [
    property?.city,
    property?.province,
    property?.postal_code,
  ].filter(Boolean)

  const propertyProvince =
    provinceParts.length > 0
      ? provinceParts.join(', ')
      : caseRecord
      ? 'Case record only'
      : trustState === 'NOT_ISSUED'
      ? 'Registry lookup only'
      : 'Location not available'

  const {
    authorityName,
    authorityTitle,
    authorityCode,
    authorityBadgeNumber,
    authorityCompanyName,
    resolvedSignatureImageUrl,
    resolvedStampImageUrl,
  } = resolveCertificateAuthorityPresentation({
    normalizedId,
    authority,
    authorityAssets,
    legacyInspector,
    certificate,
  })

  const inspectorDisplay = authorityBadgeNumber
    ? `${authorityName}\n${authorityBadgeNumber}`
    : authorityName

  const validUntil =
    trustState === 'FINAL_VERIFIED'
      ? 'Active until revoked or superseded'
      : trustState === 'CONDITIONAL'
      ? 'Conditionally active subject to recorded conditions'
      : trustState === 'SUPERSEDED'
      ? 'Superseded by a newer authority-issued record'
      : trustState === 'REVOKED'
      ? 'No longer valid'
      : 'Not applicable'

  const ledger =
    registry?.property_code ??
    registry?.report_code ??
    certificate?.verification_ref ??
    'No active ledger entry'

  const mock = {
    id:
      registry?.certificate_number ??
      registry?.report_code ??
      certificate?.certificate_number ??
      certificate?.verification_ref ??
      id,
    address: propertyAddress,
    province: propertyProvince,
    inspectionDate: formatDate(registry?.issued_at ?? certificate?.issued_at),
    inspector: `${inspectorDisplay}\n${authorityTitle}`,
    validUntil,
    ledger,
    auditTrail,
    categories,
  }

  const trustMeaning: Record<TrustOutcome, string> = {
    NOT_ISSUED: 'This property does not currently have an active verified record.',
    CONDITIONAL:
      'This property has been assessed and issued a conditional certificate. Certain findings or requirements remain outstanding before full certification can be achieved.',
    FINAL_VERIFIED:
      'This property has achieved full certification and meets all required conditions at the time of verification.',
    SUPERSEDED:
      'This certificate has been replaced by a newer authority-issued record and should be treated as historical only.',
    REVOKED: 'This certificate has been revoked and should not be relied upon.',
  }

  const buyerGuidance: Record<TrustOutcome, string> = {
    CONDITIONAL:
      'This property has been assessed but contains findings that require attention. You should review the key findings and confirm whether remedial work will be completed before transfer.',
    FINAL_VERIFIED:
      'This property has met all certification requirements at the time of inspection. No outstanding issues affecting certification were recorded.',
    SUPERSEDED:
      'Do not rely on this certificate alone. Use the latest certificate number or verification reference issued by the authority registry.',
    NOT_ISSUED:
      'No verified inspection record is available. You should proceed with caution and consider requesting a formal inspection.',
    REVOKED:
      'This certificate has been revoked. You should not rely on this record and should request a new inspection.',
  }

  const nextActionContent: Partial<Record<TrustOutcome, string>> = {
    CONDITIONAL:
      'To achieve full certification, outstanding items must be resolved and verified.',
    NOT_ISSUED: 'This property does not yet have a verified inspection record.',
    REVOKED:
      'This certificate is no longer valid. A new inspection is required to establish a current verified record.',
  }

  const certificateNumberDisplay =
    certificate?.certificate_number ?? registry?.certificate_number ?? 'Pending assignment'
  const authorityRegistryStanding =
    authority?.status?.toLowerCase() === 'active'
      ? 'Verified active authority registry record'
      : authority
      ? `Authority registry status: ${authority.status ?? 'not confirmed'}`
      : 'Legacy record presentation in use'
  const publicRecordStatusLabel =
    trustState === 'FINAL_VERIFIED'
      ? 'Valid and fully verified'
      : trustState === 'CONDITIONAL'
      ? 'Issued with active conditions'
      : trustState === 'SUPERSEDED'
      ? 'Superseded by a newer authority record'
      : trustState === 'REVOKED'
      ? 'Revoked and not valid for reliance'
      : 'No active issued record'

  const showNextAction =
    trustState === 'CONDITIONAL' ||
    trustState === 'NOT_ISSUED' ||
    trustState === 'REVOKED'

  const nextActionProduct = showNextAction
    ? getFpiaProduct(
        trustState === 'CONDITIONAL' ? 'upgrade_product' : 'inspection_product'
      )
    : null

  const integrityValueColor =
    trustState === 'FINAL_VERIFIED'
      ? 'var(--off-white)'
      : trustState === 'CONDITIONAL'
      ? '#FFF4E5'
      : '#E8E2E2'

  const auditBorderColor =
    trustState === 'FINAL_VERIFIED'
      ? '2px solid rgba(46,125,50,0.6)'
      : trustState === 'CONDITIONAL'
      ? '2px solid rgba(183,121,31,0.6)'
      : '2px solid rgba(198,40,40,0.6)'

  const sectionCardStyle: CSSProperties = {
    backgroundColor: '#fff',
    border: '1px solid rgba(11,31,51,0.08)',
    padding: 'clamp(18px, 4vw, 24px)',
    marginBottom: '16px',
    overflow: 'hidden',
  }

  const sectionLabelStyle: CSSProperties = {
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    margin: '0 0 14px 0',
    fontWeight: 700,
  }

  const sectionHeadingStyle: CSSProperties = {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 'clamp(24px, 5vw, 30px)',
    color: 'var(--navy)',
    margin: '0 0 10px 0',
    lineHeight: 1.15,
  }

  const detailGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '18px 24px',
  }

  const detailLabelStyle: CSSProperties = {
    fontSize: '11px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#6C7077',
    margin: '0 0 8px 0',
    fontWeight: 700,
  }

  const detailValueStyle: CSSProperties = {
    fontWeight: 600,
    color: 'var(--navy)',
    fontSize: '15px',
    lineHeight: 1.55,
    margin: 0,
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
    whiteSpace: 'pre-line',
  }

  const certificationRows = [
    { label: 'Inspection Date', value: mock.inspectionDate },
    { label: 'Inspector', value: mock.inspector },
    { label: 'Certification Standing', value: mock.validUntil },
    { label: 'Ledger Reference', value: mock.ledger },
  ]

  return (
    <main
      style={{
        backgroundColor: 'var(--off-white)',
        color: 'var(--navy)',
        fontFamily: "'DM Sans', sans-serif",
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '800px',
          margin: 'clamp(28px, 7vw, 60px) auto',
          padding: '0 clamp(14px, 4vw, 24px)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '57%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(28deg)',
            transformOrigin: 'center',
            color: 'rgba(60,78,98,0.055)',
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(22px, 6vw, 41px)',
            letterSpacing: '0.11em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            lineHeight: 1,
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            width: 'min(138%, 1100px)',
          }}
          >
          <div style={{ fontWeight: 700 }}>
            <span>
              ACCOUNTABILITY BUILT IN
              <span
                style={{
                  fontSize: '0.45em',
                  verticalAlign: 'super',
                  marginLeft: '-1px',
                  lineHeight: 1,
                }}
              >
                ™
              </span>
            </span>
          </div>
          <div
            style={{
              marginTop: '5px',
              fontSize: '11px',
              letterSpacing: '0.085em',
              fontWeight: 700,
            }}
          >
            GOVERNED AUTHORITY RECORD • {watermarkHashLabel}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              backgroundColor: 'var(--navy)',
              borderRadius: '4px 4px 0 0',
              padding: 'clamp(18px, 4vw, 24px) clamp(18px, 5vw, 40px) clamp(20px, 4.5vw, 28px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Image
                src="/fpia-logo.png"
                alt="FPIA Logo"
                width={320}
                height={90}
                priority
                style={{
                  objectFit: 'contain',
                  width: 'auto',
                  height: 'clamp(50px, 10vw, 68px)',
                  display: 'block',
                }}
              />

              <div>
                <p
                  style={{
                    color: 'var(--gold)',
                    fontSize: '11px',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  Authority-Issued Registry Certificate
                </p>
                <h1
                  style={{
                    margin: '0 0 8px 0',
                    color: '#fff',
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 'clamp(28px, 6.2vw, 36px)',
                    lineHeight: 1.1,
                  }}
                >
                  Official Property Condition Certificate
                </h1>
                <p style={{ color: '#a0aec0', fontSize: '14px', margin: 0 }}>
                  Accountability built in through the FPIA authority registry, issued record controls, and live verification ledger.
                </p>
                <p style={{ color: '#d0d7de', fontSize: '12px', margin: '8px 0 0 0', lineHeight: 1.6 }}>
                  This is a certificate representation. For verification, use the{' '}
                  <Link
                    href={`/verify/${id}`}
                    style={{ color: 'var(--gold)', textDecoration: 'underline' }}
                  >
                    verification page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div style={authoritySnapshotGridStyle}>
            <div style={authoritySnapshotCardStyle}>
              <p style={detailLabelStyle}>Issued Status</p>
              <p style={snapshotPrimaryValueStyle}>{publicRecordStatusLabel}</p>
            </div>
            <div style={authoritySnapshotCardStyle}>
              <p style={detailLabelStyle}>Certificate Number</p>
              <p style={snapshotSecondaryValueStyle}>{certificateNumberDisplay}</p>
            </div>
            <div style={authoritySnapshotCardStyle}>
              <p style={detailLabelStyle}>Verification Reference</p>
              <p style={snapshotSecondaryValueStyle}>{verificationReference}</p>
            </div>
            <div style={authoritySnapshotCardStyle}>
              <p style={detailLabelStyle}>Authority Registry</p>
              <p style={snapshotSecondaryValueStyle}>{authorityRegistryStanding}</p>
            </div>
          </div>

          <div
            style={{
              ...sectionCardStyle,
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <p style={sectionLabelStyle}>Trust Status</p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ maxWidth: '420px' }}>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6C7077',
                    margin: '0 0 8px 0',
                    lineHeight: 1.6,
                  }}
                >
                  Current registry trust outcome recorded against the supplied reference.
                </p>
                {certificate?.revoked_reason && trustState === 'REVOKED' && (
                  <p style={{ margin: 0, color: '#7A1C1C', fontWeight: 600, lineHeight: 1.6 }}>
                    Revocation reason: {certificate.revoked_reason}
                  </p>
                )}
              </div>

              <TrustBadge trustState={trustState} />
            </div>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--navy)',
                lineHeight: 1.7,
                margin: '18px 0 0 0',
                maxWidth: '640px',
                paddingTop: '18px',
                borderTop: '1px solid rgba(11,31,51,0.08)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  ...sectionLabelStyle,
                  color: '#6C7077',
                  margin: '0 0 10px 0',
                }}
              >
                What this means
              </span>
              {trustMeaning[trustState]}
            </p>

            <div
              style={{
                marginTop: '18px',
                maxWidth: '640px',
                paddingTop: '18px',
                borderTop: '1px solid rgba(11,31,51,0.08)',
              }}
            >
              <p
                style={{
                  display: 'block',
                  ...sectionLabelStyle,
                  color: '#6C7077',
                  margin: '0 0 10px 0',
                }}
              >
                What this means for you
              </p>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--navy)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {buyerGuidance[trustState]}
              </p>
            </div>
          </div>

          <div style={sectionCardStyle}>
            <p style={sectionLabelStyle}>Authority Issue Credentials</p>

            <div style={authorityMetricsGridStyle}>
              <div style={authorityMetricCardStyle}>
                <p style={detailLabelStyle}>Inspector Name</p>
                <p style={detailValueStyle}>{authorityName}</p>
              </div>
              <div style={authorityMetricCardStyle}>
                <p style={detailLabelStyle}>Inspector Code</p>
                <p style={detailValueStyle}>{authorityCode}</p>
              </div>
              <div style={authorityMetricCardStyle}>
                <p style={detailLabelStyle}>Badge Number</p>
                <p style={detailValueStyle}>{authorityBadgeNumber ?? 'Not available'}</p>
              </div>
              <div style={authorityMetricCardStyle}>
                <p style={detailLabelStyle}>Authority Office</p>
                <p style={detailValueStyle}>{authorityCompanyName}</p>
              </div>
            </div>

            <p style={authorityCredentialFootnoteStyle}>
              This certificate is issued under governed authority controls. Each public record is bound to an accountable issuing identity, registry reference, and integrity hash.
            </p>
          </div>

          <div style={sectionCardStyle}>
            <p style={sectionLabelStyle}>Share Record</p>
            <ShareRecordPanel
              verifyUrl={verificationUrl}
              verificationReference={verificationReference}
              embedUrl={embedBadgeUrl}
            />
          </div>

          <div style={sectionCardStyle}>
            <p style={sectionLabelStyle}>Property Reference</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              <div>
                <p style={detailLabelStyle}>Reference Code</p>
                <p
                  style={{
                    ...sectionHeadingStyle,
                    fontSize: 'clamp(22px, 5vw, 26px)',
                    marginBottom: 0,
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {mock.id}
                </p>
              </div>

              <div>
                <p style={detailLabelStyle}>Registered Address</p>
                <p style={{ ...detailValueStyle, fontSize: 'clamp(16px, 4vw, 18px)' }}>{mock.address}</p>
                <p style={{ color: '#6C7077', margin: '8px 0 0 0', fontSize: '14px' }}>
                  {mock.province}
                </p>
              </div>
            </div>
          </div>

          <div style={sectionCardStyle}>
            <p style={sectionLabelStyle}>Certification Block</p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '24px',
                flexWrap: 'wrap',
                marginBottom: '22px',
              }}
            >
              <div style={{ flex: '1 1 360px' }}>
                <p style={{ ...detailLabelStyle, marginBottom: '6px' }}>Record Standing</p>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6C7077',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Canonical trust outcome derived from the live registry record.
                </p>
              </div>

              <TrustBadge trustState={trustState} variant="compact" />
            </div>

            <div style={detailGridStyle}>
              {certificationRows.map((row) => (
                <div key={row.label}>
                  <p style={detailLabelStyle}>{row.label}</p>
                  <p style={detailValueStyle}>{row.value}</p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '24px',
                paddingTop: '22px',
                borderTop: '1px solid rgba(11,31,51,0.08)',
              }}
            >
              <p style={{ ...detailLabelStyle, marginBottom: '14px' }}>
                Recorded Certification Categories
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                }}
              >
                {mock.categories.map((cat, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px',
                      flexWrap: 'wrap',
                      padding: '12px 16px',
                      backgroundColor: 'var(--off-white)',
                      borderRadius: '4px',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: 'var(--navy)' }}>
                      {cat.name}
                    </span>

                    <span
                      style={{
                        fontSize: '12px',
                        color:
                          cat.status === 'Pass'
                            ? '#2E7D32'
                            : cat.status === 'Conditional'
                            ? '#B7791F'
                            : '#C62828',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cat.status === 'Pass'
                        ? '✔'
                        : cat.status === 'Conditional'
                        ? '•'
                        : '✕'}{' '}
                      {cat.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {trustState === 'CONDITIONAL' && conditionalExplanation && (
            <div
              style={{
                ...sectionCardStyle,
                backgroundColor: '#fffaf2',
                border: '1px solid rgba(183,121,31,0.28)',
              }}
            >
              <p style={sectionLabelStyle}>Why Conditional</p>

              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--navy)',
                  lineHeight: 1.7,
                  margin: '0 0 14px 0',
                  fontWeight: 500,
                }}
              >
                {conditionalExplanation.summary}
              </p>

              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 14px',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(183,121,31,0.18)',
                  borderRadius: '4px',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#B7791F',
                    margin: '0 0 10px 0',
                    fontWeight: 700,
                  }}
                >
                  Recorded matters
                </p>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '18px',
                    color: 'var(--navy)',
                    lineHeight: 1.7,
                  }}
                >
                  {conditionalExplanation.keyFindings.map((finding) => (
                    <li key={finding} style={{ marginBottom: '8px' }}>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 14px',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(183,121,31,0.18)',
                  borderRadius: '4px',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#B7791F',
                    margin: '0 0 10px 0',
                    fontWeight: 700,
                  }}
                >
                  Required follow-up
                </p>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '18px',
                    color: 'var(--navy)',
                    lineHeight: 1.7,
                  }}
                >
                  {conditionalExplanation.nextSteps.map((step) => (
                    <li key={step} style={{ marginBottom: '8px' }}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {certificate?.recommendation &&
                conditionalExplanation.keyFindings.length === 1 &&
                conditionalExplanation.keyFindings[0] ===
                  (certificate.recommendation.endsWith('.')
                    ? certificate.recommendation
                    : `${certificate.recommendation}.`) && (
                <div
                  style={{
                    marginTop: '14px',
                    padding: '12px 14px',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(183,121,31,0.18)',
                    borderRadius: '4px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '11px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      color: '#B7791F',
                      margin: '0 0 6px 0',
                      fontWeight: 700,
                    }}
                  >
                    Recorded Certification Note
                  </p>

                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--navy)',
                      lineHeight: 1.6,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {certificate.recommendation}
                  </p>
                </div>
              )}
            </div>
          )}

          <div style={sectionCardStyle}>
            <p style={sectionLabelStyle}>Integrity / Verification</p>

            <div style={integrityTopGridStyle}>
              <div
                style={{
                  backgroundColor: 'var(--navy)',
                  border: '1px solid rgba(201,161,77,0.22)',
                  padding: '18px 24px',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '20px',
                    alignItems: 'end',
                  }}
                >
                  <div>
                    <p style={{ ...integrityLabelStyle, margin: '0 0 8px 0' }}>Lock Status</p>
                    <p style={{ ...integrityValueStyle, color: integrityValueColor }}>
                      {registry?.is_locked ? 'Locked' : 'Not Locked'}
                    </p>
                  </div>

                  <div>
                    <p style={{ ...integrityLabelStyle, margin: '0 0 8px 0' }}>Registry Record</p>
                    <p style={{ ...integrityValueStyle, color: integrityValueColor }}>
                      {trustState === 'NOT_ISSUED' ? 'Not Found' : 'Found'}
                    </p>
                  </div>

                  <div>
                    <p style={{ ...integrityLabelStyle, margin: '0 0 8px 0' }}>
                      Ledger Reference
                    </p>
                    <p
                      style={{
                        ...integrityValueStyle,
                        color: integrityValueColor,
                        wordBreak: 'break-word',
                      }}
                    >
                      {mock.ledger}
                    </p>
                  </div>

                  <div>
                    <p style={{ ...integrityLabelStyle, margin: '0 0 8px 0' }}>Integrity Hash</p>
                    <p
                      style={{
                        ...integrityValueStyle,
                        color: integrityValueColor,
                        wordBreak: 'break-word',
                      }}
                    >
                      {hashDisplay}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <CopyHashButton value={verificationHash} />
                  </div>
                </div>
              </div>

              <div style={verificationCardStyle}>
                <div style={{ flex: '1 1 220px' }}>
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'var(--navy)',
                      fontWeight: 600,
                      margin: '0 0 10px 0',
                    }}
                  >
                    Verification link
                  </p>

                  <p
                    style={{
                      fontSize: '13px',
                      color: '#6C7077',
                      lineHeight: 1.6,
                      margin: '0 0 10px 0',
                    }}
                  >
                    The QR code resolves to this live registry entry and may be used to confirm the current record status.
                  </p>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#6C7077',
                      margin: 0,
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}
                  >
                    {verificationUrl}
                  </p>
                </div>

                <Image
                  src={qrCodeDataUrl}
                  alt={`QR code for certificate ${mock.id}`}
                  width={132}
                  height={132}
                  style={{
                    width: '132px',
                    height: '132px',
                    padding: '10px',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(11,31,51,0.08)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    flexShrink: 0,
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <p style={{ ...detailLabelStyle, marginBottom: '14px' }}>Record History</p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '20px',
                }}
              >
                {mock.auditTrail.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      borderLeft: auditBorderColor,
                      paddingLeft: '14px',
                    }}
                  >
                    <p style={detailLabelStyle}>{item.label}</p>

                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--navy)',
                        margin: 0,
                        fontWeight: 600,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={sectionCardStyle}>
            <p style={sectionLabelStyle}>Certification Authority</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '22px 28px',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  paddingTop: '6px',
                }}
              >
                <p
                  style={{
                    ...detailLabelStyle,
                    marginBottom: '8px',
                  }}
                >
                  Issuing Officer
                </p>

                <p style={detailValueStyle}>{authorityName}</p>
                <p style={{ color: '#6C7077', margin: '6px 0 0 0', fontSize: '14px' }}>
                  {authorityTitle}
                </p>
                {authorityBadgeNumber && (
                  <p style={{ color: '#6C7077', margin: '6px 0 0 0', fontSize: '13px' }}>
                    {authorityBadgeNumber}
                  </p>
                )}
                {authorityCode !== 'Not available' && (
                  <p style={{ color: '#6C7077', margin: '6px 0 0 0', fontSize: '13px' }}>
                    {authorityCode}
                  </p>
                )}
                <p style={{ color: '#6C7077', margin: '6px 0 0 0', fontSize: '13px' }}>
                  {authorityCompanyName}
                </p>
                {issuerIdentityWarning ? (
                  <p
                    style={{
                      color: '#7F1D1D',
                      margin: '10px 0 0 0',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {issuerIdentityWarning}
                  </p>
                ) : null}
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '14px',
                  alignContent: 'start',
                }}
              >
                {resolvedSignatureImageUrl ? (
                  <div
                    style={{
                      padding: '14px 16px',
                      border: '1px solid rgba(11,31,51,0.08)',
                      backgroundColor: '#fbfbfa',
                    }}
                  >
                    <p style={{ ...detailLabelStyle, marginBottom: '10px' }}>Authorised Signature</p>
                    <Image
                      src={resolvedSignatureImageUrl}
                      alt={`Signature of ${authorityName}`}
                      width={280}
                      height={92}
                      style={{
                        width: '100%',
                        maxWidth: '220px',
                        height: '72px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                ) : null}

                <div
                  style={{
                    padding: '14px 16px',
                    border: '1px solid rgba(11,31,51,0.08)',
                    backgroundColor: '#fbfbfa',
                  }}
                >
                  <p style={{ ...detailLabelStyle, marginBottom: '10px' }}>Official Stamp</p>
                  <Image
                    src={resolvedStampImageUrl}
                    alt="Official FPIA certification stamp"
                    width={160}
                    height={160}
                    style={{
                      width: '96px',
                      height: '96px',
                      objectFit: 'contain',
                      opacity: 0.92,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <DownloadPdfButton
              id={mock.id}
              trustState={trustState}
              address={mock.address}
              province={propertyProvince}
              hash={verificationHash}
              qrCode={qrCodeDataUrl}
              issuedDate={registry?.issued_at ?? certificate?.issued_at}
              validUntil={
                trustState === 'FINAL_VERIFIED'
                  ? 'Active until revoked or superseded'
                  : trustState === 'CONDITIONAL'
                  ? 'Conditionally active subject to recorded conditions'
                  : trustState === 'REVOKED'
                  ? 'No longer valid'
                  : 'Not currently applicable'
              }
              inspectorName={authorityName}
              inspectorRole={authorityTitle}
              inspectorCode={authorityCode}
              badgeNumber={authorityBadgeNumber ?? undefined}
              companyName={authorityCompanyName}
              certificateType={certificate?.certificate_type}
              recommendation={certificate?.recommendation}
              signatureImageUrl={resolvedSignatureImageUrl}
              stampImageUrl={resolvedStampImageUrl}
            />
          </div>

          {showNextAction && (
            <div
              style={{
                ...sectionCardStyle,
                marginTop: '16px',
                backgroundColor: '#fbfbfa',
                border: '1px solid rgba(11,31,51,0.1)',
              }}
            >
              <p style={sectionLabelStyle}>Next Action</p>
              {nextActionProduct && (
                <div style={{ marginBottom: '14px' }}>
                  <p style={{ ...detailLabelStyle, marginBottom: '6px' }}>Applicable Product</p>
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'var(--navy)',
                      fontWeight: 700,
                      margin: '0 0 4px 0',
                    }}
                  >
                    {nextActionProduct.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6C7077', margin: '0 0 4px 0' }}>
                    {nextActionProduct.usageSubheading}
                  </p>
                  <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', margin: '0 0 4px 0' }}>
                    {nextActionProduct.priceLabel}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: 700, margin: '0 0 4px 0' }}>
                    {nextActionProduct.price}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6C7077', margin: 0 }}>
                    {nextActionProduct.valueMicrocopy}
                  </p>
                </div>
              )}
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--navy)',
                  lineHeight: 1.7,
                  margin: '0 0 18px 0',
                  maxWidth: '620px',
                }}
              >
                {nextActionContent[trustState]}
              </p>

              <RequestInspectionCaptureForm
                propertyReference={verificationReference}
              />
            </div>
          )}
        </div>
      </div>

      <p
        style={{
          textAlign: 'center',
          color: '#6C7077',
          fontSize: '12px',
          margin: '14px 24px 18px',
          lineHeight: 1.6,
        }}
      >
        This document is cryptographically anchored to the FPIA registry and tied to a governed authority identity.
      </p>

      <p
        style={{
          textAlign: 'center',
          color: '#999',
          fontSize: '12px',
          paddingBottom: '60px',
        }}
      >
        Issued under the Fair Properties Inspection Authority (FPIA) trust system. Accountability built in.
      </p>
    </main>
  )
}

const integrityTopGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '18px',
  alignItems: 'start',
  marginBottom: '22px',
}

const authoritySnapshotGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '12px',
  padding: '16px clamp(18px, 4vw, 40px) 0',
  backgroundColor: '#fff',
  borderLeft: '1px solid rgba(11,31,51,0.08)',
  borderRight: '1px solid rgba(11,31,51,0.08)',
}

const authoritySnapshotCardStyle: CSSProperties = {
  padding: '14px 16px',
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  minHeight: '108px',
}

const snapshotPrimaryValueStyle: CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 'clamp(19px, 4vw, 24px)',
  lineHeight: 1.2,
  color: 'var(--navy)',
  margin: 0,
}

const snapshotSecondaryValueStyle: CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.55,
  color: 'var(--navy)',
  margin: 0,
  fontWeight: 600,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

const authorityMetricsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '14px',
}

const authorityMetricCardStyle: CSSProperties = {
  padding: '14px 16px',
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
}

const authorityCredentialFootnoteStyle: CSSProperties = {
  margin: '16px 0 0 0',
  fontSize: '14px',
  lineHeight: 1.7,
  color: '#55606d',
  maxWidth: '720px',
}

const verificationCardStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.12)',
  backgroundColor: '#f5f6f4',
  padding: 'clamp(16px, 3.5vw, 18px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '18px',
  flexWrap: 'wrap',
  marginTop: 'clamp(0px, 7vw, 72px)',
}

const integrityLabelStyle: CSSProperties = {
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  margin: '0 0 6px 0',
  fontWeight: 700,
}

const integrityValueStyle: CSSProperties = {
  fontSize: '14px',
  margin: 0,
  fontWeight: 600,
}
