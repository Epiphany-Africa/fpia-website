import Link from 'next/link'
import Image from 'next/image'
import QRCode from 'qrcode'
import type { CSSProperties } from 'react'
import TrustBadge from '@/components/TrustBadge'
import { resolveCertificateAuthorityPresentation } from '@/lib/authority/resolveCertificateAuthorityPresentation'
import {
  getCanonicalTrustState,
  type TrustOutcome,
} from '@/lib/certification/getCanonicalTrustState'
import { getConditionalExplanation } from '@/lib/certification/getConditionalExplanation'
import { getFpiaProduct } from '@/lib/products/fpiaProducts'
import { loadPublicVerificationRecord } from '@/lib/verification/loadPublicVerificationRecord'
import CopyHashButton from './CopyHashButton'
import RequestInspectionCaptureForm from './RequestInspectionCaptureForm'
import ShareRecordPanel from './ShareRecordPanel'

type RegistryRow = {
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
  review_outcome: string | null
  certified_at: string | null
  reviewed_at: string | null
  final_hash: string | null
  submitted_for_review_at: string | null
  certificate_number: string | null
}

type CertificateSnapshot = {
  checklist?: unknown
  inspector?: {
    inspector_name?: string | null
  } | null
} | null

type CertificateRow = {
  id: string
  case_id: string
  issued_at: string | null
  verification_ref: string | null
  recommendation: string | null
  snapshot: CertificateSnapshot
  certificate_state: string | null
  revoked_at: string | null
  revoked_reason: string | null
  inspector_name: string | null
  integrity_hash: string | null
  certificate_number: string | null
  inspection_status: string | null
  fail_items: number | null
  material_items: number | null
  observation_items: number | null
}

type AuditLogRow = {
  id: string
  event_type: string | null
  created_at: string
}

type CaseEventRow = {
  id: string
  event_type: string | null
  event_label: string | null
  created_at: string
}

type AuditItem = {
  label: string
  value: string
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
      {
        label: 'Certificate Reference',
        value: certificate.verification_ref ?? 'Not available',
      },
    ]
  }

  if (!registry && rows.length === 0) {
    return [
      { label: 'Lookup Performed', value: formatDateTime(new Date().toISOString()) },
      { label: 'Registry Match', value: 'No active certification found' },
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
      label: 'Last Verified',
      value: formatDateTime(registry?.certified_at ?? registry?.reviewed_at),
    },
  ]
}

