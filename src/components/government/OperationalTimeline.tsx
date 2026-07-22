import React from 'react';
import type { OperationalEvent } from '@/types/government';
import { Activity, Clock } from 'lucide-react';

interface OperationalTimelineProps {
  events?: OperationalEvent[];
}

export const OperationalTimeline: React.FC<OperationalTimelineProps> = ({ events = [] }) => {
  const getEventBadge = (type: string) => {
    switch (type) {
      case 'drawdown':
        return 'text-brand-red bg-brand-red/10 border-brand-red/30';
      case 'escalation':
        return 'text-brand-yellow bg-brand-yellow/10 border-brand-yellow/30';
      case 'recommendation':
        return 'text-brand-teal bg-brand-teal/10 border-brand-teal/30';
      default:
        return 'text-brand-primary bg-brand-primary/10 border-brand-primary/30';
    }
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-5 space-y-4 text-left shadow-lg">
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-brand-primary" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Operational Event Timeline</h3>
        </div>
        <span className="text-[9px] text-brand-muted font-bold uppercase tracking-wider flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
          Realtime Feed
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-brand-muted py-4">No recent operational events logged.</p>
      ) : (
        <div className="relative pl-4 space-y-4 border-l border-brand-border/60">
          {events.map((evt) => (
            <div key={evt.id} className="relative group">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border border-brand-border bg-[#0b101a] group-hover:border-brand-primary group-hover:bg-brand-primary transition-colors" />
              
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">{evt.title}</span>
                <span className="text-[9px] text-brand-muted flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" />
                  {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className="text-[10px] text-brand-muted mt-0.5 leading-snug">{evt.description}</p>
              
              <div className="mt-1.5 flex items-center space-x-2">
                <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${getEventBadge(evt.event_type)}`}>
                  {evt.event_type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OperationalTimeline;
