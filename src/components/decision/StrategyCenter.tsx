import React from 'react';
import { useStrategicRecommendations } from '@/hooks/useDecisionData';
import { updateStrategicRecommendation } from '@/services/decisionService';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, CheckCircle, Archive } from 'lucide-react';

export const StrategyCenter: React.FC = () => {
  const { data: recommendations, isLoading } = useStrategicRecommendations();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  const handleAction = async (id: string, status: string) => {
    await updateStrategicRecommendation(id, status);
    queryClient.invalidateQueries({ queryKey: ['strategic_recommendations'] });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-green-400 bg-green-500/10 border-green-500/30';
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    return `$${(val / 1e3).toFixed(0)}K`;
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Target className="w-5 h-5 text-brand-teal" />
        Strategic Recommendation Center
      </h3>

      {!recommendations || recommendations.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No strategic recommendations.</div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="p-4 bg-[#1a2130] border border-brand-border/50 rounded"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{rec.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                    {rec.status === 'approved' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/30">
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-brand-muted mb-3">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider">Confidence</span>
                  <span className="font-bold text-white">{rec.confidence}%</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider">Est. Cost</span>
                  <span className="font-bold text-white">{formatCurrency(rec.estimated_cost)}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider">Est. Benefit</span>
                  <span className="font-bold text-green-400">{formatCurrency(rec.estimated_benefit)}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider">ROI</span>
                  <span className="font-bold text-green-400">{rec.estimated_cost > 0 ? `${Math.round((rec.estimated_benefit / rec.estimated_cost) * 100)}%` : 'N/A'}</span>
                </div>
              </div>

              {rec.long_term_impact && (
                <p className="text-[10px] text-brand-muted italic mb-3">{rec.long_term_impact}</p>
              )}

              {rec.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(rec.id, 'approved')}
                    className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded font-bold hover:bg-green-500/30 transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(rec.id, 'archived')}
                    className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded font-bold hover:bg-yellow-500/20 transition-colors"
                  >
                    <Archive className="w-3 h-3" />
                    Archive
                  </button>
                </div>
              )}

              {rec.status === 'approved' && (
                <button
                  onClick={() => handleAction(rec.id, 'archived')}
                  className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded font-bold hover:bg-yellow-500/20 transition-colors"
                >
                  <Archive className="w-3 h-3" />
                  Archive
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StrategyCenter;
