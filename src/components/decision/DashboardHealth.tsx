import React from 'react';
import { useDashboardHealth } from '@/hooks/useDecisionData';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ShoppingCart, Ship, Factory, ArrowRight } from 'lucide-react';

const DASHBOARD_ICONS: Record<string, React.ElementType> = {
  government: Shield,
  procurement: ShoppingCart,
  shipping: Ship,
  refinery: Factory,
};

const DASHBOARD_PATHS: Record<string, string> = {
  government: '/government',
  procurement: '/procurement',
  shipping: '/shipping',
  refinery: '/refinery',
};

export const DashboardHealth: React.FC = () => {
  const { data: healthData, isLoading } = useDashboardHealth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="h-32 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  if (!healthData || healthData.length === 0) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6">
        <p className="text-sm text-brand-muted italic">No dashboard health data available.</p>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
    if (score >= 60) return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
    return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">Dashboard Health Overview</h3>

      <div className="space-y-3">
        {healthData.map((d, idx) => {
          const Icon = DASHBOARD_ICONS[d.dashboard_name] || Shield;
          const colors = getHealthColor(d.health_score);

          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => navigate(DASHBOARD_PATHS[d.dashboard_name] || '/')}
              className={`p-4 rounded border ${colors.border} ${colors.bg} cursor-pointer hover:opacity-80 transition-opacity`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                  <div>
                    <div className="text-sm font-bold text-white capitalize">{d.dashboard_name}</div>
                    <div className="text-[10px] text-brand-muted">{d.status}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${colors.text}`}>{d.health_score}%</div>
                    <div className="text-[9px] text-brand-muted">
                      {d.pending_actions} pending / {d.critical_issues} critical
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${colors.text}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHealth;
