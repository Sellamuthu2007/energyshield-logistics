import React from 'react';
import type { CrudeCompatibility } from '@/types/procurement';
import { Beaker, ShieldAlert, CheckCircle, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  compatibilities: CrudeCompatibility[];
  isLoading?: boolean;
}

const statusConfig = {
  Recommended: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  'Not Recommended': { icon: AlertOctagon, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  Warning: { icon: ShieldAlert, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
};

export const CompatibilityPanel: React.FC<Props> = ({ compatibilities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6 animate-pulse">
        <div className="h-6 w-1/2 bg-brand-border/50 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-24 w-full bg-brand-border/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg shadow-black/20 text-left">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
        <Beaker className="w-5 h-5 text-brand-teal" />
        Crude Compatibility Analysis
      </h3>

      <div className="space-y-3">
        {compatibilities.map((comp) => {
          const statusKey = comp.status || (comp.compatibility_score >= 90 ? 'Recommended' : comp.compatibility_score >= 80 ? 'Warning' : 'Not Recommended');
          const config = statusConfig[statusKey] || statusConfig.Recommended;
          const Icon = config.icon;

          return (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded border ${config.bg} ${config.border} flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#0e131d] shadow-inner">
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <h4 className="text-brand-text font-bold text-base">{comp.refinery_name}</h4>
                  <p className="text-sm text-brand-muted">Target: <span className="text-brand-text font-semibold">{comp.crude_type}</span></p>
                  {comp.recommendation && (
                    <p className="text-xs text-brand-muted/80 mt-0.5">{comp.recommendation}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-brand-muted uppercase font-bold tracking-widest">Compatibility</span>
                  <span className={`text-lg font-bold ${config.color}`}>{comp.compatibility_score}%</span>
                </div>
                <div className="flex flex-col items-end border-l border-brand-border/30 pl-4">
                  <span className="text-[10px] text-brand-muted uppercase font-bold tracking-widest">Est. Yield</span>
                  <span className="text-lg font-bold text-white">{comp.expected_yield}%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CompatibilityPanel;
