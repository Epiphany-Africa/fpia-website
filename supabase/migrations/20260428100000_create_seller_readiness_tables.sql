create table if not exists public.seller_readiness_assessments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid null references public.properties(id) on delete set null,
  case_id uuid null references public.cases(id) on delete set null,
  seller_name text null,
  seller_email text null,
  seller_phone text null,
  property_address text not null,
  suburb text null,
  city text null,
  province text null,
  postal_code text null,
  property_type text null,
  floor_area_m2 numeric(10,2) null,
  erf_size_m2 numeric(10,2) null,
  bedrooms numeric(4,1) null,
  bathrooms numeric(4,1) null,
  garages integer null,
  finish_tier text null,
  expected_asking_price numeric(14,2) null,
  expected_price_currency text not null default 'ZAR',
  selling_urgency text null,
  assessment_status text not null default 'draft',
  readiness_score integer null,
  buyer_negotiation_risk text null,
  disclosure_risk_level text null,
  visible_damage_estimate_min numeric(14,2) null,
  visible_damage_estimate_max numeric(14,2) null,
  reinstatement_estimate_amount numeric(14,2) null,
  reinstatement_estimate_currency text null,
  reinstatement_estimate_basis_summary text null,
  reinstatement_estimate_model_version text null,
  pricing_guidance_summary text null,
  recommended_listing_posture text null,
  disclaimer text not null default 'This FPIA Seller Readiness Assessment is based on information and visible evidence submitted to FPIA. It provides indicative pre-listing readiness, visible repair exposure, disclosure-risk and negotiation-risk guidance only. It is not a formal property valuation, not an estate-agent comparative market analysis, not a quantity-surveyor report, not an engineering opinion, not an insurance assessment, and not a guarantee of final sale price or repair cost. Specialist inspection, contractor quotation, insurer assessment, lender valuation or professional advice may be required before reliance.',
  notes text null,
  report_reference text unique null,
  report_generated_at timestamptz null,
  reviewed_by uuid null,
  reviewed_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.seller_readiness_assessments
  drop constraint if exists seller_readiness_assessments_finish_tier_check;

alter table public.seller_readiness_assessments
  add constraint seller_readiness_assessments_finish_tier_check
  check (
    finish_tier is null or finish_tier in ('standard', 'mid', 'premium')
  );

alter table public.seller_readiness_assessments
  drop constraint if exists seller_readiness_assessments_selling_urgency_check;

alter table public.seller_readiness_assessments
  add constraint seller_readiness_assessments_selling_urgency_check
  check (
    selling_urgency is null or selling_urgency in ('sell_fast', 'balanced', 'maximise_price')
  );

alter table public.seller_readiness_assessments
  drop constraint if exists seller_readiness_assessments_assessment_status_check;

alter table public.seller_readiness_assessments
  add constraint seller_readiness_assessments_assessment_status_check
  check (
    assessment_status in ('draft', 'submitted', 'ai_reviewed', 'authority_reviewed', 'report_ready', 'archived')
  );

alter table public.seller_readiness_assessments
  drop constraint if exists seller_readiness_assessments_readiness_score_check;

alter table public.seller_readiness_assessments
  add constraint seller_readiness_assessments_readiness_score_check
  check (
    readiness_score is null or readiness_score between 0 and 100
  );

alter table public.seller_readiness_assessments
  drop constraint if exists seller_readiness_assessments_buyer_negotiation_risk_check;

alter table public.seller_readiness_assessments
  add constraint seller_readiness_assessments_buyer_negotiation_risk_check
  check (
    buyer_negotiation_risk is null or buyer_negotiation_risk in ('low', 'medium', 'high', 'critical')
  );

alter table public.seller_readiness_assessments
  drop constraint if exists seller_readiness_assessments_disclosure_risk_level_check;

alter table public.seller_readiness_assessments
  add constraint seller_readiness_assessments_disclosure_risk_level_check
  check (
    disclosure_risk_level is null or disclosure_risk_level in ('low', 'medium', 'high', 'critical')
  );

