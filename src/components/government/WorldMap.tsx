import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { SupplierCountry } from '@/types/government';
import SupplierDetailPanel from './SupplierDetailPanel';
import { Filter, Globe } from 'lucide-react';

interface WorldMapProps {
  suppliers?: SupplierCountry[];
}

export const WorldMap: React.FC<WorldMapProps> = ({ suppliers = [] }) => {
  const [filter, setFilter] = useState<'all' | 'stable' | 'monitoring' | 'elevated' | 'critical'>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierCountry | null>(null);

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'red':
        return '#ef4444'; // brand-red
      case 'yellow':
        return '#f59e0b'; // brand-yellow
      default:
        return '#10b981'; // brand-green
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    if (filter === 'stable') return s.risk_level === 'green';
    if (filter === 'monitoring' || filter === 'elevated') return s.risk_level === 'yellow';
    if (filter === 'critical') return s.risk_level === 'red';
    return true;
  });

  return (
    <div className="rounded border border-brand-border bg-brand-card overflow-hidden shadow-lg space-y-0 text-left">
      <div className="border-b border-brand-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand-teal" />
            Global Exporter Risk & Maritime Map
          </h3>
          <p className="text-[10px] text-brand-muted mt-0.5">AIS-linked maritime corridors and national risk assessment flags</p>
        </div>

        {/* Risk Level Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#0b101a] p-1 rounded border border-brand-border/50 text-[10px]">
          <Filter className="h-3 w-3 text-brand-muted ml-1" />
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${filter === 'all' ? 'bg-brand-primary text-white' : 'text-brand-muted hover:text-white'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('stable')}
            className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${filter === 'stable' ? 'bg-brand-green text-brand-dark' : 'text-brand-muted hover:text-white'}`}
          >
            Stable
          </button>
          <button
            onClick={() => setFilter('monitoring')}
            className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${filter === 'monitoring' ? 'bg-brand-yellow text-brand-dark' : 'text-brand-muted hover:text-white'}`}
          >
            Monitoring
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className={`h-[400px] w-full dark-map ${selectedSupplier ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <MapContainer
            center={[25, 30]}
            zoom={2}
            scrollWheelZoom={false}
            className="h-full w-full outline-none"
            style={{ background: '#0b0e14' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredSuppliers.map((country) => {
              const coords = country.coordinates || [20, 0];
              const color = getMarkerColor(country.risk_level);

              return (
                <CircleMarker
                  key={country.id}
                  center={coords}
                  radius={9}
                  eventHandlers={{
                    click: () => setSelectedSupplier(country),
                  }}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.7,
                    color: color,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-1 text-left text-brand-dark min-w-[200px]">
                      <div className="flex items-center justify-between mb-1.5 border-b pb-1">
                        <span className="font-bold text-xs uppercase tracking-wide">{country.name}</span>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase text-white"
                          style={{ backgroundColor: color }}
                        >
                          {country.risk_level} Risk
                        </span>
                      </div>
                      <div className="space-y-1 text-[10px] leading-tight">
                        <p>
                          <span className="font-semibold text-gray-500">Current Imports:</span>{' '}
                          <span className="font-bold">{(country.current_imports / 1000).toFixed(0)}k Barrels/Day</span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-500">Active Events:</span>{' '}
                          <span className="text-gray-700">{country.active_events}</span>
                        </p>
                        <p className="pt-1 text-[#00e0ff] font-bold text-[9px] cursor-pointer">
                          Click marker for full telemetry profile ➔
                        </p>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {selectedSupplier && (
          <div className="p-3 border-t lg:border-t-0 lg:border-l border-brand-border/40 bg-[#0c1018]">
            <SupplierDetailPanel
              supplier={selectedSupplier}
              onClose={() => setSelectedSupplier(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap;
