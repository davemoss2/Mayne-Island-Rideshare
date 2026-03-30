-- ============================================================
-- Mayne Island Rideshare — Supabase Database Schema
-- ============================================================
-- Run this in the Supabase SQL editor (or via supabase db push
-- if you use the Supabase CLI).
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- 1. profiles
--    Extends the built-in auth.users table. One row per user.
-- ────────────────────────────────────────────────────────────
create table public.profiles (
  id                     uuid references auth.users(id) on delete cascade primary key,
  name                   text not null,
  email                  text not null,
  phone                  text not null,
  role                   text not null check (role in ('rider', 'driver', 'both')),
  -- Driver fields
  vehicle_description    text,
  pets_allowed           text check (pets_allowed in ('yes', 'no', 'case-by-case')),
  child_seats_available  integer default 0,
  wheelchair_accessible  boolean default false,
  cargo_capacity         text,
  emergency_contact      jsonb,  -- { name: string, phone: string }
  -- Rider preferences
  has_pet                boolean default false,
  needs_child_seat       boolean default false,
  needs_wheelchair_access boolean default false,
  cargo_needs            text,
  created_at             timestamptz default now() not null
);

-- ────────────────────────────────────────────────────────────
-- 2. ride_requests
--    Submitted by riders; confirmed by a driver.
-- ────────────────────────────────────────────────────────────
create table public.ride_requests (
  id                       uuid default uuid_generate_v4() primary key,
  rider_id                 uuid references public.profiles(id) on delete cascade not null,
  rider_name               text not null,
  rider_phone              text not null,
  destination              text not null,
  pickup_location          text not null,
  notes                    text default '',
  has_pet                  boolean default false,
  needs_child_seat         boolean default false,
  needs_wheelchair_access  boolean default false,
  cargo_description        text default '',
  status                   text not null default 'pending'
                             check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  confirmed_driver_id      uuid references public.profiles(id),
  confirmed_driver_name    text,
  confirmed_driver_phone   text,
  confirmed_driver_vehicle text,
  created_at               timestamptz default now() not null
);

-- ────────────────────────────────────────────────────────────
-- 3. driver_trips
--    Posted by drivers; visible on the community message board.
-- ────────────────────────────────────────────────────────────
create table public.driver_trips (
  id                    uuid default uuid_generate_v4() primary key,
  driver_id             uuid references public.profiles(id) on delete cascade not null,
  driver_name           text not null,
  driver_phone          text not null,
  destination           text not null,
  departure_time        text not null,
  departure_location    text not null,
  available_seats       integer not null default 1,
  pets_allowed          boolean default false,
  child_seats_available integer default 0,
  wheelchair_accessible boolean default false,
  notes                 text default '',
  status                text not null default 'active'
                          check (status in ('active', 'full', 'completed')),
  created_at            timestamptz default now() not null
);

-- ────────────────────────────────────────────────────────────
-- 4. Row-Level Security (RLS)
-- ────────────────────────────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.ride_requests enable row level security;
alter table public.driver_trips  enable row level security;

-- profiles
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- ride_requests
create policy "Ride requests are viewable by authenticated users"
  on public.ride_requests for select
  to authenticated
  using (true);

create policy "Authenticated users can create ride requests"
  on public.ride_requests for insert
  to authenticated
  with check (auth.uid() = rider_id);

-- Riders can cancel their own requests; any authenticated user can
-- confirm a pending request (i.e. act as a driver).
create policy "Riders can update their requests; drivers can confirm pending ones"
  on public.ride_requests for update
  to authenticated
  using (auth.uid() = rider_id or status = 'pending');

-- driver_trips (public read so the /board page works without login)
create policy "Driver trips are viewable by everyone"
  on public.driver_trips for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can post driver trips"
  on public.driver_trips for insert
  to authenticated
  with check (auth.uid() = driver_id);

create policy "Drivers can update their own trips"
  on public.driver_trips for update
  to authenticated
  using (auth.uid() = driver_id);

create policy "Drivers can delete their own trips"
  on public.driver_trips for delete
  to authenticated
  using (auth.uid() = driver_id);

-- ────────────────────────────────────────────────────────────
-- 5. Realtime
--    Enable Postgres change events for the two data tables so
--    the DataContext Realtime subscriptions work.
-- ────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.ride_requests;
alter publication supabase_realtime add table public.driver_trips;
