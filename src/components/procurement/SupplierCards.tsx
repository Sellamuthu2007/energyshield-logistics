import React from 'react';
import type { ProcurementSupplier } from '@/types/procurement';
import { Clock, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  suppliers: ProcurementSupplier[];
  isLoading?: boolean;
}

const statusColors = {
  green: 'text-green-400 bg-green-400/10 border-green-400/20',
  yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  red: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export const SupplierCards: React.FC<Props> = ({ suppliers, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 rounded border border-brand-border bg-brand-card p-4 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-brand-teal" />
        Supplier Intelligence
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {suppliers.map((supplier) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded border border-brand-border bg-brand-card p-5 relative overflow-hidden group hover:border-${supplier.supplier_status}-400/50 transition-colors`}
          >
            {/* Top Right Status Indicator */}
            <div className="absolute top-0 right-0 p-3">
              <span className={`w-3 h-3 rounded-full block shadow-[0_0_8px_currentColor] ${statusColors[supplier.supplier_status].split(' ')[0]}`} />
            </div>

            <h4 className="text-lg font-bold text-white mb-4">{supplier.country}</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-muted font-semibold">Current Price</span>
                <span className="text-brand-text font-bold">${supplier.current_price.toFixed(2)}/bbl</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-muted font-semibold">Capacity</span>
                <span className="text-brand-text font-bold">{(supplier.supply_capacity / 1000000).toFixed(1)}M bbl/d</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-muted font-semibold">Delivery Time</span>
                <span className="text-brand-text font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {supplier.delivery_time} days
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2 border-t border-brand-border/40">
                <span className="text-brand-muted font-semibold">Risk & Reliability</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-brand-muted flex items-center gap-1">
                    {supplier.geopolitical_risk === 'low' ? <CheckCircle className="w-3 h-3 text-green-400" /> : <AlertTriangle className="w-3 h-3 text-yellow-400" />}
                    {supplier.geopolitical_risk}
                  </span>
                  <span className="text-brand-text font-bold bg-[#1a2130] px-2 py-0.5 rounded">{supplier.reliability_score}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SupplierCards;
