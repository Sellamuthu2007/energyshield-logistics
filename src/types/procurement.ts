export type SupplierStatus = 'green' | 'yellow' | 'red';
export type GeopoliticalRisk = 'green' | 'yellow' | 'red' | 'low' | 'medium' | 'high' | 'critical';
export type PurchaseOrderStatus = 'Pending' | 'Approved' | 'Completed' | 'Delayed' | 'Tracked';
export type CompatibilityStatus = 'Recommended' | 'Not Recommended' | 'Warning';
export type ContractRenewalStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'active' | 'expiring_soon' | 'expired';

export interface ProcurementSupplier {
  id: string;
  supplier_name: string;
  country: string;
  price_per_barrel: number;
  supply_capacity: number;
  delivery_time_days: number;
  geopolitical_risk: GeopoliticalRisk;
  reliability_score: number;
  contract_status: string;
  created_at?: string;
}

export interface SupplierRanking {
  id: string;
  rank: number;
  supplier_name: string;
  score: number;
  reasoning: string;
  confidence: number;
  business_impact: string;
  ranked_at: string;
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
  recommendation: string;
  status?: CompatibilityStatus;
  created_at?: string;
}

export interface Contract {
  id: string;
  supplier_name: string;
  start_date: string;
  end_date: string;
  remaining_days: number;
  renewal_status: ContractRenewalStatus;
  ai_suggestion: string;
  created_at?: string;
}
