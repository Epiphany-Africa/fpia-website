export type TrustOutcome =
  | "NOT_ISSUED"
  | "CONDITIONAL"
  | "FINAL_VERIFIED"
  | "SUPERSEDED"
  | "REVOKED";

type Input = {
  certificateState?: string | null;
  caseStatus?: string | null;
  complianceStage?: string | null;
  inspectionStatus?: string | null;
  reviewOutcome?: string | null;
  workflowStatus?: string | null;
  revokedAt?: string | null;
  isLocked?: boolean | null;
};

export function getCanonicalTrustState(input: Input): TrustOutcome {
  const certificateState = (input.certificateState ?? "").toLowerCase();
  const caseStatus = (input.caseStatus ?? "").toLowerCase();
  const complianceStage = (input.complianceStage ?? "").toLowerCase();
  const inspectionStatus = (input.inspectionStatus ?? "").toLowerCase();
  const reviewOutcome = (input.reviewOutcome ?? "").toLowerCase();
  const workflowStatus = (input.workflowStatus ?? "").toLowerCase();
  const isLocked = Boolean(input.isLocked);
  const hasIssuedCertificate = certificateState === "issued";

  if (
    input.revokedAt ||
    certificateState === "revoked" ||
    caseStatus === "revoked" ||
    reviewOutcome === "revoked" ||
    workflowStatus === "revoked"
  ) {
    return "REVOKED";
  }

  if (
    certificateState === "superseded" ||
    caseStatus === "superseded" ||
    reviewOutcome === "superseded" ||
    workflowStatus === "superseded"
  ) {
    return "SUPERSEDED";
  }

  if (!isLocked) {
    if (
      hasIssuedCertificate ||
      inspectionStatus === "conditional" ||
      workflowStatus === "conditional_certificate_issued" ||
      reviewOutcome === "conditional" ||
      caseStatus === "conditional"
    ) {
      return "CONDITIONAL";
    }

    return "NOT_ISSUED";
  }

  const complianceComplete =
    complianceStage === "compliance complete" ||
    complianceStage === "verified" ||
    complianceStage === "final verified" ||
    inspectionStatus === "pass";

  const reviewerApprovedFinal =
    reviewOutcome === "approved" ||
    reviewOutcome === "final_verified" ||
    reviewOutcome === "approved_final";

  const registryCertified =
    workflowStatus === "certified" &&
    reviewerApprovedFinal;

  if (
    (complianceComplete && reviewerApprovedFinal) ||
    registryCertified ||
    (caseStatus === "certified" && reviewerApprovedFinal)
  ) {
    return "FINAL_VERIFIED";
  }

  // If a certificate exists but not final verified → CONDITIONAL
  if (
    certificateState === "conditional" ||
    hasIssuedCertificate ||
    inspectionStatus === "conditional"
  ) {
    return "CONDITIONAL";
  }

  if (caseStatus === "conditional") {
    return "CONDITIONAL";
  }

  return "NOT_ISSUED";
}
