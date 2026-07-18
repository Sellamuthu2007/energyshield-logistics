drop table if exists public.route_recommendations cascade;
drop table if exists public.shipment_events cascade;
drop table if exists public.shipment_notifications cascade;
drop table if exists public.shipments cascade;
drop table if exists public.vessels cascade;
drop table if exists public.ports cascade;
drop table if exists public.weather_alerts cascade;
drop table if exists public.refinery_impact cascade;

-- 1. Create Vessels
create table public.vessels (
  id uuid default gen_random_uuid() primary key,
  vessel_name text not null,
  latitude double precision not null,
  longitude double precision not null,
  current_speed double precision not null,
  status text not null check (status in ('In Transit', 'Moored', 'Anchored', 'Loading')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Shipments
create table public.shipments (
  id uuid default gen_random_uuid() primary key,
  po_number text not null, -- Links to purchase_orders
  supplier_country text not null,
  destination_port text not null,
  destination_refinery text not null,
  vessel_id uuid references public.vessels(id),
  quantity integer not null,
  current_eta timestamp with time zone not null,
  status text not null check (status in ('Preparing', 'Departed', 'In Transit', 'Arriving', 'Delivered')),
  progress_stage integer not null default 1, -- 1: Supplier, 2: Ocean, 3: Port, 4: Refinery
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Shipment Events (Timeline/History)
create table public.shipment_events (
  id uuid default gen_random_uuid() primary key,
  shipment_id uuid references public.shipments(id) not null,
  event_type text not null,
  event_description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Ports
create table public.ports (
  id uuid default gen_random_uuid() primary key,
  port_name text not null,
  waiting_ships integer not null,
  available_berths integer not null,
  average_waiting_time text not null,
  congestion_level text not null check (congestion_level in ('low', 'medium', 'high', 'critical')),
  status text not null check (status in ('green', 'yellow', 'red')),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Weather Alerts
create table public.weather_alerts (
  id uuid default gen_random_uuid() primary key,
  alert_type text not null,
  affected_area text not null,
  expected_delay text not null,
  confidence_score integer not null,
  ai_recommendation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create Route Recommendations
create table public.route_recommendations (
  id uuid default gen_random_uuid() primary key,
  shipment_id uuid references public.shipments(id),
  recommended_route text not null,
  time_saved text not null,
  fuel_savings text not null,
  risk_reduction text not null,
  status text not null check (status in ('pending', 'approved', 'ignored')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Create Shipment Notifications
create table public.shipment_notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 8. Create Refinery Impact
create table public.refinery_impact (
  id uuid default gen_random_uuid() primary key,
  refinery_name text not null,
  shipment_id uuid references public.shipments(id),
  expected_delay text not null,
  inventory_remaining text not null,
  ai_assessment text not null check (ai_assessment in ('Low Risk', 'Medium Risk', 'Critical')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.vessels enable row level security;
alter table public.shipments enable row level security;
alter table public.shipment_events enable row level security;
alter table public.ports enable row level security;
alter table public.weather_alerts enable row level security;
alter table public.route_recommendations enable row level security;
alter table public.shipment_notifications enable row level security;
alter table public.refinery_impact enable row level security;

-- Policies for viewing (Authenticated users can view)
create policy "Anyone authenticated can view vessels" on public.vessels for select to authenticated using (true);
create policy "Anyone authenticated can view shipments" on public.shipments for select to authenticated using (true);
create policy "Anyone authenticated can view shipment_events" on public.shipment_events for select to authenticated using (true);
create policy "Anyone authenticated can view ports" on public.ports for select to authenticated using (true);
create policy "Anyone authenticated can view weather_alerts" on public.weather_alerts for select to authenticated using (true);
create policy "Anyone authenticated can view route_recommendations" on public.route_recommendations for select to authenticated using (true);
create policy "Anyone authenticated can view shipment_notifications" on public.shipment_notifications for select to authenticated using (true);
create policy "Anyone authenticated can view refinery_impact" on public.refinery_impact for select to authenticated using (true);

-- Allow Shipping to update purchase orders (to mark them as Tracked)
drop policy if exists "Shipping can update purchase_orders" on public.purchase_orders;
create policy "Shipping can update purchase_orders" on public.purchase_orders
  for update to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'shipping'));

-- Updating policies for Shipping users
create policy "Shipping can manage shipments" on public.shipments
  for all to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'shipping'));

create policy "Shipping can manage route_recommendations" on public.route_recommendations
  for all to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'shipping'));

create policy "Shipping can manage shipment_events" on public.shipment_events
  for all to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'shipping'));

create policy "Shipping can manage shipment_notifications" on public.shipment_notifications
  for all to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'shipping'));


