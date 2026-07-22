import { supabase } from '@/lib/supabaseClient';
import type {
  NationalRiskScore,
  SupplierCountry,
  AIRiskInsight,
  GovernmentAlert,
  StrategicPetroleumReserve,
  GovernmentRecommendation,
  OperationalEvent,
  DataSourceHealth,
  ReadinessLevel
} from '@/types/government';
import { createNotification } from './notificationService';

// Helper to validate UUID strings
const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

// Fallback mock datasets if Supabase table is empty or unseeded
const FALLBACK_RISK_SCORE: NationalRiskScore = {
  id: 'risk-1',
  score: 68,
  risk_level: 'medium',
  previous_score: 64,
  score_change: 4.2,
  confidence: 92,
  recorded_at: new Date().toISOString()
};

const FALLBACK_SUPPLIERS: SupplierCountry[] = [
  { id: 'sup-1', name: 'Saudi Arabia', risk_level: 'green', current_imports: 850000, active_events: 'Normal Crude Tanker Flows', expected_impact: 'Stable supply corridor', latitude: 23.8859, longitude: 45.0792, coordinates: [23.8859, 45.0792], reliability_score: 96, sanctions_status: 'Compliant', last_incident: 'None (Clear)' },
  { id: 'sup-2', name: 'Russia', risk_level: 'yellow', current_imports: 1100000, active_events: 'Sanctions Review & Shadow Fleet Routing', expected_impact: '+2 days shipping delay', latitude: 61.524, longitude: 105.3188, coordinates: [61.524, 105.3188], reliability_score: 88, sanctions_status: 'Under Review', last_incident: 'EU Cap Compliance Check' },
  { id: 'sup-3', name: 'Iraq', risk_level: 'yellow', current_imports: 720000, active_events: 'Basra Terminal Maintenance', expected_impact: 'Minor loading delay', latitude: 33.2232, longitude: 43.6793, coordinates: [33.2232, 43.6793], reliability_score: 85, sanctions_status: 'Compliant', last_incident: 'Pump Station Maintenance' },
  { id: 'sup-4', name: 'UAE', risk_level: 'green', current_imports: 450000, active_events: 'Fujairah Storage Expansion', expected_impact: 'Increased emergency stock access', latitude: 23.4241, longitude: 53.8478, coordinates: [23.4241, 53.8478], reliability_score: 98, sanctions_status: 'Compliant', last_incident: 'None (Clear)' }
];

const FALLBACK_INSIGHTS: AIRiskInsight[] = [
  { id: 'ins-1', insight_text: 'Suez Canal maritime congestion index increased by 14%. Diverting 2 VLCC tankers via Cape of Good Hope recommended to avoid $45k/day demurrage.', confidence_score: 92, data_sources: ['AIS Marine Telemetry', 'Satellite SAR', 'Open-Meteo Weather'], expected_impact: 'Cost avoidance of $340,000', created_at: new Date().toISOString() },
  { id: 'ins-2', insight_text: 'Urals crude discount narrowing to $4.50/bbl. Shift 15% procurement allocation to Murban crude for IOCL Paradip refinery.', confidence_score: 87, data_sources: ['Platts Pricing Index', 'Refinery Assay Database'], expected_impact: 'Optimal yield preservation', created_at: new Date(Date.now() - 3600000 * 4).toISOString() }
];

const FALLBACK_ALERTS: GovernmentAlert[] = [
  { id: 'alt-1', title: 'Strait of Hormuz Naval Security Advisory', priority: 'high', affected_region: 'Middle East / Persian Gulf', recommended_action: 'Deploy IN Escort for Indian flagged crude carriers', status: 'open', created_at: new Date().toISOString() },
  { id: 'alt-2', title: 'Bay of Bengal Cyclonic Storm Alert', priority: 'medium', affected_region: 'Paradip & Vizag Ports', recommended_action: 'Delay berthing by 36 hours for incoming tankers', status: 'monitoring', created_at: new Date(Date.now() - 3600000 * 8).toISOString() }
];

let FALLBACK_SPR: StrategicPetroleumReserve = {
  id: 'spr-1',
  reserve_level: 39.5,
  remaining_days: 9.5,
  consumption_rate: 4.15,
  readiness_level: 'normal',
  ai_recommendation: 'Maintain current draw rate of 0.2M bbl/day. Release extra 1.5M bbls if Red Sea disruption persists past Day 14.',
  recorded_at: new Date().toISOString()
};

