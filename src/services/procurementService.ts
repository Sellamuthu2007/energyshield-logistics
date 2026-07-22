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
import { addInventory } from './inventoryService';

let FALLBACK_FORWARDED_RECS: GovernmentRecommendation[] = [
  {
    id: 'frec-1',
    title: 'Authorize 2.5M Bbl Urgent Procurement from ADNOC',
    reason: 'Offset projected 5-day arrival lag from Black Sea ports',
    priority: 'high',
    confidence: 91,
    business_impact: 'Prevents Paradip CDU 2 shutdown',
    status: 'forwarded',
    created_at: new Date().toISOString()
  }
];

let FALLBACK_SUPPLIERS: ProcurementSupplier[] = [
  { id: 'psup-1', supplier_name: 'Saudi Aramco', country: 'Saudi Arabia', price_per_barrel: 76.5, supply_capacity: 5000000, delivery_time_days: 7, geopolitical_risk: 'green', reliability_score: 96, contract_status: 'Active' },
  { id: 'psup-2', supplier_name: 'Rosneft PJSC', country: 'Russia', price_per_barrel: 68.2, supply_capacity: 4200000, delivery_time_days: 14, geopolitical_risk: 'yellow', reliability_score: 88, contract_status: 'Under Review' },
  { id: 'psup-3', supplier_name: 'ADNOC Logistics', country: 'UAE', price_per_barrel: 77.8, supply_capacity: 3500000, delivery_time_days: 5, geopolitical_risk: 'green', reliability_score: 98, contract_status: 'Active' },
  { id: 'psup-4', supplier_name: 'SOMO Iraq', country: 'Iraq', price_per_barrel: 72.4, supply_capacity: 3800000, delivery_time_days: 9, geopolitical_risk: 'yellow', reliability_score: 85, contract_status: 'Active' }
];

const FALLBACK_RANKINGS: SupplierRanking[] = [
  { id: 'rank-1', rank: 1, supplier_name: 'ADNOC Logistics', score: 94.5, reasoning: 'Shortest transit duration (5d) and zero geopolitical maritime risk flags.', confidence: 96, business_impact: 'Guarantees uninterrupted stock cover for West & East coast refineries.', ranked_at: new Date().toISOString() },
  { id: 'rank-2', rank: 2, supplier_name: 'Saudi Aramco', score: 91.2, reasoning: 'High volume capacity with locked long-term contract discounts.', confidence: 93, business_impact: 'Reduces net per-barrel acquisition cost by $1.80.', ranked_at: new Date().toISOString() },
  { id: 'rank-3', rank: 3, supplier_name: 'Rosneft PJSC', score: 82.0, reasoning: 'Deep pricing discount ($68.20/bbl) offset by extended shipping route risks.', confidence: 84, business_impact: 'High profit margin potential with increased demurrage vulnerability.', ranked_at: new Date().toISOString() }
];

let FALLBACK_POS: PurchaseOrder[] = [
  { id: 'po-101', po_number: 'PO-2026-0891', supplier: 'ADNOC Logistics', quantity: 1500000, destination_refinery: 'IOCL Paradip', expected_delivery: '2026-08-02', status: 'Pending', created_at: new Date().toISOString() },
  { id: 'po-102', po_number: 'PO-2026-0888', supplier: 'Saudi Aramco', quantity: 2000000, destination_refinery: 'HPCL Vizag', expected_delivery: '2026-07-29', status: 'Approved', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'po-103', po_number: 'PO-2026-0875', supplier: 'Rosneft PJSC', quantity: 1800000, destination_refinery: 'RIL Jamnagar', expected_delivery: '2026-08-10', status: 'Tracked', created_at: new Date(Date.now() - 172800000).toISOString() }
];

const FALLBACK_COMPATIBILITY: CrudeCompatibility[] = [
  { id: 'comp-1', refinery_name: 'IOCL Paradip', crude_type: 'Arab Light', compatibility_score: 96, expected_yield: 88.5, recommendation: 'Optimal compatibility for CDU Unit 1 & 2' },
  { id: 'comp-2', refinery_name: 'HPCL Vizag', crude_type: 'Urals Blend', compatibility_score: 82, expected_yield: 81.0, recommendation: 'Requires desalter temperature boost +4°C' },
  { id: 'comp-3', refinery_name: 'RIL Jamnagar', crude_type: 'Basra Heavy', compatibility_score: 94, expected_yield: 89.2, recommendation: 'Excellent API gravity match for delayed coker unit' }
];

const FALLBACK_CONTRACTS: Contract[] = [
  { id: 'cnt-1', supplier_name: 'Saudi Aramco', start_date: '2025-01-01', end_date: '2026-12-31', remaining_days: 160, renewal_status: 'Active', ai_suggestion: 'Initiate 2-year renewal negotiations to lock in current crude grade spreads.' },
  { id: 'cnt-2', supplier_name: 'Rosneft PJSC', start_date: '2025-06-01', end_date: '2026-09-30', remaining_days: 68, renewal_status: 'Expiring Soon', ai_suggestion: 'Review sanctions compliance clause prior to issuing renewal PO.' }
];

