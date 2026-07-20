import React from 'react';
import { useExecutiveInsights } from '@/hooks/useDecisionData';
import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';

export const ExecutiveInsights: React.FC = () => {
  const { data: insights, isLoading } = useExecutiveInsights();

  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-brand-yellow" />
        AI Executive Insights
      </h3>

      {!insights || insights.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No insights available.</div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-4 bg-[#1a2130] border border-brand-border/50 rounded"
            >
              <div className="flex gap-3">
                <ChevronRight className="w-4 h-4 text-brand-yellow mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-brand-text leading-relaxed">{insight.insight_text}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-brand-muted">
                    <span>Confidence: <span className="font-bold text-white">{insight.confidence_score}%</span></span>
                    {insight.affected_department && (
                      <span>Department: <span className="font-bold text-white">{insight.affected_department}</span></span>
                    )}
                    {insight.business_impact && (
                      <span>Impact: <span className="font-bold text-white">{insight.business_impact}</span></span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExecutiveInsights;
