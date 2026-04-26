begin;

-- Harden helper functions so policy evaluation does not depend on a mutable search_path.
create or replace function public.jwt_authority_role()
returns text
language sql
stable
set search_path = public
as $$
  select case lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'role', ''))
    when 'admin' then 'admin'
    when 'super_admin' then 'super_admin'
    when 'super_user' then 'super_admin'
    when 'inspector' then 'inspector'
    else null
  end;
$$;

create or replace function public.jwt_has_authority_role()
returns boolean
language sql
stable
set search_path = public
as $$
  select public.jwt_authority_role() is not null;
$$;

create or replace function public.jwt_is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select public.jwt_has_authority_role();
$$;

-- Remove the permissive fallback policies that exposed cases to all authenticated users.
drop policy if exists "Allow authenticated users to read cases" on public.cases;
drop policy if exists "Allow insert for authenticated users" on public.cases;

-- Force RLS on sensitive tables so even table owners must pass policy checks.
alter table if exists public.certificate_action_requests force row level security;
alter table if exists public.inspection_requests force row level security;
alter table if exists public.report_registry force row level security;
alter table if exists public.issued_certificates force row level security;
alter table if exists public.properties force row level security;
alter table if exists public.report_audit_log force row level security;
alter table if exists public.cases force row level security;
alter table if exists public.case_events force row level security;
alter table if exists public.inspectors force row level security;
alter table if exists public.authority_registry force row level security;
alter table if exists public.property_passport_profiles force row level security;
alter table if exists public.property_passport_documents force row level security;

commit;
