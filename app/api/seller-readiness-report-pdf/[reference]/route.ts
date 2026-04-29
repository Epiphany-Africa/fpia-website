import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { loadPublicSellerReadinessReport } from '@/lib/seller-readiness/loadPublicSellerReadinessReport'

export const dynamic = 'force-dynamic'

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

function formatEstimateRange(min: number | null, max: number | null, currency = 'ZAR') {
  if (typeof min !== 'number' || typeof max !== 'number') {
    return 'Estimate pending authority review'
  }

  return `${formatCurrency(min, currency)} to ${formatCurrency(max, currency)}`
}

function formatRiskLabel(value: string | null) {
  if (!value) return 'Not assessed'
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function buildDownloadFileName(reference: string) {
  return `FPIA-Seller-Readiness-${reference.replace(/[^A-Z0-9._-]+/gi, '_')}.pdf`
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference } = await params
  const report = await loadPublicSellerReadinessReport(reference)

  if (!report) {
    return NextResponse.json({ error: 'Report not available.' }, { status: 404 })
  }

  const { assessment, damageItems } = report

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
  })

  const navy: [number, number, number] = [11, 31, 51]
  const grey: [number, number, number] = [90, 102, 117]
  const lightGrey: [number, number, number] = [233, 236, 239]
  const gold: [number, number, number] = [201, 161, 77]

  let y = 20

  const writeBlock = (title: string, body: string | string[], options?: { mono?: boolean }) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...grey)
    doc.text(title.toUpperCase(), 18, y)
    y += 6

    doc.setFont(options?.mono ? 'courier' : 'helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...navy)

    const lines = Array.isArray(body)
      ? body.flatMap((item) => doc.splitTextToSize(item, 174))
      : doc.splitTextToSize(body, 174)

    doc.text(lines, 18, y)
    y += lines.length * 5 + 5
  }

  doc.setFillColor(...navy)
  doc.rect(0, 0, 210, 28, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('FPIA Seller Readiness Assessment', 18, 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.text('Pre-Listing Property Readiness Report', 18, 22)

  doc.saveGraphicsState()
  doc.setGState(doc.GState({ opacity: 0.05 }))
  doc.setTextColor(168, 176, 186)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  doc.text('FPIA', 52, 160, { angle: 24 })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('INTEGRITY ANCHORED TO LIVE REGISTRY', 68, 174, { angle: 24 })
  doc.setFont('courier', 'bold')
  doc.setFontSize(8)
  doc.text(`REF ${assessment.report_reference ?? reference.toUpperCase()}`, 89, 188, { angle: 24 })
  doc.restoreGraphicsState()

  y = 40

  writeBlock('Report Reference', assessment.report_reference ?? reference.toUpperCase(), {
    mono: true,
  })
  writeBlock('Generated', formatDate(assessment.report_generated_at))
  writeBlock('Property', [
    assessment.property_address,
    [assessment.suburb, assessment.city, assessment.province, assessment.postal_code]
      .filter(Boolean)
      .join(', '),
  ].filter(Boolean))

  doc.setDrawColor(...lightGrey)
  doc.line(18, y, 192, y)
  y += 8

  writeBlock(
    'Reinstatement Cost Estimate',
    typeof assessment.reinstatement_estimate_amount === 'number'
      ? formatCurrency(
          assessment.reinstatement_estimate_amount,
          assessment.reinstatement_estimate_currency ?? 'ZAR'
        )
      : 'Estimate pending required inputs'
  )
  writeBlock(
    'Visible Damage Repair Estimate',
    formatEstimateRange(
      assessment.visible_damage_estimate_min,
      assessment.visible_damage_estimate_max,
      assessment.expected_price_currency
    )
  )
  writeBlock(
    'Seller Readiness Score',
    assessment.readiness_score === null ? 'Pending' : String(assessment.readiness_score)
  )
  writeBlock('Buyer Negotiation Risk', formatRiskLabel(assessment.buyer_negotiation_risk))
  writeBlock('Disclosure Risk', formatRiskLabel(assessment.disclosure_risk_level))
  writeBlock(
    'Suggested Listing Posture',
    assessment.recommended_listing_posture ?? 'Authority review required'
  )
  writeBlock(
    'Pricing Guidance',
    assessment.pricing_guidance_summary ?? 'Pricing guidance has not been published on this report yet.'
  )

  const findingLines =
    damageItems.length > 0
      ? damageItems.map((item) => {
          const title = [item.damage_category, item.building_element, item.location_on_property]
            .filter(Boolean)
            .join(' · ')
          const estimate = formatEstimateRange(
            item.estimated_cost_min,
            item.estimated_cost_max,
            assessment.expected_price_currency
          )

          return `${title || 'Visible damage item'}: ${
            item.visible_condition ?? 'Visible condition summary not recorded.'
          } Severity ${formatRiskLabel(item.severity)}. Confidence ${formatRiskLabel(
            item.confidence
          )}. Estimate ${estimate}.`
        })
      : ['No authority-reviewed visible damage findings are recorded on this published report.']

  writeBlock('Damage Findings Summary', findingLines)
  writeBlock('Disclaimer', assessment.disclaimer)

  doc.setFillColor(...navy)
  doc.rect(0, 286, 210, 11, 'F')
  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('www.fairproperties.org.za', 105, 293, { align: 'center' })

  return new NextResponse(Buffer.from(doc.output('arraybuffer')), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${buildDownloadFileName(
        assessment.report_reference ?? reference.toUpperCase()
      )}"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