export default async function VerifyPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const {
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

  const trustSummary: Record<TrustOutcome, string> = {
    CONDITIONAL:
      'This property has an active authority-issued certificate with recorded conditions still outstanding.',
    FINAL_VERIFIED:
      'This property is recorded as valid and fully verified in the FPIA registry.',
    SUPERSEDED:
      'A newer authority-issued certificate has replaced this record in the FPIA trust system.',
    NOT_ISSUED: 'No active verified inspection record is currently listed.',
    REVOKED: 'A previously issued record is no longer valid for reliance.',
  }

  const trustMeaning: Record<TrustOutcome, string> = {
    CONDITIONAL:
      'This property has been assessed and issued a conditional certificate. Certain findings or requirements remain outstanding before full certification can be achieved.',
    FINAL_VERIFIED:
      'This property has achieved full certification and meets all required conditions at the time of verification.',
    SUPERSEDED:
      'This certificate remains part of the audit history, but it has been replaced by a newer authority-issued record and should not be used as the current reliance document.',
    NOT_ISSUED:
      'This property does not currently have an active verified record.',
    REVOKED:
      'This certificate has been revoked and should not be relied upon.',
  }

  const buyerGuidance: Record<TrustOutcome, string> = {
    CONDITIONAL:
      'Review the recorded findings and confirm whether the required work will be completed before transfer.',
    FINAL_VERIFIED:
      'No outstanding issues affecting certification were recorded at the time of inspection.',
    SUPERSEDED:
      'Use the latest certificate number or verification reference now associated with this property. This older record is retained for audit history only.',
    NOT_ISSUED:
      'No verified inspection record is currently listed. A formal inspection should be obtained before relying on property condition.',
    REVOKED:
      'This record should not be relied upon. A current inspection is required before proceeding.',
  }

  const nextSteps: Record<TrustOutcome, string[]> = {
    CONDITIONAL: [
      'Review the listed findings.',
      'Confirm whether issues will be resolved before transfer.',
    ],
    FINAL_VERIFIED: ['Proceed with confidence based on current inspection.'],
    SUPERSEDED: ['Use the most recent authority-issued certificate for reliance.'],
    NOT_ISSUED: ['Request an inspection before proceeding.'],
    REVOKED: ['Do not rely on this record — request updated inspection.'],
  }

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

  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 144,
    margin: 1,
  })

  const auditTrail = buildAuditTrail(registry, auditRows, certificate, caseEvents)
  const latestAudit = auditTrail.at(-1)
  const {
    authorityName,
    authorityTitle,
    authorityCode,
    authorityBadgeNumber,
    authorityCompanyName,
  } = resolveCertificateAuthorityPresentation({
    normalizedId: id.toUpperCase(),
    authority,
    authorityAssets,
    legacyInspector,
    certificate,
  })

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
      ? [addressLine1, addressLine2].filter(Boolean).join(', ')
      : 'Address not available'

  const propertyLocation = [property?.city, property?.province, property?.postal_code]
    .filter(Boolean)
    .join(', ')

  const registryPresence = registry || certificate ? 'Record found' : 'No active record'
  const ledgerReference =
    registry?.property_code ??
    registry?.report_code ??
    certificate?.verification_ref ??
    'Not recorded'
  const propertyCode = registry?.property_code ?? registry?.report_code ?? 'Not recorded'
  const issueDate = formatDate(certificate?.issued_at ?? registry?.issued_at)
  const registryDate = formatDate(
    registry?.certified_at ?? registry?.reviewed_at ?? registry?.issued_at ?? certificate?.issued_at
  )

  const registryStatusText: Record<TrustOutcome, string> = {
    CONDITIONAL: 'Recorded with active conditions',
    FINAL_VERIFIED: 'Recorded and active in the FPIA registry',
    SUPERSEDED: 'Superseded by a newer authority-issued record',
    NOT_ISSUED: 'No active registry record',
    REVOKED: 'Record revoked and no longer valid',
  }
  const relianceStatusText: Record<TrustOutcome, string> = {
    CONDITIONAL: 'Valid with active conditions',
    FINAL_VERIFIED: 'Valid for reliance',
    SUPERSEDED: 'Superseded',
    NOT_ISSUED: 'Not issued',
    REVOKED: 'Revoked',
  }
  const authorityRegistryText =
    authority?.status?.toLowerCase() === 'active'
      ? 'Verified active authority registry identity'
      : authority
      ? `Authority registry status: ${authority.status ?? 'not confirmed'}`
      : issuerIdentityWarning
      ? 'Legacy issuer details presented'
      : 'Issuer identity not fully available'

  const hasIntegrityRecord = verificationHash !== 'No active verification hash'
  const integrityCheckText = hasIntegrityRecord
    ? 'Verified — no changes detected'
    : 'No active integrity record'
  const recordLockText = registry?.is_locked
    ? 'Locked — record cannot be altered'
    : 'Not locked'
  const showRegistryVerifiedSignal =
    Boolean(registry) &&
    (trustState === 'FINAL_VERIFIED' || trustState === 'CONDITIONAL')

  const verificationIntegrityItems: {
    label: string
    value: string
    icon: IntegrityIconKind
    tone: IntegrityTone
  }[] = [
    {
      label: 'Registry Status',
      value: registryStatusText[trustState],
      icon: 'check-circle',
      tone: getIntegrityTone(trustState),
    },
    {
      label: 'Integrity Check',
      value: integrityCheckText,
      icon: 'shield',
      tone: hasIntegrityRecord ? 'positive' : 'negative',
    },
    {
      label: 'Record Lock',
      value: recordLockText,
      icon: 'lock',
      tone: registry?.is_locked ? 'positive' : 'neutral',
    },
    {
      label: 'Ledger Entry',
      value: ledgerReference,
      icon: 'check-circle',
      tone: ledgerReference === 'Not recorded' ? 'neutral' : 'positive',
    },
  ]

  const issueCount =
    (certificate?.fail_items ?? 0) +
    (certificate?.material_items ?? 0) +
    (certificate?.observation_items ?? 0)

  const snapshotRows =
    trustState === 'NOT_ISSUED'
      ? [
          { label: 'Inspection record', value: 'Not available', note: 'No verified inspection has been recorded.' },
          { label: 'Priority issues', value: 'Not assessed', note: 'No current inspection findings are available.' },
          { label: 'Material to transfer', value: 'Unknown', note: 'A formal inspection is required for a reliable position.' },
        ]
      : [
          {
            label: 'Recorded issues',
            value: String(issueCount),
            note:
              issueCount === 0
                ? 'No outstanding recorded issues.'
                : 'Total findings currently recorded against this property.',
          },
          {
            label: 'Priority issues',
            value: String(certificate?.fail_items ?? 0),
            note: 'Items requiring the highest level of attention.',
          },
          {
            label: 'Material to transfer',
            value: String(certificate?.material_items ?? 0),
            note: 'Items likely to matter during OTP or transfer decisions.',
          },
        ]

  const showNextActionForm =
    trustState === 'CONDITIONAL' ||
    trustState === 'NOT_ISSUED' ||
    trustState === 'REVOKED'

  const nextActionProduct = showNextActionForm
    ? getFpiaProduct(
        trustState === 'CONDITIONAL' ? 'upgrade_product' : 'inspection_product'
      )
    : null

  const hasCertificateView = Boolean(registry || certificate)

  return (
    <main
      style={{
        backgroundColor: '#f4f5f2',
        color: 'var(--navy)',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: 'clamp(28px, 5vw, 48px) clamp(14px, 4vw, 24px) clamp(56px, 8vw, 80px)',
        }}
      >
        <section style={registryHeaderStyle}>
          <div style={registryHeaderTopStyle}>
            <div style={registryLogoShellStyle}>
              <Image
                src="/fpia-logo.png"
                alt="Fair Properties Inspection Authority"
                width={240}
                height={70}
                priority
                style={{
                  width: 'clamp(152px, 40vw, 220px)',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div style={{ flex: '1 1 520px' }}>
              <p style={eyebrowStyle}>Public Registry Record</p>
              <h1 style={pageTitleStyle}>Official Property Condition Record</h1>
              <p style={pageIntroStyle}>
                Public verification for an authority-backed FPIA record. Accountability built in through the issuing authority registry, the verification ledger, and record integrity controls.
              </p>
            </div>
          </div>

          <div style={registryHeaderMetaGridStyle}>
            <div>
              <p style={sectionLabelStyle}>Reference Number</p>
              <p style={headerMetaValueStyle}>{verificationReference}</p>
            </div>
            <div>
              <p style={sectionLabelStyle}>Reliance Status</p>
              <p style={headerMetaValueStyle}>{relianceStatusText[trustState]}</p>
            </div>
            <div>
              <p style={sectionLabelStyle}>Registry Recorded</p>
              <p style={headerMetaValueStyle}>{registryDate}</p>
            </div>
            <div>
              <p style={sectionLabelStyle}>Authority Registry</p>
              <p style={headerMetaValueStyle}>{authorityRegistryText}</p>
            </div>
          </div>
        </section>

        <section style={statusPanelStyle}>
          <div style={statusHeaderRowStyle}>
            <div style={{ flex: '1 1 280px' }}>
              <p style={sectionLabelStyle}>Trust Status</p>
              <p style={statusSummaryStyle}>{trustSummary[trustState]}</p>
            </div>

            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <TrustBadge trustState={trustState} />
              {showRegistryVerifiedSignal ? (
                <p style={registryVerifiedSignalStyle}>Authority Registry Verified</p>
              ) : null}
            </div>
          </div>

          <div style={definitionGridStyle}>
            <div style={definitionItemStyle}>
              <p style={sectionLabelStyle}>What This Means</p>
              <p style={definitionValueStyle}>{trustMeaning[trustState]}</p>
            </div>
            <div style={definitionItemStyle}>
              <p style={sectionLabelStyle}>What This Means For You</p>
              <p style={definitionValueStyle}>{buyerGuidance[trustState]}</p>
            </div>
          </div>

          <div style={actionRowStyle}>
            {hasCertificateView ? (
              <Link href={`/certificate/${id}`} style={primaryButtonStyle}>
                View Certificate
              </Link>
            ) : null}
            <Link href="/verify" style={secondaryButtonStyle}>
              Verify Another Property
            </Link>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={sectionLabelStyle}>Verified Authority</p>
          <div style={authorityPanelStyle}>
            <div style={authorityPanelCardStyle}>
              <p style={sectionLabelStyle}>Issuing Officer</p>
              <p style={recordPrimaryValueStyle}>{authorityName}</p>
              <p style={authorityMetaStyle}>{authorityTitle}</p>
              <p style={authorityMicrocopyStyle}>
                This public record is tied to the accountable authority identity that issued or controlled the certificate within the FPIA registry.
              </p>
            </div>
            <div style={authorityMetricsGridStyle}>
              <div style={authorityMetricCardStyle}>
                <p style={sectionLabelStyle}>Inspector Code</p>
                <p style={recordValueStyle}>{authorityCode}</p>
              </div>
              <div style={authorityMetricCardStyle}>
                <p style={sectionLabelStyle}>Badge Number</p>
                <p style={recordValueStyle}>{authorityBadgeNumber ?? 'Not recorded'}</p>
              </div>
              <div style={authorityMetricCardStyle}>
                <p style={sectionLabelStyle}>Authority Office</p>
                <p style={recordValueStyle}>{authorityCompanyName}</p>
              </div>
              <div style={authorityMetricCardStyle}>
                <p style={sectionLabelStyle}>Registry Standing</p>
                <p style={recordValueStyle}>{authorityRegistryText}</p>
              </div>
            </div>
          </div>
          {issuerIdentityWarning ? (
            <p style={{ ...integrityMicrocopyStyle, marginTop: '12px', color: '#7F1D1D' }}>
              {issuerIdentityWarning}
            </p>
          ) : null}
        </section>

        <section style={cardStyle}>
          <p style={sectionLabelStyle}>Verification Integrity</p>
          <div style={integrityGridStyle}>
            {verificationIntegrityItems.map((item) => (
              <div key={item.label} style={integrityItemStyle}>
                <div style={integrityItemHeaderStyle}>
                  <IntegrityIcon kind={item.icon} tone={item.tone} />
                  <p style={integrityLabelStyle}>{item.label}</p>
                </div>
                <p style={integrityValueStyle}>{item.value}</p>
              </div>
            ))}
          </div>
          <p style={integrityMicrocopyStyle}>
            This verification record is stored as part of the FPIA registry and
            is protected against unauthorized modification. Any changes to the
            underlying data will invalidate this record.
          </p>
        </section>

        <section style={cardStyle}>
          <p style={sectionLabelStyle}>Property Reference</p>
          <div style={recordGridStyle}>
            <div style={recordItemWideStyle}>
              <p style={sectionLabelStyle}>Registered Address</p>
              <p style={recordPrimaryValueStyle}>{propertyAddress}</p>
              {propertyLocation ? <p style={locationStyle}>{propertyLocation}</p> : null}
            </div>
            <div>
              <p style={sectionLabelStyle}>Property Code</p>
              <p style={recordValueStyle}>{propertyCode}</p>
            </div>
            <div>
              <p style={sectionLabelStyle}>Certificate / Verification Reference</p>
              <p style={recordValueStyle}>{verificationReference}</p>
            </div>
            <div>
              <p style={sectionLabelStyle}>Issue Date</p>
              <p style={recordValueStyle}>{issueDate}</p>
            </div>
            <div>
              <p style={sectionLabelStyle}>Registry Date</p>
              <p style={recordValueStyle}>{registryDate}</p>
            </div>
          </div>
        </section>

        {trustState === 'CONDITIONAL' ? (
          <section style={cardStyle}>
            <p style={sectionLabelStyle}>Conditional Record Notes</p>
            <p style={conditionalHeadingStyle}>Why this property is conditionally certified</p>
            <p style={definitionValueStyle}>
              {conditionalExplanation?.summary ??
                'Recorded findings or unresolved requirements remain outstanding before full certification can be achieved.'}
            </p>

            <div style={snapshotGridStyle}>
              {snapshotRows.map((item) => (
                <div key={item.label} style={snapshotPanelStyle}>
                  <p style={snapshotLabelStyle}>{item.label}</p>
                  <p style={snapshotValueStyle}>{item.value}</p>
                  <p style={snapshotNoteStyle}>{item.note}</p>
                </div>
              ))}
            </div>

            <div style={conditionalNextStepsStyle}>
              <p style={sectionLabelStyle}>Required Next Steps</p>
              <ul style={nextStepsListStyle}>
                {nextSteps[trustState].map((item) => (
                  <li key={item} style={nextStepItemStyle}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <details style={technicalPanelStyle}>
          <summary style={technicalSummaryStyle}>Technical Verification Details</summary>

          <div style={{ padding: '0 clamp(16px, 4vw, 24px) clamp(18px, 4vw, 24px)' }}>
            <div style={technicalGridStyle}>
              <div>
                <p style={technicalLabelStyle}>Registry Presence</p>
                <p style={technicalValueStyle}>{registryPresence}</p>
              </div>
              <div>
                <p style={technicalLabelStyle}>Ledger Reference</p>
                <p style={technicalValueStyle}>{ledgerReference}</p>
              </div>
              <div>
                <p style={technicalLabelStyle}>Audit Indicator</p>
                <p style={technicalValueStyle}>
                  {latestAudit
                    ? `${auditTrail.length} recorded event${auditTrail.length === 1 ? '' : 's'}`
                    : 'No recorded audit events'}
                </p>
                {latestAudit ? <p style={technicalMetaStyle}>Latest: {latestAudit.value}</p> : null}
              </div>
              <div>
                <p style={technicalLabelStyle}>Inspection Date</p>
                <p style={technicalValueStyle}>{formatDate(registry?.issued_at ?? certificate?.issued_at)}</p>
              </div>
            </div>

            <div style={hashPanelStyle}>
              <div style={{ flex: '1 1 420px' }}>
                <p style={technicalLabelStyle}>Integrity Hash</p>
                <p style={hashValueStyle}>{verificationHash}</p>
              </div>
              <CopyHashButton value={verificationHash} />
            </div>

            <div style={technicalIdPanelStyle}>
              <p style={technicalLabelStyle}>Internal Record IDs</p>
              <div style={technicalIdGridStyle}>
                <div>
                  <p style={technicalMetaLabelStyle}>Registry ID</p>
                  <p style={technicalMetaValueStyle}>{registry?.id ?? 'Not available'}</p>
                </div>
                <div>
                  <p style={technicalMetaLabelStyle}>Certificate ID</p>
                  <p style={technicalMetaValueStyle}>{certificate?.id ?? 'Not available'}</p>
                </div>
                <div>
                  <p style={technicalMetaLabelStyle}>Case ID</p>
                  <p style={technicalMetaValueStyle}>
                    {certificate?.case_id ?? caseRecord?.id ?? 'Not available'}
                  </p>
                </div>
              </div>
            </div>

            <div style={technicalLowerGridStyle}>
              <div
                style={{
                  border: '1px solid rgba(11,31,51,0.08)',
                  backgroundColor: '#fbfbfa',
                  padding: 'clamp(16px, 3.4vw, 18px)',
                }}
              >
                <p style={technicalLabelStyle}>Verification QR</p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <Image
                    src={qrCodeDataUrl}
                    alt={`QR code for verification reference ${verificationReference}`}
                    width={96}
                    height={96}
                    style={{ width: '96px', height: '96px', backgroundColor: '#fff', padding: '6px', border: '1px solid rgba(11,31,51,0.08)' }}
                  />
                  <p style={{ ...technicalMetaStyle, maxWidth: '280px', margin: 0 }}>
                    Scan to open this verification page directly.
                  </p>
                </div>
              </div>

              <div
                style={{
                  border: '1px solid rgba(11,31,51,0.08)',
                  backgroundColor: '#fbfbfa',
                  padding: 'clamp(16px, 3.4vw, 18px)',
                }}
              >
                <p style={technicalLabelStyle}>Share Record</p>
                <ShareRecordPanel
                  verifyUrl={verificationUrl}
                  verificationReference={verificationReference}
                  embedUrl={embedBadgeUrl}
                />
              </div>
            </div>
          </div>
        </details>

        {showNextActionForm ? (
          <section style={cardStyle}>
            <p style={sectionLabelStyle}>Next Action</p>
            <p style={definitionValueStyle}>
              {trustState === 'CONDITIONAL'
                ? 'To pursue full certification, the outstanding items must be resolved and verified.'
                : trustState === 'REVOKED'
                ? 'This record is no longer valid. A new inspection is required before a current status can be relied upon.'
                : 'No active verified record is currently listed. A formal inspection is required to create one.'}
            </p>
            {nextActionProduct ? (
              <p style={supportingTextStyle}>
                System route: {nextActionProduct.name} · {nextActionProduct.priceLabel} · {nextActionProduct.price}
              </p>
            ) : null}
            <RequestInspectionCaptureForm propertyReference={verificationReference} />
          </section>
        ) : null}

        <p style={authorityFootnoteStyle}>
          FPIA operates as an independent property verification authority. This
          public record is tied to the issuing authority registry, the locked
          verification ledger, and the inspection outcome recorded at the time
          of issue. Accountability built in.
        </p>
      </div>
    </main>
  )
}

const eyebrowStyle: CSSProperties = {
  color: '#55606d',
  fontSize: '11px',
  letterSpacing: '2.4px',
  textTransform: 'uppercase',
  margin: '0 0 12px 0',
  fontWeight: 700,
}

const pageTitleStyle: CSSProperties = {
  margin: '0 0 10px 0',
  color: 'var(--navy)',
  fontFamily: "'DM Serif Display', serif",
  fontSize: 'clamp(30px, 6vw, 36px)',
  lineHeight: 1.12,
}

const pageIntroStyle: CSSProperties = {
  color: '#55606d',
  fontSize: '14px',
  lineHeight: 1.7,
  margin: 0,
  maxWidth: '720px',
}

const cardStyle: CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid rgba(11,31,51,0.1)',
  padding: 'clamp(18px, 4vw, 24px)',
  marginBottom: '18px',
  overflow: 'hidden',
}

const registryHeaderStyle: CSSProperties = {
  ...cardStyle,
  padding: 'clamp(18px, 4vw, 24px) clamp(18px, 4vw, 24px) clamp(16px, 3.5vw, 20px)',
}

const registryHeaderTopStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '24px',
  flexWrap: 'wrap',
  marginBottom: '18px',
}

const registryLogoShellStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 16px',
  backgroundColor: '#0B1F33',
  border: '1px solid rgba(201,161,77,0.16)',
  borderRadius: '4px',
  boxShadow: '0 8px 18px rgba(11,31,51,0.08)',
}

const registryHeaderMetaGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '16px',
  paddingTop: '18px',
  borderTop: '1px solid rgba(11,31,51,0.08)',
}

const headerMetaValueStyle: CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: 'var(--navy)',
  margin: 0,
  fontWeight: 600,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

const statusPanelStyle: CSSProperties = {
  ...cardStyle,
  padding: '24px',
}

const sectionLabelStyle: CSSProperties = {
  fontSize: '11px',
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
  color: '#6C7077',
  margin: '0 0 10px 0',
  fontWeight: 700,
}

const locationStyle: CSSProperties = {
  fontSize: '14px',
  color: '#6C7077',
  margin: '6px 0 0 0',
}

const statusHeaderRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '24px',
  flexWrap: 'wrap',
  marginBottom: '20px',
}

const statusSummaryStyle: CSSProperties = {
  fontSize: 'clamp(18px, 4.8vw, 21px)',
  lineHeight: 1.4,
  color: 'var(--navy)',
  fontWeight: 600,
  margin: 0,
  maxWidth: '720px',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

const definitionGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
  paddingTop: '20px',
  borderTop: '1px solid rgba(11,31,51,0.08)',
}

const definitionItemStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '18px',
}

