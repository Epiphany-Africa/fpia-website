import type { TrustOutcome } from '@/lib/certification/getCanonicalTrustState'

export type TrustBadgeMeta = {
  label: 'NOT CERTIFIED' | 'CONDITIONAL' | 'VERIFIED' | 'SUPERSEDED' | 'REVOKED'
  descriptor: string
  tooltip: string
  accentColor: string
  textColor: string
  backgroundColor: string
  borderColor: string
}

const TRUST_BADGE_META: Record<TrustOutcome, TrustBadgeMeta> = {
  NOT_ISSUED: {
    label: 'NOT CERTIFIED',
    descriptor: 'No active verified record',
    tooltip:
      'No active FPIA certificate or final registry verification is currently in force for this property reference.',
    accentColor: '#C62828',
    textColor: '#7F1D1D',
    backgroundColor: '#FFF1F2',
    borderColor: 'rgba(198, 40, 40, 0.28)',
  },
  CONDITIONAL: {
    label: 'CONDITIONAL',
    descriptor: 'Issued with outstanding conditions',
    tooltip:
      'A certificate has been issued, but full certification is not yet complete. Outstanding conditions, compliance items, or review steps still remain.',
    accentColor: '#B7791F',
    textColor: '#8A5A12',
    backgroundColor: '#FFF7ED',
    borderColor: 'rgba(183, 121, 31, 0.28)',
  },
  FINAL_VERIFIED: {
    label: 'VERIFIED',
    descriptor: 'Final registry approval recorded',
    tooltip:
      'The property record has reached final verified status in the FPIA registry and remains active unless revoked or superseded.',
    accentColor: '#1A7F37',
    textColor: '#166534',
    backgroundColor: '#ECFDF3',
    borderColor: 'rgba(26, 127, 55, 0.28)',
  },
  SUPERSEDED: {
    label: 'SUPERSEDED',
    descriptor: 'Replaced by a newer authority record',
    tooltip:
      'This certificate has been superseded by a newer FPIA authority-issued record. Use the latest verification reference for reliance.',
    accentColor: '#475467',
    textColor: '#344054',
    backgroundColor: '#F5F7FA',
    borderColor: 'rgba(71, 84, 103, 0.24)',
  },
  REVOKED: {
    label: 'REVOKED',
    descriptor: 'No longer valid for reliance',
    tooltip:
      'A previously issued FPIA certificate or registry record has been revoked and should not be relied on as active certification.',
    accentColor: '#7A1C1C',
    textColor: '#7A1C1C',
    backgroundColor: '#FFF5F5',
    borderColor: 'rgba(122, 28, 28, 0.3)',
  },
}

export function getTrustBadgeMeta(trustState: TrustOutcome): TrustBadgeMeta {
  return TRUST_BADGE_META[trustState]
}
