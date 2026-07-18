import { supabase } from '@/lib/supabaseClient';
import type { Shipment, Vessel, ShipmentEvent } from '@/types/shipping';
import type { PurchaseOrder } from '@/types/procurement';
import { createShipmentNotification } from './notificationService';

export async function getShipmentQueue(): Promise<PurchaseOrder[]> {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('status', 'Approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PurchaseOrder[];
}

export async function getShipments(): Promise<Shipment[]> {
  const { data, error } = await supabase
    .from('shipments')
    .select('*, vessel:vessels(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Shipment[];
}

export async function dispatchShipment(po: PurchaseOrder): Promise<void> {
  const { error: poError } = await supabase
    .from('purchase_orders')
    .update({ status: 'Tracked' })
    .eq('id', po.id);
  if (poError) throw poError;

  const { data: vessels, error: vError } = await supabase
    .from('vessels')
    .select('*')
    .limit(1);
  if (vError) throw vError;

  const vesselId = vessels && vessels.length > 0 ? vessels[0].id : null;

  const { data: shipment, error: asError } = await supabase
    .from('shipments')
    .insert({
      po_number: po.po_number,
      supplier_country: po.supplier,
      destination_port: 'Paradip Port',
      destination_refinery: po.destination_refinery,
      vessel_id: vesselId,
      quantity: po.quantity,
      current_eta: po.expected_delivery,
      status: 'Departed',
      progress_stage: 2,
    })
    .select()
    .single();
    
  if (asError) throw asError;

  // Create Timeline Event
  await supabase.from('shipment_events').insert({
    shipment_id: shipment.id,
    event_type: 'DISPATCH',
    event_description: `Shipment departed from ${po.supplier} port. Tanker assigned.`
  });

  await createShipmentNotification(
    'Shipment Dispatched',
    `Tanker assigned for PO ${po.po_number}. Shipment has departed.`
  );
}