let FALLBACK_RECOMMENDATIONS: GovernmentRecommendation[] = [
  { id: 'rec-1', title: 'Authorize 2.5M Bbl Urgent Procurement from ADNOC', reason: 'Offset projected 5-day arrival lag from Black Sea ports', priority: 'high', confidence: 91, business_impact: 'Prevents Paradip CDU 2 shutdown', status: 'pending', created_at: new Date().toISOString() },
  { id: 'rec-2', title: 'Expand Strategic Reserves Drawdown by 500k Bbls', reason: 'Stabilize domestic fuel pricing during Middle East transit risk spike', priority: 'medium', confidence: 85, business_impact: 'Maintains domestic retail price buffer', status: 'approved', created_at: new Date(Date.now() - 3600000 * 12).toISOString() }
];

let FALLBACK_EVENTS: OperationalEvent[] = [
  { id: 'evt-1', title: 'SPR Emergency Drawdown Authorized', description: 'Drawdown release of 0.8M Bbls/day authorized for Paradip reserve.', event_type: 'drawdown', created_at: new Date().toISOString() },
  { id: 'evt-2', title: 'National Security Alert Issued', description: 'Strait of Hormuz transit threat level set to High Advisory.', event_type: 'alert', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'evt-3', title: 'Directive Forwarded to Procurement Desk', description: 'Urgent 2.5M Bbl ADNOC crude procurement approved by MoPNG.', event_type: 'recommendation', created_at: new Date(Date.now() - 3600000 * 5).toISOString() }
];

const FALLBACK_HEALTH: DataSourceHealth[] = [
  { id: 'dh-1', source_name: 'Open-Meteo Weather API', status: 'online', latency_ms: 185, last_sync: new Date().toISOString() },
  { id: 'dh-2', source_name: 'AIS Marine Telemetry', status: 'online', latency_ms: 240, last_sync: new Date().toISOString() },
  { id: 'dh-3', source_name: 'Gemini AI Risk Engine', status: 'online', latency_ms: 310, last_sync: new Date().toISOString() },
  { id: 'dh-4', source_name: 'Supabase DB Realtime', status: 'online', latency_ms: 95, last_sync: new Date().toISOString() }
];

export async function fetchLiveOpenMeteoWeather(): Promise<{ temp: number; windSpeed: number; precipitation: number }> {
  try {
    const url = `${import.meta.env.VITE_OPEN_METEO_API_URL || 'https://api.open-meteo.com/v1/forecast'}?latitude=20.27&longitude=86.67&current=temperature_2m,precipitation,wind_speed_10m`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.current) {
      return {
        temp: data.current.temperature_2m || 31.2,
        windSpeed: data.current.wind_speed_10m || 14.5,
        precipitation: data.current.precipitation || 0.0,
      };
    }
    return { temp: 31.2, windSpeed: 14.5, precipitation: 0.0 };
  } catch {
    return { temp: 31.2, windSpeed: 14.5, precipitation: 0.0 };
  }
}

export async function getNationalRiskScore(): Promise<NationalRiskScore> {
  try {
    const { data, error } = await supabase
      .from('national_risk_score')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return FALLBACK_RISK_SCORE;
    return data as NationalRiskScore;
  } catch {
    return FALLBACK_RISK_SCORE;
  }
}

export async function getSupplierCountries(): Promise<SupplierCountry[]> {
  try {
    const { data, error } = await supabase
      .from('supplier_countries')
      .select('*');

    if (error || !data || data.length === 0) return FALLBACK_SUPPLIERS;
    
    return data.map((country: any) => ({
      ...country,
      coordinates: country.latitude && country.longitude ? [country.latitude, country.longitude] : [20, 0]
    })) as SupplierCountry[];
  } catch {
    return FALLBACK_SUPPLIERS;
  }
}

export async function getAIRiskInsights(): Promise<AIRiskInsight[]> {
  try {
    const { data, error } = await supabase
      .from('ai_risk_insights')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_INSIGHTS;
    return data as AIRiskInsight[];
  } catch {
    return FALLBACK_INSIGHTS;
  }
}

