import React, { useState } from 'react';
import { useProductionPlans } from '@/hooks/useRefineryData';
import { updateProductionPlan } from '@/services/refineryService';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Settings } from 'lucide-react';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const PRODUCTS = ['Petrol', 'Diesel', 'ATF', 'LPG', 'Lubricants'];

export const ProductionPlanning: React.FC = () => {
  const { data: plans, isLoading } = useProductionPlans();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  if (isLoading) {
    return <div className="h-64 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6">
        <p className="text-sm text-brand-muted italic">No production plans available.</p>
      </div>
    );
  }

  const handleAdjust = async (id: string) => {
    await updateProductionPlan(id, adjustments);
    setEditingId(null);
    setAdjustments({});
    queryClient.invalidateQueries({ queryKey: ['production_plan'] });
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Settings className="w-5 h-5 text-brand-teal" />
        Production Planning
      </h3>

      <div className="space-y-4">
        {plans.map((plan, idx) => {
          const pieData = [
            { name: 'Petrol', value: plan.petrol_pct },
            { name: 'Diesel', value: plan.diesel_pct },
            { name: 'ATF', value: plan.atf_pct },
            { name: 'LPG', value: plan.lpg_pct },
            { name: 'Lubricants', value: plan.lubricants_pct },
          ];

          const isEditing = editingId === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-4 bg-[#1a2130] border border-brand-border/50 rounded"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{plan.refinery_name}</h4>
                  {plan.ai_recommendation && (
                    <p className="text-[10px] text-brand-teal mt-1 italic max-w-md">{plan.ai_recommendation}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditingId(isEditing ? null : plan.id);
                    setAdjustments({});
                  }}
                  className="text-[10px] text-brand-muted hover:text-white uppercase font-bold tracking-wider"
                >
                  {isEditing ? 'Cancel' : 'Adjust'}
                </button>
              </div>

              <div className="flex gap-6">
                <div className="h-28 w-28 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={20} outerRadius={38}>
                        {pieData.map((entry, idx) => (
                          <Cell key={entry.name} fill={COLORS[idx]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                  {PRODUCTS.map((product) => {
                    const pctField = product.toLowerCase() === 'petrol' ? 'petrol_pct' :
                      product.toLowerCase() === 'diesel' ? 'diesel_pct' :
                      product.toLowerCase() === 'atf' ? 'atf_pct' :
                      product.toLowerCase() === 'lpg' ? 'lpg_pct' : 'lubricants_pct';
                    const currentVal = plan[pctField] as number;

                    return (
                      <div key={product} className="flex items-center justify-between">
                        <span className="text-brand-muted">{product}</span>
                        <span className="font-semibold text-white">{currentVal}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 pt-4 border-t border-brand-border/40">
                  <button
                    onClick={() => handleAdjust(plan.id)}
                    className="bg-brand-primary text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-brand-primary/80 transition-colors"
                  >
                    Apply AI Recommendation
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductionPlanning;
