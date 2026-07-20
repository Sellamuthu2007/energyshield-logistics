import { useSupabaseQuery } from './useSupabaseQuery';
import {
  getRefineryInventory,
  getIncomingShipments,
  getProductionPlans,
  getMaintenanceSchedules,
  getProductionRisks,
  getCrudeCompatibility
} from '@/services/refineryService';

export function useRefineryInventory() {
  return useSupabaseQuery(['refinery_inventory'], getRefineryInventory);
}

export function useIncomingShipments() {
  return useSupabaseQuery(['incoming_shipments'], getIncomingShipments);
}

export function useProductionPlans() {
  return useSupabaseQuery(['production_plan'], getProductionPlans);
}

export function useMaintenanceSchedules() {
  return useSupabaseQuery(['maintenance_schedule'], getMaintenanceSchedules);
}

export function useProductionRisks() {
  return useSupabaseQuery(['production_risk'], getProductionRisks);
}

export function useCrudeCompatibility() {
  return useSupabaseQuery(['crude_compatibility'], getCrudeCompatibility);
}
