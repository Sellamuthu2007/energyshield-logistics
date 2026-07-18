import { supabase } from '@/lib/supabaseClient';

export interface SystemAnalytics {
  id: string;
  metric_name: string;
  metric_value: number;
  category: string;
  last_updated: string;
}

export async function getSystemAnalytics(): Promise<SystemAnalytics[]> {
  const { data, error } = await supabase
    .from('system_analytics')
    .select('*');

  if (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
  return data as SystemAnalytics[];
}
