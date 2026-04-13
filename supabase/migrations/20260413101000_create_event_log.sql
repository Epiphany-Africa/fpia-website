create table if not exists public.event_log (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid null,
  case_id uuid null,
  property_id uuid null,
  certificate_id uuid null,
  actor_user_id uuid null,
  actor_role text null,
  event_type text not null,
  event_label text null,
  source_system text not null default 'fpia',
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_log_case_id on public.event_log(case_id);
create index if not exists idx_event_log_property_id on public.event_log(property_id);
create index if not exists idx_event_log_certificate_id on public.event_log(certificate_id);
create index if not exists idx_event_log_event_type on public.event_log(event_type);
create index if not exists idx_event_log_created_at on public.event_log(created_at desc);
