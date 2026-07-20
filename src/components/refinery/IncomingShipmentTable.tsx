import React from 'react';
import { useIncomingShipments } from '@/hooks/useRefineryData';
import { receiveShipment } from '@/services/refineryService';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Anchor, CheckCircle } from 'lucide-react';

export const IncomingShipmentTable: React.FC = () => {
  const { data: shipments, isLoading } = useIncomingShipments();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  const handleReceive = async (id: string) => {
    await receiveShipment(id);
    queryClient.invalidateQueries({ queryKey: ['incoming_shipments'] });
    queryClient.invalidateQueries({ queryKey: ['refinery_inventory'] });
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Anchor className="w-5 h-5 text-brand-teal" />
        Incoming Shipments
      </h3>

      {!shipments || shipments.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No incoming shipments scheduled.</div>
      ) : (
        <div className="space-y-3">
          {shipments.map((s, idx) => {
            const isDelivered = s.status === 'delivered';
            const isDelayed = s.status === 'delayed';
            const arrivalDate = new Date(s.expected_arrival);
            const daysUntil = Math.ceil((arrivalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-center justify-between p-3 rounded border ${
                  isDelivered ? 'border-green-500/20 bg-green-500/5' :
                  isDelayed ? 'border-red-500/20 bg-red-500/5' :
                  'bg-[#1a2130] border-brand-border/50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{s.refinery_name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isDelivered ? 'bg-green-500/20 text-green-400' :
                      isDelayed ? 'bg-red-500/20 text-red-400' :
                      'bg-brand-teal/20 text-brand-teal'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="text-xs text-brand-muted mt-1">
                    {s.quantity.toLocaleString()} BBL — {isDelivered ? 'Received' : `ETA ${arrivalDate.toLocaleDateString()} (${daysUntil > 0 ? `${daysUntil}d` : 'Today'})`}
                  </div>
                </div>
                {!isDelivered && (
                  <button
                    onClick={() => handleReceive(s.id)}
                    className="flex items-center gap-1.5 bg-brand-teal text-[#0e131d] px-3 py-1.5 rounded text-xs font-bold hover:bg-brand-teal/80 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Receive
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

export default IncomingShipmentTable;
