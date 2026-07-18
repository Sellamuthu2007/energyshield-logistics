import { supabase } from '@/lib/supabaseClient';
import type { WeatherAlert } from '@/types/shipping';

export async function getWeatherAlerts(): Promise<WeatherAlert[]> {
  const { data, error } = await supabase
    .from('weather_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as WeatherAlert[];
}
