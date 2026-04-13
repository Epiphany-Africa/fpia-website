create table if not exists public.defect_taxonomy (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  subcategory text not null,
  severity_weight numeric(5,2) not null default 1,
  transfer_weight numeric(5,2) not null default 1,
  safety_weight numeric(5,2) not null default 1,
  insurance_weight numeric(5,2) not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists uq_defect_taxonomy_category_subcategory
on public.defect_taxonomy(category, subcategory);
