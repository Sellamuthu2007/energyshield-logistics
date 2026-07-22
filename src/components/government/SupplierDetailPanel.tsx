import React from 'react';
import type { SupplierCountry } from '@/types/government';
import { X, Shield, AlertTriangle, Activity, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface SupplierDetailPanelProps {
  supplier: SupplierCountry | null;
  onClose: () => void;
}

export const SupplierDetailPanel: React.FC<SupplierDetailPanelProps> = ({ supplier, onClose }) => {
  if (!supplier) return null;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'red':
        return 'bg-brand-red/10 border-brand-red/30 text-brand-red';
      case 'yellow':
        return 'bg-brand-yellow/10 border-brand-yellow/30 text-brand-yellow';
      default:
        return 'bg-brand-green/10 border-brand-green/30 text-brand-green';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded border border-brand-border bg-brand-card p-5 text-left space-y-4 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-brand-primary" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            {supplier.name} Telemetry & Intelligence Profile
          </h3>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-brand-muted hover:bg-brand-dark hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-[#0b101a] p-3 rounded border border-brand-border/50">
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Daily Imports</span>
          <span className="text-sm font-bold text-white font-mono">
            {(supplier.current_imports / 1000).toFixed(0)}k bbls/day
          </span>
        </div>
        <div className="bg-[#0b101a] p-3 rounded border border-brand-border/50">
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Risk Level</span>
          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getRiskBadge(supplier.risk_level)}`}>
            {supplier.risk_level}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="bg-[#0b101a] p-3 rounded border border-brand-border/50 space-y-1">
          <div className="flex items-center space-x-1.5 text-brand-muted font-bold text-[10px] uppercase">
            <Activity className="h-3.5 w-3.5 text-brand-teal" />
            <span>Active Maritime Events</span>
          </div>
          <p className="text-brand-text text-[11px] leading-relaxed">{supplier.active_events}</p>
        </div>

        <div className="bg-[#0b101a] p-3 rounded border border-brand-border/50 space-y-1">
          <div className="flex items-center space-x-1.5 text-brand-muted font-bold text-[10px] uppercase">
            <AlertTriangle className="h-3.5 w-3.5 text-brand-yellow" />
            <span>Projected Supply Chain Impact</span>
          </div>
          <p className="text-brand-text text-[11px] leading-relaxed">{supplier.expected_impact}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0b101a] p-2.5 rounded border border-brand-border/40 text-center">
            <span className="text-[9px] text-brand-muted font-bold uppercase block">Reliability Score</span>
            <span className="text-xs font-bold text-brand-teal font-mono flex items-center justify-center gap-1 mt-0.5">
              <Award className="h-3 w-3" />
              {supplier.reliability_score || 94}%
            </span>
          </div>
          <div className="bg-[#0b101a] p-2.5 rounded border border-brand-border/40 text-center">
            <span className="text-[9px] text-brand-muted font-bold uppercase block">Sanctions Status</span>
            <span className="text-xs font-bold text-white font-mono mt-0.5 block">
              {supplier.sanctions_status || 'Compliant'}
            </span>
          </div>
        </div>

        {supplier.last_incident && (
          <div className="bg-[#0b101a] p-2.5 rounded border border-brand-border/40 text-[10px] text-brand-muted flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-brand-muted" />
              <span>Last Logged Incident:</span>
            </span>
            <span className="font-semibold text-white">{supplier.last_incident}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SupplierDetailPanel;
