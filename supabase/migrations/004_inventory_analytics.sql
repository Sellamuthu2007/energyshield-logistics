drop table if exists public.system_analytics cascade;
drop table if exists public.refinery_inventory cascade;

-- 1. Create Refinery Inventory
create table public.refinery_inventory (
  id uuid default gen_random_uuid() primary key,
  refinery_name text not null,
  crude_type text not null,
  current_stock integer not null,
  capacity integer not null,
  last_replenished timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create System Analytics
create table public.system_analytics (
  id uuid default gen_random_uuid() primary key,
  metric_name text not null,
  metric_value double precision not null,
  category text not null,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.refinery_inventory enable row level security;
alter table public.system_analytics enable row level security;

-- Policies for viewing (Authenticated users can view)
create policy "Anyone authenticated can view refinery_inventory" on public.refinery_inventory for select to authenticated using (true);
create policy "Anyone authenticated can view system_analytics" on public.system_analytics for select to authenticated using (true);

-- Update policies for system integration
create policy "Procurement can update inventory" on public.refinery_inventory
  for update to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'procurement'
    )
  );

-- Enable Realtime
alter publication supabase_realtime add table public.refinery_inventory;
alter publication supabase_realtime add table public.system_analytics;

-- SEED DATA
insert into public.refinery_inventory (refinery_name, crude_type, current_stock, capacity) values
('Paradip Refinery', 'Russian Crude (Urals)', 4500000, 8000000),
('Kochi Refinery', 'UAE Murban', 2100000, 5000000),
('Vizag Refinery', 'Iraqi Basra Heavy', 1800000, 4000000);

insert into public.system_analytics (metric_name, metric_value, category) values
('Total Procurement Savings', 12.5, 'finance'),
('Average Delivery SLA', 18.2, 'logistics'),
('Global Supplier Risk Index', 42.0, 'risk');
