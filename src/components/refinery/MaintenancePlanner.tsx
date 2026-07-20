import React from 'react';
import { useMaintenanceSchedules } from '@/hooks/useRefineryData';
import { updateMaintenanceStatus } from '@/services/refineryService';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

export const MaintenancePlanner: React.FC = () => {
  const { data: schedules, isLoading } = useMaintenanceSchedules();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  const handleAction = async (id: string, action: string) => {
    await updateMaintenanceStatus(id, action);
    queryClient.invalidateQueries({ queryKey: ['maintenance_schedule'] });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getDueColor = (date: string) => {
    const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'text-red-400';
    if (days < 14) return 'text-yellow-400';
    return 'text-brand-muted';
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Wrench className="w-5 h-5 text-brand-teal" />
        Maintenance Planner
      </h3>

      {!schedules || schedules.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No maintenance schedules.</div>
      ) : (
        <div className="space-y-3">
          {schedules.map((s, idx) => {
            const dueDate = new Date(s.maintenance_due);
            const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 bg-[#1a2130] border border-brand-border/50 rounded"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{s.refinery_name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${getStatusColor(s.status)}`}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5">{s.unit_name}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${getDueColor(s.maintenance_due)}`}>
                      {daysUntil > 0 ? `Due in ${daysUntil}d` : daysUntil === 0 ? 'Due Today' : `${Math.abs(daysUntil)}d overdue`}
                    </div>
                    <div className="text-[9px] text-brand-muted">{s.estimated_downtime_hours}h downtime</div>
                  </div>
                </div>

                {s.ai_recommendation && (
                  <p className="text-[10px] text-brand-teal italic mb-3">{s.ai_recommendation}</p>
                )}

                {s.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(s.id, 'in_progress')}
                      className="text-[10px] bg-brand-primary text-white px-3 py-1 rounded font-bold hover:bg-brand-primary/80 transition-colors"
                    >
                      Start Maintenance
                    </button>
                    <button
                      onClick={() => handleAction(s.id, 'completed')}
                      className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded font-bold hover:bg-green-500/30 transition-colors"
                    >
                      Mark Complete
                    </button>
                  </div>
                )}

                {s.status === 'in_progress' && (
                  <button
                    onClick={() => handleAction(s.id, 'completed')}
                    className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded font-bold hover:bg-green-500/30 transition-colors"
                  >
                    Complete Maintenance
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MaintenancePlanner;
