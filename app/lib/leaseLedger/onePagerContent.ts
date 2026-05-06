export const leaseLedgerOnePager = {
  title: 'Lease Ledger',
  subtitle: 'The tenancy accountability layer inside FPIA',
  overview:
    'Lease Ledger gives landlords, managers, lessees, and agencies a governed record of property condition across the tenancy lifecycle. It captures move-in baselines, move-out condition, handover comparison, dispute support, deposit dispute support, and governed closure in one evidence-backed workflow.',
  principles: [
    'Evidence-backed workflow, not recollection-driven handover',
    'Governed tenancy record, not generic property management software',
    'Operational accountability support, not legal adjudication',
  ],
  workflowCoverage: [
    {
      title: 'Move-In Baseline',
      body: 'Capture the starting condition record with structured notes and supporting evidence before or at key handover.',
    },
    {
      title: 'Move-Out Record',
      body: 'Preserve the outgoing condition record so the tenancy close-out is based on dated evidence, not memory.',
    },
    {
      title: 'Handover Comparison',
      body: 'Compare move-in and move-out records area by area and preserve the operational conclusion behind each change.',
    },
    {
      title: 'Dispute Support',
      body: 'Flag contested issues, preserve context, and prepare a governed support record for downstream review.',
    },
    {
      title: 'Governed Closure',
      body: 'Close the handover with the full workflow history preserved under a controlled record and audit trail.',
    },
  ],
  commercialModel: [
    {
      title: 'One-off workflow services',
      body: 'Use Lease Ledger for a specific tenancy event where a governed record, comparison, or support output is required.',
      bullets: [
        'Move-In Baseline Record',
        'Move-Out Condition Record',
        'Handover Comparison Summary',
        'Deposit Dispute Support Pack',
      ],
    },
    {
      title: 'Portfolio / agency access',
      body: 'Run Lease Ledger as part of normal tenancy operations with recurring workflow support and better oversight across multiple records.',
      bullets: [
        'Recurring access for agencies and rental managers',
        'Monthly workflow capacity planning',
        'Portfolio oversight and reporting',
        'Governed handover support',
      ],
    },
    {
      title: 'Institutional / managed use',
      body: 'Discuss a managed rollout where multiple users, properties, or reporting obligations need a more formal operating layer.',
      bullets: [
        'Larger landlord or portfolio rollout discussion',
        'Pilot or staged implementation support',
        'Access and reporting configuration',
        'Structured operating model for internal teams',
      ],
    },
  ],
  audiences: [
    {
      title: 'Landlords',
      body: 'Move-in baseline protection, move-out accountability, governed dispute support, and a full tenancy audit trail.',
    },
    {
      title: 'Lessees',
      body: 'A fair starting record, transparent handover comparison, and evidence support when condition issues are contested.',
    },
    {
      title: 'Estate agents and rental managers',
      body: 'Cleaner handovers, more consistent portfolio records, and lower dispute friction across the tenancy workflow.',
    },
  ],
  closing:
    'Lease Ledger provides the governed evidentiary record and support summary. It does not determine legal outcome, tenant scoring, or automated liability decisions.',
  walkthroughHref: '/contact?topic=lease-ledger&intent=walkthrough',
  rolloutHref: '/contact?topic=lease-ledger&intent=portfolio-rollout',
} as const
