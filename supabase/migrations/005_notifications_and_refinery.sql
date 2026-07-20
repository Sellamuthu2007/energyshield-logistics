-- 005: Notifications + Refinery Dashboard Tables

-- Shared notifications table (referenced by notificationService.ts)
drop table if exists public.notifications cascade;

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  target_role text not null check (target_role in ('government','procurement','shipping','refinery','executive','admin')),
  title text not null,
  message text not null,
  is_read boolean default false,
  action_url text,
  created_at timestamptz default now()
);

-- Refinery Dashboard tables
drop table if exists public.refinery_inventory cascade;
drop table if exists public.incoming_shipments cascade;
drop table if exists public.production_plan cascade;
drop table if exists public.maintenance_schedule cascade;
drop table if exists public.production_risk cascade;

create table public.refinery_inventory (
  id uuid primary key default gen_random_uuid(),
  refinery_name text not null,
  current_inventory_barrels numeric not null,
  daily_consumption numeric not null,
  min_safety_stock numeric not null,
  remaining_days numeric not null,
  recorded_at timestamptz default now()
);

create table public.incoming_shipments (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid references public.shipments(id),
  refinery_name text not null,
  expected_arrival timestamptz not null,
  quantity numeric not null,
  status text check (status in ('pending','delivered','delayed')) default 'pending',
  created_at timestamptz default now()
);

create table public.production_plan (
  id uuid primary key default gen_random_uuid(),
  refinery_name text not null,
  petrol_pct numeric not null,
  diesel_pct numeric not null,
  atf_pct numeric not null,
  lpg_pct numeric not null,
  lubricants_pct numeric not null,
  ai_recommendation text,
  reason text
);

create table public.maintenance_schedule (
  id uuid primary key default gen_random_uuid(),
  refinery_name text not null,
  unit_name text not null,
  status text check (status in ('scheduled','in_progress','completed','overdue')) default 'scheduled',
  maintenance_due date not null,
  estimated_downtime_hours numeric not null,
  ai_recommendation text
);

create table public.production_risk (
  id uuid primary key default gen_random_uuid(),
  refinery_name text not null,
  inventory_remaining_days numeric not null,
  incoming_shipment_days numeric not null,
  risk_level text check (risk_level in ('low','medium','high','critical')) not null,
  business_impact text
);

-- Enable RLS
alter table public.notifications enable row level security;
alter table public.refinery_inventory enable row level security;
alter table public.incoming_shipments enable row level security;
alter table public.production_plan enable row level security;
alter table public.maintenance_schedule enable row level security;
alter table public.production_risk enable row level security;

-- RLS: authenticated users can read notifications filtered by their role
create policy "Users can read own role notifications" on public.notifications
  for select to authenticated
  using (target_role = (select role from public.profiles where id = auth.uid()) or 'admin' = (select role from public.profiles where id = auth.uid()));

create policy "Authenticated can read refinery_inventory" on public.refinery_inventory
  for select to authenticated using (true);

create policy "Authenticated can read incoming_shipments" on public.incoming_shipments
  for select to authenticated using (true);

create policy "Authenticated can read production_plan" on public.production_plan
  for select to authenticated using (true);

create policy "Authenticated can read maintenance_schedule" on public.maintenance_schedule
  for select to authenticated using (true);

create policy "Authenticated can read production_risk" on public.production_risk
  for select to authenticated using (true);

-- Refinery role can manage refinery tables
create policy "Refinery can manage incoming_shipments" on public.incoming_shipments
  for all to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'refinery'));

create policy "Refinery can manage production_plan" on public.production_plan
  for all to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'refinery'));

create policy "Refinery can manage maintenance_schedule" on public.maintenance_schedule
  for all to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'refinery'));

-- Enable Realtime
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.refinery_inventory;
alter publication supabase_realtime add table public.incoming_shipments;
alter publication supabase_realtime add table public.production_plan;
alter publication supabase_realtime add table public.maintenance_schedule;
alter publication supabase_realtime add table public.production_risk;

