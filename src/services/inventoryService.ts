import { supabase } from '@/lib/supabaseClient';

export interface RefineryInventory {
  id: string;
  refinery_name: string;
  crude_type: string;
  current_stock: number;
  capacity: number;
  last_replenished: string;
}

export async function getRefineryInventory(): Promise<RefineryInventory[]> {
  const { data, error } = await supabase
    .from('refinery_inventory')
    .select('*');

  if (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
  return data as RefineryInventory[];
}

export async function addInventory(refineryName: string, quantity: number): Promise<void> {
  // First, get the current stock to add to it.
  const { data: currentData, error: fetchError } = await supabase
    .from('refinery_inventory')
    .select('current_stock, capacity')
    .eq('refinery_name', refineryName)
    .single();

  if (fetchError || !currentData) {
    console.error('Error fetching current inventory for update:', fetchError);
    throw fetchError || new Error('Inventory not found');
  }

  const newStock = Math.min(currentData.current_stock + quantity, currentData.capacity);

  const { error: updateError } = await supabase
    .from('refinery_inventory')
    .update({ 
      current_stock: newStock,
      last_replenished: new Date().toISOString()
    })
    .eq('refinery_name', refineryName);

  if (updateError) {
    console.error('Error updating inventory stock:', updateError);
    throw updateError;
  }
}
