import { useSupabaseQuery } from './useSupabaseQuery';
import { getNotificationsByRole } from '@/services/notificationService';
import type { UserRole } from '@/constants/roles';

export function useNotifications(role: UserRole) {
  return useSupabaseQuery(['notifications', role], () => getNotificationsByRole(role));
}
