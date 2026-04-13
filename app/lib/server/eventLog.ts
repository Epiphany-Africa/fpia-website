type AdminInsertClient = {
  from(table: string): {
    insert(payload: Record<string, unknown>): Promise<{
      error: { message?: string | null } | null;
    }>;
  };
};

export async function writeAdminEvent(
  client: AdminInsertClient,
  input: {
    entityType: string;
    entityId?: string | null;
    caseId?: string | null;
    propertyId?: string | null;
    certificateId?: string | null;
    actorUserId?: string | null;
    actorRole?: string | null;
    eventType: string;
    eventLabel?: string | null;
    sourceSystem?: string;
    eventPayload?: Record<string, unknown>;
  }
) {
  const { error } = await client.from("event_log").insert({
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    case_id: input.caseId ?? null,
    property_id: input.propertyId ?? null,
    certificate_id: input.certificateId ?? null,
    actor_user_id: input.actorUserId ?? null,
    actor_role: input.actorRole ?? null,
    event_type: input.eventType,
    event_label: input.eventLabel ?? null,
    source_system: input.sourceSystem ?? "fpia-website",
    event_payload: input.eventPayload ?? {},
  });

  if (error) {
    throw new Error(error.message ?? "Failed to write event_log row.");
  }
}

export async function writeAssignmentLog(
  client: AdminInsertClient,
  input: {
    inspectionRequestId: string;
    inspectorId?: string | null;
    assignmentStatus: string;
    distanceKm?: number | null;
    rankPosition?: number | null;
    expiresAt?: string | null;
    acceptedAt?: string | null;
    declinedAt?: string | null;
    metadata?: Record<string, unknown>;
  }
) {
  const { error } = await client.from("assignment_log").insert({
    inspection_request_id: input.inspectionRequestId,
    inspector_id: input.inspectorId ?? null,
    assignment_status: input.assignmentStatus,
    distance_km: input.distanceKm ?? null,
    rank_position: input.rankPosition ?? null,
    expires_at: input.expiresAt ?? null,
    accepted_at: input.acceptedAt ?? null,
    declined_at: input.declinedAt ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) {
    throw new Error(error.message ?? "Failed to write assignment_log row.");
  }
}
