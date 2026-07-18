import React from 'react';
import { useNotifications } from '@/hooks/useShippingHooks';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationCenter: React.FC = () => {
  const { data: notifications, isLoading } = useNotifications('shipping');

  if (isLoading) {
    return <div className="h-64 border border-brand-border bg-brand-card rounded p-4 animate-pulse" />;
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full flex flex-col">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Bell className="w-5 h-5 text-brand-teal" />
        Logistics Notifications
      </h3>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {!notifications || notifications.length === 0 ? (
          <div className="text-brand-muted text-sm italic">No logistics notifications.</div>
        ) : (
          notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-[#1a2130] border border-brand-border/50 rounded flex gap-3 items-start"
            >
              <div className="mt-1 w-2 h-2 rounded-full bg-brand-teal shadow-[0_0_8px_rgba(0,224,255,0.8)]" />
              <div>
                <div className="text-brand-text font-bold text-sm mb-1">{notif.title}</div>
                <div className="text-brand-muted text-xs leading-relaxed mb-2">{notif.message}</div>
                <div className="text-brand-muted/50 text-[10px] font-mono">
                  {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
