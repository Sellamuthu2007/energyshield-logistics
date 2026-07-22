import React from 'react';
import type { DataSourceHealth as HealthItem } from '@/types/government';
import { Server, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface DataSourceHealthProps {
  sources?: HealthItem[];
}

export const DataSourceHealth: React.FC<DataSourceHealthProps> = ({ sources = [] }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="h-3.5 w-3.5 text-brand-green" />;
      case 'degraded':
        return <AlertTriangle className="h-3.5 w-3.5 text-brand-yellow" />;
      default:
        return <XCircle className="h-3.5 w-3.5 text-brand-red" />;
    }
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-5 space-y-4 text-left shadow-lg">
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <Server className="h-4 w-4 text-brand-teal" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Telemetry Data Source Health</h3>
        </div>
        <span className="text-[9px] text-brand-muted font-bold uppercase tracking-wider">
          API Status Monitor
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sources.map((item) => (
          <div
            key={item.id}
            className="bg-[#0b101a] p-3 rounded border border-brand-border/50 flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5">
                {getStatusIcon(item.status)}
                <span className="text-xs font-bold text-white">{item.source_name}</span>
              </div>
              <span className="text-[9px] text-brand-muted block font-mono">
                Sync: {new Date(item.last_sync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono font-bold text-brand-teal block">
                {item.latency_ms} ms
              </span>
              <span className="text-[8px] uppercase font-bold text-brand-muted tracking-wider">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataSourceHealth;
