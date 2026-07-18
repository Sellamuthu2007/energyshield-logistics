import React from 'react';
import type { AIRiskInsight } from '@/types/government';
import { Cpu, AlertCircle, RefreshCw } from 'lucide-react';

interface AIRiskPanelProps {
  insights?: AIRiskInsight[];
  isLoading?: boolean;
}

export const AIRiskPanel: React.FC<AIRiskPanelProps> = ({ insights = [], isLoading }) => {
  return (
    <div className="rounded border border-brand-border bg-brand-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="h-4 w-4 text-brand-primary" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Risk Intelligence</h3>
        </div>
        <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest bg-brand-dark px-2 py-0.5 rounded">
          Active Models: Gemini-2.0
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
          {insights.map((insight) => (
            <div key={insight.id} className="rounded border border-brand-border/60 bg-brand-dark/40 p-4 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-white">
                  <AlertCircle className="h-3.5 w-3.5 text-brand-primary" />
                  <span>Security Insight Alert</span>
                </span>
                <span className="text-[10px] font-semibold text-brand-muted">
                  Confidence Score: <span className="font-bold text-brand-teal">{insight.confidence_score}%</span>
                </span>
              </div>
              <p className="text-xs text-brand-text leading-relaxed font-medium">{insight.insight_text}</p>
              <div className="text-[10px] text-brand-muted leading-tight border-t border-brand-border/40 pt-2 space-y-1">
                <p><span className="font-bold text-white uppercase">Projected Impact:</span> {insight.expected_impact}</p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-bold text-white uppercase mr-1">Sources:</span>
                  {insight.data_sources.map(src => (
                    <span key={src} className="bg-brand-card border border-brand-border px-1.5 py-0.5 rounded text-[8px]">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRiskPanel;
