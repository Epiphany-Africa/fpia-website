begin;

update public.user_profiles
set role = 'super_admin'
where lower(coalesce(role, '')) = 'super_user';

create or replace function public.jwt_authority_role()
returns text
language sql
stable
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
as $$
  select public.jwt_authority_role() is not null;
$$;

create or replace function public.jwt_is_admin()
returns boolean
language sql
stable
as $$
  select public.jwt_has_authority_role();
$$;

alter table if exists public.authority_registry enable row level security;

drop policy if exists "Admins can manage certificate action requests" on public.certificate_action_requests;
create policy "Admins can manage certificate action requests"
on public.certificate_action_requests
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

drop policy if exists "Admins can manage inspection requests" on public.inspection_requests;
create policy "Admins can manage inspection requests"
on public.inspection_requests
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

drop policy if exists "Admins can manage report registry" on public.report_registry;
create policy "Admins can manage report registry"
on public.report_registry
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

drop policy if exists "Admins can manage issued certificates" on public.issued_certificates;
create policy "Admins can manage issued certificates"
on public.issued_certificates
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

drop policy if exists "Admins can manage properties" on public.properties;
create policy "Admins can manage properties"
on public.properties
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

drop policy if exists "Admins can manage report audit log" on public.report_audit_log;
create policy "Admins can manage report audit log"
on public.report_audit_log
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

drop policy if exists "Admins can manage cases" on public.cases;
create policy "Admins can manage cases"
on public.cases
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

drop policy if exists "Admins can manage case events" on public.case_events;
create policy "Admins can manage case events"
on public.case_events
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

drop policy if exists "Admins can manage inspectors" on public.inspectors;
create policy "Admins can manage inspectors"
on public.inspectors
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

drop policy if exists "Authority roles can manage authority registry" on public.authority_registry;
create policy "Authority roles can manage authority registry"
on public.authority_registry
for all
to authenticated
using (public.jwt_has_authority_role())
with check (public.jwt_has_authority_role());

commit;
