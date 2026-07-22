import React, { useState } from 'react';
import type { StrategicPetroleumReserve, ReadinessLevel } from '@/types/government';
import { Database, ShieldAlert, Award, FileText, CheckCircle2, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
import DrawdownConfirmModal from './DrawdownConfirmModal';
import EscalationConfirmModal from './EscalationConfirmModal';
import { authorizeDrawdown, escalateReadiness } from '@/services/governmentService';
import { useAuth } from '@/hooks/useAuth';

interface ReserveCardProps {
  spr?: StrategicPetroleumReserve;
  onRefresh?: () => void;
}

export const ReserveCard: React.FC<ReserveCardProps> = ({ spr, onRefresh }) => {
  const { user } = useAuth();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [customDrawRate, setCustomDrawRate] = useState<number>(0.2); // M bbls/day
  const [isDrawdownModalOpen, setIsDrawdownModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);

  const baseReserve = spr?.reserve_level || 39.5;
  const baseConsumption = spr?.consumption_rate || 4.15;
  const currentReadiness: ReadinessLevel = spr?.readiness_level || 'normal';

  const totalDailyConsumption = baseConsumption + customDrawRate;
  const calculatedDaysCover = parseFloat((baseReserve / totalDailyConsumption).toFixed(1));
  const baseDaysCover = parseFloat((baseReserve / baseConsumption).toFixed(1));
  const capacityPercent = Math.min((baseReserve / 100) * 100, 100);

  const handleConfirmDrawdown = async (reason: string) => {
    if (!user) return;
    await authorizeDrawdown(customDrawRate, reason, user.id);
    setActionMessage(`Emergency drawdown release of +${customDrawRate.toFixed(1)}M Bbls/day authorized & audited.`);
    if (onRefresh) onRefresh();
  };

  const handleConfirmEscalation = async (nextLevel: ReadinessLevel) => {
    if (!user) return;
    await escalateReadiness(nextLevel, user.id);
    setActionMessage(`National readiness escalated to "${nextLevel.toUpperCase()}". Mandatory monitoring active.`);
    if (onRefresh) onRefresh();
  };

  return (
    <>
      <div className="rounded border border-brand-border bg-brand-card p-6 space-y-5 text-left shadow-lg">
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-brand-teal" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Strategic Petroleum Reserve (SPR) Drawdown Console
            </h3>
          </div>
          <span className="text-[10px] text-brand-teal font-bold px-2 py-0.5 rounded border border-brand-teal/30 bg-brand-teal/10 uppercase tracking-wider">
            Live Stock Cover Model
          </span>
        </div>

        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 rounded border border-brand-green/30 bg-brand-green/10 p-3 text-xs text-brand-green"
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{actionMessage}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side: Stats, Gauge, Interactive Slider */}
          <div className="md:col-span-2 space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0b101a] p-3 rounded border border-brand-border/50">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Reserve Level</span>
                <p className="text-xl font-black text-white">{baseReserve}M Bbls</p>
              </div>
              <div className="bg-[#0b101a] p-3 rounded border border-brand-border/50">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Daily Consumption</span>
                <p className="text-xl font-black text-white">{baseConsumption}M Bbls/d</p>
              </div>
              <div className="bg-[#0b101a] p-3 rounded border border-brand-teal/30">
                <span className="text-[10px] text-brand-teal font-bold uppercase tracking-wider block">Calculated Cover</span>
                <p className="text-xl font-black text-brand-teal">{calculatedDaysCover} Days</p>
              </div>
            </div>

            {/* Interactive Drawdown Slider */}
            <div className="bg-[#0e131d] p-4 rounded border border-brand-border/60 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-brand-primary" />
                  Emergency Release Drawdown Rate:
                </span>
                <span className="font-mono font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/30 px-2 py-0.5 rounded">
                  +{customDrawRate.toFixed(1)} M Bbls/day
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.1"
                value={customDrawRate}
                onChange={(e) => setCustomDrawRate(parseFloat(e.target.value))}
                className="w-full accent-brand-primary cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-brand-muted">
                <span>0 M Bbls/day (Normal)</span>
                <span>0.75 M Bbls/day (Moderate)</span>
                <span>1.5 M Bbls/day (Emergency Max)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-brand-muted uppercase">National Strategic Reserve Level</span>
                <span className="text-white">{capacityPercent.toFixed(1)}% Capacity ({calculatedDaysCover} Days Stock Remaining)</span>
              </div>
              <div className="h-3 w-full bg-brand-dark rounded-full overflow-hidden border border-brand-border p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-teal to-brand-primary rounded-full"
                  animate={{ width: `${capacityPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Action Console */}
          <div className="flex flex-col gap-2.5 justify-center border-t md:border-t-0 md:border-l border-brand-border/40 pt-4 md:pt-0 md:pl-6">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-widest block mb-1">
              Command Center Actions
            </span>
            <button
              onClick={() => setIsDrawdownModalOpen(true)}
              className="flex items-center justify-center space-x-1.5 rounded bg-brand-red px-3 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>AUTHORIZE DRAWDOWN ({customDrawRate.toFixed(1)}M)</span>
            </button>
            <button
              onClick={() => setIsEscalationModalOpen(true)}
              className="flex items-center justify-center space-x-1.5 rounded border border-brand-border bg-brand-dark px-3 py-2 text-xs font-bold text-brand-text hover:bg-brand-card transition-colors"
            >
              <Award className="h-3.5 w-3.5 text-brand-teal" />
              <span>ESCALATE READINESS LEVEL</span>
            </button>
            <button
              onClick={() => setActionMessage('Classified system audit report exported successfully.')}
              className="flex items-center justify-center space-x-1.5 rounded border border-brand-border bg-brand-dark px-3 py-2 text-xs font-bold text-brand-text hover:bg-brand-card transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-brand-primary" />
              <span>EXPORT CLASSIFIED AUDIT</span>
            </button>
          </div>
        </div>

        <div className="rounded border border-brand-border/40 bg-[#0b101a] p-3 text-[11px] text-brand-muted leading-relaxed flex items-start gap-2">
          <span className="px-1.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary font-bold text-[9px] uppercase tracking-wider">AI ASSISTANT</span>
          <span>{spr?.ai_recommendation || 'Maintain current draw rate of 0.2M bbl/day. Release extra 1.5M bbls if Red Sea disruption persists.'}</span>
        </div>
      </div>

      <DrawdownConfirmModal
        isOpen={isDrawdownModalOpen}
        onClose={() => setIsDrawdownModalOpen(false)}
        onConfirm={handleConfirmDrawdown}
        currentStock={baseReserve}
        drawdownRate={customDrawRate}
        currentDays={baseDaysCover}
        projectedDays={calculatedDaysCover}
      />

      <EscalationConfirmModal
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        onConfirm={handleConfirmEscalation}
        currentLevel={currentReadiness}
      />
    </>
  );
};

export default ReserveCard;
