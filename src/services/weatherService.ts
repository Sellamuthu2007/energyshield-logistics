import { supabase } from '@/lib/supabaseClient';
import type { WeatherAlert } from '@/types/shipping';

const FALLBACK_WEATHER: WeatherAlert[] = [
  {
    id: 'wtr-1',
    alert_type: 'Bay of Bengal Tropical Depression',
    severity: 'High',
    affected_region: 'East Coast Shipping Lanes',
    expected_delay_hours: 36,
    impact_description: 'Swell height 4.2m near Paradip approach channel.',
    created_at: new Date().toISOString()
  }
];

export async function getWeatherAlerts(): Promise<WeatherAlert[]> {
  try {
    const { data, error } = await supabase
      .from('weather_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_WEATHER;
    return data as WeatherAlert[];
  } catch {
    return FALLBACK_WEATHER;
  }
}
