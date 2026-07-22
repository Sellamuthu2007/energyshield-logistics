import React, { useState } from 'react';
import type { PurchaseOrder } from '@/types/procurement';
import { ShoppingCart, X, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (po: Partial<PurchaseOrder>) => Promise<void>;
}

export const CreatePOModal: React.FC<CreatePOModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [supplier, setSupplier] = useState('ADNOC Logistics');
  const [quantity, setQuantity] = useState<number>(1500000);
  const [destinationRefinery, setDestinationRefinery] = useState('IOCL Paradip');
  const [expectedDelivery, setExpectedDelivery] = useState('2026-08-05');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newPO: Partial<PurchaseOrder> = {
        po_number: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier,
        quantity,
        destination_refinery: destinationRefinery,
        expected_delivery: expectedDelivery,
        status: 'Pending'
      };
      await onSubmit(newPO);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-left">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg rounded-xl border border-brand-teal/40 bg-[#111622] p-6 space-y-5 shadow-2xl relative"
      >
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
          <div className="flex items-center space-x-2 text-brand-teal">
            <ShoppingCart className="h-5 w-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              ISSUE NEW CRUDE PURCHASE ORDER
            </h3>
          </div>
          <button onClick={onClose} className="text-brand-muted hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-brand-muted uppercase">Select Supplier</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full rounded bg-[#0b101a] border border-brand-border p-2.5 text-white outline-none focus:border-brand-teal"
              >
                <option value="ADNOC Logistics">ADNOC Logistics (UAE)</option>
                <option value="Saudi Aramco">Saudi Aramco (KSA)</option>
                <option value="Rosneft PJSC">Rosneft PJSC (Russia)</option>
                <option value="SOMO Iraq">SOMO Iraq (Iraq)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-muted uppercase">Destination Refinery</label>
              <select
                value={destinationRefinery}
                onChange={(e) => setDestinationRefinery(e.target.value)}
                className="w-full rounded bg-[#0b101a] border border-brand-border p-2.5 text-white outline-none focus:border-brand-teal"
              >
                <option value="IOCL Paradip">IOCL Paradip (East Coast)</option>
                <option value="HPCL Vizag">HPCL Vizag (Bay of Bengal)</option>
                <option value="RIL Jamnagar">RIL Jamnagar (West Coast)</option>
                <option value="BPCL Mumbai">BPCL Mumbai (West Coast)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-brand-muted uppercase">Volume Quantity (Barrels)</label>
              <input
                type="number"
                step="100000"
                min="500000"
                max="5000000"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full rounded bg-[#0b101a] border border-brand-border p-2.5 text-white outline-none focus:border-brand-teal font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-muted uppercase">Expected Delivery Date</label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full rounded bg-[#0b101a] border border-brand-border p-2.5 text-white outline-none focus:border-brand-teal font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-brand-border/40">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded border border-brand-border px-4 py-2 font-semibold text-brand-text hover:bg-brand-card transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 rounded bg-brand-teal px-4 py-2 font-bold text-brand-dark hover:bg-teal-400 disabled:opacity-50 transition-colors shadow"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{isSubmitting ? 'Issuing PO...' : 'ISSUE PURCHASE ORDER'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePOModal;