const definitionValueStyle: CSSProperties = {
  fontSize: '16px',
  color: 'var(--navy)',
  lineHeight: 1.7,
  margin: 0,
  maxWidth: '760px',
  fontWeight: 500,
}

const supportingTextStyle: CSSProperties = {
  fontSize: '14px',
  color: '#55606d',
  lineHeight: 1.7,
  margin: '12px 0 0 0',
  maxWidth: '760px',
}

const registryVerifiedSignalStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  margin: '12px 0 0 12px',
  padding: '7px 10px',
  borderRadius: '999px',
  border: '1px solid rgba(26, 127, 55, 0.22)',
  backgroundColor: '#F3FBF5',
  color: '#166534',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.4px',
  textTransform: 'uppercase',
}

const authorityPanelStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
  alignItems: 'start',
}

const authorityPanelCardStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '18px',
}

const authorityMetricsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '14px',
}

const authorityMetricCardStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '18px',
  minHeight: '116px',
}

const authorityMetaStyle: CSSProperties = {
  fontSize: '14px',
  color: '#55606d',
  margin: '8px 0 0 0',
  lineHeight: 1.6,
}

const authorityMicrocopyStyle: CSSProperties = {
  fontSize: '14px',
  color: '#55606d',
  margin: '12px 0 0 0',
  lineHeight: 1.7,
}

const integrityGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px',
}

const integrityItemStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '18px',
  minHeight: '124px',
}

const integrityItemHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '12px',
}

const integrityLabelStyle: CSSProperties = {
  fontSize: '11px',
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
  color: '#6C7077',
  margin: 0,
  fontWeight: 700,
}

const integrityValueStyle: CSSProperties = {
  fontSize: '16px',
  lineHeight: 1.6,
  color: 'var(--navy)',
  margin: 0,
  fontWeight: 600,
}

const integrityMicrocopyStyle: CSSProperties = {
  fontSize: '14px',
  color: '#55606d',
  lineHeight: 1.7,
  margin: '16px 0 0 0',
  maxWidth: '760px',
}

const actionRowStyle: CSSProperties = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  marginTop: '20px',
}

const recordGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '16px',
}

const recordItemWideStyle: CSSProperties = {
  gridColumn: '1 / -1',
}

const recordPrimaryValueStyle: CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 'clamp(20px, 5vw, 24px)',
  lineHeight: 1.2,
  color: 'var(--navy)',
  margin: 0,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

const recordValueStyle: CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.6,
  color: 'var(--navy)',
  margin: 0,
  fontWeight: 600,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

const conditionalHeadingStyle: CSSProperties = {
  fontSize: '20px',
  lineHeight: 1.4,
  color: 'var(--navy)',
  margin: '0 0 12px 0',
  fontWeight: 600,
}

const snapshotGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '16px',
  marginTop: '18px',
}

const snapshotPanelStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '18px',
  minHeight: '132px',
}

const snapshotLabelStyle: CSSProperties = {
  fontSize: '11px',
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
  color: '#6C7077',
  margin: '0 0 10px 0',
  fontWeight: 700,
}

const snapshotValueStyle: CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: '30px',
  lineHeight: 1,
  color: 'var(--navy)',
  margin: '0 0 10px 0',
}

const snapshotNoteStyle: CSSProperties = {
  fontSize: '13px',
  color: '#55606d',
  lineHeight: 1.65,
  margin: 0,
}

const conditionalNextStepsStyle: CSSProperties = {
  marginTop: '20px',
  paddingTop: '18px',
  borderTop: '1px solid rgba(11,31,51,0.08)',
}

const nextStepsListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: '12px',
}

const nextStepItemStyle: CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.65,
  color: 'var(--navy)',
  padding: '14px 16px',
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
}

const primaryButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '1 1 220px',
  minHeight: '44px',
  padding: '11px 16px',
  backgroundColor: '#0B1F33',
  color: '#fff',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 600,
}

const secondaryButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '1 1 220px',
  minHeight: '44px',
  padding: '11px 16px',
  backgroundColor: '#fff',
  color: 'var(--navy)',
  border: '1px solid rgba(11,31,51,0.16)',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 600,
}