-- Enable Realtime
alter publication supabase_realtime add table public.vessels;
alter publication supabase_realtime add table public.shipments;
alter publication supabase_realtime add table public.shipment_events;
alter publication supabase_realtime add table public.ports;
alter publication supabase_realtime add table public.weather_alerts;
alter publication supabase_realtime add table public.route_recommendations;
alter publication supabase_realtime add table public.shipment_notifications;
alter publication supabase_realtime add table public.refinery_impact;

-- SEED DATA

-- Vessels
insert into public.vessels (vessel_name, latitude, longitude, current_speed, status) values
('MT Ocean Pride', 12.5, 65.2, 14.5, 'In Transit'),
('Eagle Pioneer', 8.2, 75.1, 16.2, 'In Transit'),
('Baltic Sea', 21.0, 58.5, 12.0, 'In Transit');

-- Ports
insert into public.ports (port_name, waiting_ships, available_berths, average_waiting_time, congestion_level, status) values
('Paradip Port', 4, 2, '18 hours', 'medium', 'yellow'),
('Sikka Port', 1, 4, '4 hours', 'low', 'green'),
('Vadinar Port', 0, 3, '2 hours', 'low', 'green'),
('Mundra Port', 6, 1, '32 hours', 'high', 'red'),
('Visakhapatnam Port', 2, 3, '12 hours', 'medium', 'yellow'),
('Mumbai Port', 5, 0, '48 hours', 'critical', 'red'),
('Ennore Port', 1, 2, '6 hours', 'low', 'green');

-- Weather Alerts
insert into public.weather_alerts (alert_type, affected_area, expected_delay, confidence_score, ai_recommendation) values
('Cyclone Alert', 'Arabian Sea (Lat 15, Lon 65)', '3 Days', 92, 'Cyclone detected. Reroute via Maldives corridor to avoid 5m swells.'),
('Dense Fog', 'Visakhapatnam Approach', '12 Hours', 85, 'Reduce speed to 8 knots. Standby for pilot vessel availability.');

-- Shipments Seed Data
insert into public.shipments (po_number, supplier_country, destination_port, destination_refinery, vessel_id, quantity, current_eta, status, progress_stage)
select 
  'PO-SEED-1', 'UAE', 'Mumbai Port', 'Mumbai Refinery', v.id, 500000, now() + interval '5 days', 'In Transit', 3
from public.vessels v where v.vessel_name = 'MT Ocean Pride'
limit 1;

insert into public.shipments (po_number, supplier_country, destination_port, destination_refinery, vessel_id, quantity, current_eta, status, progress_stage)
select 
  'PO-SEED-2', 'Russia', 'Paradip Port', 'Paradip Refinery', v.id, 1000000, now() + interval '12 days', 'In Transit', 2
from public.vessels v where v.vessel_name = 'Baltic Sea'
limit 1;

-- Route Recommendations Seed Data
insert into public.route_recommendations (shipment_id, recommended_route, time_saved, fuel_savings, risk_reduction, status)
select 
  s.id, 'Maldives Safe Corridor', '14 Hours', '250 MT', 'Cyclone Avoidance', 'pending'
from public.shipments s where s.po_number = 'PO-SEED-1'
limit 1;

-- Refinery Impact Seed Data
insert into public.refinery_impact (refinery_name, shipment_id, expected_delay, inventory_remaining, ai_assessment)
select 
  'Mumbai Refinery', s.id, '72 Hours', '4 Days', 'Critical'
from public.shipments s where s.po_number = 'PO-SEED-1'
limit 1;

-- Shipment Notifications Seed Data
insert into public.shipment_notifications (title, message, is_read) values
('Vessel Dispatched', 'MT Ocean Pride has successfully departed from UAE.', false),
('Weather Reroute', 'AI engine calculated new route to avoid Arabian Sea cyclone.', false);
