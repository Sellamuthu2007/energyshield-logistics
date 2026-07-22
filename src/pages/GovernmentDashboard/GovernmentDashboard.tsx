import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import {
  useNationalRiskScore,
  useSupplierCountries,
  useAIRiskInsights,
  useGovernmentAlerts,
  useStrategicPetroleumReserve,
  useGovernmentRecommendations,
  useOperationalEvents,
  useDataSourceHealth
} from '@/hooks/useGovernmentData';
import { approveAndForwardRecommendation } from '@/services/governmentService';
import RiskCards from '@/components/government/RiskCards';
import WorldMap from '@/components/government/WorldMap';
import AIRiskPanel from '@/components/government/AIRiskPanel';
import AlertList from '@/components/government/AlertList';
import ReserveCard from '@/components/government/ReserveCard';
import RecommendationPanel from '@/components/government/RecommendationPanel';
import OperationalTimeline from '@/components/government/OperationalTimeline';
import DataSourceHealth from '@/components/government/DataSourceHealth';
import { RefreshCw } from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Data queries
  const { data: riskScore, isLoading: isRiskLoading, refetch: refetchRisk } = useNationalRiskScore();
  const { data: suppliers, isLoading: isSuppliersLoading, refetch: refetchSuppliers } = useSupplierCountries();
  const { data: insights, isLoading: isInsightsLoading, refetch: refetchInsights } = useAIRiskInsights();
  const { data: alerts, isLoading: isAlertsLoading, refetch: refetchAlerts } = useGovernmentAlerts();
  const { data: spr, isLoading: isSprLoading, refetch: refetchSpr } = useStrategicPetroleumReserve();
  const { data: recommendations, isLoading: isRecommendationsLoading, refetch: refetchRecommendations } = useGovernmentRecommendations();
  const { data: events, refetch: refetchEvents } = useOperationalEvents();
  const { data: healthSources, refetch: refetchHealth } = useDataSourceHealth();

  // Setup Supabase Realtime listeners for all Government tables
  useRealtimeTable('national_risk_score', ['national_risk_score']);
  useRealtimeTable('supplier_countries', ['supplier_countries']);
  useRealtimeTable('ai_risk_insights', ['ai_risk_insights']);
  useRealtimeTable('government_alerts', ['government_alerts']);
  useRealtimeTable('strategic_petroleum_reserve', ['strategic_petroleum_reserve']);
  useRealtimeTable('government_recommendations', ['government_recommendations']);
  useRealtimeTable('operational_events', ['operational_events']);
  useRealtimeTable('data_source_health', ['data_source_health']);

  const handleApproveRecommendation = async (id: string) => {
    if (!user) return;
    await approveAndForwardRecommendation(id, user.id);
    refetchRecommendations();
    refetchEvents();
  };

  const handleManualRefresh = async () => {
    refetchRisk();
    refetchSuppliers();
    refetchInsights();
    refetchAlerts();
    refetchSpr();
    refetchRecommendations();
    refetchEvents();
    refetchHealth();
  };

  const isPageLoading = isRiskLoading || isSuppliersLoading || isSprLoading;

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border/40 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <span>National Energy Security & Reserves Desk</span>
            <span className="flex items-center space-x-1 text-[9px] bg-brand-green/10 border border-brand-green/30 px-2 py-0.5 rounded text-brand-green">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
              <span>LIVE SYSTEM</span>
            </span>
          </h2>
          <p className="text-xs text-brand-muted mt-0.5">
            Classified risk assessment matrix, strategic stockpile controls, and procurement recommendations.
          </p>
        </div>
        
        <button
          onClick={handleManualRefresh}
          className="flex items-center justify-center space-x-1.5 rounded border border-brand-border bg-brand-card px-3 py-1.5 text-xs font-semibold text-brand-text hover:bg-[#1a2130] transition-colors self-start sm:self-center"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {isPageLoading ? (
        <div className="flex h-[60vh] items-center justify-center text-brand-muted">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-primary" />
            <p className="text-sm font-semibold">Synchronizing secure telemetry streams...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top KPIs Row */}
          <RiskCards riskScore={riskScore} spr={spr} alerts={alerts} />

          {/* Core Layout Split Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column (2/3 width) - Map, Reserve and AI Proposals */}
            <div className="lg:col-span-2 space-y-6">
              <WorldMap suppliers={suppliers} />
              
              <ReserveCard spr={spr} onRefresh={handleManualRefresh} />
              
              <RecommendationPanel
                recommendations={recommendations}
                onApprove={handleApproveRecommendation}
                isLoading={isRecommendationsLoading}
              />
            </div>

            {/* Right Column (1/3 width) - AI Analysis Panel, Alerts, Timeline & Health */}
            <div className="space-y-6">
              <AIRiskPanel insights={insights} isLoading={isInsightsLoading} onRefresh={handleManualRefresh} />
              
              <AlertList alerts={alerts} isLoading={isAlertsLoading} />

              <OperationalTimeline events={events} />

              <DataSourceHealth sources={healthSources} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentDashboard;
