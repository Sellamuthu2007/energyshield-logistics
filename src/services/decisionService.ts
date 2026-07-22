import { supabase } from '@/lib/supabaseClient';
import type {
  ExecutiveKPI,
  DashboardHealth,
  ExecutiveInsight,
  EconomicImpact,
  ScenarioSimulation,
  StrategicRecommendation
} from '@/types/decision';

const FALLBACK_KPIS: ExecutiveKPI = {
  id: 'exec-1',
  energy_security_score: 84.5,
  national_risk_level: 'Low',
  supply_chain_health: 88.0,
  avg_delivery_performance: 92.4,
  refinery_utilization: 91.2,
  economic_impact: 1250000,
  recorded_at: new Date().toISOString()
};

const FALLBACK_HEALTH: DashboardHealth[] = [
  { id: 'dh-1', dashboard_name: 'Government Security Desk', status: 'Optimal', health_score: 94, pending_actions: 2, critical_issues: 0 },
  { id: 'dh-2', dashboard_name: 'AI Procurement Center', status: 'Optimal', health_score: 91, pending_actions: 3, critical_issues: 0 },
  { id: 'dh-3', dashboard_name: 'Logistics Command Center', status: 'Warning', health_score: 82, pending_actions: 4, critical_issues: 1 },
  { id: 'dh-4', dashboard_name: 'Refinery Operations Desk', status: 'Optimal', health_score: 88, pending_actions: 1, critical_issues: 0 }
];

const FALLBACK_INSIGHTS: ExecutiveInsight[] = [
  { id: 'eins-1', insight_text: 'Current 9.5-day SPR stock cover combined with active shipping diversions maintains zero domestic fuel supply deficit risk for Q3.', confidence_score: 95, business_impact: 'Guarantees retail fuel price stability across all states.', affected_department: 'Ministry of Petroleum & Natural Gas', created_at: new Date().toISOString() }
];

const FALLBACK_ECONOMIC: EconomicImpact = {
  id: 'econ-1',
  estimated_loss: 420000,
  logistics_cost_increase: 120000,
  import_cost_increase: 300000,
  fuel_price_impact: 0.15,
  inventory_holding_cost: 85000,
  projected_savings: 1450000
};

const FALLBACK_SIMULATIONS: ScenarioSimulation[] = [
  { id: 'sim-1', scenario_name: 'Strait of Hormuz 14-Day Blockade', duration_days: 14, estimated_shortage: 4200000, expected_price_increase: 12.5, affected_refineries: ['IOCL Paradip', 'HPCL Vizag', 'BPCL Mumbai'], expected_loss: 28000000, recommended_actions: 'Execute immediate SPR drawdown of 200k bbl/day & redirect West African crude spot purchases.', run_at: new Date().toISOString() }
];

const FALLBACK_RECOMMENDATIONS: StrategicRecommendation[] = [
  { id: 'srec-1', title: 'Expand Strategic Petroleum Reserves (Phase 3)', priority: 'high', confidence: 92, estimated_cost: 45000000, estimated_benefit: 180000000, long_term_impact: 'Increases national emergency crude buffer from 9.5 days to 22 days.', status: 'pending', created_at: new Date().toISOString() }
];

export async function getExecutiveKPIs(): Promise<ExecutiveKPI> {
  try {
    const { data, error } = await supabase.from('executive_kpis').select('*').order('recorded_at', { ascending: false }).limit(1).single();
    if (error || !data) return FALLBACK_KPIS;
    return data as ExecutiveKPI;
  } catch {
    return FALLBACK_KPIS;
  }
}

export async function getDashboardHealth(): Promise<DashboardHealth[]> {
  try {
    const { data, error } = await supabase.from('dashboard_health').select('*');
    if (error || !data || data.length === 0) return FALLBACK_HEALTH;
    return data as DashboardHealth[];
  } catch {
    return FALLBACK_HEALTH;
  }
}

export async function getExecutiveInsights(): Promise<ExecutiveInsight[]> {
  try {
    const { data, error } = await supabase.from('executive_insights').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_INSIGHTS;
    return data as ExecutiveInsight[];
  } catch {
    return FALLBACK_INSIGHTS;
  }
}

export async function getEconomicImpact(): Promise<EconomicImpact> {
  try {
    const { data, error } = await supabase.from('economic_impact').select('*').limit(1).single();
    if (error || !data) return FALLBACK_ECONOMIC;
    return data as EconomicImpact;
  } catch {
    return FALLBACK_ECONOMIC;
  }
}

export async function getScenarioSimulations(): Promise<ScenarioSimulation[]> {
  try {
    const { data, error } = await supabase.from('scenario_simulations').select('*').order('run_at', { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_SIMULATIONS;
    return data as ScenarioSimulation[];
  } catch {
    return FALLBACK_SIMULATIONS;
  }
}

export async function runSimulation(input: Partial<ScenarioSimulation>): Promise<void> {
  try {
    await supabase.from('scenario_simulations').insert([{ ...input, run_at: new Date().toISOString() }]);
  } catch (err) {
    console.warn('Fallback run simulation:', err);
  }
}

export async function getStrategicRecommendations(): Promise<StrategicRecommendation[]> {
  try {
    const { data, error } = await supabase.from('strategic_recommendations').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_RECOMMENDATIONS;
    return data as StrategicRecommendation[];
  } catch {
    return FALLBACK_RECOMMENDATIONS;
  }
}

export async function updateStrategicRecommendation(id: string, status: string): Promise<void> {
  try {
    await supabase.from('strategic_recommendations').update({ status }).eq('id', id);
  } catch (err) {
    console.warn('Fallback update strategic rec:', err);
  }
}
