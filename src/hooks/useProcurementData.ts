import { useSupabaseQuery } from './useSupabaseQuery';
import {
  getForwardedRecommendations,
  getProcurementSuppliers,
  getSupplierRankings,
  getPurchaseOrders,
  getCrudeCompatibility,
  getContracts
} from '@/services/procurementService';

export function useForwardedRecommendations() {
  return useSupabaseQuery(['forwarded_recommendations'], getForwardedRecommendations);
}

export function useProcurementSuppliers() {
  return useSupabaseQuery(['procurement_suppliers'], getProcurementSuppliers);
}

export function useSupplierRankings() {
  return useSupabaseQuery(['supplier_rankings'], getSupplierRankings);
}

export function usePurchaseOrders() {
  return useSupabaseQuery(['purchase_orders'], getPurchaseOrders);
}

export function useCrudeCompatibility() {
  return useSupabaseQuery(['crude_compatibility'], getCrudeCompatibility);
}

export function useContracts() {
  return useSupabaseQuery(['contracts'], getContracts);
}