const technicalPanelStyle: CSSProperties = {
  ...cardStyle,
  padding: 0,
  overflow: 'hidden',
}

const technicalSummaryStyle: CSSProperties = {
  listStyle: 'none',
  cursor: 'pointer',
  padding: '18px clamp(16px, 4vw, 24px)',
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--navy)',
  borderBottom: '1px solid rgba(11,31,51,0.08)',
}

const technicalGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '18px',
  marginBottom: '18px',
}

const technicalLowerGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
}

const technicalLabelStyle: CSSProperties = {
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#6C7077',
  margin: '0 0 8px 0',
  fontWeight: 700,
}

const technicalValueStyle: CSSProperties = {
  fontSize: '15px',
  color: 'var(--navy)',
  margin: 0,
  lineHeight: 1.6,
  fontWeight: 600,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

const technicalMetaStyle: CSSProperties = {
  fontSize: '13px',
  color: '#55606d',
  lineHeight: 1.6,
  margin: '6px 0 0 0',
}

const technicalIdPanelStyle: CSSProperties = {
  marginBottom: '18px',
  padding: '18px',
  backgroundColor: '#fbfbfa',
  border: '1px solid rgba(11,31,51,0.08)',
}

const technicalIdGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '16px',
}

const technicalMetaLabelStyle: CSSProperties = {
  fontSize: '11px',
  letterSpacing: '1.6px',
  textTransform: 'uppercase',
  color: '#6C7077',
  margin: '0 0 6px 0',
  fontWeight: 700,
}

