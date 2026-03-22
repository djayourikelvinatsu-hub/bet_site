-- WinLine: profiles, slips (previews), codes (gated by RLS)
-- Run in Supabase SQL Editor or via supabase db push

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  is_vip boolean not null default false,
  vip_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booking_slips (
  id uuid primary key default gen_random_uuid(),
  league text not null,
  fixture text not null,
  market text not null,
  bookmaker text not null,
  kickoff text not null,
  tier text not null check (tier in ('free', 'vip')),
  sort_order int not null default 0,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booking_codes (
  slip_id uuid primary key references public.booking_slips (id) on delete cascade,
  code text not null
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.booking_slips enable row level security;
alter table public.booking_codes enable row level security;

-- Profiles: read own row
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (auth.uid() = id);

-- Profiles: admins read all (manage users / VIP manually if needed)
create policy profiles_select_admin on public.profiles
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Profiles: admins update any (VIP flags, role — use carefully)
create policy profiles_update_admin on public.profiles
  for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Slips: verified users see all rows (fixtures; codes are separate table)
create policy booking_slips_select_verified on public.booking_slips
  for select to authenticated
  using (
    exists (
      select 1 from auth.users u
      where u.id = auth.uid() and u.email_confirmed_at is not null
    )
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy booking_slips_all_admin on public.booking_slips
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Codes: free tier + email verified
create policy booking_codes_select_free on public.booking_codes
  for select to authenticated
  using (
    exists (
      select 1
      from public.booking_slips s
      join auth.users u on u.id = auth.uid()
      where s.id = booking_codes.slip_id
        and s.tier = 'free'
        and u.email_confirmed_at is not null
    )
  );

-- Codes: VIP tier + active subscription
create policy booking_codes_select_vip on public.booking_codes
  for select to authenticated
  using (
    exists (
      select 1
      from public.booking_slips s
      join public.profiles p on p.id = auth.uid()
      where s.id = booking_codes.slip_id
        and s.tier = 'vip'
        and p.is_vip = true
        and (p.vip_expires_at is null or p.vip_expires_at > now())
    )
  );

create policy booking_codes_all_admin on public.booking_codes
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
