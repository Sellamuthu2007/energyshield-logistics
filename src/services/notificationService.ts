import { supabase } from '@/lib/supabaseClient';
import type { ShipmentNotification } from '@/types/shipping';

export interface Notification {
  id: string;
  target_role: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

const FALLBACK_NOTIFICATIONS: Record<string, Notification[]> = {
  government: [
    { id: 'notif-gov-1', target_role: 'government', title: 'National Risk Advisory Updated', message: 'Red Sea transit threat level elevated to Yellow.', is_read: false, action_url: '/government', created_at: new Date().toISOString() }
  ],
  procurement: [
    { id: 'notif-proc-1', target_role: 'procurement', title: 'New Government Recommendation Forwarded', message: 'Urgent 2.5M Bbl crude procurement from ADNOC has been forwarded for PO creation.', is_read: false, action_url: '/procurement', created_at: new Date().toISOString() }
  ],
  shipping: [
    { id: 'notif-ship-1', target_role: 'shipping', title: 'Shipment Dispatched', message: 'MT Desh Vishal departed Ras Tanura bound for Paradip Port.', is_read: false, action_url: '/shipping', created_at: new Date().toISOString() }
  ],
  refinery: [
    { id: 'notif-ref-1', target_role: 'refinery', title: 'Incoming Payload Alert', message: '1.8M BBL Arab Light crude expected at Paradip berth on July 28.', is_read: false, action_url: '/refinery', created_at: new Date().toISOString() }
  ],
  executive: [
    { id: 'notif-exec-1', target_role: 'executive', title: 'Q3 Security Index Summary', message: 'National Strategic Oil Cover index verified at 84.5%.', is_read: false, action_url: '/decision', created_at: new Date().toISOString() }
  ]
};

export async function getShipmentNotifications(): Promise<ShipmentNotification[]> {
  try {
    const { data, error } = await supabase.from('shipment_notifications').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return [{ id: 'snotif-1', title: 'System Dispatch Notice', message: 'All active tankers connected to AIS telemetry.', is_read: false, created_at: new Date().toISOString() }];
    }
    return data as ShipmentNotification[];
  } catch {
    return [{ id: 'snotif-1', title: 'System Dispatch Notice', message: 'All active tankers connected to AIS telemetry.', is_read: false, created_at: new Date().toISOString() }];
  }
}

export async function createShipmentNotification(title: string, message: string): Promise<void> {
  try {
    await supabase.from('shipment_notifications').insert({ title, message });
  } catch (err) {
    console.warn('Fallback create shipment notification:', err);
  }
}

export async function getNotificationsByRole(role: string): Promise<Notification[]> {
  try {
    const { data, error } = await supabase.from('notifications').select('*').eq('target_role', role).order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_NOTIFICATIONS[role] || [];
    return data as Notification[];
  } catch {
    return FALLBACK_NOTIFICATIONS[role] || [];
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  } catch (err) {
    console.warn('Fallback mark read:', err);
  }
}

export async function createNotification(target_role: string, title: string, message: string, action_url: string | null = null): Promise<void> {
  try {
    await supabase.from('notifications').insert([{ target_role, title, message, action_url }]);
  } catch (err) {
    console.warn('Fallback create notification:', err);
  }
}
