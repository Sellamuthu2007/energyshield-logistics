import { supabase } from '@/lib/supabaseClient';
import type {
  ProcurementSupplier,
  SupplierRanking,
  PurchaseOrder,
  CrudeCompatibility,
  Contract
} from '@/types/procurement';
import type { GovernmentRecommendation } from '@/types/government';
import { createNotification } from './notificationService';

export async function getForwardedRecommendations(): Promise<GovernmentRecommendation[]> {
  const { data, error } = await supabase
    .from('government_recommendations')
    .select('*')
    .eq('status', 'forwarded')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching forwarded recommendations:', error);
    throw error;
  }
  return data as GovernmentRecommendation[];
}

export async function acceptRecommendation(id: string): Promise<void> {
  const { error } = await supabase
    .from('government_recommendations')
    .update({ status: 'approved' })
    .eq('id', id);

  if (error) {
    console.error('Error accepting recommendation:', error);
    throw error;
  }
}

export async function rejectRecommendation(id: string): Promise<void> {
  const { error } = await supabase
    .from('government_recommendations')
    .update({ status: 'rejected' })
    .eq('id', id);

  if (error) {
    console.error('Error rejecting recommendation:', error);
    throw error;
  }
}

export async function getProcurementSuppliers(): Promise<ProcurementSupplier[]> {
  const { data, error } = await supabase
    .from('procurement_suppliers')
    .select('*')
    .order('reliability_score', { ascending: false });

  if (error) {
    console.error('Error fetching procurement suppliers:', error);
    throw error;
  }
  return data as ProcurementSupplier[];
}

export async function getSupplierRankings(): Promise<SupplierRanking[]> {
  const { data, error } = await supabase
    .from('supplier_rankings')
    .select('*')
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching supplier rankings:', error);
    throw error;
  }
  return data as SupplierRanking[];
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
  return data as PurchaseOrder[];
}

export async function getCrudeCompatibility(): Promise<CrudeCompatibility[]> {
  const { data, error } = await supabase
    .from('crude_compatibility')
    .select('*')
    .order('compatibility_score', { ascending: false });

  if (error) {
    console.error('Error fetching crude compatibility:', error);
    throw error;
  }
  return data as CrudeCompatibility[];
}

export async function getContracts(): Promise<Contract[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .order('remaining_days', { ascending: true });

  if (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
  return data as Contract[];
}

export async function createPurchaseOrder(po: Partial<PurchaseOrder>, userId: string): Promise<void> {
  const { error } = await supabase
    .from('purchase_orders')
    .insert({
      ...po,
      created_by: userId,
      status: 'Pending',
    });

  if (error) {
    console.error('Error creating purchase order:', error);
    throw error;
  }

  await createNotification(
    'procurement',
    'Purchase Order Created',
    `PO ${po.po_number} has been created and is pending approval.`
  );
}

import { addInventory } from './inventoryService';

export async function approvePurchaseOrder(id: string): Promise<void> {
  const { error, data } = await supabase
    .from('purchase_orders')
    .update({ status: 'Approved' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error approving PO:', error);
    throw error;
  }
  
  if (data) {
    // 1. Notify
    await createNotification(
      'procurement',
      'Purchase Order Approved',
      `PO ${data.po_number} has been approved.`
    );
    
    // 2. Automatically update inventory based on PO destination and quantity
    try {
      await addInventory(data.destination_refinery, data.quantity);
    } catch (invError) {
      console.error('Failed to update inventory downstream:', invError);
      // We don't throw here to avoid failing the PO approval if inventory sync fails temporarily,
      // but in a strict transactional system this should be atomic.
    }
  }
}

export async function trackShipment(id: string): Promise<void> {
  const { error, data } = await supabase
    .from('purchase_orders')
    .update({ status: 'Tracked' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error initiating tracking:', error);
    throw error;
  }
  
  if (data) {
    await createNotification(
      'shipping',
      'New Shipment Tracked',
      `Shipment for PO ${data.po_number} has been forwarded to the Shipping Dashboard.`
    );
  }
}