const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export async function getForwardedRecommendations(): Promise<GovernmentRecommendation[]> {
  try {
    const { data, error } = await supabase
      .from('government_recommendations')
      .select('*')
      .eq('status', 'forwarded')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_FORWARDED_RECS.filter(r => r.status === 'forwarded');
    return data as GovernmentRecommendation[];
  } catch {
    return FALLBACK_FORWARDED_RECS.filter(r => r.status === 'forwarded');
  }
}

export async function acceptRecommendation(id: string): Promise<void> {
  const target = FALLBACK_FORWARDED_RECS.find(r => r.id === id);
  if (target) {
    target.status = 'approved';
  }

  if (isUUID(id)) {
    try {
      await supabase.from('government_recommendations').update({ status: 'approved' }).eq('id', id);
    } catch (err) {
      console.warn('Fallback accept recommendation:', err);
    }
  }
}

export async function rejectRecommendation(id: string): Promise<void> {
  const target = FALLBACK_FORWARDED_RECS.find(r => r.id === id);
  if (target) {
    target.status = 'rejected';
  }

  if (isUUID(id)) {
    try {
      await supabase.from('government_recommendations').update({ status: 'rejected' }).eq('id', id);
    } catch (err) {
      console.warn('Fallback reject recommendation:', err);
    }
  }
}

export async function getProcurementSuppliers(): Promise<ProcurementSupplier[]> {
  try {
    const { data, error } = await supabase.from('procurement_suppliers').select('*').order('reliability_score', { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_SUPPLIERS;
    return data as ProcurementSupplier[];
  } catch {
    return FALLBACK_SUPPLIERS;
  }
}

export async function getSupplierRankings(): Promise<SupplierRanking[]> {
  try {
    const { data, error } = await supabase.from('supplier_rankings').select('*').order('rank', { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_RANKINGS;
    return data as SupplierRanking[];
  } catch {
    return FALLBACK_RANKINGS;
  }
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const { data, error } = await supabase.from('purchase_orders').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_POS;
    return data as PurchaseOrder[];
  } catch {
    return FALLBACK_POS;
  }
}

export async function getCrudeCompatibility(): Promise<CrudeCompatibility[]> {
  try {
    const { data, error } = await supabase.from('crude_compatibility').select('*').order('compatibility_score', { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_COMPATIBILITY;
    return data as CrudeCompatibility[];
  } catch {
    return FALLBACK_COMPATIBILITY;
  }
}

export async function getContracts(): Promise<Contract[]> {
  try {
    const { data, error } = await supabase.from('contracts').select('*').order('remaining_days', { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_CONTRACTS;
    return data as Contract[];
  } catch {
    return FALLBACK_CONTRACTS;
  }
}

export async function createPurchaseOrder(po: Partial<PurchaseOrder>, userId: string): Promise<void> {
  const newPO: PurchaseOrder = {
    id: isUUID(po.id || '') ? po.id! : `po-${Date.now()}`,
    po_number: po.po_number || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    supplier: po.supplier || 'ADNOC Logistics',
    quantity: po.quantity || 1500000,
    destination_refinery: po.destination_refinery || 'IOCL Paradip',
    expected_delivery: po.expected_delivery || new Date().toISOString(),
    status: 'Pending',
    created_by: userId,
    created_at: new Date().toISOString()
  };

  FALLBACK_POS = [newPO, ...FALLBACK_POS];

  try {
    await supabase.from('purchase_orders').insert({ ...po, created_by: userId, status: 'Pending' });
    await createNotification('procurement', 'Purchase Order Created', `PO ${newPO.po_number} has been created and is pending approval.`);
  } catch (err) {
    console.warn('Fallback PO creation:', err);
  }
}

export async function approvePurchaseOrder(id: string): Promise<void> {
  const target = FALLBACK_POS.find(p => p.id === id);
  if (target) {
    target.status = 'Approved';
  }

  if (isUUID(id)) {
    try {
      const { data } = await supabase.from('purchase_orders').update({ status: 'Approved' }).eq('id', id).select().single();
      if (data) {
        await createNotification('procurement', 'Purchase Order Approved', `PO ${data.po_number} has been approved.`);
        try { await addInventory(data.destination_refinery, data.quantity); } catch (invErr) { console.warn('Inventory sync error:', invErr); }
      }
    } catch (err) {
      console.warn('Fallback approve PO:', err);
    }
  }
}

export async function trackShipment(id: string): Promise<void> {
  const target = FALLBACK_POS.find(p => p.id === id);
  if (target) {
    target.status = 'Tracked';
  }

  if (isUUID(id)) {
    try {
      const { data } = await supabase.from('purchase_orders').update({ status: 'Tracked' }).eq('id', id).select().single();
      if (data) {
        await createNotification('shipping', 'New Shipment Tracked', `Shipment for PO ${data.po_number} has been forwarded to the Shipping Dashboard.`);
      }
    } catch (err) {
      console.warn('Fallback track shipment:', err);
    }
  }
}
