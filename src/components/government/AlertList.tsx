import React from 'react';
import type { GovernmentAlert } from '@/types/government';
import { AlertOctagon, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

interface AlertListProps {
  alerts?: GovernmentAlert[];
  isLoading?: boolean;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts = [], isLoading }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          icon: AlertOctagon,
          class: 'border-brand-red bg-brand-red/10 text-brand-red',
          badge: 'bg-brand-red text-white'
        };
      case 'high':
        return {
          icon: ShieldAlert,
          class: 'border-brand-yellow bg-brand-yellow/10 text-brand-yellow',
          badge: 'bg-brand-yellow text-brand-dark'
        };
      default:
        return {
          icon: ShieldAlert,
          class: 'border-brand-border bg-brand-card text-brand-text',
          badge: 'bg-brand-teal text-brand-dark'
        };
    }
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Pipeline Alert Log</h3>
        <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
          Audited Live
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6 text-brand-muted">
          <RefreshCw className="h-5 w-5 animate-spin" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-brand-muted space-y-2">
          <CheckCircle className="h-8 w-8 text-brand-green" />
          <p className="text-xs">No active security alerts. Systems functioning normal.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = getPriorityStyle(alert.priority);
            const Icon = style.icon;

            return (
              <div
                key={alert.id}
                className={`rounded border p-4 text-left flex gap-4 ${
                  alert.status === 'resolved' ? 'opacity-50 border-brand-border/40 bg-brand-dark/20' : 'bg-brand-dark/20 border-brand-border'
                }`}
              >
                <div className={`p-2 rounded h-fit ${style.class}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">{alert.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${style.badge}`}>
                        {alert.priority}
                      </span>
                      <span className="text-[9px] text-brand-muted">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-brand-muted leading-relaxed">
                    <div>
                      <span className="font-bold text-white uppercase block mb-0.5">Affected Territory:</span>
                      {alert.affected_region}
                    </div>
                    <div>
                      <span className="font-bold text-white uppercase block mb-0.5">Recommended Countermeasure:</span>
                      {alert.recommended_action}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        alert.status === 'open' ? 'bg-brand-red' : alert.status === 'monitoring' ? 'bg-brand-yellow' : 'bg-brand-green'
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                        alert.status === 'open' ? 'bg-brand-red' : alert.status === 'monitoring' ? 'bg-brand-yellow' : 'bg-brand-green'
                      }`}></span>
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-brand-muted">
                      Status: {alert.status}
                    </span>
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

export default AlertList;
