import React from 'react';
import { useProductionRisks } from '@/hooks/useRefineryData';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export const RiskAnalysis: React.FC = () => {
  const { data: risks, isLoading } = useProductionRisks();

  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertOctagon };
      case 'high': return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle };
      case 'medium': return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertTriangle };
      default: return { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: Info };
    }
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-brand-teal" />
        AI Production Risk Analysis
      </h3>

      {!risks || risks.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No risk data available.</div>
      ) : (
        <div className="space-y-3">
          {risks.map((risk, idx) => {
            const colors = getRiskColor(risk.risk_level);
            const Icon = colors.icon;

            return (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded border ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${colors.text}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{risk.refinery_name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${colors.text} ${colors.bg}`}>
                        {risk.risk_level}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-brand-muted mt-2">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider">Inventory Cover</span>
                        <span className="font-bold text-white">{risk.inventory_remaining_days} days</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider">Next Shipment</span>
                        <span className="font-bold text-white">{risk.incoming_shipment_days} days</span>
                      </div>
                    </div>

                    {risk.business_impact && (
                      <p className="text-[10px] text-brand-muted mt-2 italic">{risk.business_impact}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RiskAnalysis;
