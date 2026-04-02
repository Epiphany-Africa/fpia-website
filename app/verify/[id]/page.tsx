import DownloadPdfButton from './DownloadPdfButton'
import CopyHashButton from './CopyHashButton'
import QRCode from 'qrcode'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Status = 'Certified' | 'Pending' | 'NotCertified'

type AuditItem = {
  label: string
  value: string
}

type CategoryItem = {
  name: string
  status: 'Pass' | 'Pending' | 'Fail'
}

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
  lock_status: string | null
  inspector_signed_off_by: string | null
  inspector_signed_off_at: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  certified_by: string | null
  certified_at: string | null
  final_hash: string | null
  review_outcome: string | null
  review_notes: string | null
  submitted_for_review_at: string | null
  certificate_number: string | null
}

type PropertyRow = {
  id: string
  title: string | null
  address: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  status: string | null
  transaction_stage: string | null
  property_type: string | null
  notes: string | null
  risk_score: number | null
  created_at: string | null
  unit_number?: string | null
  complex_name?: string | null
  estate_name?: string | null
  building_name?: string | null
}

type CertificateRow = {
  id: string
  case_id: string
  issued_by: string | null
  issued_at: string | null
  certificate_type: string | null
  inspection_status: string | null
  verification_ref: string | null
  recommendation: string | null
  snapshot: any
  certificate_state: string | null
  revoked_at: string | null
  revoked_reason: string | null
  inspector_name: string | null
  inspector_id: string | null
  inspector_title: string | null
  signature_name: string | null
  integrity_hash: string | null
  hash_version: string | null
  signature_image_url: string | null
  stamp_image_url: string | null
  certificate_number: string | null
  trust_score: number | null
}

type AuditLogRow = {
  id: string
  property_id: string | null
  event_type: string | null
  status_label: string | null
  event_message: string | null
  previous_hash: string | null
  new_hash: string | null
  created_at: string
  report_id: string | null
  action: string | null
  performed_by: string | null
}

