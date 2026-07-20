import React from 'react';
import type { SupplierRanking as SupplierRankingType } from '@/types/procurement';
import { Award, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  rankings: SupplierRankingType[];
  isLoading?: boolean;
}

export const SupplierRanking: React.FC<Props> = ({ rankings, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6 animate-pulse">
        <div className="h-6 w-1/3 bg-brand-border/50 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-20 w-full bg-brand-border/30 rounded"></div>
          <div className="h-20 w-full bg-brand-border/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg shadow-black/20 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-teal" />
          AI Supplier Ranking
        </h3>
        <button 
          onClick={() => {
            const topCountry = rankings.find(r => r.rank === 1);
            if (topCountry) {
              alert(`Live AI Analysis Complete!\n\nTop Recommended Supplier: ${topCountry.country}\nConfidence: ${topCountry.confidence_score}%\nReason: ${topCountry.reason}`);
            }
          }}
          className="text-[10px] uppercase tracking-widest font-bold text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20 transition-colors px-2 py-1 rounded border border-brand-teal/20 cursor-pointer"
        >
          Live Analysis
        </button>
      </div>
      
      <div className="space-y-4">
        {rankings.map((ranking, index) => (
          <motion.div
            key={ranking.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col p-4 rounded border ${
              index === 0 
                ? 'bg-brand-teal/5 border-brand-teal/30 shadow-[0_0_15px_rgba(0,224,255,0.05)]' 
                : 'bg-[#1a2130] border-brand-border/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded font-bold ${
                  index === 0 ? 'bg-brand-teal text-[#0e131d]' : 'bg-brand-border/50 text-brand-text'
                }`}>
                  #{ranking.rank}
                </div>
                <h4 className="text-brand-text font-bold text-base">{ranking.country}</h4>
              </div>
              <div className="flex items-center gap-1 bg-[#0e131d] px-2 py-1 rounded text-xs">
                <Target className="w-3 h-3 text-brand-teal" />
                <span className="text-brand-text font-bold">{ranking.confidence_score}%</span>
                <span className="text-brand-muted ml-1">Confidence</span>
              </div>
            </div>
            
            <div className="pl-11 space-y-2">
              <p className="text-sm text-brand-muted leading-relaxed">
                <span className="font-semibold text-brand-text/70">Reason:</span> {ranking.reason}
              </p>
              <div className="flex items-start gap-1.5 pt-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-brand-text/80 font-semibold">{ranking.business_impact}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SupplierRanking;
