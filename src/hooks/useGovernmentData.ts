import { useSupabaseQuery } from './useSupabaseQuery';
import {
  getNationalRiskScore,
  getSupplierCountries,
  getAIRiskInsights,
  getGovernmentAlerts,
  getStrategicPetroleumReserve,
  getGovernmentRecommendations,
  getOperationalEvents,
  getDataSourceHealth,
  fetchLiveOpenMeteoWeather
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

export function useOperationalEvents() {
  return useSupabaseQuery(['operational_events'], getOperationalEvents);
}

export function useDataSourceHealth() {
  return useSupabaseQuery(['data_source_health'], getDataSourceHealth);
}

export function useLiveWeather() {
  return useSupabaseQuery(['open_meteo_weather'], fetchLiveOpenMeteoWeather);
}
