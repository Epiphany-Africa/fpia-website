create table if not exists public.seller_readiness_documents (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.seller_readiness_assessments(id) on delete cascade,
  document_type text not null,
  document_status text null,
  file_path text null,
  file_name text null,
  mime_type text null,
  uploaded_at timestamptz null,
  notes text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.seller_readiness_documents
  drop constraint if exists seller_readiness_documents_document_status_check;

alter table public.seller_readiness_documents
  add constraint seller_readiness_documents_document_status_check
  check (
    document_status is null
    or document_status in ('not_started', 'uploaded', 'completed', 'signed', 'not_applicable')
  );

create unique index if not exists ux_seller_readiness_documents_assessment_type
  on public.seller_readiness_documents (assessment_id, document_type);

create index if not exists idx_seller_readiness_documents_assessment_id
  on public.seller_readiness_documents (assessment_id);

create index if not exists idx_seller_readiness_documents_type_status
  on public.seller_readiness_documents (document_type, document_status);

create or replace function public.set_seller_readiness_documents_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_seller_readiness_documents_updated_at
  on public.seller_readiness_documents;

create trigger trg_seller_readiness_documents_updated_at
before update on public.seller_readiness_documents
for each row
execute function public.set_seller_readiness_documents_updated_at();

alter table public.seller_readiness_documents enable row level security;

drop policy if exists "Authority read seller readiness documents" on public.seller_readiness_documents;
create policy "Authority read seller readiness documents"
on public.seller_readiness_documents
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

drop policy if exists "Admin manage seller readiness documents" on public.seller_readiness_documents;
create policy "Admin manage seller readiness documents"
on public.seller_readiness_documents
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
