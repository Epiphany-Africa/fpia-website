begin;

-- Assumption for future admin access:
-- authenticated admin users carry `app_metadata.role = 'admin'` in their JWT.
-- Until that claim exists, these policies grant no additional access.

create or replace function public.jwt_is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

-- Admin-only access to sensitive operational tables.
drop policy if exists "Admins can manage certificate action requests" on public.certificate_action_requests;
create policy "Admins can manage certificate action requests"
on public.certificate_action_requests
for all
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

drop policy if exists "Admins can manage inspection requests" on public.inspection_requests;
create policy "Admins can manage inspection requests"
on public.inspection_requests
for all
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

drop policy if exists "Admins can manage report registry" on public.report_registry;
create policy "Admins can manage report registry"
on public.report_registry
for all
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

drop policy if exists "Admins can manage issued certificates" on public.issued_certificates;
create policy "Admins can manage issued certificates"
on public.issued_certificates
for all
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

drop policy if exists "Admins can manage properties" on public.properties;
create policy "Admins can manage properties"
on public.properties
for all
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

drop policy if exists "Admins can manage report audit log" on public.report_audit_log;
create policy "Admins can manage report audit log"
on public.report_audit_log
for all
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

drop policy if exists "Admins can manage cases" on public.cases;
create policy "Admins can manage cases"
on public.cases
for all
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

drop policy if exists "Admins can manage case events" on public.case_events;
create policy "Admins can manage case events"
on public.case_events
for all
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

drop policy if exists "Admins can manage inspectors" on public.inspectors;
create policy "Admins can manage inspectors"
on public.inspectors
for all
to authenticated
using (public.jwt_is_admin())
with check (public.jwt_is_admin());

commit;
