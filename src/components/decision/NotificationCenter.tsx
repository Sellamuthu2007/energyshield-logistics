import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { markNotificationAsRead } from '@/services/notificationService';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { role } = useAuth();
  const { data: notifications, isLoading } = useNotifications(role || 'executive');
  const queryClient = useQueryClient();

  const execNotifs = (notifications || []).filter(n => !n.is_read);

  if (isLoading) {
    return <div className="h-48 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Bell className="w-5 h-5 text-brand-teal" />
        Executive Notifications
        {execNotifs.length > 0 && (
          <span className="text-[10px] bg-brand-red text-white px-1.5 py-0.5 rounded-full">{execNotifs.length}</span>
        )}
      </h3>

      {execNotifs.length === 0 ? (
        <div className="text-brand-muted text-sm italic">No executive notifications.</div>
      ) : (
        <div className="space-y-2">
          {execNotifs.slice(0, 10).map((n, idx) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => handleMarkRead(n.id)}
              className="p-3 bg-[#151b26] border-l-2 border-brand-yellow rounded cursor-pointer hover:bg-[#1a2130] transition-colors"
            >
              <div className="text-xs font-bold text-white">{n.title}</div>
              <p className="text-[10px] text-brand-muted mt-1">{n.message}</p>
              <div className="text-[9px] text-brand-muted/60 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
