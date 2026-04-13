create table if not exists public.assignment_log (
  id uuid primary key default gen_random_uuid(),
  inspection_request_id uuid not null,
  inspector_id uuid null,
  assignment_status text not null,
  distance_km numeric(8,2) null,
  rank_position integer null,
  expires_at timestamptz null,
  accepted_at timestamptz null,
  declined_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_assignment_log_request on public.assignment_log(inspection_request_id, created_at desc);
create index if not exists idx_assignment_log_inspector on public.assignment_log(inspector_id, created_at desc);
