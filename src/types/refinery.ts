export type RefineryRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type IncomingShipmentStatus = 'pending' | 'delivered' | 'delayed';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';

export interface RefineryInventory {
  id: string;
  refinery_name: string;
  current_inventory_barrels: number;
  daily_consumption: number;
  min_safety_stock: number;
  remaining_days: number;
  recorded_at: string;
}

export interface IncomingShipment {
  id: string;
  shipment_id: string;
  refinery_name: string;
  expected_arrival: string;
  quantity: number;
  status: IncomingShipmentStatus;
  created_at?: string;
}

export interface ProductionPlan {
  id: string;
  refinery_name: string;
  petrol_pct: number;
  diesel_pct: number;
  atf_pct: number;
  lpg_pct: number;
  lubricants_pct: number;
  ai_recommendation: string;
  reason: string;
}

export interface MaintenanceSchedule {
  id: string;
  refinery_name: string;
  unit_name: string;
  status: MaintenanceStatus;
  maintenance_due: string;
  estimated_downtime_hours: number;
  ai_recommendation: string;
}

export interface ProductionRisk {
  id: string;
  refinery_name: string;
  inventory_remaining_days: number;
  incoming_shipment_days: number;
  risk_level: RefineryRiskLevel;
  business_impact: string;
}

export interface RefineryCrudeCompatibility {
  id: string;
  refinery_name: string;
  crude_type: string;
  compatibility_score: number;
  expected_yield: number;
  recommendation: string;
}
