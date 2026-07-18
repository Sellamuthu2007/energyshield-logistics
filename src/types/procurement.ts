export type SupplierStatus = 'green' | 'yellow' | 'red';
export type GeopoliticalRisk = 'low' | 'medium' | 'high' | 'critical';
export type PurchaseOrderStatus = 'Pending' | 'Approved' | 'Completed' | 'Delayed' | 'Tracked';
export type CompatibilityStatus = 'Recommended' | 'Not Recommended' | 'Warning';
export type ContractRenewalStatus = 'active' | 'expiring_soon' | 'expired';

export interface ProcurementSupplier {
  id: string;
  country: string;
  current_price: number;
  supply_capacity: number;
  delivery_time: number;
  geopolitical_risk: GeopoliticalRisk;
  reliability_score: number;
  contract_status: string;
  supplier_status: SupplierStatus;
  created_at: string;
}

export interface SupplierRanking {
  id: string;
  rank: number;
  country: string;
  reason: string;
  confidence_score: number;
  business_impact: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier: string;
  quantity: number;
  expected_delivery: string;
  destination_refinery: string;
  status: PurchaseOrderStatus;
  created_by?: string;
  created_at: string;
}

export interface CrudeCompatibility {
  id: string;
  refinery_name: string;
  crude_type: string;
  compatibility_score: number;
  expected_yield: number;
  status: CompatibilityStatus;
  created_at: string;
}

export interface Contract {
  id: string;
  supplier_name: string;
  contract_start: string;
  contract_end: string;
  remaining_days: number;
  renewal_status: ContractRenewalStatus;
  ai_suggestion: string;
  created_at: string;
}
