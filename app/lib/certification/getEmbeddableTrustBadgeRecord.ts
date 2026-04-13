import {
  getCanonicalTrustState,
  type TrustOutcome,
} from '@/lib/certification/getCanonicalTrustState'
import { loadPublicVerificationRecord } from '@/lib/verification/loadPublicVerificationRecord'

export type EmbeddableTrustBadgeRecord = {
  trustState: TrustOutcome
  verificationReference: string
  verificationUrl: string
  embedUrl: string
}

export async function getEmbeddableTrustBadgeRecord(
  id: string
): Promise<EmbeddableTrustBadgeRecord> {
  const {
    registry,
    certificate,
    caseRecord,
    verificationReference,
    verificationUrl,
    embedBadgeUrl,
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

  return {
    trustState,
    verificationReference,
    verificationUrl,
    embedUrl: embedBadgeUrl,
  }
}
