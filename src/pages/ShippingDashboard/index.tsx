import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { useShippingStore } from '@/store/useShippingStore';
import {
  useShipmentQueue,
  useShipments,
  usePorts,
  useWeatherAlerts,
  useRouteRecommendations
} from '@/hooks/useShippingHooks';
import { dispatchShipment } from '@/services/shipmentService';
import { approveRouteRecommendation } from '@/services/routeService';
import { RefreshCw } from 'lucide-react';

import ShipmentQueue from '@/components/shipping/ShipmentQueue';
import ShipmentTracking from '@/components/shipping/ShipmentTracking';
import WorldMap from '@/components/shipping/WorldMap';
import PortOperations from '@/components/shipping/PortOperations';
import WeatherPanel from '@/components/shipping/WeatherPanel';
import RouteOptimizer from '@/components/shipping/RouteOptimizer';
import DeliveryTimeline from '@/components/shipping/DeliveryTimeline';
import RefineryImpactPanel from '@/components/shipping/RefineryImpactPanel';
import NotificationCenter from '@/components/shipping/NotificationCenter';

export const ShippingDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isSyncing, setSyncing, globalError, setGlobalError } = useShippingStore();

  // Subscriptions to keep dashboard live with exact requested table names
  useRealtimeTable('purchase_orders', ['shipmentQueue']);
  useRealtimeTable('shipments', ['shipments', 'refineryImpacts']);
  useRealtimeTable('ports', ['ports']);
  useRealtimeTable('weather_alerts', ['weatherAlerts']);
  useRealtimeTable('route_recommendations', ['routeRecommendations']);

  // Queries using the new requested hooks
  const { data: queue, isLoading: isQueueLoading, refetch: refetchQueue } = useShipmentQueue();
  const { data: shipments, isLoading: isShipmentsLoading, refetch: refetchShipments } = useShipments();
  const { data: ports, isLoading: isPortsLoading, refetch: refetchPorts } = usePorts();
  const { data: weather, isLoading: isWeatherLoading, refetch: refetchWeather } = useWeatherAlerts();
  const { data: routes, isLoading: isRoutesLoading, refetch: refetchRoutes } = useRouteRecommendations();

  const handleManualRefresh = async () => {
    setSyncing(true);
    setGlobalError(null);
    try {
      await Promise.all([
        refetchQueue(),
        refetchShipments(),
        refetchPorts(),
        refetchWeather(),
        refetchRoutes()
      ]);
    } catch (error) {
      setGlobalError('Failed to sync data with central server.');
    } finally {
      setTimeout(() => setSyncing(false), 500);
    }
  };

  const handleDispatch = async (po: any) => {
    try {
      await dispatchShipment(po);
    } catch (err) {
      console.error('Dispatch failed', err);
      alert('Failed to dispatch shipment.');
    }
  };

  const handleApproveRoute = async (id: string) => {
    try {
      await approveRouteRecommendation(id);
    } catch (err) {
      console.error('Route approval failed', err);
      alert('Failed to approve route.');
    }
  };

  const isPageLoading = isQueueLoading || isShipmentsLoading || isPortsLoading || isSyncing;

  return (
    <div className="space-y-6 text-left pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border/40 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">
            National Oil Logistics Command Center
          </h2>
          <p className="text-xs text-brand-muted mt-0.5">
            Real-time execution and monitoring of global crude oil shipments.
          </p>
        </div>
        
        <button
          onClick={handleManualRefresh}
          disabled={isSyncing}
          className="flex items-center justify-center space-x-1.5 rounded border border-brand-border bg-brand-card px-3 py-1.5 text-xs font-semibold text-brand-text hover:bg-[#1a2130] transition-colors self-start sm:self-center disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
        </button>
      </div>

      {globalError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded text-sm flex justify-between items-center">
          <span>{globalError}</span>
          <button onClick={handleManualRefresh} className="underline text-xs font-bold hover:text-red-300">Retry</button>
        </div>
      )}

      {isPageLoading ? (
        <div className="flex h-[60vh] items-center justify-center text-brand-muted">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-teal" />
            <span className="uppercase tracking-widest text-xs font-bold">Establishing Satellite Connection...</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Top Row: Map & Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <WorldMap shipments={shipments || []} />
            </div>
            <div className="lg:col-span-4">
              <ShipmentQueue queue={queue || []} onDispatch={handleDispatch} />
            </div>
          </div>

          {/* Middle Row: Tracking & Port Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <ShipmentTracking shipments={shipments || []} />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <PortOperations ports={ports || []} />
              <WeatherPanel alerts={weather || []} />
            </div>
          </div>

          {/* Bottom Row: AI Route, Timeline, Impact, Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <RouteOptimizer optimizations={routes || []} onApprove={handleApproveRoute} />
            </div>
            <div className="lg:col-span-3">
              <DeliveryTimeline shipment={(shipments && shipments.length > 0) ? shipments[0] : { progress_stage: 1 } as any} />
            </div>
            <div className="lg:col-span-3">
              <RefineryImpactPanel />
            </div>
            <div className="lg:col-span-3">
              <NotificationCenter />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ShippingDashboard;
