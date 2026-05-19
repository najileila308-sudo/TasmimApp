create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  auth_provider text not null default 'email',
  provider_user_id text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
alter column email drop not null;

alter table public.profiles
add column if not exists auth_provider text not null default 'email',
add column if not exists provider_user_id text,
add column if not exists full_name text,
add column if not exists avatar_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_auth_provider_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
    add constraint profiles_auth_provider_check
    check (auth_provider in ('email', 'facebook', 'google', 'unknown'));
  end if;
end;
$$;

alter table public.profiles enable row level security;

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    auth_provider,
    provider_user_id,
    full_name,
    avatar_url
  )
  values (
    new.id,
    nullif(new.email, ''),
    coalesce(new.raw_app_meta_data->>'provider', 'email'),
    coalesce(new.raw_user_meta_data->>'provider_id', new.raw_user_meta_data->>'sub'),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set
    email = coalesce(excluded.email, public.profiles.email),
    auth_provider = coalesce(excluded.auth_provider, public.profiles.auth_provider),
    provider_user_id = coalesce(excluded.provider_user_id, public.profiles.provider_user_id),
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (
  id,
  email,
  auth_provider,
  provider_user_id,
  full_name,
  avatar_url
)
select
  id,
  nullif(email, ''),
  coalesce(raw_app_meta_data->>'provider', 'email'),
  coalesce(raw_user_meta_data->>'provider_id', raw_user_meta_data->>'sub'),
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do update
set
  email = coalesce(excluded.email, public.profiles.email),
  auth_provider = coalesce(excluded.auth_provider, public.profiles.auth_provider),
  provider_user_id = coalesce(excluded.provider_user_id, public.profiles.provider_user_id),
  full_name = coalesce(excluded.full_name, public.profiles.full_name),
  avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);
