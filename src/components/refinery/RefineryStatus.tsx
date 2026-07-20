import React from 'react';
import { useRefineryInventory } from '@/hooks/useRefineryData';
import { motion } from 'framer-motion';
import { Droplets, Gauge, TrendingUp, Shield } from 'lucide-react';

const statusCards = [
  { label: 'Total Inventory', icon: Droplets, color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/20', key: 'total' },
  { label: 'Avg Operating Days', icon: Gauge, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', key: 'avg' },
  { label: 'Avg Efficiency', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', key: 'eff' },
  { label: 'Overall Health', icon: Shield, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10', border: 'border-brand-yellow/20', key: 'health' },
];

export const RefineryStatus: React.FC = () => {
  const { data: inventory, isLoading } = useRefineryInventory();

  if (isLoading) {
    return <div className="h-32 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  const totalInventory = inventory?.reduce((sum, r) => sum + r.current_inventory_barrels, 0) || 0;
  const avgDays = inventory?.length ? Math.round(inventory.reduce((sum, r) => sum + r.remaining_days, 0) / inventory.length) : 0;
  const avgEfficiency = inventory?.length ? Math.round(inventory.reduce((sum, r) => sum + ((r.daily_consumption / r.min_safety_stock) * 100), 0) / inventory.length) : 0;
  const healthScore = avgDays > 10 ? 82 : avgDays > 5 ? 65 : 45;

  const cardData = [
    { value: `${(totalInventory / 1_000_000).toFixed(1)}M`, sub: 'Total Barrels Across All Refineries' },
    { value: `${avgDays} Days`, sub: 'Average Inventory Cover' },
    { value: `${Math.min(avgEfficiency, 100)}%`, sub: 'Consumption vs Safety Stock' },
    { value: `${healthScore}%`, sub: 'Composite Health Score' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statusCards.map((card, idx) => {
        const Icon = card.icon;
        const data = cardData[idx];
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`rounded border ${card.border} ${card.bg} p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-brand-muted">{card.label}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-xl font-bold text-white">{data.value}</div>
            <div className="text-[10px] text-brand-muted mt-1">{data.sub}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RefineryStatus;
