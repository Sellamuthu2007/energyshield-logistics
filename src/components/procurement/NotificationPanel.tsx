import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  notifications: any[];
  isLoading?: boolean;
}

const getRelativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
};

export const NotificationPanel: React.FC<Props> = ({ notifications, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded border border-brand-border bg-brand-card p-6 animate-pulse h-full">
        <div className="h-4 w-1/2 bg-brand-border/50 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 w-full bg-brand-border/30 rounded"></div>
          <div className="h-16 w-full bg-brand-border/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-brand-border bg-brand-card p-4 shadow-lg shadow-black/20 h-full flex flex-col">
      <h3 className="mb-4 text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <Bell className="w-4 h-4 text-brand-teal" />
        Procurement Notifications
      </h3>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {notifications.map((notif, idx) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3 rounded bg-[#1a2130] border-l-2 border-brand-teal flex flex-col gap-1"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-brand-text">{notif.title}</span>
              <span className="text-[10px] text-brand-muted whitespace-nowrap ml-2">
                {getRelativeTime(notif.created_at)}
              </span>
            </div>
            <p className="text-xs text-brand-muted/80 leading-relaxed">
              {notif.message}
            </p>
          </motion.div>
        ))}
        {notifications.length === 0 && (
          <p className="text-xs text-brand-muted text-center pt-4">No recent notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
