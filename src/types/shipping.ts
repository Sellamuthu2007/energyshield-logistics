export interface Vessel {
  id: string;
  vessel_name: string;
  latitude: number;
  longitude: number;
  current_speed: number;
  status: 'In Transit' | 'Moored' | 'Anchored' | 'Loading';
  created_at: string;
}

export interface Shipment {
  id: string;
  po_number: string;
  supplier_country: string;
  destination_port: string;
  destination_refinery: string;
  vessel_id: string;
  quantity: number;
  current_eta: string;
  status: 'Preparing' | 'Departed' | 'In Transit' | 'Arriving' | 'Delivered';
  progress_stage: number; // 1: Supplier, 2: Ocean, 3: Port, 4: Refinery
  created_at: string;
  vessel?: Vessel;
}

export interface ShipmentEvent {
  id: string;
  shipment_id: string;
  event_type: string;
  event_description: string;
  created_at: string;
}

export interface Port {
  id: string;
  port_name: string;
  waiting_ships: number;
  available_berths: number;
  average_waiting_time: string;
  congestion_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'green' | 'yellow' | 'red';
  updated_at: string;
}

export interface WeatherAlert {
  id: string;
  alert_type: string;
  affected_area: string;
  expected_delay: string;
  confidence_score: number;
  ai_recommendation: string;
  created_at: string;
}

export interface RouteRecommendation {
  id: string;
  shipment_id: string;
  recommended_route: string;
  time_saved: string;
  fuel_savings: string;
  risk_reduction: string;
  status: 'pending' | 'approved' | 'ignored';
  created_at: string;
}

export interface ShipmentNotification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