export async function getGovernmentAlerts(): Promise<GovernmentAlert[]> {
  try {
    const { data, error } = await supabase
      .from('government_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_ALERTS;
    return data as GovernmentAlert[];
  } catch {
    return FALLBACK_ALERTS;
  }
}

export async function getStrategicPetroleumReserve(): Promise<StrategicPetroleumReserve> {
  try {
    const { data, error } = await supabase
      .from('strategic_petroleum_reserve')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return FALLBACK_SPR;
    return data as StrategicPetroleumReserve;
  } catch {
    return FALLBACK_SPR;
  }
}

export async function getGovernmentRecommendations(): Promise<GovernmentRecommendation[]> {
  try {
    const { data, error } = await supabase
      .from('government_recommendations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return [...FALLBACK_RECOMMENDATIONS];
    return data as GovernmentRecommendation[];
  } catch {
    return [...FALLBACK_RECOMMENDATIONS];
  }
}

export async function getOperationalEvents(): Promise<OperationalEvent[]> {
  try {
    const { data, error } = await supabase
      .from('operational_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_EVENTS;
    return data as OperationalEvent[];
  } catch {
    return FALLBACK_EVENTS;
  }
}

export async function getDataSourceHealth(): Promise<DataSourceHealth[]> {
  try {
    const { data, error } = await supabase
      .from('data_source_health')
      .select('*');

    if (error || !data || data.length === 0) return FALLBACK_HEALTH;
    return data as DataSourceHealth[];
  } catch {
    return FALLBACK_HEALTH;
  }
}

export async function logOperationalEvent(title: string, description: string, event_type: OperationalEvent['event_type'], user_id?: string): Promise<void> {
  const newEvt: OperationalEvent = {
    id: `evt-${Date.now()}`,
    title,
    description,
    event_type,
    user_id,
    created_at: new Date().toISOString(),
  };
  FALLBACK_EVENTS = [newEvt, ...FALLBACK_EVENTS];

  try {
    await supabase.from('operational_events').insert([{ title, description, event_type, user_id }]);
  } catch (err) {
    console.warn('Fallback event logging:', err);
  }
}

export async function authorizeDrawdown(drawdownRate: number, reason: string, userId: string): Promise<void> {
  FALLBACK_SPR = {
    ...FALLBACK_SPR,
    consumption_rate: FALLBACK_SPR.consumption_rate + drawdownRate,
    remaining_days: parseFloat((FALLBACK_SPR.reserve_level / (FALLBACK_SPR.consumption_rate + drawdownRate)).toFixed(1)),
    recorded_at: new Date().toISOString()
  };

  await logOperationalEvent(
    'SPR Emergency Drawdown Authorized',
    `Authorized release rate of ${drawdownRate.toFixed(1)}M Bbls/day. Reason: ${reason}`,
    'drawdown',
    userId
  );
}

export async function escalateReadiness(newLevel: ReadinessLevel, userId: string): Promise<void> {
  FALLBACK_SPR = {
    ...FALLBACK_SPR,
    readiness_level: newLevel,
    recorded_at: new Date().toISOString()
  };

  await logOperationalEvent(
    'National Readiness Level Escalated',
    `Escalated national readiness level to "${newLevel.toUpperCase()}". Mandatory monitoring enabled.`,
    'escalation',
    userId
  );
}

export async function approveAndForwardRecommendation(id: string, userId: string): Promise<void> {
  const target = FALLBACK_RECOMMENDATIONS.find(r => r.id === id);
  if (target) {
    target.status = 'forwarded';
    target.approved_by = userId;
  }

  await logOperationalEvent(
    'Government Policy Proposal Approved',
    `Directive for "${target?.title || 'Urgent Procurement'}" approved and forwarded to Procurement Desk.`,
    'recommendation',
    userId
  );

  if (isUUID(id)) {
    try {
      const { error, data } = await supabase
        .from('government_recommendations')
        .update({ status: 'forwarded', approved_by: userId })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        await createNotification(
          'procurement',
          'New Government Recommendation Forwarded',
          `A recommendation for "${data.title}" has been approved by the Government and forwarded to Procurement.`
        );
        return;
      }
    } catch (err) {
      console.warn('DB update fallback for recommendation approval:', err);
    }
  }

  await createNotification(
    'procurement',
    'New Government Recommendation Forwarded',
    `A recommendation for "${target?.title || 'Urgent Crude Procurement'}" has been approved by the Government and forwarded to Procurement.`
  );
}

export async function createRecommendationFromInsight(insightId: string, title: string, reason: string, impact: string, userId: string): Promise<void> {
  const newRec: GovernmentRecommendation = {
    id: `rec-${Date.now()}`,
    title,
    reason,
    priority: 'high',
    confidence: 90,
    business_impact: impact,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  FALLBACK_RECOMMENDATIONS = [newRec, ...FALLBACK_RECOMMENDATIONS];

  await logOperationalEvent(
    'New Policy Recommendation Drafted',
    `Created policy recommendation "${title}" from AI risk insight.`,
    'system',
    userId
  );
}
