create table if not exists public.risk_score_runs (
  id uuid primary key default gen_random_uuid(),
  score_type text not null,
  property_id uuid null,
  case_id uuid null,
  certificate_id uuid null,
  score_value numeric(5,2) not null check (score_value >= 0 and score_value <= 100),
  score_band text not null,
  model_version text not null,
  drivers_json jsonb not null default '[]'::jsonb,
  inputs_json jsonb not null default '{}'::jsonb,
  computed_at timestamptz not null default now()
);

create index if not exists idx_risk_score_runs_case on public.risk_score_runs(case_id, computed_at desc);
create index if not exists idx_risk_score_runs_property on public.risk_score_runs(property_id, computed_at desc);
create index if not exists idx_risk_score_runs_type on public.risk_score_runs(score_type, computed_at desc);
