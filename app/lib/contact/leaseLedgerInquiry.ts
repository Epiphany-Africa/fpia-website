export const LEASE_LEDGER_TOPIC = 'lease-ledger' as const

export const LEASE_LEDGER_INTENT_CONFIG = {
  'landlord-access': {
    label: 'Landlord access',
    helperText:
      'Tell us about the property or tenancy workflow you want to support, and whether you are looking for move-in, move-out, handover comparison, or dispute support.',
    recommendedRole: 'Landlord',
  },
  'tenant-guidance': {
    label: 'Tenant guidance',
    helperText:
      'Tell us what guidance you need and whether you are asking about move-in records, handover comparison, or a tenancy condition concern.',
    recommendedRole: 'Tenant',
  },
  'estate-agent-demo': {
    label: 'Estate agent demo',
    helperText:
      'Tell us about your rental portfolio or operating model and we’ll arrange a Lease Ledger walkthrough for your team.',
    recommendedRole: 'Property Practitioner / Estate Agent',
  },
  'one-off-workflow': {
    label: 'One-off workflow',
    helperText:
      'Tell us which tenancy event you need support for, such as move-in baseline, move-out record, handover comparison, or deposit dispute support.',
    recommendedRole: 'Landlord',
  },
  'portfolio-agency-demo': {
    label: 'Portfolio / agency demo',
    helperText:
      'Tell us about your portfolio size, operating model, and what you want to improve across move-ins, handovers, and dispute handling.',
    recommendedRole: 'Property Practitioner / Estate Agent',
  },
  'institutional-rollout': {
    label: 'Institutional rollout',
    helperText:
      'Tell us about the environment, scale, and reporting requirements you want to explore for a structured Lease Ledger rollout.',
    recommendedRole: 'Institutional / Portfolio Operator',
  },
  walkthrough: {
    label: 'Walkthrough request',
    helperText:
      'Tell us what you would like to see in a Lease Ledger walkthrough and who the session is for.',
    recommendedRole: 'Property Practitioner / Estate Agent',
  },
  'portfolio-rollout': {
    label: 'Portfolio rollout',
    helperText:
      'Tell us about your portfolio or managed environment and the kind of tenancy accountability process you want to introduce.',
    recommendedRole: 'Institutional / Portfolio Operator',
  },
} as const

export type LeaseLedgerIntent = keyof typeof LEASE_LEDGER_INTENT_CONFIG

export type LeaseLedgerContactContext = {
  topic: typeof LEASE_LEDGER_TOPIC
  topicLabel: 'Lease Ledger'
  introCopy: string
  helperText: string
  intent: LeaseLedgerIntent | null
  intentLabel: string
  recommendedRole: string
  messagePlaceholder: string
}

const GENERIC_LEASE_LEDGER_INTRO =
  'You’re contacting FPIA about Lease Ledger, the tenancy accountability layer inside FPIA. Tell us a little about what you need and we’ll route your enquiry appropriately.'

const GENERIC_LEASE_LEDGER_HELPER =
  'Briefly describe your property, tenancy workflow, portfolio, or the kind of Lease Ledger support you’re looking for.'

export function normalizeLeaseLedgerTopic(value: unknown) {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  return normalized === LEASE_LEDGER_TOPIC ? LEASE_LEDGER_TOPIC : null
}

export function normalizeLeaseLedgerIntent(value: unknown): LeaseLedgerIntent | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()

  return normalized in LEASE_LEDGER_INTENT_CONFIG
    ? (normalized as LeaseLedgerIntent)
    : null
}

export function getLeaseLedgerContactContext(
  topicValue: unknown,
  intentValue: unknown
): LeaseLedgerContactContext | null {
  const topic = normalizeLeaseLedgerTopic(topicValue)
  if (!topic) return null

  const rawIntent =
    typeof intentValue === 'string' ? intentValue.trim().toLowerCase() : ''
  const intent = normalizeLeaseLedgerIntent(intentValue)

  if (rawIntent && !intent) {
    return null
  }

  const intentConfig = intent ? LEASE_LEDGER_INTENT_CONFIG[intent] : null

  return {
    topic,
    topicLabel: 'Lease Ledger',
    introCopy: GENERIC_LEASE_LEDGER_INTRO,
    helperText: intentConfig?.helperText ?? GENERIC_LEASE_LEDGER_HELPER,
    intent,
    intentLabel: intentConfig?.label ?? 'General Lease Ledger enquiry',
    recommendedRole: intentConfig?.recommendedRole ?? 'Landlord',
    messagePlaceholder: GENERIC_LEASE_LEDGER_HELPER,
  }
}
