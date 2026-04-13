begin;

alter table public.cases enable row level security;

drop policy if exists "Allow authenticated users to read cases" on public.cases;
create policy "Allow authenticated users to read cases"
on public.cases
for select
to authenticated
using (true);

drop policy if exists "Allow insert for authenticated users" on public.cases;
create policy "Allow insert for authenticated users"
on public.cases
for insert
to authenticated
with check (auth.uid() is not null);

commit;
