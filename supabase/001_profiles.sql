create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null default '',
  role text not null default 'customer' check (role in ('admin', 'customer')),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- Seed an admin profile after you create the admin account in Supabase Auth.
-- Replace the UUID below with the actual auth.users id for admin@velanova.com.
-- insert into public.profiles (id, email, full_name, role)
-- values ('REPLACE_WITH_ADMIN_UUID', 'admin@velanova.com', 'Velanova Admin', 'admin');
