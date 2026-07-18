import React from 'react';

export const DecisionDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Decision Intelligence & Strategy</h2>
        <span className="text-xs bg-brand-primary/20 text-brand-primary px-3 py-1 rounded font-bold uppercase">Executive Desk</span>
      </div>
      <div className="rounded border border-brand-border bg-brand-card p-6">
        <p className="text-sm text-brand-muted">
          Executive KPIs, Overall Platform Health, Economic Impact, Scenario Simulators, and Strategic Action Centers will be implemented in Phase 7.
        </p>
      </div>
    </div>
  );
};

export default DecisionDashboard;
