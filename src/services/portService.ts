import { supabase } from '@/lib/supabaseClient';
import type { Port } from '@/types/shipping';

export async function getPorts(): Promise<Port[]> {
  const { data, error } = await supabase
    .from('ports')
    .select('*')
    .order('port_name', { ascending: true });

  if (error) throw error;
  return data as Port[];
}
