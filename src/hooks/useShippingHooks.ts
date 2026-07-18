import { useSupabaseQuery } from './useSupabaseQuery';
import { getShipments, getShipmentQueue } from '@/services/shipmentService';
import { getPorts } from '@/services/portService';
import { getWeatherAlerts } from '@/services/weatherService';
import { getRouteRecommendations } from '@/services/routeService';
import { getShipmentNotifications } from '@/services/notificationService';
import { useRealtimeTable } from './useRealtimeTable';

export function useShipments() {
  return useSupabaseQuery(['shipments'], getShipments);
}

// Custom hook to subscribe to shipments in real-time
export function useRealtimeShipments() {
  useRealtimeTable('shipments', ['shipments']);
  return useShipments();
}

export function useShipmentQueue() {
  return useSupabaseQuery(['shipmentQueue'], getShipmentQueue);
}

export function usePorts() {
  return useSupabaseQuery(['ports'], getPorts);
}

export function useWeatherAlerts() {
  return useSupabaseQuery(['weatherAlerts'], getWeatherAlerts);
}

export function useRouteRecommendations() {
  return useSupabaseQuery(['routeRecommendations'], getRouteRecommendations);
}

export function useNotifications() {
  return useSupabaseQuery(['shipmentNotifications'], getShipmentNotifications);
}

export function useShipment(id: string) {
  // Stub for fetching a single shipment if needed in the future
  return useSupabaseQuery(['shipment', id], async () => {
    // implementation would go here using shipmentService.getShipmentById(id)
    return null;
  });
}
