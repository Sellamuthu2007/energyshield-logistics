import React from 'react';
import { useExecutiveKPIs } from '@/hooks/useDecisionData';
import { motion } from 'framer-motion';
import { Shield, Globe, Truck, Factory, DollarSign } from 'lucide-react';

export const ExecutiveSummary: React.FC = () => {
  const { data: kpis, isLoading } = useExecutiveKPIs();

  if (isLoading) {
    return <div className="h-32 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  if (!kpis) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6">
        <p className="text-sm text-brand-muted italic">No KPI data available.</p>
      </div>
    );
  }

  const cards = [
    { label: 'Energy Security Score', value: `${kpis.energy_security_score}%`, icon: Shield, color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/20' },
    { label: 'National Risk Level', value: kpis.national_risk_level, icon: Globe, color: kpis.national_risk_level === 'Low' ? 'text-green-400' : 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    { label: 'Supply Chain Health', value: `${kpis.supply_chain_health}%`, icon: Truck, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { label: 'Avg Delivery Performance', value: `${kpis.avg_delivery_performance}%`, icon: Factory, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
    { label: 'Refinery Utilization', value: `${kpis.refinery_utilization}%`, icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`rounded border ${card.border} ${card.bg} p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-brand-muted">{card.label}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
          </motion.div>
        );
      })}
      {kpis.economic_impact != null && (
        <div className="col-span-full text-[10px] text-brand-muted text-right mt-1">
          Last updated: {new Date(kpis.recorded_at).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default ExecutiveSummary;
