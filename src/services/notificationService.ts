import { supabase } from '@/lib/supabaseClient';
import type { ShipmentNotification } from '@/types/shipping';

// We overwrite the existing notificationService for shipping specific ones 
// or we add a specialized function.

export async function getShipmentNotifications(): Promise<ShipmentNotification[]> {
  const { data, error } = await supabase
    .from('shipment_notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ShipmentNotification[];
}

export async function createShipmentNotification(title: string, message: string): Promise<void> {
  const { error } = await supabase
    .from('shipment_notifications')
    .insert({ title, message });

  if (error) {
    console.error('Failed to create shipment notification', error);
  }
}
export interface Notification {
  id: string;
  target_role: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

export async function getNotificationsByRole(role: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('target_role', role)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  return data as Notification[];
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking notification as read:', error);
  }
}

export async function createNotification(target_role: string, title: string, message: string, action_url: string | null = null): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .insert([{ target_role, title, message, action_url }]);
    
  if (error) {
    console.error('Error creating notification:', error);
  }
}
