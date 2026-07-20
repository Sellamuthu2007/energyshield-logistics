import React from 'react';
import { useCrudeCompatibility } from '@/hooks/useRefineryData';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

export const CompatibilityPanel: React.FC = () => {
  const { data: compatibilities, isLoading } = useCrudeCompatibility();

  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <FlaskConical className="w-5 h-5 text-brand-teal" />
        Crude Compatibility Analysis
      </h3>

      {!compatibilities || compatibilities.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No compatibility data available.</div>
      ) : (
        <div className="space-y-3">
          {compatibilities.map((c, idx) => {
            const scorePct = Math.round(c.compatibility_score * 100);
            const isRecommended = scorePct >= 70;
            const isWarning = scorePct >= 40 && scorePct < 70;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 bg-[#1a2130] border border-brand-border/50 rounded"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold text-white">{c.refinery_name}</span>
                    <span className="text-[10px] text-brand-muted ml-2">{c.crude_type}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    isRecommended ? 'bg-green-500/20 text-green-400' :
                    isWarning ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {isRecommended ? 'Recommended' : isWarning ? 'Warning' : 'Not Recommended'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-brand-muted">
                  <div className="flex items-center gap-1">
                    <span>Score:</span>
                    <span className="font-bold text-white">{scorePct}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Expected Yield:</span>
                    <span className="font-bold text-white">{c.expected_yield}%</span>
                  </div>
                </div>

                {c.recommendation && (
                  <p className="text-[10px] text-brand-teal mt-2 italic">{c.recommendation}</p>
                )}

                <div className="w-full bg-[#090d13] rounded-full h-1 mt-2">
                  <div
                    className="h-1 rounded-full transition-all"
                    style={{ width: `${scorePct}%`, backgroundColor: isRecommended ? '#22c55e' : isWarning ? '#eab308' : '#ef4444' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompatibilityPanel;