const technicalMetaValueStyle: CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.7,
  color: 'var(--navy)',
  margin: 0,
  fontFamily: 'monospace',
  wordBreak: 'break-all',
}

const hashPanelStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '16px',
  flexWrap: 'wrap',
  marginBottom: '18px',
  padding: '18px',
  backgroundColor: '#fbfbfa',
  border: '1px solid rgba(11,31,51,0.08)',
}

const hashValueStyle: CSSProperties = {
  fontSize: '13px',
  color: 'var(--navy)',
  margin: 0,
  lineHeight: 1.7,
  fontFamily: 'monospace',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

const authorityFootnoteStyle: CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.7,
  color: '#55606d',
  margin: 0,
  maxWidth: '760px',
}

type IntegrityTone = 'positive' | 'warning' | 'negative' | 'neutral'
type IntegrityIconKind = 'shield' | 'lock' | 'check-circle'

function getIntegrityTone(trustState: TrustOutcome): IntegrityTone {
  if (trustState === 'FINAL_VERIFIED') return 'positive'
  if (trustState === 'CONDITIONAL') return 'warning'
  if (trustState === 'SUPERSEDED') return 'neutral'
  if (trustState === 'REVOKED' || trustState === 'NOT_ISSUED') return 'negative'
  return 'neutral'
}

