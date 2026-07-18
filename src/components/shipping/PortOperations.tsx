import React from 'react';
import type { Port } from '@/types/shipping';
import { Anchor, Ship } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  ports: Port[];
  isLoading?: boolean;
}

export const PortOperations: React.FC<Props> = ({ ports, isLoading }) => {
  if (isLoading) {
    return <div className="h-64 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  const getStatusColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'yellow': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'red': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-brand-text bg-brand-border border-brand-border/50';
    }
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Anchor className="w-5 h-5 text-brand-teal" />
        Port Operations Status
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ports.map((port, idx) => (
          <motion.div
            key={port.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 rounded border flex flex-col justify-between ${
              port.status === 'red' ? 'bg-red-500/5 border-red-500/20' : 'bg-[#1a2130] border-brand-border/50'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="font-bold text-brand-text">{port.port_name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold border ${getStatusColor(port.status)}`}>
                {port.congestion_level}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0e131d] rounded p-2 text-center">
                <div className="text-brand-muted mb-0.5">Waiting</div>
                <div className="font-mono font-bold text-brand-text flex items-center justify-center gap-1">
                  <Ship className="w-3 h-3 text-brand-teal" />
                  {port.waiting_ships}
                </div>
              </div>
              <div className="bg-[#0e131d] rounded p-2 text-center">
                <div className="text-brand-muted mb-0.5">Berths</div>
                <div className="font-mono font-bold text-brand-text">{port.available_berths}</div>
              </div>
              <div className="bg-[#0e131d] rounded p-2 text-center col-span-2">
                <div className="text-brand-muted mb-0.5">Avg Wait Time</div>
                <div className="font-mono font-bold text-brand-text">{port.average_waiting_time}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PortOperations;
