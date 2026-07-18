import React, { useState } from 'react';
import type { GovernmentRecommendation } from '@/types/government';
import { Cpu, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface RecommendationPanelProps {
  recommendations?: GovernmentRecommendation[];
  onApprove: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendations = [],
  onApprove,
  isLoading
}) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApproveClick = (id: string) => {
    setConfirmingId(id);
  };

  const handleConfirmApprove = async (id: string) => {
    setIsSubmitting(true);
    try {
      await onApprove(id);
      setConfirmingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-brand-red';
      case 'high':
        return 'text-brand-yellow';
      default:
        return 'text-brand-primary';
    }
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="h-4 w-4 text-brand-primary" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Procurement Recommendations</h3>
        </div>
        <span className="text-[10px] text-brand-muted uppercase font-bold">
          Pipeline Feeder
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6 text-brand-muted">
          <RefreshCw className="h-5 w-5 animate-spin" />
        </div>
      ) : recommendations.length === 0 ? (
        <p className="text-xs text-brand-muted py-4">No recommendations available at this time.</p>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const isPending = rec.status === 'pending';
            const isConfirming = confirmingId === rec.id;

            return (
              <div
                key={rec.id}
                className="rounded border border-brand-border/60 bg-brand-dark/40 p-4 text-left space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/40 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">{rec.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${getPriorityColor(rec.priority)}`}>
                      {rec.priority} priority
                    </span>
                    <span className="text-brand-border">|</span>
                    <span className="text-[9px] text-brand-muted">
                      Confidence: <span className="font-bold text-brand-teal">{rec.confidence}%</span>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] space-y-2 text-brand-text leading-relaxed">
                  <p><span className="font-bold text-brand-muted block uppercase mb-0.5">Primary Reasoning:</span> {rec.reason}</p>
                  <p><span className="font-bold text-brand-muted block uppercase mb-0.5">Projected Business Impact:</span> {rec.business_impact}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-brand-border/40">
                  <div className="flex items-center space-x-2 text-[9px] uppercase font-bold">
                    <span className={`h-2 w-2 rounded-full ${
                      rec.status === 'pending' ? 'bg-brand-yellow' : rec.status === 'forwarded' ? 'bg-brand-green' : 'bg-brand-muted'
                    }`} />
                    <span className={rec.status === 'forwarded' ? 'text-brand-green' : 'text-brand-muted'}>
                      Status: {rec.status}
                    </span>
                  </div>

                  {isPending && !isConfirming && (
                    <button
                      onClick={() => handleApproveClick(rec.id)}
                      disabled={isSubmitting}
                      className="rounded bg-brand-primary px-3 py-1.5 text-[10px] font-bold text-white hover:bg-brand-primary-hover transition-colors"
                    >
                      Approve & Forward
                    </button>
                  )}

                  {isPending && isConfirming && (
                    <div className="flex items-center space-x-2 bg-brand-red/10 border border-brand-red/30 p-2 rounded w-full sm:w-auto">
                      <AlertCircle className="h-4 w-4 text-brand-red flex-shrink-0" />
                      <span className="text-[10px] text-brand-red font-semibold">Confirm Forward?</span>
                      <button
                        onClick={() => handleConfirmApprove(rec.id)}
                        disabled={isSubmitting}
                        className="rounded bg-brand-red text-white px-2.5 py-1 text-[9px] font-bold hover:bg-red-700 transition-colors"
                      >
                        {isSubmitting ? 'Processing...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        disabled={isSubmitting}
                        className="rounded border border-brand-border text-brand-text px-2 py-1 text-[9px] font-semibold hover:bg-brand-card transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {rec.status === 'forwarded' && (
                    <div className="flex items-center space-x-1.5 text-brand-green bg-brand-green/10 border border-brand-green/20 px-2.5 py-1 rounded">
                      <Check className="h-3.5 w-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Forwarded to Procurement</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;
