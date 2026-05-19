create table if not exists public.contact_messages (
  id bigint primary key generated always as identity,
  name text not null,
  email text not null,
  phone text,
  service_type text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.contact_messages
add column if not exists is_read boolean not null default false;

alter table public.contact_messages enable row level security;

create policy "anon can insert contact messages"
on public.contact_messages
for insert
to anon
with check (true);

create policy "authenticated can insert contact messages"
on public.contact_messages
for insert
to authenticated
with check (true);

create policy "authenticated can read contact messages"
on public.contact_messages
for select
to authenticated
using (true);

create policy "authenticated can update contact messages"
on public.contact_messages
for update
to authenticated
using (true)
with check (true);

create policy "authenticated can delete contact messages"
on public.contact_messages
for delete
to authenticated
using (true);
