import { useSupabaseQuery } from './useSupabaseQuery';
import {
  getNationalRiskScore,
  getSupplierCountries,
  getAIRiskInsights,
  getGovernmentAlerts,
  getStrategicPetroleumReserve,
  getGovernmentRecommendations
} from '@/services/governmentService';

export function useNationalRiskScore() {
  return useSupabaseQuery(['national_risk_score'], getNationalRiskScore);
}

export function useSupplierCountries() {
  return useSupabaseQuery(['supplier_countries'], getSupplierCountries);
}

export function useAIRiskInsights() {
  return useSupabaseQuery(['ai_risk_insights'], getAIRiskInsights);
}

export function useGovernmentAlerts() {
  return useSupabaseQuery(['government_alerts'], getGovernmentAlerts);
}

export function useStrategicPetroleumReserve() {
  return useSupabaseQuery(['strategic_petroleum_reserve'], getStrategicPetroleumReserve);
}

export function useGovernmentRecommendations() {
  return useSupabaseQuery(['government_recommendations'], getGovernmentRecommendations);
}
