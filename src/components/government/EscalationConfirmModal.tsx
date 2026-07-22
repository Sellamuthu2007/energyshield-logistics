import React from 'react';
import type { ReadinessLevel } from '@/types/government';
import { Award, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EscalationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nextLevel: ReadinessLevel) => Promise<void>;
  currentLevel: ReadinessLevel;
}

export const EscalationConfirmModal: React.FC<EscalationConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentLevel,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const getNextLevel = (current: ReadinessLevel): ReadinessLevel => {
    switch (current) {
      case 'normal':
        return 'elevated';
      case 'elevated':
        return 'high_alert';
      case 'high_alert':
        return 'emergency';
      default:
        return 'emergency';
    }
  };

  const nextLevel = getNextLevel(currentLevel);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(nextLevel);
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
        className="w-full max-w-md rounded-xl border border-brand-teal/40 bg-[#111622] p-6 space-y-5 shadow-2xl relative"
      >
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
          <div className="flex items-center space-x-2 text-brand-teal">
            <Award className="h-5 w-5" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              ESCALATE NATIONAL READINESS LEVEL
            </h3>
          </div>
          <button onClick={onClose} className="text-brand-muted hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-brand-muted leading-relaxed">
          Elevating national energy security readiness triggers automated monitoring protocols across all port authorities, crude pipelines, and domestic oil refiners.
        </p>

        <div className="flex items-center justify-around bg-[#0b101a] p-4 rounded border border-brand-border/50 text-xs">
          <div className="text-center">
            <span className="text-[9px] text-brand-muted font-bold uppercase block">Current Level</span>
            <span className="font-bold text-white uppercase mt-0.5 inline-block">{currentLevel.replace('_', ' ')}</span>
          </div>

          <ArrowRight className="h-4 w-4 text-brand-teal animate-pulse" />

          <div className="text-center">
            <span className="text-[9px] text-brand-teal font-bold uppercase block">Target Escalation</span>
            <span className="font-bold text-brand-teal uppercase mt-0.5 inline-block bg-brand-teal/10 border border-brand-teal/30 px-2 py-0.5 rounded">
              {nextLevel.replace('_', ' ')}
            </span>
          </div>
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
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="rounded bg-brand-teal px-4 py-2 text-xs font-bold text-brand-dark hover:bg-teal-400 disabled:opacity-50 transition-colors shadow"
          >
            {isSubmitting ? 'Escalating...' : 'CONFIRM ESCALATION'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EscalationConfirmModal;
