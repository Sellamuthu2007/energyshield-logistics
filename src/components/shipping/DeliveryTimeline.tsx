import React from 'react';
import type { Shipment } from '@/types/shipping';
import { GitCommit, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  shipment: Shipment;
}

const TIMELINE_STAGES = [
  'Supplier Departure',
  'Ocean Transit',
  'Indian Port Arrival',
  'Customs Clearance',
  'Refinery Delivery'
];

export const DeliveryTimeline: React.FC<Props> = ({ shipment }) => {
  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <GitCommit className="w-5 h-5 text-brand-teal" />
        Delivery Timeline
      </h3>
      
      <div className="relative pl-6 space-y-6">
        {/* Vertical connecting line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-brand-border/50" />
        
        {TIMELINE_STAGES.map((stage, index) => {
          const isCompleted = index + 1 < shipment.progress_stage;
          const isCurrent = index + 1 === shipment.progress_stage;
          
          return (
            <motion.div 
              key={stage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center gap-4"
            >
              {/* Node */}
              <div className="absolute -left-6 bg-brand-card">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                ) : isCurrent ? (
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="absolute w-4 h-4 bg-brand-teal/20 rounded-full animate-ping" />
                    <Circle className="w-5 h-5 text-brand-teal fill-brand-teal/20" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-brand-border" />
                )}
              </div>
              
              <div className="flex-1">
                <div className={`text-sm font-bold ${isCurrent ? 'text-brand-teal' : isCompleted ? 'text-brand-text' : 'text-brand-muted'}`}>
                  {stage}
                </div>
                {isCurrent && (
                  <div className="text-xs text-brand-text/70 mt-1">
                    Currently in progress. Tracking vessel speed and route conditions.
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryTimeline;
