export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type SupplierRiskColor = 'green' | 'yellow' | 'red';
export type AlertStatus = 'open' | 'monitoring' | 'resolved';
export type RecommendationStatus = 'pending' | 'approved' | 'rejected' | 'forwarded';

export interface NationalRiskScore {
  id: string;
  score: number;
  risk_level: RiskLevel;
  recorded_at: string;
}

export interface SupplierCountry {
  id: string;
  name: string;
  risk_level: SupplierRiskColor;
  current_imports: number; // e.g. barrels/day
  active_events: string;
  expected_impact: string;
  coordinates?: [number, number]; // Add for Map rendering
}

export interface AIRiskInsight {
  id: string;
  insight_text: string;
  confidence_score: number;
  data_sources: string[];
  expected_impact: string;
  created_at: string;
}

export interface GovernmentAlert {
  id: string;
  title: string;
  priority: RiskLevel;
  affected_region: string;
  recommended_action: string;
  status: AlertStatus;
  created_at: string;
}

export interface StrategicPetroleumReserve {
  id: string;
  reserve_level: number;
  remaining_days: number;
  consumption_rate: number;
  ai_recommendation: string;
  recorded_at: string;
}

export interface GovernmentRecommendation {
  id: string;
  title: string;
  reason: string;
  priority: RiskLevel;
  confidence: number;
  business_impact: string;
  status: RecommendationStatus;
  approved_by?: string;
  created_at: string;
}
