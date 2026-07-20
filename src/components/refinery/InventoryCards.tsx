import React from 'react';
import { useRefineryInventory } from '@/hooks/useRefineryData';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package } from 'lucide-react';

export const InventoryCards: React.FC = () => {
  const { data: inventory, isLoading } = useRefineryInventory();

  if (isLoading) {
    return <div className="h-64 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  if (!inventory || inventory.length === 0) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6">
        <p className="text-sm text-brand-muted italic">No inventory data available.</p>
      </div>
    );
  }

  const chartData = inventory.map(r => ({
    name: r.refinery_name.split(' ')[0],
    inventory: Math.round(r.current_inventory_barrels / 1000),
    remaining: r.remaining_days,
  }));

  const getBarColor = (days: number) => {
    if (days >= 10) return '#22c55e';
    if (days >= 5) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Package className="w-5 h-5 text-brand-teal" />
        Crude Inventory & Trend
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {inventory.map((ref, idx) => {
          const pct = Math.min((ref.current_inventory_barrels / (ref.daily_consumption * 30)) * 100, 100);
          return (
            <motion.div
              key={ref.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 bg-[#1a2130] border border-brand-border/50 rounded"
            >
              <div className="text-[10px] font-bold text-brand-muted uppercase truncate">{ref.refinery_name}</div>
              <div className="text-sm font-bold text-white mt-1">{ref.current_inventory_barrels.toLocaleString()} BBL</div>
              <div className="w-full bg-[#090d13] rounded-full h-1.5 mt-2">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: getBarColor(ref.remaining_days) }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-brand-muted mt-1">
                <span>{ref.remaining_days}d cover</span>
                <span>{Math.round(pct)}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a2130', border: '1px solid #2a3a5c', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="inventory" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={getBarColor(entry.remaining)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryCards;
