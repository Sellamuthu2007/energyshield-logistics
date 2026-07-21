import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { SupplierCountry } from '@/types/government';

interface WorldMapProps {
  suppliers?: SupplierCountry[];
}

export const WorldMap: React.FC<WorldMapProps> = ({ suppliers = [] }) => {
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

  return (
    <div className="rounded border border-brand-border bg-brand-card overflow-hidden">
      <div className="border-b border-brand-border p-4 text-left">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Global Exporter Risk Map</h3>
        <p className="text-[10px] text-brand-muted mt-0.5">AIS-linked maritime corridors and national risk assessment flags</p>
      </div>
      
      <div className="h-[400px] w-full dark-map">
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

          {suppliers.map((country) => {
            const coords: [number, number] = country.coordinates || [20, 0];
            const color = getMarkerColor(country.risk_level);

            return (
              <CircleMarker
                key={country.id}
                center={coords}
                radius={8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.6,
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
                      <p>
                        <span className="font-semibold text-gray-500">Expected Impact:</span>{' '}
                        <span className="text-gray-700">{country.expected_impact}</span>
                      </p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default WorldMap;
