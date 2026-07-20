import React from 'react';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import RefineryStatus from '@/components/refinery/RefineryStatus';
import InventoryCards from '@/components/refinery/InventoryCards';
import IncomingShipmentTable from '@/components/refinery/IncomingShipmentTable';
import ProductionPlanning from '@/components/refinery/ProductionPlanning';
import CompatibilityPanel from '@/components/refinery/CompatibilityPanel';
import MaintenancePlanner from '@/components/refinery/MaintenancePlanner';
import RiskAnalysis from '@/components/refinery/RiskAnalysis';
import NotificationCenter from '@/components/refinery/NotificationCenter';
import OperationsAssistant from '@/components/refinery/OperationsAssistant';

export const RefineryDashboard: React.FC = () => {
  useRealtimeTable('refinery_inventory', ['refinery_inventory']);
  useRealtimeTable('incoming_shipments', ['incoming_shipments']);
  useRealtimeTable('production_plan', ['production_plan']);
  useRealtimeTable('maintenance_schedule', ['maintenance_schedule']);
  useRealtimeTable('production_risk', ['production_risk']);
  useRealtimeTable('notifications', ['notifications']);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Refinery Operations Desk</h2>
        <span className="text-xs bg-brand-yellow/20 text-brand-yellow px-3 py-1 rounded font-bold uppercase">Refinery Operations</span>
      </div>

      <RefineryStatus />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InventoryCards />
        </div>
        <div>
          <IncomingShipmentTable />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionPlanning />
        <MaintenancePlanner />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskAnalysis />
        <CompatibilityPanel />
        <NotificationCenter />
      </div>

      <OperationsAssistant />
    </div>
  );
};

export default RefineryDashboard;