type InspectorRow = {
  id: string
  full_name: string
  inspector_code: string
  badge_number: string
  company_name: string
  signature_file_path: string | null
  stamp_file_path: string | null
  is_active: boolean
  created_at: string
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

function normalizeStatus(
  registry: RegistryRow | null,
  certificate: CertificateRow | null
): Status {
  if (!registry) return 'NotCertified'

  const registryStatus = (registry.status ?? '').toLowerCase()
  const workflowStatus = (registry.workflow_status ?? '').toLowerCase()
  const reviewOutcome = (registry.review_outcome ?? '').toLowerCase()
  const certificateState = (certificate?.certificate_state ?? '').toLowerCase()

  if (certificate?.revoked_at || certificateState === 'revoked') {
    return 'NotCertified'
  }

  if (
    registryStatus === 'certified' ||
    workflowStatus === 'certified' ||
    reviewOutcome === 'approved'
  ) {
    return 'Certified'
  }

  if (
    registryStatus === 'locked' ||
    workflowStatus === 'in_review' ||
    workflowStatus === 'pending' ||
    reviewOutcome === 'pending'
  ) {
    return 'Pending'
  }

  return 'Pending'
}

function buildAuditTrail(
  registry: RegistryRow | null,
  auditRows: AuditLogRow[] | null
): AuditItem[] {
  const rows = auditRows ?? []

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

function buildCategories(certificate: CertificateRow | null, status: Status): CategoryItem[] {
  const checklist = certificate?.snapshot?.checklist

  if (Array.isArray(checklist) && checklist.length > 0) {
    const grouped = new Map<string, CategoryItem['status']>()

    for (const item of checklist) {
      const section = String(item?.section ?? 'General')
      const result = String(item?.result ?? '').toLowerCase()

      let mapped: CategoryItem['status'] = 'Pending'
      if (result === 'pass') mapped = 'Pass'
      if (result === 'fail') mapped = 'Fail'
      if (result === 'observation') mapped = 'Pending'

      const existing = grouped.get(section)

      if (!existing) {
        grouped.set(section, mapped)
        continue
      }

      if (existing === 'Fail') continue
      if (existing === 'Pending' && mapped === 'Pass') continue
      if (mapped === 'Fail') {
        grouped.set(section, 'Fail')
      } else if (mapped === 'Pending') {
        grouped.set(section, 'Pending')
      }
    }

    return Array.from(grouped.entries()).map(([name, groupedStatus]) => ({
      name,
      status: groupedStatus,
    }))
  }

  if (status === 'NotCertified') {
    return [{ name: 'Certification Status', status: 'Fail' }]
  }

  if (status === 'Pending') {
    return [{ name: 'Certification Status', status: 'Pending' }]
  }

  return [{ name: 'Certification Status', status: 'Pass' }]
}

export default async function VerifyProperty({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const normalizedId = id.toUpperCase()

  const { data: registryData, error: registryError } = await supabase
    .from('report_registry')
    .select('*')
    .or(`certificate_number.eq.${normalizedId},report_code.eq.${normalizedId}`)
    .maybeSingle()

  const registry = (registryData as RegistryRow | null) ?? null

  let property: PropertyRow | null = null
  let certificate: CertificateRow | null = null
  let auditRows: AuditLogRow[] = []
  let inspector: InspectorRow | null = null

  if (registry && !registryError) {
    const [{ data: propertyData }, { data: certificateData }, { data: auditData }] =
      await Promise.all([
        supabase
          .from('properties')
          .select('*')
          .eq('id', registry.property_id)
          .maybeSingle(),
        supabase
          .from('issued_certificates')
          .select('*')
          .or(
            registry.certificate_number
              ? `certificate_number.eq.${registry.certificate_number},verification_ref.eq.${registry.report_code}`
              : `verification_ref.eq.${registry.report_code}`
          )
          .order('issued_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('report_audit_log')
          .select('*')
          .eq('report_id', registry.id)
          .order('created_at', { ascending: true }),
      ])

    property = (propertyData as PropertyRow | null) ?? null
    certificate = (certificateData as CertificateRow | null) ?? null
    auditRows = (auditData as AuditLogRow[] | null) ?? []

    if (registry.inspector_id) {
      const { data: inspectorData } = await supabase
        .from('inspectors')
        .select('*')
        .eq('id', registry.inspector_id)
        .maybeSingle()

      inspector = (inspectorData as InspectorRow | null) ?? null
    }
  }

  const status = normalizeStatus(registry, certificate)

  const verificationHash =
    registry?.final_hash ??
    registry?.report_hash ??
    certificate?.integrity_hash ??
    'No active verification hash'

  const hashDisplay =
    verificationHash.length > 36
      ? `${verificationHash.slice(0, 18)}...${verificationHash.slice(-8)}`
      : verificationHash

  const verificationUrl = `https://www.fairproperties.org.za/verify/${id}`

  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 180,
    margin: 1,
  })

  const auditTrail = buildAuditTrail(registry, auditRows)
  const categories = buildCategories(certificate, status)

  const identityParts = [
    property?.unit_number,
    property?.building_name,
    property?.complex_name,
    property?.estate_name,
  ].filter(Boolean)

  const addressLine1 = identityParts.join(' ')
  const addressLine2 = property?.address ?? ''

  const propertyAddress =
    addressLine1 || addressLine2
      ? [addressLine1, addressLine2].filter(Boolean).join('\n')
      : status === 'NotCertified'
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
      : status === 'NotCertified'
      ? 'Registry lookup only'
      : 'Location not available'

  const inspectorDisplay = inspector
    ? `${inspector.full_name}\n${inspector.badge_number}`
    : certificate?.inspector_name ??
      registry?.inspector_signed_off_by ??
      'FPIA Inspector'

  const validUntil =
    status === 'Certified' ? 'Active until revoked or superseded' : 'Not applicable'

  const ledger =
    registry?.property_code ??
    registry?.report_code ??
    certificate?.verification_ref ??
    'No active ledger entry'

  const mock = {
    id: registry?.certificate_number ?? registry?.report_code ?? id,
    address: propertyAddress,
    province: propertyProvince,
    status,
    inspectionDate: formatDate(registry?.issued_at ?? certificate?.issued_at),
    inspector: inspector
      ? `${inspector.full_name}\n${inspector.badge_number}`
      : certificate?.inspector_title
      ? `${inspectorDisplay}\n${certificate.inspector_title}`
      : inspectorDisplay,
    validUntil,
    ledger,
    auditTrail,
    categories,
  }

  const statusContent: Record<Status, { title: string; message: string }> = {
    Certified: {
      title: 'This property is currently certified.',
      message:
        'This record confirms that the certificate has been verified against the official FPIA registry and reflects the current certified status of the property.',
    },
    Pending: {
      title: 'This property is currently pending certification.',
      message:
        'An FPIA inspection or review is currently in progress. A final certification outcome has not yet been issued on the official registry.',
    },
    NotCertified: {
      title: 'This property is not currently certified.',
      message:
        'No valid active certification was found for this property on the official FPIA registry based on the certificate reference provided.',
    },
  }

  const statementStyles: Record<
    Status,
    { border: string; titleColor: string; backgroundColor: string }
  > = {
    Certified: {
      border: '1px solid rgba(201,161,77,0.3)',
      titleColor: '#1a7f37',
      backgroundColor: '#fff',
    },
    Pending: {
      border: '1px solid rgba(21,101,192,0.28)',
      titleColor: '#1565C0',
      backgroundColor: '#f8fbff',
    },
    NotCertified: {
      border: '1px solid rgba(198,40,40,0.28)',
      titleColor: '#C62828',
      backgroundColor: '#fff8f8',
    },
  }

  const statusStyles: Record<string, CSSProperties> = {
    Certified: {
      background: '#E8F5E9',
      color: '#2E7D32',
      border: '1px solid #2E7D32',
    },
    Pending: {
      background: '#E3F2FD',
      color: '#1565C0',
      border: '1px solid #1565C0',
    },
    NotCertified: {
      background: '#FFEBEE',
      color: '#C62828',
      border: '1px solid #C62828',
    },
  }

  const integrityValueColor =
    mock.status === 'Certified'
      ? 'var(--off-white)'
      : mock.status === 'Pending'
      ? '#BBDEFB'
      : '#E8E2E2'

  const auditBorderColor =
    mock.status === 'Certified'
      ? '2px solid rgba(46,125,50,0.6)'
      : mock.status === 'Pending'
      ? '2px solid rgba(21,101,192,0.6)'
      : '2px solid rgba(198,40,40,0.6)'

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
          margin: '60px auto',
          padding: '0 24px',
        }}
      >
        <img
          src="/fpia-watermark.png"
          alt="FPIA Watermark"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            opacity: 0.05,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              backgroundColor: 'var(--navy)',
              borderRadius: '4px 4px 0 0',
              padding: '24px 40px 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
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
                  height: '68px',
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
                  FPIA Verified Property Record
                </p>
                <p style={{ color: '#a0aec0', fontSize: '14px', margin: 0 }}>
                  #{mock.id}
                </p>
              </div>
            </div>

            <span
              style={{
                ...statusStyles[mock.status],
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              ✔{' '}
              {mock.status === 'NotCertified'
                ? 'NOT CERTIFIED'
                : mock.status.toUpperCase()}
            </span>
          </div>

          <div
            style={{
              backgroundColor: statementStyles[mock.status].backgroundColor,
              border: statementStyles[mock.status].border,
              padding: '20px 24px',
              marginBottom: '16px',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                margin: '0 0 10px 0',
                fontWeight: 700,
              }}
            >
              Verification Outcome
            </p>

            <p
              style={{
                fontSize: '16px',
                color: statementStyles[mock.status].titleColor,
                lineHeight: 1.5,
                margin: '0 0 10px 0',
                fontWeight: 600,
              }}
            >
              {statusContent[mock.status].title}
            </p>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--navy)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {statusContent[mock.status].message}
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--navy)',
              border: '1px solid rgba(201,161,77,0.22)',
              padding: '18px 24px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1.4fr auto',
                gap: '20px',
                alignItems: 'start',
              }}
            >
              <div>
                <p style={integrityLabelStyle}>Record Integrity</p>
                <p
                  style={{
                    ...integrityValueStyle,
                    color: integrityValueColor,
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {registry?.is_locked
                    ? 'Locked'
                    : mock.status === 'Pending'
                    ? 'In Review'
                    : 'No Active Lock'}
                </p>
              </div>

              <div>
                <p style={integrityLabelStyle}>Registry Match</p>
                <p
                  style={{
                    ...integrityValueStyle,
                    color: integrityValueColor,
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {mock.status === 'NotCertified' ? 'No Match Found' : 'Confirmed'}
                </p>
              </div>

              <div>
                <p style={integrityLabelStyle}>Ledger Reference</p>
                <p
                  style={{
                    ...integrityValueStyle,
                    color: integrityValueColor,
                    lineHeight: 1.45,
                    margin: 0,
                    wordBreak: 'break-word',
                  }}
                >
                  {mock.ledger}
                </p>
              </div>

              <div>
                <p style={integrityLabelStyle}>Integrity Hash</p>
                <p
                  style={{
                    ...integrityValueStyle,
                    color: integrityValueColor,
                    lineHeight: 1.45,
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {hashDisplay}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  paddingTop: '34px',
                }}
              >
                <CopyHashButton value={verificationHash} />
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid rgba(11,31,51,0.08)',
              padding: '24px',
              marginBottom: '16px',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                margin: '0 0 18px 0',
                fontWeight: 700,
              }}
            >
              Audit Trail
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
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
                  <p
                    style={{
                      fontSize: '11px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      color: '#6C7077',
                      margin: '0 0 8px 0',
                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </p>

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

          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid rgba(11,31,51,0.08)',
              padding: '24px',
              marginBottom: '16px',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                margin: '0 0 18px 0',
                fontWeight: 700,
              }}
            >
              QR Verification
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
              }}
            >
              <img
                src={qrCodeDataUrl}
                alt={`QR code for certificate ${mock.id}`}
                style={{
                  width: '140px',
                  height: '140px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(11,31,51,0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              />

              <div>
                <p
                  style={{
                    fontSize: '15px',
                    color: 'var(--navy)',
                    fontWeight: 600,
                    margin: '0 0 10px 0',
                  }}
                >
                  Scan to open this verified property record
                </p>

                <p
                  style={{
                    fontSize: '13px',
                    color: '#6C7077',
                    lineHeight: 1.6,
                    margin: '0 0 10px 0',
                  }}
                >
                  This QR code links directly to the official FPIA verification page
                  for this certificate.
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
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <DownloadPdfButton
              id={mock.id}
              status={mock.status}
              address={mock.address}
              province={propertyProvince}
              hash={verificationHash}
              qrCode={qrCodeDataUrl}
              issuedDate={registry?.issued_at ?? certificate?.issued_at}
              validUntil={
                mock.status === 'Certified'
                  ? 'Active until revoked or superseded'
                  : 'Not currently applicable'
              }
              inspectorName={inspector?.full_name ?? certificate?.inspector_name}
              inspectorRole={certificate?.inspector_title ?? 'Authorised Certification Officer'}
              inspectorCode={inspector?.inspector_code ?? certificate?.inspector_id}
              badgeNumber={inspector?.badge_number}
              companyName={inspector?.company_name}
              certificateType={certificate?.certificate_type}
              recommendation={certificate?.recommendation}
              signatureImageUrl={certificate?.signature_image_url}
              stampImageUrl={certificate?.stamp_image_url}
            />
          </div>

          <div
            style={{
              backgroundColor: '#fff',
              padding: '40px',
              borderLeft: '1px solid #eee',
              borderRight: '1px solid #eee',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#999',
                marginBottom: '8px',
              }}
            >
              Property
            </p>

            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '28px',
                marginBottom: '4px',
                whiteSpace: 'pre-line',
              }}
            >
              {mock.address}
            </h2>

            <p style={{ color: '#666', marginBottom: '40px' }}>{mock.province}</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0',
                borderTop: '1px solid #eee',
              }}
            >
              {[
                { label: 'Inspection Date', value: mock.inspectionDate },
                { label: 'Inspector', value: mock.inspector },
                { label: 'Certificate Valid Until', value: mock.validUntil },
                { label: 'Ledger Entry', value: mock.ledger },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    padding: '20px 0',
                    borderBottom: '1px solid #eee',
                    paddingRight: '24px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '11px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#999',
                      marginBottom: '6px',
                    }}
                  >
                    {row.label}
                  </p>

                  <p
                    style={{
                      fontWeight: 600,
                      color: 'var(--navy)',
                      fontSize: '15px',
                      lineHeight: 1.5,
                      margin: 0,
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#fff',
              padding: '40px',
              borderLeft: '1px solid #eee',
              borderRight: '1px solid #eee',
              borderTop: '1px solid #eee',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#999',
                marginBottom: '24px',
              }}
            >
              Compliance Categories
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              }}
            >
              {mock.categories.map((cat, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                          : cat.status === 'Pending'
                          ? '#1565C0'
                          : '#C62828',
                      fontWeight: 600,
                    }}
                  >
                    {cat.status === 'Pass'
                      ? '✔'
                      : cat.status === 'Pending'
                      ? '•'
                      : '✕'}{' '}
                    {cat.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--navy)',
              borderRadius: '0 0 4px 4px',
              padding: '24px 40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ color: '#a0aec0', fontSize: '12px' }}>
              Verified on the FPIA immutable ledger · fairproperties.org.za
            </p>

            <p style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 600 }}>
              {mock.ledger}
            </p>
          </div>
        </div>
      </div>

      <p
        style={{
          textAlign: 'center',
          color: '#999',
          fontSize: '12px',
          paddingBottom: '60px',
        }}
      >
        This certificate was issued by the Fair Property Inspection Authority
        (FPIA) · South Africa
      </p>
    </main>
  )
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