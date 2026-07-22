import React, { useState } from 'react';
import type { AIRiskInsight } from '@/types/government';
import { Cpu, AlertCircle, RefreshCw, FilePlus, Check } from 'lucide-react';
import { createRecommendationFromInsight } from '@/services/governmentService';
import { useAuth } from '@/hooks/useAuth';

interface AIRiskPanelProps {
  insights?: AIRiskInsight[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const AIRiskPanel: React.FC<AIRiskPanelProps> = ({ insights = [], isLoading, onRefresh }) => {
  const { user } = useAuth();
  const [createdIds, setCreatedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProposal = async (insight: AIRiskInsight) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await createRecommendationFromInsight(
        insight.id,
        `Policy Directive: ${insight.insight_text.slice(0, 50)}...`,
        insight.insight_text,
        insight.expected_impact,
        user.id
      );
      setCreatedIds((prev) => [...prev, insight.id]);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-5 space-y-4 shadow-lg text-left">
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="h-4 w-4 text-brand-primary" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Risk Intelligence Feed</h3>
        </div>
        <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest bg-brand-dark px-2 py-0.5 rounded border border-brand-border/40">
          Gemini-2.0 Telemetry
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6 text-brand-muted">
          <RefreshCw className="h-5 w-5 animate-spin" />
        </div>
      ) : insights.length === 0 ? (
        <p className="text-xs text-brand-muted">No security intelligence insights logged today.</p>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => {
            const isCreated = createdIds.includes(insight.id);

            return (
              <div key={insight.id} className="rounded border border-brand-border/60 bg-brand-dark/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-xs font-bold text-white">
                    <AlertCircle className="h-3.5 w-3.5 text-brand-primary" />
                    <span>Security Insight Alert</span>
                  </span>
                  <span className="text-[10px] font-semibold text-brand-muted">
                    Confidence: <span className="font-bold text-brand-teal">{insight.confidence_score}%</span>
                  </span>
                </div>
                
                <p className="text-xs text-brand-text leading-relaxed font-medium">{insight.insight_text}</p>
                
                <div className="text-[10px] text-brand-muted leading-tight border-t border-brand-border/40 pt-2 space-y-1.5">
                  <p><span className="font-bold text-white uppercase">Projected Impact:</span> {insight.expected_impact}</p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white uppercase mr-1">Sources:</span>
                      {insight.data_sources.map(src => (
                        <span key={src} className="bg-brand-card border border-brand-border/60 px-1.5 py-0.5 rounded text-[8px] text-brand-text">
                          {src}
                        </span>
                      ))}
                    </div>

                    {!isCreated ? (
                      <button
                        onClick={() => handleCreateProposal(insight)}
                        disabled={isSubmitting}
                        className="flex items-center space-x-1 rounded bg-brand-primary/10 border border-brand-primary/30 px-2.5 py-1 text-[9px] font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                      >
                        <FilePlus className="h-3 w-3" />
                        <span>Draft Policy Directive</span>
                      </button>
                    ) : (
                      <span className="flex items-center space-x-1 text-brand-green bg-brand-green/10 border border-brand-green/30 px-2 py-0.5 rounded text-[9px] font-bold">
                        <Check className="h-3 w-3" />
                        <span>Proposal Drafted</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AIRiskPanel;
