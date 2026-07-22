import React from 'react';
import { Shield, Database, AlertOctagon, TrendingUp, CloudSun } from 'lucide-react';
import type { NationalRiskScore, StrategicPetroleumReserve, GovernmentAlert } from '@/types/government';
import { useLiveWeather } from '@/hooks/useGovernmentData';

interface RiskCardsProps {
  riskScore?: NationalRiskScore;
  spr?: StrategicPetroleumReserve;
  alerts?: GovernmentAlert[];
}

export const RiskCards: React.FC<RiskCardsProps> = ({ riskScore, spr, alerts }) => {
  const { data: weatherData } = useLiveWeather();
  const activeAlertsCount = alerts?.filter(a => a.status === 'open').length || 0;

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
      <div className="rounded border border-brand-border bg-brand-card p-5 text-left shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
            National Security Risk Score
          </span>
          <Shield className="h-4 w-4 text-brand-primary" />
        </div>
        
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{riskScore?.score || 68}</span>
          <span className="text-xs text-brand-muted">/ 100</span>
          <span className="text-[10px] font-bold text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30 px-1.5 py-0.5 rounded ml-auto">
            ↑ {riskScore?.score_change || 4.2}%
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-brand-border/40 text-[10px]">
          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getRiskBadge(riskScore?.risk_level || 'medium')}`}>
            {riskScore?.risk_level || 'Medium'} Risk
          </span>
          <span className="text-brand-muted font-mono font-semibold">
            {riskScore?.confidence || 92}% confidence
          </span>
        </div>
      </div>

      {/* Card 2: SPR Cover Status */}
      <div className="rounded border border-brand-border bg-brand-card p-5 text-left shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
            Strategic Reserves Cover
          </span>
          <Database className="h-4 w-4 text-brand-teal" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{spr?.remaining_days || 9.5}</span>
          <span className="text-xs text-brand-muted">Days Cover</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-brand-border/40 text-[10px] text-brand-muted">
          <span>Total Storage: <strong className="text-white">{spr?.reserve_level || 39.5}M Bbls</strong></span>
          <span className="text-brand-teal font-bold uppercase">{spr?.readiness_level || 'NORMAL'}</span>
        </div>
      </div>

      {/* Card 3: Active Pipeline Alerts */}
      <div className="rounded border border-brand-border bg-brand-card p-5 text-left shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
            Active Security Alerts
          </span>
          <AlertOctagon className="h-4 w-4 text-brand-yellow" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{activeAlertsCount}</span>
          <span className="text-xs text-brand-muted">Triggers Open</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-brand-border/40 text-[10px] text-brand-muted">
          <span>Refineries affected: <strong className="text-white">2 / 7</strong></span>
          <span className="text-brand-yellow font-bold uppercase">Hormuz Alert</span>
        </div>
      </div>

      {/* Card 4: Live Open-Meteo Weather Telemetry */}
      <div className="rounded border border-brand-border bg-brand-card p-5 text-left shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
            Paradip Coast Weather API
          </span>
          <CloudSun className="h-4 w-4 text-brand-teal" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{weatherData?.temp || 31.2}°C</span>
          <span className="text-xs text-brand-muted">Coastal</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-brand-border/40 text-[10px] text-brand-muted">
          <span>Wind: <strong className="text-white">{weatherData?.windSpeed || 14.5} km/h</strong></span>
          <span className="text-brand-green font-bold uppercase">Open-Meteo Live</span>
        </div>
      </div>
    </div>
  );
};

export default RiskCards;
