create or replace view public.analytics_case_snapshot as
select
  c.id as case_id,
  c.property_address,
  c.status,
  c.compliance_stage,
  c.created_at,
  ic.id as certificate_id,
  ic.certificate_number,
  ic.certificate_state,
  ic.inspection_status,
  ic.issued_at
from public.cases c
left join public.issued_certificates ic on ic.case_id = c.id;

create or replace view public.analytics_property_snapshot as
select
  p.id as property_id,
  p.address,
  p.city,
  p.province,
  p.postal_code,
  p.status as property_status,
  p.transaction_stage,
  p.risk_score,
  p.created_at,
  rr.id as latest_registry_id,
  rr.report_code as latest_report_code,
  rr.certificate_number as latest_certificate_number,
  rr.review_outcome,
  rr.certified_at
from public.properties p
left join public.report_registry rr on rr.property_id = p.id;

create or replace view public.analytics_certificate_snapshot as
select
  ic.id as certificate_id,
  ic.case_id,
  ic.certificate_number,
  ic.certificate_type,
  ic.certificate_state,
  ic.inspection_status,
  ic.verification_ref,
  ic.issued_at,
  ic.integrity_hash,
  ic.hash_version,
  ic.fail_items,
  ic.material_items,
  ic.observation_items
from public.issued_certificates ic;

create or replace view public.analytics_inspector_snapshot as
select
  i.id as inspector_id,
  i.full_name,
  i.inspector_code,
  i.company_name,
  i.is_active,
  i.accepting_requests,
  count(al.id) filter (where al.assignment_status = 'awaiting_inspector_acceptance') as pending_assignments,
  count(al.id) filter (where al.accepted_at is not null) as accepted_assignments,
  count(al.id) filter (where al.declined_at is not null) as declined_assignments
from public.inspectors i
left join public.assignment_log al on al.inspector_id = i.id
group by
  i.id,
  i.full_name,
  i.inspector_code,
  i.company_name,
  i.is_active,
  i.accepting_requests;
