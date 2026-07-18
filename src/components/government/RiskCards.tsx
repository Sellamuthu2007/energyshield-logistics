import React from 'react';
import { Shield, Database, AlertOctagon, TrendingUp } from 'lucide-react';
import type { NationalRiskScore, StrategicPetroleumReserve, GovernmentAlert } from '@/types/government';

interface RiskCardsProps {
  riskScore?: NationalRiskScore;
  spr?: StrategicPetroleumReserve;
  alerts?: GovernmentAlert[];
}

export const RiskCards: React.FC<RiskCardsProps> = ({ riskScore, spr, alerts }) => {
  const activeAlertsCount = alerts?.filter(a => a.status === 'open').length || 0;

  // Determine risk level styling
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-brand-red border-brand-red/30 bg-brand-red/10';
      case 'high':
        return 'text-brand-yellow border-brand-yellow/30 bg-brand-yellow/10';
      case 'medium':
        return 'text-brand-teal border-brand-teal/30 bg-brand-teal/10';
      default:
        return 'text-brand-green border-brand-green/30 bg-brand-green/10';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: National Risk Score */}
      <div className="rounded border border-brand-border bg-brand-card p-5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
            National Security Risk Score
          </span>
          <Shield className="h-4 w-4 text-brand-primary" />
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{riskScore?.score || 0}</span>
          <span className="text-xs text-brand-muted">/ 100</span>
        </div>
        <div className="mt-2">
          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getRiskBadge(riskScore?.risk_level || 'low')}`}>
            {riskScore?.risk_level || 'Stable'} Risk
          </span>
        </div>
      </div>

      {/* Card 2: SPR Cover Status */}
      <div className="rounded border border-brand-border bg-brand-card p-5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
            Strategic Reserves Cover
          </span>
          <Database className="h-4 w-4 text-brand-teal" />
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{spr?.remaining_days || 0}</span>
          <span className="text-xs text-brand-muted">Days Cover</span>
        </div>
        <div className="mt-2 text-xs text-brand-muted/80">
          Total Storage: <span className="font-bold text-white">{spr?.reserve_level || 0}M Bbls</span>
        </div>
      </div>

      {/* Card 3: Active Pipeline Alerts */}
      <div className="rounded border border-brand-border bg-brand-card p-5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
            Active Security Alerts
          </span>
          <AlertOctagon className="h-4 w-4 text-brand-yellow" />
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{activeAlertsCount}</span>
          <span className="text-xs text-brand-muted">Triggers Open</span>
        </div>
        <div className="mt-2 text-xs text-brand-muted/80">
          Refineries affected: <span className="font-bold text-white">2 / 7</span>
        </div>
      </div>

      {/* Card 4: Supply Disruption Projection */}
      <div className="rounded border border-brand-border bg-brand-card p-5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
            Projected Pipeline Disruption
          </span>
          <TrendingUp className="h-4 w-4 text-brand-red" />
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">12.4%</span>
          <span className="text-xs text-brand-muted">Risk Prob.</span>
        </div>
        <div className="mt-2 text-xs text-brand-muted/80">
          Outlook: <span className="font-bold text-brand-yellow uppercase">UNSTABLE</span> (Middle East)
        </div>
      </div>
    </div>
  );
};

export default RiskCards;
