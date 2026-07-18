import React from 'react';
import type { Shipment } from '@/types/shipping';
import { Map, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  shipments: Shipment[];
  isLoading?: boolean;
}

export const WorldMap: React.FC<Props> = ({ shipments, isLoading }) => {
  if (isLoading) {
    return <div className="h-[400px] border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Map className="w-5 h-5 text-brand-teal" />
          Live Global Tracking
        </h3>
        <div className="flex items-center gap-3 text-xs font-bold text-brand-muted uppercase tracking-wider">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" /> Active Vessels</span>
        </div>
      </div>

      <div className="relative w-full h-[320px] bg-[#0e131d] rounded border border-brand-border/30 overflow-hidden flex items-center justify-center">
        {/* Abstract Dark Stylized Map Background (SVG) */}
        <svg 
          viewBox="0 0 1000 500" 
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M200,150 Q250,100 300,120 T400,180 T500,150 T600,200 T700,180 T800,250 T850,300" fill="none" stroke="#00e0ff" strokeWidth="1" strokeDasharray="5,5" />
          <path d="M150,250 Q200,200 300,220 T450,280 T550,250 T650,300 T750,280 T900,350" fill="none" stroke="#00e0ff" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
          
          {/* Faux Landmasses */}
          <path d="M0,0 L300,0 L350,100 L250,200 L100,150 L0,250 Z" fill="#1a2130" stroke="#2d3748" strokeWidth="1"/>
          <path d="M700,0 L1000,0 L1000,300 L850,250 L800,100 Z" fill="#1a2130" stroke="#2d3748" strokeWidth="1"/>
          <path d="M400,500 L600,500 L700,350 L500,300 L350,400 Z" fill="#1a2130" stroke="#2d3748" strokeWidth="1"/>
        </svg>

        {/* Dynamic Shipments Overlay */}
        {shipments.map((shipment, index) => {
          // Normalize lat/long to abstract coordinates for the dummy SVG map.
          // In a real app with Leaflet, these would be real projection points.
          // Since we are mocking, we just generate deterministic positions based on progress.
          const xPos = 20 + (shipment.progress_stage * 20); // 20% to 80%
          const yPos = 40 + (index * 15); // Stagger vertically
          
          return (
            <motion.div
              key={shipment.id}
              className="absolute"
              initial={{ left: '10%', top: `${yPos}%` }}
              animate={{ left: `${xPos}%`, top: `${yPos}%` }}
              transition={{ duration: 2, type: 'spring' }}
            >
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-2 bg-brand-teal/20 rounded-full blur-md animate-pulse" />
                <div className="relative w-4 h-4 bg-brand-teal rounded-full border-2 border-[#0e131d] shadow-[0_0_10px_rgba(0,224,255,0.8)]" />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-brand-card border border-brand-teal/50 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  <div className="text-xs font-bold text-brand-teal mb-1">{shipment.vessel?.vessel_name}</div>
                  <div className="text-[10px] text-brand-text/80 mb-1">Route: {shipment.supplier_country} → {shipment.destination_port}</div>
                  <div className="text-[10px] text-brand-text font-mono flex items-center justify-between">
                    <span>SPD: {shipment.vessel?.current_speed} kts</span>
                    <span>{shipment.status}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Destination Port Marker */}
        <div className="absolute right-[15%] top-[45%] flex flex-col items-center">
          <MapPin className="w-6 h-6 text-yellow-400 mb-1" />
          <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest bg-black/50 px-1 rounded">Indian Ports</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
