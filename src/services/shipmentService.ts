import { supabase } from '@/lib/supabaseClient';
import type { Shipment } from '@/types/shipping';
import type { PurchaseOrder } from '@/types/procurement';
import { createShipmentNotification } from './notificationService';

const FALLBACK_QUEUE: PurchaseOrder[] = [
  { id: 'po-201', po_number: 'PO-2026-0902', supplier: 'ADNOC Logistics', quantity: 1800000, destination_refinery: 'IOCL Paradip', expected_delivery: '2026-08-04', status: 'Approved', created_at: new Date().toISOString() },
  { id: 'po-202', po_number: 'PO-2026-0905', supplier: 'Saudi Aramco', quantity: 2200000, destination_refinery: 'BPCL Mumbai', expected_delivery: '2026-08-08', status: 'Approved', created_at: new Date(Date.now() - 3600000 * 6).toISOString() }
];

const FALLBACK_SHIPMENTS: Shipment[] = [
  {
    id: 'ship-1',
    po_number: 'PO-2026-0875',
    supplier_country: 'Saudi Arabia',
    destination_port: 'Paradip Port',
    destination_refinery: 'IOCL Paradip',
    vessel_id: 'vess-1',
    vessel: { id: 'vess-1', name: 'MT Desh Vishal', type: 'VLCC Tanker', flag: 'India', current_lat: 16.5, current_lng: 82.8, speed_knots: 14.2, status: 'In Transit' },
    quantity: 1800000,
    current_eta: '2026-07-28',
    status: 'In Transit',
    progress_stage: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'ship-2',
    po_number: 'PO-2026-0850',
    supplier_country: 'UAE',
    destination_port: 'Sikka Port',
    destination_refinery: 'RIL Jamnagar',
    vessel_id: 'vess-2',
    vessel: { id: 'vess-2', name: 'MT Swarna Kamal', type: 'Suezmax Tanker', flag: 'India', current_lat: 22.4, current_lng: 69.8, speed_knots: 12.8, status: 'Arriving' },
    quantity: 1200000,
    current_eta: '2026-07-24',
    status: 'Arriving',
    progress_stage: 4,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export async function getShipmentQueue(): Promise<PurchaseOrder[]> {
  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('status', 'Approved')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_QUEUE;
    return data as PurchaseOrder[];
  } catch {
    return FALLBACK_QUEUE;
  }
}

export async function getShipments(): Promise<Shipment[]> {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('*, vessel:vessels(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_SHIPMENTS;
    return data as Shipment[];
  } catch {
    return FALLBACK_SHIPMENTS;
  }
}

export async function dispatchShipment(po: PurchaseOrder): Promise<void> {
  try {
    await supabase.from('purchase_orders').update({ status: 'Tracked' }).eq('id', po.id);
    await createShipmentNotification('Shipment Dispatched', `Tanker assigned for PO ${po.po_number}. Shipment has departed.`);
  } catch (err) {
    console.warn('Fallback dispatch shipment:', err);
  }
}
