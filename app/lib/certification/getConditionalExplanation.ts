type ChecklistItem = {
  section?: unknown
  item_label?: unknown
  result?: unknown
  material_to_otp?: unknown
  notes?: unknown
}

type Input = {
  checklist?: unknown
  failItems?: number | null
  materialItems?: number | null
  observationItems?: number | null
  recommendation?: string | null
}

export type ConditionalExplanation = {
  summary: string
  keyFindings: string[]
  nextSteps: string[]
}

function toCount(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function toPlainText(value: unknown) {
  if (typeof value !== 'string') return null
  const text = value.replace(/\s+/g, ' ').trim()
  return text.length > 0 ? text : null
}

function normalizeSection(value: unknown) {
  const section = toPlainText(value)
  if (!section) return null
  return section.replace(/\s*\/\s*/g, ' and ')
}

function normalizeFindingLabel(value: unknown) {
  const label = toPlainText(value)
  if (!label) return null
  return label.replace(/\s*\/\s*/g, ' and ')
}

function toChecklistItems(value: unknown): ChecklistItem[] {
  return Array.isArray(value) ? (value as ChecklistItem[]) : []
}

function buildFindingSentence(item: ChecklistItem) {
  const section = normalizeSection(item.section)
  const label = normalizeFindingLabel(item.item_label) ?? 'Recorded inspection item'
  const notes = toPlainText(item.notes)
  const result = toPlainText(item.result)?.toLowerCase() ?? ''
  const material = Boolean(item.material_to_otp)

  const prefix =
    result === 'fail'
      ? 'Requires repair or further attention'
      : material
      ? 'Has a material condition that must be resolved'
      : 'Has an observed issue that still requires follow-up'

  const locationText = section ? `${section}: ` : ''
  const noteText =
    notes && !notes.toLowerCase().includes(label.toLowerCase()) ? ` ${notes}` : ''

  return `${locationText}${label}. ${prefix}.${noteText}`.replace(/\s+/g, ' ').trim()
}

function buildRecommendationFallback(recommendation: string | null | undefined) {
  const text = toPlainText(recommendation)
  if (!text) return null
  return text.endsWith('.') ? text : `${text}.`
}

export function getConditionalExplanation(input: Input): ConditionalExplanation {
  const failItems = toCount(input.failItems)
  const materialItems = toCount(input.materialItems)
  const observationItems = toCount(input.observationItems)

  const summary =
    failItems > 0
      ? 'This property has not achieved full certification due to identified defects requiring attention.'
      : materialItems > 0
      ? 'This property meets conditional certification criteria but includes material observations requiring resolution.'
      : 'This property is conditionally certified pending completion of final compliance or documentation.'

  const flaggedItems = toChecklistItems(input.checklist).filter((item) => {
    const result = toPlainText(item.result)?.toLowerCase() ?? ''
    return result === 'fail' || result === 'observation' || Boolean(item.material_to_otp)
  })

  let keyFindings = flaggedItems.slice(0, 3).map(buildFindingSentence)

  if (keyFindings.length === 0) {
    const fallback = buildRecommendationFallback(input.recommendation)
    if (fallback) {
      keyFindings = [fallback]
    } else if (observationItems > 0 || materialItems > 0 || failItems > 0) {
      keyFindings = ['Recorded inspection findings remain outstanding before full certification can be issued.']
    } else {
      keyFindings = ['Final compliance or supporting documentation is still being completed and reviewed.']
    }
  }

  const nextSteps: string[] = []

  if (failItems > 0) {
    nextSteps.push('Remedial work must be completed and verified')
  }

  if (materialItems > 0) {
    nextSteps.push('Outstanding items should be addressed')
  }

  if (failItems === 0 && materialItems === 0) {
    nextSteps.push('Outstanding compliance documents or confirmations should be submitted for review')
  }

  nextSteps.push(
    'Final certification is issued once all required conditions are satisfied and validated'
  )

  return {
    summary,
    keyFindings,
    nextSteps,
  }
}
