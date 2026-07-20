import React from 'react';
import { useEconomicImpact } from '@/hooks/useDecisionData';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, Fuel, Warehouse, PiggyBank } from 'lucide-react';

export const EconomicImpact: React.FC = () => {
  const { data: impact, isLoading } = useEconomicImpact();

  if (isLoading) {
    return <div className="h-32 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  if (!impact) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6">
        <p className="text-sm text-brand-muted italic">No economic impact data available.</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    const abs = Math.abs(val);
    if (abs >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
    if (abs >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
    return `${(val / 1e3).toFixed(0)}K`;
  };

  const cards = [
    { label: 'Estimated Loss', value: formatCurrency(impact.estimated_loss), icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', isPositive: false },
    { label: 'Logistics Cost Increase', value: formatCurrency(impact.logistics_cost_increase), icon: DollarSign, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', isPositive: false },
    { label: 'Import Cost Increase', value: formatCurrency(impact.import_cost_increase), icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', isPositive: false },
    { label: 'Fuel Price Impact', value: `$${impact.fuel_price_impact.toFixed(1)}/gal`, icon: Fuel, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', isPositive: false },
    { label: 'Inventory Holding Cost', value: formatCurrency(impact.inventory_holding_cost), icon: Warehouse, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', isPositive: false },
    { label: 'Projected Savings', value: formatCurrency(impact.projected_savings), icon: PiggyBank, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', isPositive: true },
  ];

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-brand-teal" />
        Economic Impact Analysis
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`rounded border ${card.border} ${card.bg} p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-muted">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className={`text-lg font-bold ${card.color}`}>
                {card.isPositive ? '+' : '-'}${card.value}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EconomicImpact;
