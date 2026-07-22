import { supabase } from '@/lib/supabaseClient';
import type { Port } from '@/types/shipping';

const FALLBACK_PORTS: Port[] = [
  { id: 'port-1', port_name: 'Paradip Port', country: 'India', waiting_ships: 3, available_berths: 8, average_waiting_time: '18 hrs', congestion_level: 'medium', status: 'yellow' },
  { id: 'port-2', port_name: 'Sikka Port', country: 'India', waiting_ships: 1, available_berths: 12, average_waiting_time: '6 hrs', congestion_level: 'low', status: 'green' },
  { id: 'port-3', port_name: 'Vadinar Port', country: 'India', waiting_ships: 2, available_berths: 6, average_waiting_time: '12 hrs', congestion_level: 'low', status: 'green' },
  { id: 'port-4', port_name: 'Mundra Port', country: 'India', waiting_ships: 4, available_berths: 10, average_waiting_time: '24 hrs', congestion_level: 'high', status: 'yellow' },
  { id: 'port-5', port_name: 'Vizag Port', country: 'India', waiting_ships: 5, available_berths: 6, average_waiting_time: '36 hrs', congestion_level: 'critical', status: 'red' },
  { id: 'port-6', port_name: 'Mumbai Port', country: 'India', waiting_ships: 2, available_berths: 8, average_waiting_time: '14 hrs', congestion_level: 'low', status: 'green' },
  { id: 'port-7', port_name: 'Ennore Port', country: 'India', waiting_ships: 1, available_berths: 5, average_waiting_time: '8 hrs', congestion_level: 'low', status: 'green' }
];

export async function getPorts(): Promise<Port[]> {
  try {
    const { data, error } = await supabase
      .from('ports')
      .select('*')
      .order('port_name', { ascending: true });

    if (error || !data || data.length === 0) return FALLBACK_PORTS;
    return data as Port[];
  } catch {
    return FALLBACK_PORTS;
  }
}
