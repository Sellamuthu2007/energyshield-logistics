-- 1. Create National Risk Score
create table public.national_risk_score (
  id uuid default gen_random_uuid() primary key,
  score integer not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Supplier Countries
create table public.supplier_countries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  risk_level text not null check (risk_level in ('green', 'yellow', 'red')),
  current_imports integer not null,
  active_events text,
  expected_impact text,
  latitude double precision not null,
  longitude double precision not null
);

-- 3. Create AI Risk Insights
create table public.ai_risk_insights (
  id uuid default gen_random_uuid() primary key,
  insight_text text not null,
  confidence_score integer not null,
  data_sources text[] not null,
  expected_impact text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Government Alerts
create table public.government_alerts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  priority text not null check (priority in ('low', 'medium', 'high', 'critical')),
  affected_region text not null,
  recommended_action text not null,
  status text not null check (status in ('open', 'monitoring', 'resolved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Strategic Petroleum Reserve
create table public.strategic_petroleum_reserve (
  id uuid default gen_random_uuid() primary key,
  reserve_level double precision not null,
  remaining_days integer not null,
  consumption_rate double precision not null,
  ai_recommendation text,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create Government Recommendations
create table public.government_recommendations (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  reason text not null,
  priority text not null check (priority in ('low', 'medium', 'high', 'critical')),
  confidence integer not null,
  business_impact text not null,
  status text not null check (status in ('pending', 'approved', 'rejected', 'forwarded')),
  approved_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.national_risk_score enable row level security;
alter table public.supplier_countries enable row level security;
alter table public.ai_risk_insights enable row level security;
alter table public.government_alerts enable row level security;
alter table public.strategic_petroleum_reserve enable row level security;
alter table public.government_recommendations enable row level security;

-- Policies for viewing (Authenticated users can view)
create policy "Anyone authenticated can view national_risk_score" on public.national_risk_score for select to authenticated using (true);
create policy "Anyone authenticated can view supplier_countries" on public.supplier_countries for select to authenticated using (true);
create policy "Anyone authenticated can view ai_risk_insights" on public.ai_risk_insights for select to authenticated using (true);
create policy "Anyone authenticated can view government_alerts" on public.government_alerts for select to authenticated using (true);
create policy "Anyone authenticated can view strategic_petroleum_reserve" on public.strategic_petroleum_reserve for select to authenticated using (true);
create policy "Anyone authenticated can view government_recommendations" on public.government_recommendations for select to authenticated using (true);

-- Government Officers can update recommendations
create policy "Government users can update recommendations" on public.government_recommendations
  for update to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'government'
    )
  );

-- Enable Realtime for all tables!
alter publication supabase_realtime add table public.national_risk_score;
alter publication supabase_realtime add table public.supplier_countries;
alter publication supabase_realtime add table public.ai_risk_insights;
alter publication supabase_realtime add table public.government_alerts;
alter publication supabase_realtime add table public.strategic_petroleum_reserve;
alter publication supabase_realtime add table public.government_recommendations;

-- SEED DATA for initial dashboard load
insert into public.national_risk_score (score, risk_level) values (68, 'high');

insert into public.supplier_countries (name, risk_level, current_imports, active_events, expected_impact, latitude, longitude) values
('Saudi Arabia', 'green', 1200000, 'None', 'Stable supply stream', 23.8859, 45.0792),
('Iraq', 'yellow', 850000, 'Basra Port cargo handling strikes', 'Potential logistics delay of 3-5 days', 33.2232, 43.6793),
('Russia', 'red', 950000, 'Trade restrictions & sanction tightening risk', 'Supply stream could decline by 20% within 4 weeks', 61.5240, 105.3188),
('United Arab Emirates', 'green', 700000, 'None', 'Stable supply stream', 23.4241, 53.8478),
('Nigeria', 'yellow', 400000, 'Delta pipeline maintenance & security patrols', 'Short-term pressure on West African blends', 9.0820, 8.6753);

insert into public.ai_risk_insights (insight_text, confidence_score, data_sources, expected_impact) values
('Geopolitical disruption index in Middle East shipping lanes rose to 74. Re-routing Urals to Southeast Asian blends is recommended.', 92, array['AIS Marine Telemetry', 'S&P Global Platts', 'News Feed Intel'], 'Reduces Suez transit hazard exposure by 35%.'),
('Domestic refinery inventory levels are projected to dip near critical minimums by mid-August due to the Basra Port delays.', 87, array['Refinery Inventory API', 'AIS Port Queues'], 'Requires drawing 1.5M Barrels from the Strategic Reserve.');

insert into public.government_alerts (title, priority, affected_region, recommended_action, status) values
('Suez Canal Congestion Trigger', 'high', 'Global Shipping Lanes', 'Advise shipping operations to optimize route coordinates via Cape of Good Hope.', 'open'),
('Basra Loading Terminal Unrest', 'medium', 'Middle East (Iraq)', 'Monitor vessel queuing times and postpone new purchase orders from Basra.', 'monitoring'),
('Refinery Main Grid Power Failure', 'critical', 'Domestic Refinery (Vizag)', 'Initiate emergency backup reserves and divert raw feedstock storage.', 'open');

insert into public.strategic_petroleum_reserve (reserve_level, remaining_days, consumption_rate, ai_recommendation) values
(74.2, 74, 1.0, 'Strategic reserves are within safety thresholds. Hold release options unless Middle East imports decrease below 15%.');

insert into public.government_recommendations (title, reason, priority, confidence, business_impact, status) values
('Substitute Russia Ural with Malaysia Miri Blend', 'Mitigates the risk of impending sanction blockades and ensures uninterrupted feedstock flow for Kochi Refinery.', 'high', 91, 'Avoids potential 12-day shutdown of Kochi production trains.', 'pending'),
('Increase Spot Purchases from Singapore Hub', 'Offsets logistics delays in Iraq Basra terminal. Immediate delivery possible via spot charter vessels.', 'medium', 85, 'Protects against sudden price spikes by securing fixed rates today.', 'pending'),
('Deploy 2M Barrels from Vizag SPR Terminal', 'Temporary buffer to stabilize Vizag refinery feed while grid repair continues.', 'critical', 95, 'Guarantees refining operations continuity through electrical grid downtime.', 'pending');
