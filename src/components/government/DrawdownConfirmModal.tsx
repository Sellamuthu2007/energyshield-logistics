import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DrawdownConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  currentStock: number;
  drawdownRate: number;
  currentDays: number;
  projectedDays: number;
}

export const DrawdownConfirmModal: React.FC<DrawdownConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentStock,
  drawdownRate,
  currentDays,
  projectedDays,
}) => {
  const [reason, setReason] = useState('Emergency supply disruption mitigation & buffer preservation');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
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
        className="w-full max-w-lg rounded-xl border border-brand-red/40 bg-[#111622] p-6 space-y-5 shadow-2xl relative"
      >
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
          <div className="flex items-center space-x-2 text-brand-red">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AUTHORIZE EMERGENCY SPR DRAWDOWN
            </h3>
          </div>
          <button onClick={onClose} className="text-brand-muted hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded border border-brand-red/30 bg-brand-red/10 p-3 text-xs text-brand-red flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            Warning: Authorizing a Strategic Petroleum Reserve release is an audited high-level policy command. This action will update emergency stock levels and notify national energy desks.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-[#0b101a] p-2.5 rounded border border-brand-border/50">
            <span className="text-[9px] text-brand-muted font-bold uppercase block">Current Stock</span>
            <span className="text-xs font-bold text-white font-mono">{currentStock}M Bbls</span>
          </div>
          <div className="bg-[#0b101a] p-2.5 rounded border border-brand-red/40">
            <span className="text-[9px] text-brand-red font-bold uppercase block">Release Rate</span>
            <span className="text-xs font-bold text-brand-red font-mono">+{drawdownRate.toFixed(1)}M/d</span>
          </div>
          <div className="bg-[#0b101a] p-2.5 rounded border border-brand-border/50">
            <span className="text-[9px] text-brand-muted font-bold uppercase block">Current Cover</span>
            <span className="text-xs font-bold text-white font-mono">{currentDays} Days</span>
          </div>
          <div className="bg-[#0b101a] p-2.5 rounded border border-brand-teal/40">
            <span className="text-[9px] text-brand-teal font-bold uppercase block">Projected Cover</span>
            <span className="text-xs font-bold text-brand-teal font-mono">{projectedDays} Days</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-muted uppercase">Authorization Justification & Reason</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded bg-[#0b101a] border border-brand-border p-2.5 text-xs text-white focus:border-brand-red outline-none"
              placeholder="Enter official policy drawdown justification..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2 border-t border-brand-border/40">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded border border-brand-border px-4 py-2 text-xs font-semibold text-brand-text hover:bg-brand-card transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-brand-red px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors shadow"
            >
              {isSubmitting ? 'Authorizing Drawdown...' : 'CONFIRM AUTHORIZATION'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DrawdownConfirmModal;
