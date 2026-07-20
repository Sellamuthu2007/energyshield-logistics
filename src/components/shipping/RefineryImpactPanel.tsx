import React from 'react';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabaseClient';


import { Activity, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { createNotification } from '@/services/notificationService';

export const RefineryImpactPanel: React.FC = () => {
  const { data: impacts, isLoading } = useSupabaseQuery(['refineryImpacts'], async () => {
    const { data, error } = await supabase.from('refinery_impact').select('*, shipments(po_number)');
    if (error) throw error;
    return data;
  });

  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  const handleNotifyRefinery = async (impact: any) => {
    await createNotification(
      'refinery',
      'Shipment Delay Warning',
      `Delay expected for PO ${impact.shipments?.po_number}. Expected delay: ${impact.expected_delay}. Impact: ${impact.ai_assessment}.`
    );
    alert('Refinery successfully notified!');
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-brand-teal" />
        Refinery Impact Analysis
      </h3>

      {!impacts || impacts.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No downstream refinery impacts detected.</div>
      ) : (
        <div className="space-y-4">
          {impacts.map((impact: any, idx) => (
            <motion.div
              key={impact.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded border ${
                impact.ai_assessment === 'Critical' 
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-[#1a2130] border-brand-border/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-brand-text">{impact.refinery_name}</span>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                  impact.ai_assessment === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  impact.ai_assessment === 'Medium Risk' ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' :
                  'bg-brand-teal/20 text-brand-teal border-brand-teal/30'
                }`}>
                  {impact.ai_assessment}
                </span>
              </div>
              
              <div className="text-xs text-brand-text/80 grid grid-cols-2 gap-2 mb-4">
                <div><span className="text-brand-muted">Delay:</span> {impact.expected_delay}</div>
                <div><span className="text-brand-muted">Inventory:</span> {impact.inventory_remaining}</div>
              </div>

              {impact.ai_assessment === 'Critical' && (
                <button
                  onClick={() => handleNotifyRefinery(impact)}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" /> Notify Refinery Dashboard
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RefineryImpactPanel;
