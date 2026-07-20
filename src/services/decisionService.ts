import { supabase } from '@/lib/supabaseClient';
import type {
  ExecutiveKPI,
  DashboardHealth,
  ExecutiveInsight,
  EconomicImpact,
  ScenarioSimulation,
  StrategicRecommendation
} from '@/types/decision';

export async function getExecutiveKPIs(): Promise<ExecutiveKPI> {
  const { data, error } = await supabase
    .from('executive_kpis')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching executive KPIs:', error);
    throw error;
  }
  return data as ExecutiveKPI;
}

export async function getDashboardHealth(): Promise<DashboardHealth[]> {
  const { data, error } = await supabase
    .from('dashboard_health')
    .select('*');

  if (error) {
    console.error('Error fetching dashboard health:', error);
    throw error;
  }
  return data as DashboardHealth[];
}

export async function getExecutiveInsights(): Promise<ExecutiveInsight[]> {
  const { data, error } = await supabase
    .from('executive_insights')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching executive insights:', error);
    throw error;
  }
  return data as ExecutiveInsight[];
}

export async function getEconomicImpact(): Promise<EconomicImpact> {
  const { data, error } = await supabase
    .from('economic_impact')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching economic impact:', error);
    throw error;
  }
  return data as EconomicImpact;
}

export async function getScenarioSimulations(): Promise<ScenarioSimulation[]> {
  const { data, error } = await supabase
    .from('scenario_simulations')
    .select('*')
    .order('run_at', { ascending: false });

  if (error) {
    console.error('Error fetching scenario simulations:', error);
    throw error;
  }
  return data as ScenarioSimulation[];
}

export async function runSimulation(input: Partial<ScenarioSimulation>): Promise<void> {
  const { error } = await supabase
    .from('scenario_simulations')
    .insert([{ ...input, run_at: new Date().toISOString() }]);

  if (error) {
    console.error('Error running simulation:', error);
    throw error;
  }
}

export async function getStrategicRecommendations(): Promise<StrategicRecommendation[]> {
  const { data, error } = await supabase
    .from('strategic_recommendations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching strategic recommendations:', error);
    throw error;
  }
  return data as StrategicRecommendation[];
}

export async function updateStrategicRecommendation(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('strategic_recommendations')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating strategic recommendation:', error);
    throw error;
  }
}
