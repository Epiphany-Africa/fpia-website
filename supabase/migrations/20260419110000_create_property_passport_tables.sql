create table if not exists public.property_passport_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  owner_email text not null,
  owner_phone text null,
  property_address text not null,
  suburb text null,
  city text null,
  province text null,
  postal_code text null,
  passport_tier text not null default 'free',
  profile_status text not null default 'active',
  source_channel text not null default 'website_property_passport',
  notes text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_property_passport_profiles_email
  on public.property_passport_profiles(owner_email, created_at desc);

create index if not exists idx_property_passport_profiles_address
  on public.property_passport_profiles(property_address);

create table if not exists public.property_passport_documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.property_passport_profiles(id) on delete cascade,
  document_type text not null,
  verification_status text not null default 'uploaded_unverified',
  file_name text not null,
  file_path text not null,
  file_url text null,
  mime_type text null,
  size_bytes bigint null,
  issued_at date null,
  expires_at date null,
  source_channel text not null default 'website_property_passport',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_property_passport_documents_profile
  on public.property_passport_documents(profile_id, created_at desc);

create index if not exists idx_property_passport_documents_type
  on public.property_passport_documents(document_type);

alter table public.property_passport_profiles enable row level security;
alter table public.property_passport_documents enable row level security;

revoke all on table public.property_passport_profiles from anon, authenticated;
revoke all on table public.property_passport_documents from anon, authenticated;

grant select, insert, update, delete on table public.property_passport_profiles to authenticated;
grant select, insert, update, delete on table public.property_passport_documents to authenticated;

drop policy if exists "Authority read property passport profiles" on public.property_passport_profiles;
create policy "Authority read property passport profiles"
on public.property_passport_profiles
for select
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = any (array['admin', 'super_admin', 'inspector'])
);

drop policy if exists "Authority mutate property passport profiles" on public.property_passport_profiles;
create policy "Authority mutate property passport profiles"
on public.property_passport_profiles
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = any (array['admin', 'super_admin', 'inspector'])
)
with check (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = any (array['admin', 'super_admin', 'inspector'])
);

drop policy if exists "Authority read property passport documents" on public.property_passport_documents;
create policy "Authority read property passport documents"
on public.property_passport_documents
for select
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = any (array['admin', 'super_admin', 'inspector'])
);

drop policy if exists "Authority mutate property passport documents" on public.property_passport_documents;
create policy "Authority mutate property passport documents"
on public.property_passport_documents
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = any (array['admin', 'super_admin', 'inspector'])
)
with check (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = any (array['admin', 'super_admin', 'inspector'])
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-passport',
  'property-passport',
  false,
  15728640,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
