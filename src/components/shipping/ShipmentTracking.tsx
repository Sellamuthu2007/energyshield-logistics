import React from 'react';
import type { Shipment } from '@/types/shipping';
import { Ship, Navigation, Clock, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  shipments: Shipment[];
  isLoading?: boolean;
}

const STAGES = ['Supplier', 'Ocean Transit', 'Indian Port', 'Refinery'];

export const ShipmentTracking: React.FC<Props> = ({ shipments, isLoading }) => {
  if (isLoading) {
    return <div className="h-64 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Navigation className="w-5 h-5 text-brand-teal" />
        Active Shipment Tracking
      </h3>

      {shipments.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No active shipments currently tracked.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shipments.map((shipment, idx) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#1a2130] border border-brand-border/50 rounded p-4 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Ship className="w-4 h-4 text-brand-teal" />
                    <span className="font-bold text-white text-base">
                      {shipment.vessel?.vessel_name || 'Unassigned Vessel'}
                    </span>
                  </div>
                  <div className="text-xs text-brand-muted font-mono">{shipment.po_number}</div>
                </div>
                <span className="text-[10px] px-2 py-1 bg-brand-teal/10 text-brand-teal border border-brand-teal/30 rounded uppercase tracking-wider font-bold">
                  {shipment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <div className="text-brand-muted text-xs mb-1">Destination</div>
                  <div className="font-semibold text-brand-text truncate">{shipment.destination_port}</div>
                  <div className="text-brand-text/60 text-xs">{shipment.destination_refinery}</div>
                </div>
                <div>
                  <div className="text-brand-muted text-xs mb-1">Telemetry</div>
                  <div className="font-semibold text-brand-text font-mono flex items-center gap-1 text-xs">
                    <Anchor className="w-3 h-3" />
                    {shipment.vessel?.current_speed || 0} kts
                  </div>
                  <div className="text-brand-text/60 text-xs font-mono">
                    {shipment.vessel?.latitude.toFixed(4)}, {shipment.vessel?.longitude.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-auto">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2 text-brand-muted">
                  {STAGES.map((stage, i) => (
                    <span key={stage} className={i + 1 <= shipment.progress_stage ? 'text-brand-teal' : ''}>
                      {stage}
                    </span>
                  ))}
                </div>
                <div className="relative h-1.5 bg-brand-border/30 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-brand-teal transition-all duration-1000"
                    style={{ width: `${(shipment.progress_stage / STAGES.length) * 100}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between items-center text-xs">
                  <span className="text-brand-muted">ETA:</span>
                  <span className="font-mono font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-teal" />
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(shipment.current_eta))}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShipmentTracking;
