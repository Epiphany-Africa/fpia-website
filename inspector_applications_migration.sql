-- Migration: create inspector_applications table
-- Run in Supabase SQL editor on project lpgvjyxwouttbvpgivtu

create table if not exists public.inspector_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  province text,
  registration_body text,
  registration_number text,
  registration_status text,
  qualification text,
  years_experience text,
  discipline text,
  property_types text,
  currently_inspecting text,
  motivation text,
  referral text,
  cv_url text,
  proof_url text,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inspector_applications enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'inspector_applications'
      and policyname = 'Admin can manage inspector applications'
  ) then
    create policy "Admin can manage inspector applications"
      on public.inspector_applications
      for all
      using (
        exists (
          select 1
          from public.user_profiles
          where user_profiles.id = auth.uid()
            and user_profiles.role = 'admin'
        )
      )
      with check (
        exists (
          select 1
          from public.user_profiles
          where user_profiles.id = auth.uid()
            and user_profiles.role = 'admin'
        )
      );
  end if;
end
$$;

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'inspector_applications_updated_at'
  ) then
    create trigger inspector_applications_updated_at
      before update on public.inspector_applications
      for each row execute function public.handle_updated_at();
  end if;
end
$$;

create index if not exists inspector_applications_status_idx
  on public.inspector_applications (status, created_at desc);
