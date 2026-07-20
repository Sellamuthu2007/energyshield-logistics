import { useSupabaseQuery } from './useSupabaseQuery';
import {
  getExecutiveKPIs,
  getDashboardHealth,
  getExecutiveInsights,
  getEconomicImpact,
  getScenarioSimulations,
  getStrategicRecommendations
} from '@/services/decisionService';

export function useExecutiveKPIs() {
  return useSupabaseQuery(['executive_kpis'], getExecutiveKPIs);
}

export function useDashboardHealth() {
  return useSupabaseQuery(['dashboard_health'], getDashboardHealth);
}

export function useExecutiveInsights() {
  return useSupabaseQuery(['executive_insights'], getExecutiveInsights);
}

export function useEconomicImpact() {
  return useSupabaseQuery(['economic_impact'], getEconomicImpact);
}

export function useScenarioSimulations() {
  return useSupabaseQuery(['scenario_simulations'], getScenarioSimulations);
}

export function useStrategicRecommendations() {
  return useSupabaseQuery(['strategic_recommendations'], getStrategicRecommendations);
}
