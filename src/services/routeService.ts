import { supabase } from '@/lib/supabaseClient';
import type { RouteRecommendation } from '@/types/shipping';
import { createShipmentNotification } from './notificationService';

export async function getRouteRecommendations(): Promise<RouteRecommendation[]> {
  const { data, error } = await supabase
    .from('route_recommendations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as RouteRecommendation[];
}

export async function approveRouteRecommendation(id: string): Promise<void> {
  const { error } = await supabase
    .from('route_recommendations')
    .update({ status: 'approved' })
    .eq('id', id);

  if (error) throw error;

  await createShipmentNotification(
    'Route Optimized',
    'AI Recommended route has been approved and transmitted to the vessel.'
  );
}
