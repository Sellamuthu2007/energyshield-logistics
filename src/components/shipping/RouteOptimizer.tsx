import React from 'react';
import type { RouteRecommendation } from '@/types/shipping';
import { Network, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  optimizations: RouteRecommendation[];
  isLoading?: boolean;
  onApprove: (id: string) => Promise<void>;
}

export const RouteOptimizer: React.FC<Props> = ({ optimizations, isLoading, onApprove }) => {
  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Network className="w-5 h-5 text-brand-teal" />
        AI Route Optimization
      </h3>
      
      {optimizations.length === 0 ? (
        <div className="text-brand-muted text-sm italic">Routes are optimal. No re-routes necessary.</div>
      ) : (
        <div className="space-y-4">
          {optimizations.map((opt, idx) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-[#1a2130] border border-brand-teal/30 rounded shadow-[0_0_15px_rgba(0,224,255,0.05)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-brand-teal uppercase tracking-widest text-sm">
                  Recommended Route
                </div>
                <div className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                  opt.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30' : 'bg-green-400/10 text-green-400 border-green-400/30'
                }`}>
                  {opt.status}
                </div>
              </div>

              <div className="text-sm text-brand-text mb-4">
                {opt.recommended_route}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="bg-[#0e131d] rounded p-2 border border-brand-border/30">
                  <div className="text-[10px] text-brand-muted uppercase tracking-wider font-bold mb-1">Time Saved</div>
                  <div className="text-xs font-mono text-brand-teal">{opt.time_saved}</div>
                </div>
                <div className="bg-[#0e131d] rounded p-2 border border-brand-border/30">
                  <div className="text-[10px] text-brand-muted uppercase tracking-wider font-bold mb-1">Fuel Saved</div>
                  <div className="text-xs font-mono text-green-400">{opt.fuel_savings}</div>
                </div>
                <div className="bg-[#0e131d] rounded p-2 border border-brand-border/30">
                  <div className="text-[10px] text-brand-muted uppercase tracking-wider font-bold mb-1">Risk Reduction</div>
                  <div className="text-xs font-mono text-brand-text">{opt.risk_reduction}</div>
                </div>
              </div>

              {opt.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => onApprove(opt.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-brand-teal text-[#0e131d] py-1.5 rounded font-bold text-xs hover:bg-brand-teal/80 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 bg-[#0e131d] text-brand-text border border-brand-border py-1.5 rounded font-bold text-xs hover:bg-brand-border/30 transition-colors">
                    <X className="w-3.5 h-3.5" /> Ignore
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteOptimizer;
