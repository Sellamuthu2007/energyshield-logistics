import React from 'react';

export const RefineryDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Refinery Operations Desk</h2>
        <span className="text-xs bg-brand-yellow/20 text-brand-yellow px-3 py-1 rounded font-bold uppercase">Refinery Operations</span>
      </div>
      <div className="rounded border border-brand-border bg-brand-card p-6">
        <p className="text-sm text-brand-muted">
          Inventory statuses, Incoming Shipment reception, Production Planning, Maintenance Schedules, and AI Risk Analysis will be implemented in Phase 6.
        </p>
      </div>
    </div>
  );
};

export default RefineryDashboard;