function IntegrityIcon({
  kind,
  tone,
}: {
  kind: IntegrityIconKind
  tone: IntegrityTone
}) {
  const { iconColor, iconBackground } = getIntegrityToneStyles(tone)

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '999px',
        backgroundColor: iconBackground,
        color: iconColor,
        flexShrink: 0,
      }}
    >
      {kind === 'shield' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L18 5.5V11C18 15.1 15.45 18.9 12 20.5C8.55 18.9 6 15.1 6 11V5.5L12 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {kind === 'lock' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 10V7.5C8 5.57 9.57 4 11.5 4C13.43 4 15 5.57 15 7.5V10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <rect
            x="6"
            y="10"
            width="11"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      ) : null}
      {kind === 'check-circle' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M8.8 12.2L11.2 14.6L15.6 10.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  )
}

function getIntegrityToneStyles(tone: IntegrityTone) {
  if (tone === 'positive') {
    return { iconColor: '#166534', iconBackground: '#ECFDF3' }
  }

  if (tone === 'warning') {
    return { iconColor: '#8A5A12', iconBackground: '#FFF7ED' }
  }

  if (tone === 'negative') {
    return { iconColor: '#7F1D1D', iconBackground: '#FFF1F2' }
  }

  return { iconColor: '#55606d', iconBackground: '#F3F4F6' }
}
