const DEMO_RECORD_ID = 'ZA-2024-00142'

export type DemoVerificationRecord = {
  registry: {
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
    lock_status?: string | null
    inspector_signed_off_by?: string | null
    inspector_signed_off_at?: string | null
    reviewed_by?: string | null
    reviewed_at: string | null
    certified_by?: string | null
    certified_at: string | null
    final_hash: string | null
    review_outcome: string | null
    review_notes?: string | null
    submitted_for_review_at: string | null
    certificate_number: string | null
  }
  property: {
    id: string
    title?: string | null
    address: string | null
    city: string | null
    province: string | null
    postal_code: string | null
    status?: string | null
    transaction_stage?: string | null
    property_type?: string | null
    notes?: string | null
    risk_score?: number | null
    created_at?: string | null
    unit_number?: string | null
    complex_name?: string | null
    estate_name?: string | null
    building_name?: string | null
  }
  certificate: {
    id: string
    case_id: string
    issued_by?: string | null
    issued_at: string | null
    certificate_type?: string | null
    inspection_status: string | null
    verification_ref: string | null
    recommendation: string | null
    snapshot: {
      checklist: Array<{ section: string; result: string }>
      inspector?: { inspector_name?: string | null } | null
    } | null
    certificate_state: string | null
    revoked_at: string | null
    revoked_reason: string | null
    inspector_name: string | null
    inspector_id?: string | null
    inspector_title?: string | null
    signature_name?: string | null
    integrity_hash: string | null
    hash_version?: string | null
    signature_image_url?: string | null
    stamp_image_url?: string | null
    certificate_number: string | null
    trust_score?: number | null
    fail_items: number | null
    material_items: number | null
    observation_items: number | null
  }
  caseRecord: {
    id: string
    property_address: string | null
    status: string | null
    compliance_stage: string | null
    unit_number: string | null
    scheme_name: string | null
    created_at?: string | null
  }
  auditRows: Array<{
    id: string
    property_id?: string | null
    event_type: string | null
    status_label?: string | null
    event_message?: string | null
    previous_hash?: string | null
    new_hash?: string | null
    created_at: string
    report_id?: string | null
    action?: string | null
    performed_by?: string | null
  }>
  caseEvents: Array<{
    id: string
    event_type: string | null
    event_label: string | null
    created_at: string
  }>
  inspector: {
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
}

const DEMO_VERIFICATION_RECORD: DemoVerificationRecord = {
  registry: {
    id: 'demo-registry-za-2024-00142',
    property_id: 'demo-property-14-protea-avenue',
    inspector_id: 'demo-inspector-svdm',
    report_code: DEMO_RECORD_ID,
    property_code: 'FPIA-SAN-14-PROTEA',
    issued_at: '2024-03-14T09:00:00+02:00',
    status: 'active',
    is_locked: true,
    report_hash: 'sha256:f4d9a2c6a6f4c4a9c2e9b2f18a8f6aa7b3813c6c8b7911028f4780f8e4e90a12',
    locked_at: '2024-03-15T11:55:00+02:00',
    workflow_status: 'certified',
    lock_status: 'locked',
    inspector_signed_off_by: 'Stephanus van der Merwe',
    inspector_signed_off_at: '2024-03-15T10:40:00+02:00',
    reviewed_by: 'FPIA Registry Review',
    reviewed_at: '2024-03-15T11:15:00+02:00',
    certified_by: 'FPIA Registry Review',
    certified_at: '2024-03-15T12:15:00+02:00',
    final_hash: 'sha256:8a2411d2bd5f4d9fd9f7f4e0f54a0b43c5216711b78691c3523b2583d4f1a748',
    review_outcome: 'approved',
    review_notes: 'Demo record approved for public verification display.',
    submitted_for_review_at: '2024-03-14T17:10:00+02:00',
    certificate_number: DEMO_RECORD_ID,
  },
  property: {
    id: 'demo-property-14-protea-avenue',
    title: '14 Protea Avenue, Sandton',
    address: '14 Protea Avenue',
    city: 'Sandton',
    province: 'Gauteng',
    postal_code: '2196',
    status: 'verified',
    transaction_stage: 'pre-market',
    property_type: 'Freehold Residential',
    notes: 'Stable public demo record used for the FPIA showcase journey.',
    risk_score: 8,
    created_at: '2024-03-12T09:00:00+02:00',
    unit_number: null,
    complex_name: null,
    estate_name: null,
    building_name: null,
  },
  certificate: {
    id: 'demo-certificate-za-2024-00142',
    case_id: 'demo-case-14-protea-avenue',
    issued_by: 'FPIA Registry',
    issued_at: '2024-03-15T12:15:00+02:00',
    certificate_type: 'Official Property Condition Record',
    inspection_status: 'pass',
    verification_ref: DEMO_RECORD_ID,
    recommendation:
      'No material defects affecting certification were recorded at the time of inspection.',
    snapshot: {
      checklist: [
        { section: 'Structure', result: 'pass' },
        { section: 'Roofing', result: 'pass' },
        { section: 'Electrical', result: 'pass' },
        { section: 'Plumbing', result: 'pass' },
      ],
      inspector: { inspector_name: 'Stephanus van der Merwe' },
    },
    certificate_state: 'issued',
    revoked_at: null,
    revoked_reason: null,
    inspector_name: 'Stephanus van der Merwe',
    inspector_id: 'FPIA-INS-014',
    inspector_title: 'Authorised Certification Officer',
    signature_name: 'Stephanus van der Merwe',
    integrity_hash: 'sha256:8a2411d2bd5f4d9fd9f7f4e0f54a0b43c5216711b78691c3523b2583d4f1a748',
    hash_version: 'v1',
    signature_image_url: '/signatures/INS-001.png',
    stamp_image_url: null,
    certificate_number: DEMO_RECORD_ID,
    trust_score: 96,
    fail_items: 0,
    material_items: 0,
    observation_items: 0,
  },
  caseRecord: {
    id: 'demo-case-14-protea-avenue',
    property_address: '14 Protea Avenue, Sandton',
    status: 'verified',
    compliance_stage: 'certified',
    unit_number: null,
    scheme_name: null,
    created_at: '2024-03-12T08:30:00+02:00',
  },
  auditRows: [
    {
      id: 'demo-audit-1',
      property_id: 'demo-property-14-protea-avenue',
      event_type: 'REPORT_SUBMITTED',
      status_label: 'Submitted',
      event_message: 'Inspection report submitted for registry review.',
      previous_hash: null,
      new_hash: 'sha256:f4d9a2c6a6f4c4a9c2e9b2f18a8f6aa7b3813c6c8b7911028f4780f8e4e90a12',
      created_at: '2024-03-14T17:10:00+02:00',
      report_id: 'demo-registry-za-2024-00142',
      action: 'submit',
      performed_by: 'Stephanus van der Merwe',
    },
    {
      id: 'demo-audit-2',
      property_id: 'demo-property-14-protea-avenue',
      event_type: 'REPORT_APPROVED',
      status_label: 'Approved',
      event_message: 'Registry review approved the report.',
      previous_hash: 'sha256:f4d9a2c6a6f4c4a9c2e9b2f18a8f6aa7b3813c6c8b7911028f4780f8e4e90a12',
      new_hash: 'sha256:0fd633a9da67f8b6a9af0ca3e78adfe56556dfad2281dc073f1baf492b1f8fb3',
      created_at: '2024-03-15T11:15:00+02:00',
      report_id: 'demo-registry-za-2024-00142',
      action: 'approve',
      performed_by: 'FPIA Registry Review',
    },
    {
      id: 'demo-audit-3',
      property_id: 'demo-property-14-protea-avenue',
      event_type: 'REPORT_CERTIFIED',
      status_label: 'Certified',
      event_message: 'Final certified record locked in the public registry.',
      previous_hash: 'sha256:0fd633a9da67f8b6a9af0ca3e78adfe56556dfad2281dc073f1baf492b1f8fb3',
      new_hash: 'sha256:8a2411d2bd5f4d9fd9f7f4e0f54a0b43c5216711b78691c3523b2583d4f1a748',
      created_at: '2024-03-15T12:15:00+02:00',
      report_id: 'demo-registry-za-2024-00142',
      action: 'certify',
      performed_by: 'FPIA Registry Review',
    },
  ],
  caseEvents: [
    {
      id: 'demo-case-event-1',
      event_type: 'INSPECTION_COMPLETED',
      event_label: 'Inspection Completed',
      created_at: '2024-03-14T14:45:00+02:00',
    },
    {
      id: 'demo-case-event-2',
      event_type: 'CERTIFICATION_ISSUED',
      event_label: 'Certification Issued',
      created_at: '2024-03-15T12:15:00+02:00',
    },
  ],
  inspector: {
    id: 'demo-inspector-svdm',
    full_name: 'Stephanus van der Merwe',
    inspector_code: 'FPIA-INS-014',
    badge_number: 'SACPCMP Reg.',
    company_name: 'Fair Properties Inspection Authority',
    signature_file_path: '/signatures/INS-001.png',
    stamp_file_path: '/stamps/FPIA-OFFICIAL.png',
    is_active: true,
    created_at: '2024-01-10T09:00:00+02:00',
  },
}

export function isDemoVerificationRecord(id: string) {
  return id.toUpperCase() === DEMO_RECORD_ID
}

export function getDemoVerificationRecord(id: string): DemoVerificationRecord | null {
  return isDemoVerificationRecord(id) ? DEMO_VERIFICATION_RECORD : null
}
