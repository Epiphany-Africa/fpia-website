create table if not exists public.verification_access_log (
  id uuid primary key default gen_random_uuid(),
  verification_ref text not null,
  route_path text not null,
  ip_hash text null,
  user_agent_hash text null,
  referer text null,
  created_at timestamptz not null default now()
);

create index if not exists idx_verification_access_ref on public.verification_access_log(verification_ref, created_at desc);
