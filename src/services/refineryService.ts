import { supabase } from '@/lib/supabaseClient';
import type {
  RefineryInventory,
  IncomingShipment,
  ProductionPlan,
  MaintenanceSchedule,
  ProductionRisk,
  RefineryCrudeCompatibility
} from '@/types/refinery';

export async function getRefineryInventory(): Promise<RefineryInventory[]> {
  const { data, error } = await supabase
    .from('refinery_inventory')
    .select('*')
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error('Error fetching refinery inventory:', error);
    throw error;
  }
  return data as RefineryInventory[];
}

export async function getIncomingShipments(): Promise<IncomingShipment[]> {
  const { data, error } = await supabase
    .from('incoming_shipments')
    .select('*')
    .order('expected_arrival', { ascending: true });

  if (error) {
    console.error('Error fetching incoming shipments:', error);
    throw error;
  }
  return data as IncomingShipment[];
}

export async function receiveShipment(id: string): Promise<void> {
  const { error } = await supabase
    .from('incoming_shipments')
    .update({ status: 'delivered' })
    .eq('id', id);

  if (error) {
    console.error('Error receiving shipment:', error);
    throw error;
  }
}

export async function getProductionPlans(): Promise<ProductionPlan[]> {
  const { data, error } = await supabase
    .from('production_plan')
    .select('*');

  if (error) {
    console.error('Error fetching production plans:', error);
    throw error;
  }
  return data as ProductionPlan[];
}

export async function updateProductionPlan(id: string, updates: Partial<ProductionPlan>): Promise<void> {
  const { error } = await supabase
    .from('production_plan')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating production plan:', error);
    throw error;
  }
}

export async function getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
  const { data, error } = await supabase
    .from('maintenance_schedule')
    .select('*')
    .order('maintenance_due', { ascending: true });

  if (error) {
    console.error('Error fetching maintenance schedules:', error);
    throw error;
  }
  return data as MaintenanceSchedule[];
}

export async function updateMaintenanceStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('maintenance_schedule')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating maintenance status:', error);
    throw error;
  }
}

export async function getProductionRisks(): Promise<ProductionRisk[]> {
  const { data, error } = await supabase
    .from('production_risk')
    .select('*');

  if (error) {
    console.error('Error fetching production risks:', error);
    throw error;
  }
  return data as ProductionRisk[];
}

export async function getCrudeCompatibility(): Promise<RefineryCrudeCompatibility[]> {
  const { data, error } = await supabase
    .from('crude_compatibility')
    .select('*');

  if (error) {
    console.error('Error fetching crude compatibility:', error);
    throw error;
  }
  return data as RefineryCrudeCompatibility[];
}
