import React from 'react';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import ExecutiveSummary from '@/components/decision/ExecutiveSummary';
import DashboardHealth from '@/components/decision/DashboardHealth';
import ExecutiveInsights from '@/components/decision/ExecutiveInsights';
import PerformanceCharts from '@/components/decision/PerformanceCharts';
import EconomicImpact from '@/components/decision/EconomicImpact';
import ScenarioSimulator from '@/components/decision/ScenarioSimulator';
import StrategyCenter from '@/components/decision/StrategyCenter';
import ReportsCenter from '@/components/decision/ReportsCenter';
import NotificationCenter from '@/components/decision/NotificationCenter';

export const DecisionDashboard: React.FC = () => {
  useRealtimeTable('executive_kpis', ['executive_kpis']);
  useRealtimeTable('dashboard_health', ['dashboard_health']);
  useRealtimeTable('executive_insights', ['executive_insights']);
  useRealtimeTable('economic_impact', ['economic_impact']);
  useRealtimeTable('scenario_simulations', ['scenario_simulations']);
  useRealtimeTable('strategic_recommendations', ['strategic_recommendations']);
  useRealtimeTable('notifications', ['notifications']);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Decision Intelligence & Strategy</h2>
        <span className="text-xs bg-brand-primary/20 text-brand-primary px-3 py-1 rounded font-bold uppercase">Executive Desk</span>
      </div>

      <ExecutiveSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardHealth />
        <ExecutiveInsights />
      </div>

      <PerformanceCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EconomicImpact />
        <ScenarioSimulator />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategyCenter />
        <ReportsCenter />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NotificationCenter />
      </div>
    </div>
  );
};

export default DecisionDashboard;
