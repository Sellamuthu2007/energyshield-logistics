drop table if exists public.contracts cascade;
drop table if exists public.crude_compatibility cascade;
drop table if exists public.purchase_orders cascade;
drop table if exists public.supplier_rankings cascade;
drop table if exists public.procurement_suppliers cascade;

-- 1. Create Procurement Suppliers
create table public.procurement_suppliers (
  id uuid default gen_random_uuid() primary key,
  country text not null,
  current_price double precision not null,
  supply_capacity integer not null,
  delivery_time integer not null,
  geopolitical_risk text not null check (geopolitical_risk in ('low', 'medium', 'high', 'critical')),
  reliability_score integer not null,
  contract_status text not null,
  supplier_status text not null check (supplier_status in ('green', 'yellow', 'red')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Supplier Rankings
create table public.supplier_rankings (
  id uuid default gen_random_uuid() primary key,
  rank integer not null,
  country text not null,
  reason text not null,
  confidence_score integer not null,
  business_impact text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Purchase Orders
create table public.purchase_orders (
  id uuid default gen_random_uuid() primary key,
  po_number text not null,
  supplier text not null,
  quantity integer not null,
  expected_delivery timestamp with time zone not null,
  destination_refinery text not null,
  status text not null check (status in ('Pending', 'Approved', 'Completed', 'Delayed', 'Tracked')),
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Crude Compatibility
create table public.crude_compatibility (
  id uuid default gen_random_uuid() primary key,
  refinery_name text not null,
  crude_type text not null,
  compatibility_score integer not null,
  expected_yield integer not null,
  status text not null check (status in ('Recommended', 'Not Recommended', 'Warning')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Contracts
create table public.contracts (
  id uuid default gen_random_uuid() primary key,
  supplier_name text not null,
  contract_start timestamp with time zone not null,
  contract_end timestamp with time zone not null,
  remaining_days integer not null,
  renewal_status text not null check (renewal_status in ('active', 'expiring_soon', 'expired')),
  ai_suggestion text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.procurement_suppliers enable row level security;
alter table public.supplier_rankings enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.crude_compatibility enable row level security;
alter table public.contracts enable row level security;

-- Create viewing policies
create policy "Anyone authenticated can view procurement_suppliers" on public.procurement_suppliers for select to authenticated using (true);
create policy "Anyone authenticated can view supplier_rankings" on public.supplier_rankings for select to authenticated using (true);
create policy "Anyone authenticated can view purchase_orders" on public.purchase_orders for select to authenticated using (true);
create policy "Anyone authenticated can view crude_compatibility" on public.crude_compatibility for select to authenticated using (true);
create policy "Anyone authenticated can view contracts" on public.contracts for select to authenticated using (true);

-- Create updating policies for procurement users
create policy "Procurement can manage purchase_orders" on public.purchase_orders
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'procurement'
    )
  );

-- Enable Realtime
alter publication supabase_realtime add table public.procurement_suppliers;
alter publication supabase_realtime add table public.supplier_rankings;
alter publication supabase_realtime add table public.purchase_orders;
alter publication supabase_realtime add table public.crude_compatibility;
alter publication supabase_realtime add table public.contracts;

-- SEED DATA
insert into public.procurement_suppliers (country, current_price, supply_capacity, delivery_time, geopolitical_risk, reliability_score, contract_status, supplier_status) values
('Saudi Arabia', 72.50, 5000000, 14, 'low', 95, 'Active', 'green'),
('Russia', 65.20, 3000000, 21, 'high', 82, 'Review', 'red'),
('Iraq', 68.90, 2500000, 18, 'medium', 88, 'Active', 'yellow'),
('UAE', 74.10, 4000000, 12, 'low', 98, 'Active', 'green'),
('USA', 78.50, 2000000, 30, 'low', 92, 'Negotiating', 'green'),
('Qatar', 71.80, 1500000, 15, 'low', 96, 'Active', 'green');

insert into public.supplier_rankings (rank, country, reason, confidence_score, business_impact) values
(1, 'Russia', 'Lowest risk, high refinery compatibility, stable shipping route, delivery within SLA', 94, 'Reduces procurement cost by 8%'),
(2, 'UAE', 'Extremely high reliability, minimal geopolitical risk, slightly higher cost', 90, 'Guarantees uninterrupted supply stream'),
(3, 'Saudi Arabia', 'Solid historical track record, optimal pricing volume tier', 86, 'Maintains long-term strategic reserve stability');

insert into public.purchase_orders (po_number, supplier, quantity, expected_delivery, destination_refinery, status) values
('PO-78432-RU', 'Russia', 1000000, now() + interval '21 days', 'Paradip Refinery', 'Pending'),
('PO-78433-AE', 'UAE', 500000, now() + interval '12 days', 'Kochi Refinery', 'Approved'),
('PO-78431-SA', 'Saudi Arabia', 1500000, now() + interval '14 days', 'Vizag Refinery', 'Completed');

insert into public.crude_compatibility (refinery_name, crude_type, compatibility_score, expected_yield, status) values
('Paradip Refinery', 'Russian Crude (Urals)', 94, 98, 'Recommended'),
('Paradip Refinery', 'US Light Sweet', 52, 45, 'Not Recommended'),
('Kochi Refinery', 'UAE Murban', 96, 95, 'Recommended'),
('Vizag Refinery', 'Iraqi Basra Heavy', 88, 85, 'Warning');

insert into public.contracts (supplier_name, contract_start, contract_end, remaining_days, renewal_status, ai_suggestion) values
('Saudi Aramco (Saudi Arabia)', now() - interval '300 days', now() + interval '65 days', 65, 'active', 'No action needed yet.'),
('Rosneft (Russia)', now() - interval '345 days', now() + interval '20 days', 20, 'expiring_soon', 'Start renewal process immediately due to geopolitical delays.'),
('ADNOC (UAE)', now() - interval '200 days', now() + interval '165 days', 165, 'active', 'Contract stable. Negotiate volume expansion next quarter.');
