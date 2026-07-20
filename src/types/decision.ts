export type StrategicStatus = 'pending' | 'approved' | 'archived';

export interface ExecutiveKPI {
  id: string;
  energy_security_score: number;
  national_risk_level: string;
  supply_chain_health: number;
  avg_delivery_performance: number;
  refinery_utilization: number;
  economic_impact: number;
  recorded_at: string;
}

export interface DashboardHealth {
  id: string;
  dashboard_name: string;
  status: string;
  health_score: number;
  pending_actions: number;
  critical_issues: number;
}

export interface ExecutiveInsight {
  id: string;
  insight_text: string;
  confidence_score: number;
  business_impact: string;
  affected_department: string;
  created_at: string;
}

export interface EconomicImpact {
  id: string;
  estimated_loss: number;
  logistics_cost_increase: number;
  import_cost_increase: number;
  fuel_price_impact: number;
  inventory_holding_cost: number;
  projected_savings: number;
}

export interface ScenarioSimulation {
  id: string;
  scenario_name: string;
  duration_days: number;
  estimated_shortage: number;
  expected_price_increase: number;
  affected_refineries: string[];
  expected_loss: number;
  recommended_actions: string;
  run_at: string;
}

export interface StrategicRecommendation {
  id: string;
  title: string;
  priority: string;
  confidence: number;
  estimated_cost: number;
  estimated_benefit: number;
  long_term_impact: string;
  status: StrategicStatus;
  created_at: string;
}
