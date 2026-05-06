import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { leaseLedgerOnePager } from '@/lib/leaseLedger/onePagerContent'

export const dynamic = 'force-dynamic'

const FILENAME = 'FPIA-Lease-Ledger-One-Pager.pdf'

export async function GET() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
  })

  const navy: [number, number, number] = [11, 31, 51]
  const gold: [number, number, number] = [201, 161, 77]
  const lightGrey: [number, number, number] = [228, 232, 238]

  let y = 20

  const ensureSpace = (needed = 18) => {
    if (y + needed <= 278) return
    doc.addPage()
    y = 20
  }

  const writeSection = (
    title: string,
    body: string | readonly string[],
    options?: { compact?: boolean }
  ) => {
    ensureSpace(options?.compact ? 20 : 28)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...gold)
    doc.text(title.toUpperCase(), 18, y)
    y += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...navy)

    const items = Array.isArray(body) ? body : [body]
    const lines = items.flatMap((item) => doc.splitTextToSize(item, 174))

    ensureSpace(lines.length * 5 + 8)
    doc.text(lines, 18, y)
    y += lines.length * 5 + 6
  }

  const writeBulletList = (items: readonly string[]) => {
    for (const item of items) {
      const lines = doc.splitTextToSize(item, 166)
      ensureSpace(lines.length * 5 + 4)

      doc.setTextColor(...gold)
      doc.setFont('helvetica', 'bold')
      doc.text('—', 18, y)

      doc.setTextColor(...navy)
      doc.setFont('helvetica', 'normal')
      doc.text(lines, 24, y)
      y += lines.length * 5 + 2
    }
    y += 3
  }

  doc.setFillColor(...navy)
  doc.rect(0, 0, 210, 32, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(leaseLedgerOnePager.title, 18, 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(leaseLedgerOnePager.subtitle, 18, 23)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...gold)
  doc.text('COMMERCIAL ONE-PAGER', 18, 28)

  y = 42

  writeSection('Overview', leaseLedgerOnePager.overview)

  doc.setDrawColor(...lightGrey)
  doc.line(18, y, 192, y)
  y += 8

  writeSection('Commercial Positioning', leaseLedgerOnePager.principles)

  for (const item of leaseLedgerOnePager.workflowCoverage) {
    writeSection(item.title, item.body, { compact: true })
  }

  ensureSpace(14)
  doc.setDrawColor(...lightGrey)
  doc.line(18, y, 192, y)
  y += 8

  for (const model of leaseLedgerOnePager.commercialModel) {
    writeSection(model.title, model.body, { compact: true })
    writeBulletList(model.bullets)
  }

  ensureSpace(14)
  doc.setDrawColor(...lightGrey)
  doc.line(18, y, 192, y)
  y += 8

  for (const audience of leaseLedgerOnePager.audiences) {
    writeSection(audience.title, audience.body, { compact: true })
  }

  writeSection('Governance Note', leaseLedgerOnePager.closing)

  ensureSpace(20)
  doc.setFillColor(...navy)
  doc.rect(18, y, 174, 22, 'F')
  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('NEXT STEP', 24, y + 8)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(doc.splitTextToSize('Request a Lease Ledger walkthrough or talk to FPIA about portfolio rollout and managed-use adoption.', 150), 24, y + 15)

  doc.setFillColor(...navy)
  doc.rect(0, 286, 210, 11, 'F')
  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('www.fairproperties.org.za/lease-ledger', 105, 293, { align: 'center' })

  return new NextResponse(Buffer.from(doc.output('arraybuffer')), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${FILENAME}"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