-- Seed Data

-- Refinery Inventory
insert into public.refinery_inventory (refinery_name, current_inventory_barrels, daily_consumption, min_safety_stock, remaining_days) values
('Mumbai Refinery', 850000, 95000, 300000, 9),
('Paradip Refinery', 1200000, 120000, 400000, 10),
('Jamnagar Refinery', 2500000, 200000, 600000, 12),
('Vadinar Refinery', 1800000, 150000, 500000, 12),
('Visakhapatnam Refinery', 620000, 80000, 250000, 8);

-- Incoming Shipments
insert into public.incoming_shipments (refinery_name, expected_arrival, quantity, status) values
('Mumbai Refinery', now() + interval '5 days', 500000, 'pending'),
('Paradip Refinery', now() + interval '12 days', 1000000, 'pending'),
('Jamnagar Refinery', now() + interval '8 days', 800000, 'pending'),
('Vadinar Refinery', now() + interval '15 days', 600000, 'pending'),
('Visakhapatnam Refinery', now() + interval '3 days', 400000, 'pending');

-- Production Plans
insert into public.production_plan (refinery_name, petrol_pct, diesel_pct, atf_pct, lpg_pct, lubricants_pct, ai_recommendation, reason) values
('Mumbai Refinery', 35, 40, 10, 8, 7, 'Increase diesel output by 5% due to winter demand spike', 'Seasonal demand analysis predicts 8% rise in diesel consumption'),
('Paradip Refinery', 32, 42, 12, 7, 7, 'Current mix is optimal for projected demand', 'Demand forecasts show stable product mix required'),
('Jamnagar Refinery', 38, 38, 11, 7, 6, 'Shift 3% from petrol to ATF for upcoming holiday season', 'Air travel demand projected to increase 15%'),
('Vadinar Refinery', 33, 41, 11, 8, 7, 'Maintain current configuration', 'Supply-demand balance is within optimal range');

-- Maintenance Schedule
insert into public.maintenance_schedule (refinery_name, unit_name, status, maintenance_due, estimated_downtime_hours, ai_recommendation) values
('Mumbai Refinery', 'Crude Distillation Unit - CDU-1', 'scheduled', current_date + interval '30 days', 72, 'Postpone by 2 weeks to align with incoming shipment arrival'),
('Paradip Refinery', 'Catalytic Cracker - FCC-2', 'scheduled', current_date + interval '45 days', 96, 'Schedule during low-demand period in Q3'),
('Jamnagar Refinery', 'Hydrotreater - HT-3', 'in_progress', current_date - interval '2 days', 48, 'Expedite - inventory buffer reduced to 8 days'),
('Vadinar Refinery', 'Vacuum Distillation Unit - VDU-1', 'scheduled', current_date + interval '60 days', 60, 'No adjustment needed - adequate inventory cover');

-- Production Risks
insert into public.production_risk (refinery_name, inventory_remaining_days, incoming_shipment_days, risk_level, business_impact) values
('Mumbai Refinery', 9, 5, 'medium', 'Potential production slowdown if shipment delayed beyond 4 days buffer'),
('Paradip Refinery', 10, 12, 'low', 'Adequate inventory cover - no immediate risk'),
('Jamnagar Refinery', 12, 8, 'low', 'Sufficient buffer for current operations'),
('Vadinar Refinery', 12, 15, 'low', 'Healthy inventory levels with incoming shipment'),
('Visakhapatnam Refinery', 8, 3, 'high', 'Low inventory - immediate replenishment required');

-- Seed Notifications
insert into public.notifications (target_role, title, message) values
('refinery', 'Incoming Shipment Alert', 'A shipment of 500,000 BBL is expected at Mumbai Refinery in 5 days.'),
('refinery', 'Maintenance Reminder', 'CDU-1 maintenance at Mumbai Refinery is due in 30 days.'),
('refinery', 'Risk Alert', 'Visakhapatnam Refinery has only 8 days of inventory remaining.');
