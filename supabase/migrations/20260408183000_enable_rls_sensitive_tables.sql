begin;

-- Public-read lookup table used by the request-inspection form.
alter table public.sa_suburbs enable row level security;

drop policy if exists "Public can read suburbs" on public.sa_suburbs;
create policy "Public can read suburbs"
on public.sa_suburbs
for select
to anon, authenticated
using (true);

-- Sensitive operational tables should not be exposed through the public Data API.
alter table public.certificate_action_requests enable row level security;
alter table public.inspection_requests enable row level security;
alter table public.report_registry enable row level security;
alter table public.issued_certificates enable row level security;
alter table public.properties enable row level security;
alter table public.report_audit_log enable row level security;
alter table public.cases enable row level security;
alter table public.case_events enable row level security;
alter table public.inspectors enable row level security;

revoke all on table public.certificate_action_requests from anon, authenticated;
revoke all on table public.inspection_requests from anon, authenticated;
revoke all on table public.report_registry from anon, authenticated;
revoke all on table public.issued_certificates from anon, authenticated;
revoke all on table public.properties from anon, authenticated;
revoke all on table public.report_audit_log from anon, authenticated;
revoke all on table public.cases from anon, authenticated;
revoke all on table public.case_events from anon, authenticated;
revoke all on table public.inspectors from anon, authenticated;

grant select on table public.sa_suburbs to anon, authenticated;

commit;
