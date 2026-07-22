import { supabase } from '@/lib/supabaseClient';
import type {
  RefineryInventory,
  IncomingShipment,
  ProductionPlan,
  MaintenanceSchedule,
  ProductionRisk,
  RefineryCrudeCompatibility
} from '@/types/refinery';

const FALLBACK_INVENTORY: RefineryInventory[] = [
  { id: 'ref-1', refinery_name: 'IOCL Paradip', current_inventory_barrels: 2800000, daily_consumption: 300000, min_safety_stock: 1200000, remaining_days: 9.3, recorded_at: new Date().toISOString() },
  { id: 'ref-2', refinery_name: 'RIL Jamnagar', current_inventory_barrels: 7500000, daily_consumption: 650000, min_safety_stock: 2500000, remaining_days: 11.5, recorded_at: new Date().toISOString() },
  { id: 'ref-3', refinery_name: 'HPCL Vizag', current_inventory_barrels: 1900000, daily_consumption: 180000, min_safety_stock: 800000, remaining_days: 10.5, recorded_at: new Date().toISOString() },
  { id: 'ref-4', refinery_name: 'BPCL Mumbai', current_inventory_barrels: 1600000, daily_consumption: 240000, min_safety_stock: 900000, remaining_days: 6.6, recorded_at: new Date().toISOString() },
  { id: 'ref-5', refinery_name: 'Nayara Vadinar', current_inventory_barrels: 3800000, daily_consumption: 400000, min_safety_stock: 1500000, remaining_days: 9.5, recorded_at: new Date().toISOString() }
];

const FALLBACK_INCOMING: IncomingShipment[] = [
  { id: 'inc-1', shipment_id: 'ship-1', refinery_name: 'IOCL Paradip', expected_arrival: '2026-07-28T14:00:00Z', quantity: 1800000, status: 'pending', created_at: new Date().toISOString() },
  { id: 'inc-2', shipment_id: 'ship-2', refinery_name: 'RIL Jamnagar', expected_arrival: '2026-07-24T08:00:00Z', quantity: 1200000, status: 'pending', created_at: new Date().toISOString() }
];

const FALLBACK_PLANS: ProductionPlan[] = [
  { id: 'plan-1', refinery_name: 'IOCL Paradip', petrol_pct: 32, diesel_pct: 46, atf_pct: 12, lpg_pct: 7, lubricants_pct: 3, ai_recommendation: 'Increase Diesel yield by +3% to meet monsoon agricultural demand spike.', reason: 'Regional demand forecast analysis' }
];

const FALLBACK_MAINTENANCE: MaintenanceSchedule[] = [
  { id: 'maint-1', refinery_name: 'IOCL Paradip', unit_name: 'Crude Distillation Unit 2 (CDU-2)', status: 'scheduled', maintenance_due: '2026-08-15', estimated_downtime_hours: 72, ai_recommendation: 'Postpone overhaul by 10 days until MT Desh Vishal crude payload unloads.' }
];

const FALLBACK_RISKS: ProductionRisk[] = [
  { id: 'risk-1', refinery_name: 'BPCL Mumbai', inventory_remaining_days: 6.6, incoming_shipment_days: 4.0, risk_level: 'medium', business_impact: 'Stock level approaching minimum safety threshold of 900k bbls.' }
];

const FALLBACK_COMPATIBILITY: RefineryCrudeCompatibility[] = [
  { id: 'rcomp-1', refinery_name: 'IOCL Paradip', crude_type: 'Arab Light', compatibility_score: 96, expected_yield: 88.5, recommendation: 'Optimal processing efficiency' }
];

export async function getRefineryInventory(): Promise<RefineryInventory[]> {
  try {
    const { data, error } = await supabase.from('refinery_inventory').select('*').order('recorded_at', { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_INVENTORY;
    return data as RefineryInventory[];
  } catch {
    return FALLBACK_INVENTORY;
  }
}

export async function getIncomingShipments(): Promise<IncomingShipment[]> {
  try {
    const { data, error } = await supabase.from('incoming_shipments').select('*').order('expected_arrival', { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_INCOMING;
    return data as IncomingShipment[];
  } catch {
    return FALLBACK_INCOMING;
  }
}

export async function receiveShipment(id: string): Promise<void> {
  try {
    await supabase.from('incoming_shipments').update({ status: 'delivered' }).eq('id', id);
  } catch (err) {
    console.warn('Fallback receive shipment:', err);
  }
}

export async function getProductionPlans(): Promise<ProductionPlan[]> {
  try {
    const { data, error } = await supabase.from('production_plan').select('*');
    if (error || !data || data.length === 0) return FALLBACK_PLANS;
    return data as ProductionPlan[];
  } catch {
    return FALLBACK_PLANS;
  }
}

export async function updateProductionPlan(id: string, updates: Partial<ProductionPlan>): Promise<void> {
  try {
    await supabase.from('production_plan').update(updates).eq('id', id);
  } catch (err) {
    console.warn('Fallback update plan:', err);
  }
}

export async function getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
  try {
    const { data, error } = await supabase.from('maintenance_schedule').select('*').order('maintenance_due', { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK_MAINTENANCE;
    return data as MaintenanceSchedule[];
  } catch {
    return FALLBACK_MAINTENANCE;
  }
}

export async function updateMaintenanceStatus(id: string, status: string): Promise<void> {
  try {
    await supabase.from('maintenance_schedule').update({ status }).eq('id', id);
  } catch (err) {
    console.warn('Fallback update maintenance:', err);
  }
}

export async function getProductionRisks(): Promise<ProductionRisk[]> {
  try {
    const { data, error } = await supabase.from('production_risk').select('*');
    if (error || !data || data.length === 0) return FALLBACK_RISKS;
    return data as ProductionRisk[];
  } catch {
    return FALLBACK_RISKS;
  }
}

export async function getCrudeCompatibility(): Promise<RefineryCrudeCompatibility[]> {
  try {
    const { data, error } = await supabase.from('crude_compatibility').select('*');
    if (error || !data || data.length === 0) return FALLBACK_COMPATIBILITY;
    return data as RefineryCrudeCompatibility[];
  } catch {
    return FALLBACK_COMPATIBILITY;
  }
}
