import React from 'react';
import type { GovernmentRecommendation } from '@/types/government';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  recommendations: GovernmentRecommendation[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
}

const priorityColors = {
  low: 'text-green-400 bg-green-400/10 border-green-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  critical: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export const GovernmentRecommendationCard: React.FC<Props> = ({ recommendations, onAccept, onReject, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6 animate-pulse">
        <div className="h-6 w-1/3 bg-brand-border/50 rounded mb-4"></div>
        <div className="h-24 w-full bg-brand-border/30 rounded"></div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6">
        <h3 className="mb-4 text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-brand-muted" />
          Government Recommendations
        </h3>
        <p className="text-sm text-brand-muted">No pending recommendations from the Government Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg shadow-black/20">
      <h3 className="mb-4 text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-brand-teal" />
        Government Recommendations
      </h3>
      
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded bg-[#1a2130] border border-brand-border/50"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${priorityColors[rec.priority]}`}>
                  {rec.priority} Priority
                </span>
                <span className="text-xs text-brand-muted uppercase font-semibold">Status: Pending Review</span>
              </div>
              
              <h4 className="text-brand-text font-bold text-base">{rec.title}</h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                <span className="font-semibold text-brand-text/70">Reason:</span> {rec.reason}
              </p>
            </div>
            
            <div className="flex flex-row sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => onAccept(rec.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-teal/20 hover:bg-brand-teal/30 text-brand-teal border border-brand-teal/30 rounded text-sm font-semibold transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={() => onReject(rec.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm font-semibold transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentRecommendationCard;
