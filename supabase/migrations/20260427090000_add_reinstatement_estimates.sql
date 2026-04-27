begin;

alter table public.properties
  add column if not exists floor_area_m2 numeric(10,2),
  add column if not exists finish_tier text;

alter table public.properties
  drop constraint if exists properties_floor_area_m2_check;

alter table public.properties
  add constraint properties_floor_area_m2_check
  check (floor_area_m2 is null or floor_area_m2 > 0);

alter table public.properties
  drop constraint if exists properties_finish_tier_check;

alter table public.properties
  add constraint properties_finish_tier_check
  check (
    finish_tier is null
    or finish_tier = any (array['standard', 'mid', 'premium'])
  );

comment on column public.properties.floor_area_m2 is
  'Recorded floor area in square metres used for the FPIA reinstatement cost estimate.';

comment on column public.properties.finish_tier is
  'Selected finish tier used for the FPIA reinstatement cost estimate.';

create table if not exists public.reinstatement_rate_profiles (
  id uuid primary key default gen_random_uuid(),
  province_or_region text not null,
  property_type text,
  finish_tier text not null,
  base_rate_per_m2 numeric(12,2) not null,
  demolition_percentage_or_fixed numeric(8,2) not null default 0,
  professional_fees_percentage numeric(8,2) not null default 0,
  approvals_percentage numeric(8,2) not null default 0,
  contingency_or_escalation_percentage numeric(8,2) not null default 0,
  effective_from date not null default current_date,
  is_active boolean not null default true,
  model_version text not null default 'fpia-reinstatement-v1',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.reinstatement_rate_profiles
  drop constraint if exists reinstatement_rate_profiles_finish_tier_check;

alter table public.reinstatement_rate_profiles
  add constraint reinstatement_rate_profiles_finish_tier_check
  check (finish_tier = any (array['standard', 'mid', 'premium']));

alter table public.reinstatement_rate_profiles
  drop constraint if exists reinstatement_rate_profiles_base_rate_per_m2_check;

alter table public.reinstatement_rate_profiles
  add constraint reinstatement_rate_profiles_base_rate_per_m2_check
  check (base_rate_per_m2 > 0);

alter table public.reinstatement_rate_profiles
  drop constraint if exists reinstatement_rate_profiles_nonnegative_percentages_check;

alter table public.reinstatement_rate_profiles
  add constraint reinstatement_rate_profiles_nonnegative_percentages_check
  check (
    demolition_percentage_or_fixed >= 0
    and professional_fees_percentage >= 0
    and approvals_percentage >= 0
    and contingency_or_escalation_percentage >= 0
  );

create unique index if not exists uq_reinstatement_rate_profiles_active_scope
  on public.reinstatement_rate_profiles (
    province_or_region,
    coalesce(property_type, ''),
    finish_tier,
    effective_from
  );

create or replace function public.set_reinstatement_rate_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_reinstatement_rate_profiles_updated_at
  on public.reinstatement_rate_profiles;

create trigger trg_reinstatement_rate_profiles_updated_at
before update on public.reinstatement_rate_profiles
for each row
execute function public.set_reinstatement_rate_profiles_updated_at();

alter table public.reinstatement_rate_profiles enable row level security;

revoke all on table public.reinstatement_rate_profiles from anon, authenticated;
grant select, insert, update, delete on table public.reinstatement_rate_profiles to authenticated;

drop policy if exists "Authority read reinstatement rate profiles" on public.reinstatement_rate_profiles;
drop policy if exists "Authority insert reinstatement rate profiles" on public.reinstatement_rate_profiles;
drop policy if exists "Authority update reinstatement rate profiles" on public.reinstatement_rate_profiles;
drop policy if exists "Authority delete reinstatement rate profiles" on public.reinstatement_rate_profiles;

create policy "Authority read reinstatement rate profiles"
on public.reinstatement_rate_profiles
for select
to authenticated
using (public.jwt_is_authority_user());

create policy "Authority insert reinstatement rate profiles"
on public.reinstatement_rate_profiles
for insert
to authenticated
with check (public.jwt_is_admin());

create policy "Authority update reinstatement rate profiles"
on public.reinstatement_rate_profiles
for update
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

create policy "Authority delete reinstatement rate profiles"
on public.reinstatement_rate_profiles
for delete
to authenticated
using (public.jwt_is_admin());

comment on table public.reinstatement_rate_profiles is
  'Configurable FPIA reinstatement cost rate assumptions used by the MVP estimate model.';

alter table public.issued_certificates
  add column if not exists reinstatement_estimate_amount numeric(14,2),
  add column if not exists reinstatement_estimate_currency text,
  add column if not exists reinstatement_estimate_basis_summary text,
  add column if not exists reinstatement_estimate_model_version text,
  add column if not exists reinstatement_estimate_disclaimer text,
  add column if not exists reinstatement_estimate_generated_at timestamptz,
  add column if not exists reinstatement_estimate_inputs jsonb;

comment on column public.issued_certificates.reinstatement_estimate_amount is
  'Indicative rebuild or reinstatement estimate for the fixed improvements captured at the date of issue.';

comment on column public.issued_certificates.reinstatement_estimate_inputs is
  'Frozen estimate assumptions and calculation detail captured at the date of issue.';

insert into public.reinstatement_rate_profiles (
  province_or_region,
  property_type,
  finish_tier,
  base_rate_per_m2,
  demolition_percentage_or_fixed,
  professional_fees_percentage,
  approvals_percentage,
  contingency_or_escalation_percentage,
  effective_from,
  is_active,
  model_version
)
values
  ('Eastern Cape', null, 'standard', 11600, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Eastern Cape', null, 'mid', 14300, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Eastern Cape', null, 'premium', 18100, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Free State', null, 'standard', 11000, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Free State', null, 'mid', 13750, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Free State', null, 'premium', 17400, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Gauteng', null, 'standard', 12500, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Gauteng', null, 'mid', 15250, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Gauteng', null, 'premium', 19250, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('KwaZulu-Natal', null, 'standard', 12300, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('KwaZulu-Natal', null, 'mid', 15000, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('KwaZulu-Natal', null, 'premium', 18800, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Limpopo', null, 'standard', 11100, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Limpopo', null, 'mid', 13850, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Limpopo', null, 'premium', 17550, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Mpumalanga', null, 'standard', 11200, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Mpumalanga', null, 'mid', 13950, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Mpumalanga', null, 'premium', 17700, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('North West', null, 'standard', 10950, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('North West', null, 'mid', 13650, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('North West', null, 'premium', 17300, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Northern Cape', null, 'standard', 11400, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Northern Cape', null, 'mid', 14100, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Northern Cape', null, 'premium', 17850, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Western Cape', null, 'standard', 13500, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Western Cape', null, 'mid', 16500, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1'),
  ('Western Cape', null, 'premium', 21000, 5, 8, 2, 7, current_date, true, 'fpia-reinstatement-v1')
on conflict do nothing;

commit;
