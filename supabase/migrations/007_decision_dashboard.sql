-- 007: Decision Intelligence Dashboard Tables (read-only aggregation)

drop table if exists public.executive_kpis cascade;
drop table if exists public.dashboard_health cascade;
drop table if exists public.executive_insights cascade;
drop table if exists public.economic_impact cascade;
drop table if exists public.scenario_simulations cascade;
drop table if exists public.strategic_recommendations cascade;

create table public.executive_kpis (
  id uuid primary key default gen_random_uuid(),
  energy_security_score numeric not null,
  national_risk_level text not null,
  supply_chain_health numeric not null,
  avg_delivery_performance numeric not null,
  refinery_utilization numeric not null,
  economic_impact numeric,
  recorded_at timestamptz default now()
);

create table public.dashboard_health (
  id uuid primary key default gen_random_uuid(),
  dashboard_name text not null check (dashboard_name in ('government','procurement','shipping','refinery')),
  status text not null,
  health_score numeric not null,
  pending_actions integer default 0,
  critical_issues integer default 0
);

create table public.executive_insights (
  id uuid primary key default gen_random_uuid(),
  insight_text text not null,
  confidence_score numeric not null,
  business_impact text,
  affected_department text,
  created_at timestamptz default now()
);

create table public.economic_impact (
  id uuid primary key default gen_random_uuid(),
  estimated_loss numeric default 0,
  logistics_cost_increase numeric default 0,
  import_cost_increase numeric default 0,
  fuel_price_impact numeric default 0,
  inventory_holding_cost numeric default 0,
  projected_savings numeric default 0
);

create table public.scenario_simulations (
  id uuid primary key default gen_random_uuid(),
  scenario_name text not null,
  duration_days integer not null,
  estimated_shortage numeric not null,
  expected_price_increase numeric not null,
  affected_refineries text[],
  expected_loss numeric,
  recommended_actions text,
  run_at timestamptz default now()
);

create table public.strategic_recommendations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  priority text check (priority in ('low','medium','high','critical')),
  confidence numeric,
  estimated_cost numeric,
  estimated_benefit numeric,
  long_term_impact text,
  status text check (status in ('pending','approved','archived')) default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.executive_kpis enable row level security;
alter table public.dashboard_health enable row level security;
alter table public.executive_insights enable row level security;
alter table public.economic_impact enable row level security;
alter table public.scenario_simulations enable row level security;
alter table public.strategic_recommendations enable row level security;

-- RLS: Executive and Admin can read; Executive can manage strategic recommendations
create policy "Executive can read executive_kpis" on public.executive_kpis
  for select to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive','admin')));

create policy "Executive can read dashboard_health" on public.dashboard_health
  for select to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive','admin')));

create policy "Executive can read executive_insights" on public.executive_insights
  for select to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive','admin')));

create policy "Executive can read economic_impact" on public.economic_impact
  for select to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive','admin')));

create policy "Executive can read scenario_simulations" on public.scenario_simulations
  for select to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive','admin')));

create policy "Executive can read strategic_recommendations" on public.strategic_recommendations
  for select to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive','admin')));

create policy "Executive can manage strategic_recommendations" on public.strategic_recommendations
  for update to authenticated
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive','admin')));

create policy "Executive can insert scenario_simulations" on public.scenario_simulations
  for insert to authenticated
  with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive','admin')));

-- Enable Realtime
alter publication supabase_realtime add table public.executive_kpis;
alter publication supabase_realtime add table public.dashboard_health;
alter publication supabase_realtime add table public.executive_insights;
alter publication supabase_realtime add table public.economic_impact;
alter publication supabase_realtime add table public.scenario_simulations;
alter publication supabase_realtime add table public.strategic_recommendations;

-- Seed Data

-- Executive KPIs
insert into public.executive_kpis (energy_security_score, national_risk_level, supply_chain_health, avg_delivery_performance, refinery_utilization, economic_impact) values
(72, 'Medium', 68, 81, 76, -2400000000);

-- Dashboard Health
insert into public.dashboard_health (dashboard_name, status, health_score, pending_actions, critical_issues) values
('government', 'Operational', 82, 3, 1),
('procurement', 'Operational', 78, 5, 0),
('shipping', 'Degraded', 65, 4, 2),
('refinery', 'Operational', 74, 6, 1);

-- Executive Insights
insert into public.executive_insights (insight_text, confidence_score, business_impact, affected_department) values
('Diversification of crude suppliers has reduced geopolitical risk exposure by 12% this quarter', 85, 'Reduced supply disruption probability', 'Government'),
('Inventory buffer at Visakhapatnam refinery is critically low - immediate replenishment recommended', 92, 'Potential production halt within 8 days', 'Refinery'),
('Mundra port congestion is creating cascading delays across the supply chain', 78, 'Average delivery time extended by 32 hours', 'Shipping'),
('Current crude procurement from Russia offers $4.50/barrel discount vs. benchmark', 88, 'Cost savings of approximately $4.5M per VLCC shipment', 'Procurement');

-- Economic Impact
insert into public.economic_impact (estimated_loss, logistics_cost_increase, import_cost_increase, fuel_price_impact, inventory_holding_cost, projected_savings) values
(2400000000, 890000000, 1200000000, 3.5, 450000000, 620000000);

-- Strategic Recommendations
insert into public.strategic_recommendations (title, priority, confidence, estimated_cost, estimated_benefit, long_term_impact, status) values
('Increase Strategic Petroleum Reserve to 90 days cover', 'critical', 85, 12000000000, 45000000000, 'Strengthens energy security against supply disruptions', 'pending'),
('Establish crude oil swap agreement with Southeast Asian nations', 'high', 72, 2000000000, 8000000000, 'Diversifies supply sources and reduces transit risk', 'pending'),
('Invest in port infrastructure at Paradip and Vadinar', 'high', 80, 5000000000, 15000000000, 'Reduces congestion and improves unloading efficiency', 'pending'),
('Implement AI-driven predictive maintenance across all refineries', 'medium', 75, 750000000, 2500000000, 'Reduces unplanned downtime by estimated 30%', 'approved');
