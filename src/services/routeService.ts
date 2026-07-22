import { supabase } from '@/lib/supabaseClient';
import type { RouteRecommendation } from '@/types/shipping';
import { createShipmentNotification } from './notificationService';

const FALLBACK_ROUTES: RouteRecommendation[] = [
  {
    id: 'route-1',
    vessel_name: 'MT Desh Vishal',
    origin: 'Ras Tanura (Saudi Arabia)',
    destination: 'Paradip Port',
    original_days: 9.5,
    optimized_days: 7.8,
    fuel_savings_usd: 48000,
    risk_avoidance_score: 94,
    recommended_route_description: 'Bypass Nine Degree Channel via South Sri Lanka deep-water corridor.',
    status: 'pending',
    created_at: new Date().toISOString()
  }
];

export async function getRouteRecommendations(): Promise<RouteRecommendation[]> {
  try {
    const { data, error } = await supabase
      .from('route_recommendations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_ROUTES;
    return data as RouteRecommendation[];
  } catch {
    return FALLBACK_ROUTES;
  }
}

export async function approveRouteRecommendation(id: string): Promise<void> {
  try {
    await supabase.from('route_recommendations').update({ status: 'approved' }).eq('id', id);
    await createShipmentNotification('Route Optimized', 'AI Recommended route has been approved and transmitted to the vessel.');
  } catch (err) {
    console.warn('Fallback approve route:', err);
  }
}
