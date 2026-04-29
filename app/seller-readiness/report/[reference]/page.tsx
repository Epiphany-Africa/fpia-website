import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import {
  loadPublicSellerReadinessReport,
  type PublicSellerReadinessAssessment,
  type PublicSellerReadinessDamageItem,
  type PublicSellerReadinessDocument,
} from '@/lib/seller-readiness/loadPublicSellerReadinessReport'

function formatDate(input: string | null) {
  if (!input) return 'Not available'

  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return 'Not available'

  return new Intl.DateTimeFormat('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatCurrency(amount: number | null, currency = 'ZAR') {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'Not available'
  }

  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatArea(amount: number | null) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return 'Not recorded'
  }

  return `${new Intl.NumberFormat('en-ZA', {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)} m²`
}

function formatEstimateRange(
  min: number | null,
  max: number | null,
  currency = 'ZAR'
) {
  if (typeof min !== 'number' || typeof max !== 'number') {
    return 'Estimate pending authority review'
  }

  return `${formatCurrency(min, currency)} to ${formatCurrency(max, currency)}`
}

function formatRiskLabel(value: string | null) {
  if (!value) return 'Not assessed'
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDocumentStatus(value: string | null) {
  if (!value) return 'Not started'
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function buildLocationLine(assessment: PublicSellerReadinessAssessment) {
  const parts = [
    assessment.suburb,
    assessment.city,
    assessment.province,
    assessment.postal_code,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(', ') : null
}

function buildPropertySummaryRows(assessment: PublicSellerReadinessAssessment) {
  return [
    { label: 'Property Type', value: assessment.property_type ?? 'Not recorded' },
    { label: 'Floor Area', value: formatArea(assessment.floor_area_m2) },
    { label: 'Erf Size', value: formatArea(assessment.erf_size_m2) },
    {
      label: 'Bedrooms / Bathrooms / Garages',
      value: [assessment.bedrooms, assessment.bathrooms, assessment.garages]
        .map((value) => (typeof value === 'number' ? String(value) : '—'))
        .join(' / '),
    },
    { label: 'Finish Tier', value: assessment.finish_tier ?? 'Not recorded' },
    {
      label: 'Expected Asking Position',
      value:
        typeof assessment.expected_asking_price === 'number'
          ? formatCurrency(
              assessment.expected_asking_price,
              assessment.expected_price_currency
            )
          : 'Not provided',
    },
    {
      label: 'Selling Urgency',
      value: assessment.selling_urgency
        ? formatRiskLabel(assessment.selling_urgency)
        : 'Not provided',
    },
  ]
}

function buildDisclosureItems(damageItems: PublicSellerReadinessDamageItem[]) {
  const items = damageItems
    .filter(
      (item) =>
        item.severity === 'high' ||
        item.severity === 'critical' ||
        item.specialist_required
    )
    .map((item) => {
      const title = [item.damage_category, item.building_element, item.location_on_property]
        .filter(Boolean)
        .join(' · ')

      const summary = item.visible_condition ?? 'Visible issue recorded.'
      const specialist = item.specialist_required
        ? item.recommended_specialist
          ? `Specialist review recommended: ${item.recommended_specialist}.`
          : 'Specialist review recommended.'
        : null

      return [title || 'Recorded disclosure item', summary, specialist]
        .filter(Boolean)
        .join(' ')
    })

  return items.length > 0
    ? items
    : ['No authority-reviewed high-risk disclosure items are currently recorded on this report.']
}

function buildDisclosureSupportSummary(
  damageItems: PublicSellerReadinessDamageItem[],
  ppraDocument: PublicSellerReadinessDocument | null
) {
  const flaggedItems = damageItems.filter(
    (item) =>
      item.specialist_required ||
      item.severity === 'high' ||
      item.severity === 'critical'
  )

  const summaries = flaggedItems.map((item) => {
    const heading = [item.damage_category, item.building_element, item.location_on_property]
      .filter(Boolean)
      .join(' · ')
    const evidenceNote = item.image_url
      ? `Evidence photo linked${item.uploaded_file_name ? `: ${item.uploaded_file_name}` : '.'}`
      : 'No evidence photo link published.'
    const specialistNote = item.specialist_required
      ? item.recommended_specialist
        ? `Specialist review recommended: ${item.recommended_specialist}.`
        : 'Specialist review recommended.'
      : null

    return [heading || 'Authority-reviewed visible issue', item.visible_condition, specialistNote, evidenceNote]
      .filter(Boolean)
      .join(' ')
  })

  summaries.push(
    `PPRA form uploaded: ${ppraDocument?.file_path ? 'Yes' : 'No'}. PPRA form signed: ${
      ppraDocument?.document_status === 'signed' ? 'Yes' : 'No / not confirmed'
    }.`
  )

  return summaries.length > 1
    ? summaries
    : [
        'No authority-reviewed high or critical disclosure-support items are currently recorded on this report.',
        summaries[0],
      ]
}

function buildRecommendedActions(damageItems: PublicSellerReadinessDamageItem[]) {
  const actions = new Set<string>()

  for (const item of damageItems) {
    if (item.specialist_required) {
      actions.add(
        item.recommended_specialist
          ? `Obtain ${item.recommended_specialist} input before listing where this visible issue affects buyer confidence.`
          : 'Obtain specialist input before listing where this visible issue affects buyer confidence.'
      )
    }

    if (item.severity === 'critical' || item.severity === 'high') {
      actions.add(
        'Resolve or clearly disclose high-exposure visible issues before going to market.'
      )
    }

    if (item.visible_condition) {
      actions.add('Prepare supporting disclosure wording and repair quotations for buyer enquiries.')
    }
  }

  if (actions.size === 0) {
    actions.add('Maintain current evidence and disclosure records before listing.')
  }

  return Array.from(actions).slice(0, 4)
}

function buildTrustCopy(assessment: PublicSellerReadinessAssessment) {
  if (assessment.readiness_score === null) {
    return 'This report is authority-reviewed and recorded on the governed FPIA seller-readiness workflow.'
  }

  if (assessment.readiness_score >= 85) {
    return 'This report indicates a strong pre-listing position, subject to ordinary market and buyer diligence.'
  }

  if (assessment.readiness_score >= 70) {
    return 'This report indicates a listable position with minor or manageable visible exposure.'
  }

  if (assessment.readiness_score >= 50) {
    return 'This report indicates material negotiation pressure unless issues are repaired or clearly disclosed.'
  }

  return 'This report indicates significant pre-listing risk and likely buyer negotiation pressure unless repairs or specialist reviews are completed first.'
}

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>{title}</p>
      {children}
    </section>
  )
}

export default async function SellerReadinessReportPage({
  params,
}: {
  params: Promise<{ reference: string }>
}) {
  const { reference } = await params
  const report = await loadPublicSellerReadinessReport(reference)

  if (!report) {
    return (
      <main style={pageShellStyle}>
        <div style={containerStyle}>
          <section style={heroCardStyle}>
            <p style={eyebrowStyle}>Pre-Listing Property Readiness Report</p>
            <h1 style={pageTitleStyle}>Report not available.</h1>
            <p style={supportingTextStyle}>
              The requested seller-readiness report is not public yet or the reference is invalid.
            </p>
            <div style={buttonRowStyle}>
              <Link href="/seller-readiness" style={primaryButtonStyle}>
                Start Seller Readiness Assessment
              </Link>
              <Link href="/verify" style={secondaryButtonStyle}>
                Visit Public Registry
              </Link>
            </div>
          </section>
        </div>
      </main>
    )
  }

  const { assessment, damageItems, documents } = report
  const ppraDocument =
    documents.find((document) => document.document_type === 'ppra_section_67_disclosure') ??
    null
  const locationLine = buildLocationLine(assessment)
  const disclosureItems = buildDisclosureItems(damageItems)
  const disclosureSupportSummary = buildDisclosureSupportSummary(
    damageItems,
    ppraDocument
  )
  const recommendedActions = buildRecommendedActions(damageItems)
  const propertySummaryRows = buildPropertySummaryRows(assessment)
  const visibleDamageRange = formatEstimateRange(
    assessment.visible_damage_estimate_min,
    assessment.visible_damage_estimate_max,
    assessment.expected_price_currency
  )
  const reinstatementEstimate =
    typeof assessment.reinstatement_estimate_amount === 'number'
      ? formatCurrency(
          assessment.reinstatement_estimate_amount,
          assessment.reinstatement_estimate_currency ?? 'ZAR'
        )
      : 'Estimate pending required inputs'

  return (
    <main style={pageShellStyle}>
      <div style={containerStyle}>
        <section style={heroCardStyle}>
          <div style={heroHeaderStyle}>
            <div>
              <p style={eyebrowStyle}>FPIA Seller Readiness Assessment</p>
              <h1 style={pageTitleStyle}>Pre-Listing Property Readiness Report</h1>
              <p style={supportingTextStyle}>
                Before you list, understand the visible issues buyers may use to renegotiate.
              </p>
            </div>
            <div style={heroMetaStyle}>
              <p style={metaLabelStyle}>Report Reference</p>
              <p style={metaValueStyle}>{assessment.report_reference ?? reference.toUpperCase()}</p>
              <p style={metaLabelStyle}>Generated</p>
              <p style={metaValueStyle}>{formatDate(assessment.report_generated_at)}</p>
            </div>
          </div>

          <div style={heroSummaryGridStyle}>
            <div style={heroSummaryCardStyle}>
              <p style={metaLabelStyle}>Seller Readiness Score</p>
              <p style={scoreValueStyle}>
                {assessment.readiness_score === null ? 'Pending' : assessment.readiness_score}
              </p>
            </div>
            <div style={heroSummaryCardStyle}>
              <p style={metaLabelStyle}>Buyer Negotiation Risk</p>
              <p style={heroCardValueStyle}>
                {formatRiskLabel(assessment.buyer_negotiation_risk)}
              </p>
            </div>
            <div style={heroSummaryCardStyle}>
              <p style={metaLabelStyle}>Disclosure Risk</p>
              <p style={heroCardValueStyle}>
                {formatRiskLabel(assessment.disclosure_risk_level)}
              </p>
            </div>
          </div>
        </section>

        <Section title="Property Summary">
          <h2 style={propertyTitleStyle}>{assessment.property_address}</h2>
          {locationLine ? <p style={locationStyle}>{locationLine}</p> : null}

          <div style={summaryGridStyle}>
            {propertySummaryRows.map((row) => (
              <div key={row.label} style={summaryCardStyle}>
                <p style={metaLabelStyle}>{row.label}</p>
                <p style={summaryValueStyle}>{row.value}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Assessment Outputs">
          <div style={summaryGridStyle}>
            <div style={summaryCardStyle}>
              <p style={metaLabelStyle}>Reinstatement Cost Estimate</p>
              <p style={summaryValueStyle}>{reinstatementEstimate}</p>
              {assessment.reinstatement_estimate_basis_summary ? (
                <p style={summaryNoteStyle}>
                  {assessment.reinstatement_estimate_basis_summary}
                </p>
              ) : null}
            </div>

            <div style={summaryCardStyle}>
              <p style={metaLabelStyle}>Visible Damage Repair Estimate</p>
              <p style={summaryValueStyle}>{visibleDamageRange}</p>
              <p style={summaryNoteStyle}>
                Authority-reviewed visible repair exposure only. Not a contractor quote.
              </p>
            </div>

            <div style={summaryCardStyle}>
              <p style={metaLabelStyle}>Suggested Listing Posture</p>
              <p style={summaryValueStyle}>
                {assessment.recommended_listing_posture ?? 'Authority review required'}
              </p>
            </div>
          </div>
        </Section>

        <Section title="Pricing Guidance">
          <p style={bodyTextStyle}>
            {assessment.pricing_guidance_summary ??
              'Pricing guidance has not been published on this report yet.'}
          </p>
          <p style={supportingTextStyle}>{buildTrustCopy(assessment)}</p>
        </Section>

        <Section title="Disclosure Risk Items">
          <ul style={listStyle}>
            {disclosureItems.map((item) => (
              <li key={item} style={listItemStyle}>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Disclosure Support">
          <div style={summaryGridStyle}>
            <div style={summaryCardStyle}>
              <p style={metaLabelStyle}>PPRA Section 67 form status</p>
              <p style={summaryValueStyle}>
                {formatDocumentStatus(ppraDocument?.document_status ?? 'not_started')}
              </p>
              <p style={summaryNoteStyle}>Immovable Property Condition Report</p>
            </div>
            <div style={summaryCardStyle}>
              <p style={metaLabelStyle}>Document uploaded</p>
              <p style={summaryValueStyle}>{ppraDocument?.file_path ? 'Uploaded' : 'Not uploaded'}</p>
              <p style={summaryNoteStyle}>
                {ppraDocument?.file_url ? 'Authority-held copy is on record.' : 'No uploaded copy is attached to this published report.'}
              </p>
            </div>
            <div style={summaryCardStyle}>
              <p style={metaLabelStyle}>Signed status</p>
              <p style={summaryValueStyle}>
                {ppraDocument?.document_status === 'signed' ? 'Signed' : 'Not confirmed'}
              </p>
              <p style={summaryNoteStyle}>
                FPIA does not replace the prescribed PPRA form or the transaction process.
              </p>
            </div>
          </div>

          <p style={{ ...metaLabelStyle, marginTop: 18 }}>Disclosure Support Summary</p>
          <p style={summaryNoteStyle}>
            These items may assist the seller, property practitioner, and legal advisers when completing or reviewing the prescribed disclosure process.
          </p>
          <ul style={listStyle}>
            {disclosureSupportSummary.map((item) => (
              <li key={item} style={listItemStyle}>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Recommended Pre-Listing Actions">
          <ul style={listStyle}>
            {recommendedActions.map((item) => (
              <li key={item} style={listItemStyle}>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Damage Findings Summary">
          {damageItems.length === 0 ? (
            <p style={bodyTextStyle}>
              No authority-reviewed visible damage findings are recorded on this published report.
            </p>
          ) : (
            <div style={damageGridStyle}>
              {damageItems.map((item) => (
                <article key={item.id} style={damageCardStyle}>
                  <p style={metaLabelStyle}>
                    {[item.damage_category, item.building_element, item.location_on_property]
                      .filter(Boolean)
                      .join(' · ') || 'Visible damage item'}
                  </p>
                  <p style={summaryValueStyle}>
                    {item.visible_condition ?? 'Visible condition summary not recorded.'}
                  </p>
                  <p style={summaryNoteStyle}>
                    Severity: {formatRiskLabel(item.severity)} | Confidence:{' '}
                    {formatRiskLabel(item.confidence)}
                  </p>
                  <p style={summaryNoteStyle}>
                    Estimate: {formatEstimateRange(item.estimated_cost_min, item.estimated_cost_max)}
                  </p>
                  {item.specialist_required ? (
                    <p style={summaryNoteStyle}>
                      Specialist review recommended
                      {item.recommended_specialist ? `: ${item.recommended_specialist}` : '.'}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </Section>

        <Section title="Trust and Disclaimer">
          <p style={bodyTextStyle}>
            FPIA helps sellers move from guesswork to governed pre-sale intelligence.
          </p>
          <p style={bodyTextStyle}>{assessment.disclaimer}</p>
          <p style={summaryNoteStyle}>
            FPIA does not replace the PPRA mandatory disclosure form, legal advice,
            conveyancing advice, or the seller/property practitioner&apos;s statutory obligations.
          </p>
          <div style={buttonRowStyle}>
            <Link
              href={`/api/seller-readiness-report-pdf/${assessment.report_reference ?? reference.toUpperCase()}`}
              style={primaryButtonStyle}
            >
              Download PDF
            </Link>
            <Link href="/seller-readiness" style={secondaryButtonStyle}>
              Start New Assessment
            </Link>
          </div>
        </Section>
      </div>
    </main>
  )
}

const pageShellStyle: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f4f5f2',
  color: 'var(--navy)',
}

const containerStyle: CSSProperties = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: 'clamp(28px, 5vw, 48px) clamp(14px, 4vw, 24px) clamp(56px, 8vw, 80px)',
}

const cardStyle: CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid rgba(11,31,51,0.1)',
  padding: 'clamp(18px, 4vw, 24px)',
  marginBottom: '18px',
}

const heroCardStyle: CSSProperties = {
  ...cardStyle,
  padding: 'clamp(20px, 5vw, 28px)',
}

const heroHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '24px',
  flexWrap: 'wrap',
  marginBottom: '20px',
}

const heroMetaStyle: CSSProperties = {
  minWidth: '220px',
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '16px',
}

const heroSummaryGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px',
}

const heroSummaryCardStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '16px',
}

const summaryGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '14px',
}

const summaryCardStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '16px',
}

const damageGridStyle: CSSProperties = {
  display: 'grid',
  gap: '14px',
}

const damageCardStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '16px',
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
  fontSize: 'clamp(30px, 6vw, 38px)',
  lineHeight: 1.12,
}

const propertyTitleStyle: CSSProperties = {
  margin: '0 0 8px 0',
  color: 'var(--navy)',
  fontFamily: "'DM Serif Display', serif",
  fontSize: 'clamp(22px, 5vw, 28px)',
  lineHeight: 1.16,
}

const locationStyle: CSSProperties = {
  fontSize: '15px',
  color: '#55606d',
  margin: '0 0 18px 0',
  lineHeight: 1.6,
}

const supportingTextStyle: CSSProperties = {
  fontSize: '14px',
  color: '#55606d',
  lineHeight: 1.7,
  margin: 0,
  maxWidth: '760px',
}

const bodyTextStyle: CSSProperties = {
  fontSize: '16px',
  color: 'var(--navy)',
  lineHeight: 1.75,
  margin: '0 0 12px 0',
}

const metaLabelStyle: CSSProperties = {
  fontSize: '11px',
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
  color: '#6C7077',
  margin: '0 0 8px 0',
  fontWeight: 700,
}

const metaValueStyle: CSSProperties = {
  margin: '0 0 12px 0',
  color: 'var(--navy)',
  fontSize: '15px',
  lineHeight: 1.6,
  fontWeight: 600,
  wordBreak: 'break-word',
}

const scoreValueStyle: CSSProperties = {
  margin: 0,
  color: 'var(--navy)',
  fontSize: '34px',
  lineHeight: 1,
  fontFamily: "'DM Serif Display', serif",
}

const heroCardValueStyle: CSSProperties = {
  margin: 0,
  color: 'var(--navy)',
  fontSize: '18px',
  lineHeight: 1.35,
  fontWeight: 600,
}

const summaryValueStyle: CSSProperties = {
  margin: 0,
  color: 'var(--navy)',
  fontSize: '16px',
  lineHeight: 1.6,
  fontWeight: 600,
}

const summaryNoteStyle: CSSProperties = {
  margin: '10px 0 0 0',
  color: '#55606d',
  fontSize: '13px',
  lineHeight: 1.6,
}

const listStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: '12px',
}

const listItemStyle: CSSProperties = {
  border: '1px solid rgba(11,31,51,0.08)',
  backgroundColor: '#fbfbfa',
  padding: '14px 16px',
  fontSize: '15px',
  lineHeight: 1.65,
  color: 'var(--navy)',
}

const buttonRowStyle: CSSProperties = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  marginTop: '18px',
}

const primaryButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  minHeight: '44px',
  padding: '11px 16px',
  backgroundColor: '#fff',
  color: 'var(--navy)',
  border: '1px solid rgba(11,31,51,0.16)',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 600,
}