create table if not exists public.seller_readiness_damage_items (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.seller_readiness_assessments(id) on delete cascade,
  evidence_id uuid null,
  image_path text null,
  image_url text null,
  uploaded_file_name text null,
  damage_category text null,
  building_element text null,
  location_on_property text null,
  seller_notes text null,
  visible_condition text null,
  severity text null,
  confidence text null,
  specialist_required boolean not null default false,
  recommended_specialist text null,
  estimated_quantity numeric(14,2) null,
  quantity_unit text null,
  estimated_cost_min numeric(14,2) null,
  estimated_cost_max numeric(14,2) null,
  cost_basis text null,
  ai_basis_summary text null,
  limitation_disclaimer text null,
  review_status text not null default 'draft',
  reviewed_by uuid null,
  reviewed_at timestamptz null,
  ai_model_version text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.seller_readiness_damage_items
  drop constraint if exists seller_readiness_damage_items_severity_check;

alter table public.seller_readiness_damage_items
  add constraint seller_readiness_damage_items_severity_check
  check (
    severity is null or severity in ('low', 'medium', 'high', 'critical')
  );

alter table public.seller_readiness_damage_items
  drop constraint if exists seller_readiness_damage_items_confidence_check;

alter table public.seller_readiness_damage_items
  add constraint seller_readiness_damage_items_confidence_check
  check (
    confidence is null or confidence in ('low', 'medium', 'high')
  );

alter table public.seller_readiness_damage_items
  drop constraint if exists seller_readiness_damage_items_review_status_check;

alter table public.seller_readiness_damage_items
  add constraint seller_readiness_damage_items_review_status_check
  check (
    review_status in ('draft', 'ai_suggested', 'accepted', 'amended', 'rejected')
  );

create table if not exists public.damage_repair_rate_profiles (
  id uuid primary key default gen_random_uuid(),
  damage_category text not null,
  building_element text null,
  severity text not null,
  unit_basis text not null,
  min_rate numeric(14,2) not null,
  max_rate numeric(14,2) not null,
  minimum_allowance numeric(14,2) null,
  specialist_required_default boolean not null default false,
  recommended_specialist text null,
  province_or_region text null,
  effective_from date not null default current_date,
  is_active boolean not null default true,
  model_version text not null default 'fpia-damage-cost-v1',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.damage_repair_rate_profiles
  drop constraint if exists damage_repair_rate_profiles_severity_check;

alter table public.damage_repair_rate_profiles
  add constraint damage_repair_rate_profiles_severity_check
  check (
    severity in ('low', 'medium', 'high', 'critical')
  );

create index if not exists idx_seller_readiness_assessments_status
  on public.seller_readiness_assessments (assessment_status);

create index if not exists idx_seller_readiness_assessments_report_reference
  on public.seller_readiness_assessments (report_reference);

create index if not exists idx_seller_readiness_assessments_property_address
  on public.seller_readiness_assessments (property_address);

create index if not exists idx_seller_readiness_assessments_seller_email
  on public.seller_readiness_assessments (seller_email);

create index if not exists idx_seller_readiness_assessments_created_at
  on public.seller_readiness_assessments (created_at desc);

create index if not exists idx_seller_readiness_damage_items_assessment_id
  on public.seller_readiness_damage_items (assessment_id);

create index if not exists idx_damage_repair_rate_profiles_lookup
  on public.damage_repair_rate_profiles (
    damage_category,
    severity,
    is_active,
    province_or_region,
    building_element,
    effective_from desc
  );

create or replace function public.set_seller_readiness_assessments_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create or replace function public.set_seller_readiness_damage_items_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create or replace function public.set_damage_repair_rate_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_seller_readiness_assessments_updated_at
  on public.seller_readiness_assessments;

create trigger trg_seller_readiness_assessments_updated_at
before update on public.seller_readiness_assessments
for each row
execute function public.set_seller_readiness_assessments_updated_at();

drop trigger if exists trg_seller_readiness_damage_items_updated_at
  on public.seller_readiness_damage_items;

create trigger trg_seller_readiness_damage_items_updated_at
before update on public.seller_readiness_damage_items
for each row
execute function public.set_seller_readiness_damage_items_updated_at();

drop trigger if exists trg_damage_repair_rate_profiles_updated_at
  on public.damage_repair_rate_profiles;

create trigger trg_damage_repair_rate_profiles_updated_at
before update on public.damage_repair_rate_profiles
for each row
execute function public.set_damage_repair_rate_profiles_updated_at();

alter table public.seller_readiness_assessments enable row level security;
alter table public.seller_readiness_damage_items enable row level security;
alter table public.damage_repair_rate_profiles enable row level security;

drop policy if exists "Authority read seller readiness assessments" on public.seller_readiness_assessments;
create policy "Authority read seller readiness assessments"
on public.seller_readiness_assessments
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'super_admin', 'inspector')
      and coalesce(user_profiles.status, 'active') = 'active'
  )
);

drop policy if exists "Admin manage seller readiness assessments" on public.seller_readiness_assessments;
create policy "Admin manage seller readiness assessments"
on public.seller_readiness_assessments
for all
to authenticated
using (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'super_admin')
      and coalesce(user_profiles.status, 'active') = 'active'
  )
)
with check (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'super_admin')
      and coalesce(user_profiles.status, 'active') = 'active'
  )
);

drop policy if exists "Authority read seller readiness damage items" on public.seller_readiness_damage_items;
create policy "Authority read seller readiness damage items"
on public.seller_readiness_damage_items
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'super_admin', 'inspector')
      and coalesce(user_profiles.status, 'active') = 'active'
  )
);

drop policy if exists "Admin manage seller readiness damage items" on public.seller_readiness_damage_items;
create policy "Admin manage seller readiness damage items"
on public.seller_readiness_damage_items
for all
to authenticated
using (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'super_admin')
      and coalesce(user_profiles.status, 'active') = 'active'
  )
)
with check (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'super_admin')
      and coalesce(user_profiles.status, 'active') = 'active'
  )
);

drop policy if exists "Authority read damage repair rate profiles" on public.damage_repair_rate_profiles;
create policy "Authority read damage repair rate profiles"
on public.damage_repair_rate_profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'super_admin', 'inspector')
      and coalesce(user_profiles.status, 'active') = 'active'
  )
);

