import React from 'react';
import type { WeatherAlert } from '@/types/shipping';
import { CloudLightning, Wind, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  alerts: WeatherAlert[];
  isLoading?: boolean;
}

export const WeatherPanel: React.FC<Props> = ({ alerts, isLoading }) => {
  if (isLoading) {
    return <div className="h-64 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <CloudLightning className="w-5 h-5 text-brand-teal" />
          Weather Intelligence
        </h3>
        {alerts.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded font-bold uppercase tracking-wider animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            {alerts.length} Active Alerts
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {alerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 bg-brand-card border-l-2 border-brand-teal shadow-[0_2px_10px_rgba(0,0,0,0.2)] rounded relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Wind className="w-16 h-16" />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-red-400 text-sm uppercase tracking-widest">{alert.alert_type}</div>
              <div className="text-[10px] font-mono text-brand-muted bg-[#0e131d] px-2 py-0.5 rounded">
                Confidence: {alert.confidence_score}%
              </div>
            </div>
            
            <div className="text-xs text-brand-text mb-3">
              <span className="text-brand-muted">Area:</span> <span className="font-semibold">{alert.affected_area}</span>
            </div>
            
            <div className="bg-[#1a2130] p-3 rounded border border-brand-border/50 text-xs text-brand-text/80 mb-3">
              <span className="font-bold text-brand-teal uppercase tracking-widest text-[10px] block mb-1">AI Recommendation</span>
              {alert.ai_recommendation}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-yellow-400">
              <span>Expected Delay:</span>
              <span className="font-mono bg-yellow-400/10 px-2 py-0.5 rounded">{alert.expected_delay}</span>
            </div>
          </motion.div>
        ))}
        {alerts.length === 0 && (
          <div className="text-brand-muted text-sm italic">Clear skies. No active weather alerts.</div>
        )}
      </div>
    </div>
  );
};

export default WeatherPanel;
