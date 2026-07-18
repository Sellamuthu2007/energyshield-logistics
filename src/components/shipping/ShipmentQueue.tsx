import React from 'react';
import type { PurchaseOrder } from '@/types/procurement';
import { Package, Send, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  queue: PurchaseOrder[];
  isLoading?: boolean;
  onDispatch: (po: PurchaseOrder) => Promise<void>;
}

export const ShipmentQueue: React.FC<Props> = ({ queue, isLoading, onDispatch }) => {
  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Package className="w-5 h-5 text-brand-teal" />
        Shipment Queue
      </h3>
      
      {queue.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No pending shipments in queue.</div>
      ) : (
        <div className="space-y-4">
          {queue.map((po, idx) => (
            <motion.div
              key={po.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-[#1a2130] border border-brand-border/50 rounded flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-brand-teal font-bold">{po.po_number}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded uppercase tracking-wider font-bold">
                    {po.status}
                  </span>
                </div>
                <div className="text-sm text-brand-text grid grid-cols-2 gap-x-8 gap-y-1">
                  <span className="text-brand-muted">Supplier:</span> <span className="font-semibold">{po.supplier}</span>
                  <span className="text-brand-muted">Refinery:</span> <span className="font-semibold">{po.destination_refinery}</span>
                  <span className="text-brand-muted">Quantity:</span> <span className="font-semibold">{po.quantity.toLocaleString()} BBL</span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2">
                <button
                  onClick={() => onDispatch(po)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-brand-teal text-[#0e131d] px-3 py-1.5 rounded font-bold text-xs hover:bg-brand-teal/80 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded font-bold text-xs hover:bg-red-500/20 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShipmentQueue;