drop policy if exists "Admin manage damage repair rate profiles" on public.damage_repair_rate_profiles;
create policy "Admin manage damage repair rate profiles"
on public.damage_repair_rate_profiles
for all
to authenticated
using (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'super_admin')
      and coalesce(user_profiles.status, 'active') = 'active'
  )
)
with check (
  exists (
    select 1
    from public.user_profiles
    where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'super_admin')
      and coalesce(user_profiles.status, 'active') = 'active'
  )
);

insert into public.damage_repair_rate_profiles (
  damage_category,
  building_element,
  severity,
  unit_basis,
  min_rate,
  max_rate,
  minimum_allowance,
  specialist_required_default,
  recommended_specialist,
  province_or_region,
  effective_from,
  is_active,
  model_version
) values
  ('damp', 'rising damp', 'low', 'm2', 450, 750, 6500, true, 'Damp specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('damp', 'rising damp', 'medium', 'm2', 750, 1250, 12000, true, 'Damp specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('damp', 'rising damp', 'high', 'm2', 1250, 2100, 25000, true, 'Damp specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('ceiling', 'ceiling water damage', 'low', 'room', 3500, 6500, 3500, false, 'Ceiling contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('ceiling', 'ceiling water damage', 'medium', 'room', 6500, 14000, 6500, true, 'Roofing and ceiling contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('ceiling', 'ceiling water damage', 'high', 'room', 14000, 32000, 14000, true, 'Roofing specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('roof', 'roof leak', 'low', 'item', 4500, 12000, 4500, true, 'Roofing contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('roof', 'roof section', 'medium', 'item', 12000, 35000, 12000, true, 'Roofing contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('roof', 'roof section', 'high', 'item', 35000, 95000, 35000, true, 'Roofing specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('boundary', 'boundary wall cracking', 'medium', 'linear_metre', 1500, 3200, 12000, true, 'Masonry contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('boundary', 'boundary wall cracking', 'high', 'linear_metre', 3200, 7500, 25000, true, 'Structural or masonry specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('retaining_wall', 'retaining wall movement', 'high', 'linear_metre', 6500, 14500, 45000, true, 'Structural engineer / retaining wall specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('retaining_wall', 'retaining wall movement', 'critical', 'linear_metre', 14500, 28000, 95000, true, 'Structural engineer / retaining wall specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('driveway', 'driveway erosion', 'medium', 'm2', 450, 950, 9500, false, 'Paving contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('driveway', 'driveway erosion', 'high', 'm2', 950, 1750, 18000, true, 'Civil / paving contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('structural', 'structural cracking', 'medium', 'item', 12000, 35000, 12000, true, 'Structural engineer', null, current_date, true, 'fpia-damage-cost-v1'),
  ('structural', 'structural cracking', 'high', 'item', 35000, 120000, 35000, true, 'Structural engineer', null, current_date, true, 'fpia-damage-cost-v1'),
  ('structural', 'structural cracking', 'critical', 'item', 120000, 350000, 120000, true, 'Structural engineer', null, current_date, true, 'fpia-damage-cost-v1'),
  ('plumbing', 'plumbing leak visible damage', 'low', 'item', 2500, 6500, 2500, false, 'Plumber', null, current_date, true, 'fpia-damage-cost-v1'),
  ('plumbing', 'plumbing leak visible damage', 'medium', 'item', 6500, 18000, 6500, true, 'Plumber', null, current_date, true, 'fpia-damage-cost-v1'),
  ('electrical', 'electrical visible risk', 'medium', 'callout', 3500, 12000, 3500, true, 'Electrician', null, current_date, true, 'fpia-damage-cost-v1'),
  ('electrical', 'electrical visible risk', 'high', 'callout', 12000, 35000, 12000, true, 'Electrician', null, current_date, true, 'fpia-damage-cost-v1'),
  ('finishes', 'exterior paint / plaster deterioration', 'low', 'm2', 180, 380, 6000, false, 'Painting contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('finishes', 'exterior paint / plaster deterioration', 'medium', 'm2', 380, 850, 14000, false, 'Painting / plaster contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('bathroom', 'bathroom waterproofing concern', 'medium', 'bathroom', 12000, 32000, 12000, true, 'Waterproofing contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('bathroom', 'bathroom waterproofing concern', 'high', 'bathroom', 32000, 65000, 32000, true, 'Waterproofing and plumbing contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('pool', 'pool cracks/leaks', 'medium', 'item', 18000, 45000, 18000, true, 'Pool specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('pool', 'pool cracks/leaks', 'high', 'item', 45000, 125000, 45000, true, 'Pool specialist', null, current_date, true, 'fpia-damage-cost-v1'),
  ('other', 'general finishes damage', 'low', 'room', 2500, 6500, 2500, false, 'General contractor', null, current_date, true, 'fpia-damage-cost-v1'),
  ('other', 'general finishes damage', 'medium', 'room', 6500, 18000, 6500, false, 'General contractor', null, current_date, true, 'fpia-damage-cost-v1');
