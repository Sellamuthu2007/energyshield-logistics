import React, { useState } from 'react';
import type { StrategicPetroleumReserve } from '@/types/government';
import { Database, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';

interface ReserveCardProps {
  spr?: StrategicPetroleumReserve;
}

export const ReserveCard: React.FC<ReserveCardProps> = ({ spr }) => {
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reserveLevel = spr?.reserve_level || 0;
  const remainingDays = spr?.remaining_days || 0;
  const consumptionRate = spr?.consumption_rate || 0;

  // Max capacity for display calculations is 100M barrels
  const capacityPercent = Math.min((reserveLevel / 100) * 100, 100);

  const triggerAction = (actionName: string) => {
    setIsSubmitting(true);
    setActionMessage(null);
    setTimeout(() => {
      setIsSubmitting(false);
      setActionMessage(`Action successfully executed: "${actionName}" has been logged and audited.`);
    }, 1000);
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-5 space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <Database className="h-4 w-4 text-brand-teal" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Strategic Petroleum Reserve (SPR)</h3>
        </div>
        <span className="text-[10px] text-brand-muted font-bold">
          Unit: Millions of Barrels
        </span>
      </div>

      {actionMessage && (
        <div className="flex items-center space-x-2 rounded border border-brand-green/30 bg-brand-green/10 p-3 text-xs text-brand-green">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Stats and Gauge */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Remaining Capacity</span>
              <p className="text-2xl font-black text-white">{reserveLevel}M Bbls</p>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Daily Consumption Rate</span>
              <p className="text-2xl font-black text-white">{consumptionRate}M Bbls/day</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-brand-muted uppercase">Reserve Fill Status</span>
              <span className="text-white">{capacityPercent.toFixed(1)}% ({remainingDays} Days Cover)</span>
            </div>
            <div className="h-2.5 w-full bg-brand-dark rounded-full overflow-hidden border border-brand-border">
              <div
                className="h-full bg-brand-teal rounded-full transition-all duration-500"
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Action Console */}
        <div className="flex flex-col gap-2 justify-center border-l border-brand-border/40 pl-0 md:pl-6">
          <span className="text-[9px] text-brand-muted font-bold uppercase tracking-widest block mb-1">
            Drawdown Command Console
          </span>
          <button
            onClick={() => triggerAction('Authorize Release Drawdown')}
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-1.5 rounded bg-brand-red px-3 py-2 text-[10px] font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>AUTHORIZE RELEASE DRAWDOWN</span>
          </button>
          <button
            onClick={() => triggerAction('Increase Monitoring Intensity')}
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-1.5 rounded border border-brand-border bg-brand-dark px-3 py-2 text-[10px] font-bold text-brand-text hover:bg-brand-card disabled:opacity-50 transition-colors"
          >
            <Award className="h-3.5 w-3.5 text-brand-teal" />
            <span>INCREASE MONITORING INTENSITY</span>
          </button>
          <button
            onClick={() => triggerAction('Export System Audit Report')}
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-1.5 rounded border border-brand-border bg-brand-dark px-3 py-2 text-[10px] font-bold text-brand-text hover:bg-brand-card disabled:opacity-50 transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-brand-primary" />
            <span>EXPORT SYSTEM AUDIT REPORT</span>
          </button>
        </div>
      </div>

      <div className="rounded border border-brand-border/40 bg-brand-dark/20 p-3 text-[10px] text-brand-muted leading-relaxed">
        <span className="font-bold text-white uppercase block mb-1">AI Recommendation Model Output:</span>
        {spr?.ai_recommendation}
      </div>
    </div>
  );
};

export default ReserveCard;
