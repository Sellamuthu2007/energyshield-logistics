-- ========================================================
-- ENERGYSHIELD AI - COMPLETE PLATFORM SUPABASE SCHEMA
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  organization TEXT DEFAULT 'EnergyShield Platform',
  role TEXT NOT NULL DEFAULT 'government',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Government Desk Tables
CREATE TABLE IF NOT EXISTS public.national_risk_score (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score INTEGER NOT NULL DEFAULT 68,
  risk_level TEXT NOT NULL DEFAULT 'medium',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.supplier_countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'green',
  current_imports BIGINT NOT NULL,
  active_events TEXT,
  expected_impact TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS public.ai_risk_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insight_text TEXT NOT NULL,
  confidence_score INTEGER NOT NULL DEFAULT 90,
  data_sources TEXT[],
  expected_impact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.government_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'high',
  affected_region TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.strategic_petroleum_reserve (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reserve_level NUMERIC(5,2) NOT NULL DEFAULT 39.5,
  remaining_days NUMERIC(5,2) NOT NULL DEFAULT 9.5,
  consumption_rate NUMERIC(5,2) NOT NULL DEFAULT 4.15,
  ai_recommendation TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.government_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'high',
  confidence INTEGER NOT NULL DEFAULT 90,
  business_impact TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.operational_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.data_source_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online',
  latency_ms INTEGER DEFAULT 150,
  last_sync TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Procurement Center Tables
CREATE TABLE IF NOT EXISTS public.procurement_suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_name TEXT NOT NULL,
  country TEXT NOT NULL,
  price_per_barrel NUMERIC(6,2) NOT NULL,
  supply_capacity BIGINT NOT NULL,
  delivery_time_days INTEGER NOT NULL,
  geopolitical_risk TEXT NOT NULL DEFAULT 'green',
  reliability_score INTEGER NOT NULL DEFAULT 90,
  contract_status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.supplier_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rank INTEGER NOT NULL,
  supplier_name TEXT NOT NULL,
  score NUMERIC(4,1) NOT NULL,
  reasoning TEXT NOT NULL,
  confidence INTEGER NOT NULL DEFAULT 90,
  business_impact TEXT NOT NULL,
  ranked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_number TEXT NOT NULL,
  supplier TEXT NOT NULL,
  quantity BIGINT NOT NULL,
  destination_refinery TEXT NOT NULL,
  expected_delivery TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crude_compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  refinery_name TEXT NOT NULL,
  crude_type TEXT NOT NULL,
  compatibility_score INTEGER NOT NULL,
  expected_yield NUMERIC(4,1) NOT NULL,
  recommendation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_name TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  remaining_days INTEGER NOT NULL,
  renewal_status TEXT NOT NULL DEFAULT 'Active',
  ai_suggestion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Shipping & Logistics Tables
CREATE TABLE IF NOT EXISTS public.vessels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel_name TEXT NOT NULL,
  imo_number TEXT UNIQUE NOT NULL,
  capacity_barrels BIGINT NOT NULL,
  current_speed NUMERIC(4,1) NOT NULL DEFAULT 14.2,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'underway',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel_id UUID REFERENCES public.vessels(id),
  po_number TEXT NOT NULL,
  destination_port TEXT NOT NULL,
  destination_refinery TEXT NOT NULL,
  current_eta TIMESTAMPTZ NOT NULL,
  progress_stage INTEGER DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'In Transit',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  port_name TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  waiting_ships INTEGER NOT NULL DEFAULT 3,
  available_berths INTEGER NOT NULL DEFAULT 2,
  average_waiting_time NUMERIC(4,1) NOT NULL DEFAULT 18.5,
  congestion_level TEXT NOT NULL DEFAULT 'Moderate',
  status TEXT NOT NULL DEFAULT 'operational',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.weather_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL,
  recommended_reroute TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.route_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES public.shipments(id),
  original_route TEXT NOT NULL,
  recommended_route TEXT NOT NULL,
  time_saved_hours NUMERIC(4,1) NOT NULL,
  fuel_savings_usd NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Refinery Operations Tables
CREATE TABLE IF NOT EXISTS public.refinery_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  refinery_name TEXT NOT NULL,
  current_stock BIGINT NOT NULL,
  max_capacity BIGINT NOT NULL,
  daily_processing_rate BIGINT NOT NULL,
  days_cover NUMERIC(4,1) NOT NULL,
  status TEXT NOT NULL DEFAULT 'optimal',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.incoming_shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id TEXT NOT NULL,
  refinery_name TEXT NOT NULL,
  expected_arrival TIMESTAMPTZ NOT NULL,
  quantity BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Executive Decision Intelligence Tables
CREATE TABLE IF NOT EXISTS public.executive_kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  national_security_index NUMERIC(4,1) NOT NULL DEFAULT 84.5,
  total_spr_days NUMERIC(4,1) NOT NULL DEFAULT 9.5,
  active_threats_count INTEGER NOT NULL DEFAULT 2,
  cost_avoidance_usd NUMERIC(12,2) NOT NULL DEFAULT 3400000.00,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Shared Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_role TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Allow Access Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.national_risk_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_risk_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_petroleum_reserve ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_source_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crude_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refinery_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incoming_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.national_risk_score FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.supplier_countries FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.ai_risk_insights FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.government_alerts FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.strategic_petroleum_reserve FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.government_recommendations FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.operational_events FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.data_source_health FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.procurement_suppliers FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.supplier_rankings FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.purchase_orders FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.crude_compatibility FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.contracts FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.vessels FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.shipments FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.ports FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.weather_alerts FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.route_recommendations FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.refinery_inventory FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.incoming_shipments FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.executive_kpis FOR ALL USING (true);
CREATE POLICY "Allow public all access" ON public.notifications FOR ALL USING (true);

-- Seed Initial Government Data
INSERT INTO public.national_risk_score (score, risk_level) VALUES (68, 'medium');

INSERT INTO public.supplier_countries (name, risk_level, current_imports, active_events, expected_impact, latitude, longitude) VALUES
('Saudi Arabia', 'green', 850000, 'Normal Crude Tanker Flows', 'Stable supply corridor', 23.8859, 45.0792),
('Russia', 'yellow', 1100000, 'Sanctions Review & Shadow Fleet Routing', '+2 days shipping delay', 61.524, 105.3188),
('Iraq', 'yellow', 720000, 'Basra Terminal Maintenance', 'Minor loading delay', 33.2232, 43.6793),
('UAE', 'green', 450000, 'Fujairah Storage Expansion', 'Increased emergency stock access', 23.4241, 53.8478);

INSERT INTO public.strategic_petroleum_reserve (reserve_level, remaining_days, consumption_rate, ai_recommendation) VALUES
(39.5, 9.5, 4.15, 'Maintain current draw rate of 0.2M bbl/day. Release extra 1.5M bbls if Red Sea disruption persists past Day 14.');

INSERT INTO public.government_recommendations (title, reason, priority, confidence, business_impact, status) VALUES
('Authorize 2.5M Bbl Urgent Procurement from ADNOC', 'Offset projected 5-day arrival lag from Black Sea ports', 'high', 91, 'Prevents Paradip CDU 2 shutdown', 'forwarded');

INSERT INTO public.government_alerts (title, priority, affected_region, recommended_action, status) VALUES
('Strait of Hormuz Naval Security Advisory', 'high', 'Middle East / Persian Gulf', 'Deploy IN Escort for Indian flagged crude carriers', 'open'),
('Bay of Bengal Cyclonic Storm Alert', 'medium', 'Paradip & Vizag Ports', 'Delay berthing by 36 hours for incoming tankers', 'monitoring');

INSERT INTO public.data_source_health (source_name, status, latency_ms) VALUES
('Open-Meteo Weather API', 'online', 185),
('AIS Marine Telemetry', 'online', 240),
('Gemini AI Risk Engine', 'online', 310),
('Supabase DB Realtime', 'online', 95);

-- Seed Initial Procurement Data
INSERT INTO public.procurement_suppliers (supplier_name, country, price_per_barrel, supply_capacity, delivery_time_days, geopolitical_risk, reliability_score, contract_status) VALUES
('Saudi Aramco', 'Saudi Arabia', 76.50, 5000000, 7, 'green', 96, 'Active'),
('Rosneft PJSC', 'Russia', 68.20, 4200000, 14, 'yellow', 88, 'Under Review'),
('ADNOC Logistics', 'UAE', 77.80, 3500000, 5, 'green', 98, 'Active'),
('SOMO Iraq', 'Iraq', 72.40, 3800000, 9, 'yellow', 85, 'Active');

INSERT INTO public.supplier_rankings (rank, supplier_name, score, reasoning, confidence, business_impact) VALUES
(1, 'ADNOC Logistics', 94.5, 'Shortest transit duration (5d) and zero geopolitical maritime risk flags.', 96, 'Guarantees uninterrupted stock cover for West & East coast refineries.'),
(2, 'Saudi Aramco', 91.2, 'High volume capacity with locked long-term contract discounts.', 93, 'Reduces net per-barrel acquisition cost by $1.80.'),
(3, 'Rosneft PJSC', 82.0, 'Deep pricing discount ($68.20/bbl) offset by extended shipping route risks.', 84, 'High profit margin potential with increased demurrage vulnerability.');

INSERT INTO public.purchase_orders (po_number, supplier, quantity, destination_refinery, expected_delivery, status) VALUES
('PO-2026-0891', 'ADNOC Logistics', 1500000, 'IOCL Paradip', NOW() + INTERVAL '12 days', 'Pending'),
('PO-2026-0888', 'Saudi Aramco', 2000000, 'HPCL Vizag', NOW() + INTERVAL '8 days', 'Approved'),
('PO-2026-0875', 'Rosneft PJSC', 1800000, 'RIL Jamnagar', NOW() + INTERVAL '19 days', 'Tracked');

INSERT INTO public.crude_compatibility (refinery_name, crude_type, compatibility_score, expected_yield, recommendation) VALUES
('IOCL Paradip', 'Arab Light', 96, 88.5, 'Optimal compatibility for CDU Unit 1 & 2'),
('HPCL Vizag', 'Urals Blend', 82, 81.0, 'Requires desalter temperature boost +4°C'),
('RIL Jamnagar', 'Basra Heavy', 94, 89.2, 'Excellent API gravity match for delayed coker unit');

INSERT INTO public.contracts (supplier_name, start_date, end_date, remaining_days, renewal_status, ai_suggestion) VALUES
('Saudi Aramco', NOW() - INTERVAL '100 days', NOW() + INTERVAL '160 days', 160, 'Active', 'Initiate 2-year renewal negotiations to lock in current crude grade spreads.'),
('Rosneft PJSC', NOW() - INTERVAL '200 days', NOW() + INTERVAL '68 days', 68, 'Expiring Soon', 'Review sanctions compliance clause prior to issuing renewal PO.');

-- Seed Initial Shipping Data
INSERT INTO public.vessels (vessel_name, imo_number, capacity_barrels, current_speed, latitude, longitude, status) VALUES
('MT Desh Vishal', 'IMO-9812451', 2000000, 14.5, 20.27, 86.67, 'underway'),
('MT Swarna Kamal', 'IMO-9745123', 1500000, 12.8, 18.92, 72.82, 'underway');

INSERT INTO public.ports (port_name, country, waiting_ships, available_berths, average_waiting_time, congestion_level, status) VALUES
('Paradip Port', 'India', 4, 2, 22.5, 'Moderate', 'operational'),
('Mundra Port', 'India', 2, 4, 12.0, 'Low', 'operational'),
('Sikka Terminal', 'India', 5, 1, 31.0, 'High', 'operational'),
('Vizag Port', 'India', 3, 2, 18.0, 'Moderate', 'operational');
