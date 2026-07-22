import React, { useState } from 'react';
import type { GovernmentAlert } from '@/types/government';
import { AlertOctagon, ShieldAlert, CheckCircle, RefreshCw, Filter, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertListProps {
  alerts?: GovernmentAlert[];
  isLoading?: boolean;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts = [], isLoading }) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'monitoring' | 'resolved'>('all');
  const [localAlerts, setLocalAlerts] = useState<GovernmentAlert[]>(alerts);

  const activeList = localAlerts.length > 0 ? localAlerts : alerts;

  const filteredAlerts = activeList.filter((a) => {
    if (filter === 'high') return a.priority === 'high' || a.priority === 'critical';
    if (filter === 'monitoring') return a.status === 'monitoring';
    if (filter === 'resolved') return a.status === 'resolved';
    return true;
  });

  const markResolved = (id: string) => {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a))
    );
  };

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
    <div className="rounded border border-brand-border bg-brand-card p-5 space-y-4 text-left shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border/40 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-4 w-4 text-brand-yellow" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Pipeline Alert Log</h3>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#0b101a] p-1 rounded border border-brand-border/50 text-[10px]">
          <Filter className="h-3 w-3 text-brand-muted ml-1" />
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${filter === 'all' ? 'bg-brand-primary text-white' : 'text-brand-muted hover:text-white'}`}
          >
            All ({activeList.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${filter === 'high' ? 'bg-brand-red text-white' : 'text-brand-muted hover:text-white'}`}
          >
            High
          </button>
          <button
            onClick={() => setFilter('monitoring')}
            className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${filter === 'monitoring' ? 'bg-brand-yellow text-brand-dark' : 'text-brand-muted hover:text-white'}`}
          >
            Monitoring
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6 text-brand-muted">
          <RefreshCw className="h-5 w-5 animate-spin" />
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-brand-muted space-y-2">
          <CheckCircle className="h-8 w-8 text-brand-green" />
          <p className="text-xs">No active alerts match current filter. Systems nominal.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredAlerts.map((alert) => {
              const style = getPriorityStyle(alert.priority);
              const Icon = style.icon;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded border p-4 text-left flex gap-4 transition-all ${
                    alert.status === 'resolved'
                      ? 'opacity-50 border-brand-border/40 bg-brand-dark/20'
                      : 'bg-[#121824] border-brand-border/70 hover:border-brand-primary/40'
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
                    
                    <div className="flex items-center justify-between pt-1 border-t border-brand-border/30">
                      <div className="flex items-center space-x-2">
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

                      {alert.status !== 'resolved' && (
                        <button
                          onClick={() => markResolved(alert.id)}
                          className="flex items-center space-x-1 text-[9px] font-bold text-brand-green hover:underline bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded"
                        >
                          <Check className="h-3 w-3" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AlertList;
