export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type SupplierRiskColor = 'green' | 'yellow' | 'red';
export type AlertStatus = 'open' | 'monitoring' | 'resolved';
export type RecommendationStatus = 'pending' | 'approved' | 'rejected' | 'forwarded' | 'acknowledged' | 'executing' | 'completed';
export type ReadinessLevel = 'normal' | 'elevated' | 'high_alert' | 'emergency';

export interface NationalRiskScore {
  id: string;
  score: number;
  risk_level: RiskLevel;
  previous_score?: number;
  score_change?: number;
  confidence?: number;
  recorded_at: string;
}

export interface RiskScoreHistory {
  id: string;
  score: number;
  risk_level: RiskLevel;
  geopolitical_score: number;
  maritime_score: number;
  supply_score: number;
  weather_score: number;
  disruption_probability: number;
  recorded_at: string;
}

export interface SupplierCountry {
  id: string;
  name: string;
  risk_level: SupplierRiskColor;
  current_imports: number; // e.g. barrels/day
  active_events: string;
  expected_impact: string;
  latitude?: number;
  longitude?: number;
  coordinates?: [number, number]; // Add for Map rendering
  reliability_score?: number;
  sanctions_status?: string;
  last_incident?: string;
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
  readiness_level?: ReadinessLevel;
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

export interface OperationalEvent {
  id: string;
  title: string;
  description: string;
  event_type: 'drawdown' | 'escalation' | 'recommendation' | 'alert' | 'system';
  user_id?: string;
  created_at: string;
}

export interface DataSourceHealth {
  id: string;
  source_name: string;
  status: 'online' | 'degraded' | 'offline';
  latency_ms: number;
  last_sync: string;
  error_message?: string;
}
