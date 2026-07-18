import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Shield,
  ShoppingCart,
  Ship,
  Factory,
  BarChart3,
  LogOut,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  User,
  ShieldCheck
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const { profile, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const activeRole = profile?.role;
  const isAdmin = activeRole === 'admin';

  const menuItems = [
    {
      name: 'Government Dashboard',
      path: '/government',
      icon: Shield,
      allowedRoles: ['government'],
    },
    {
      name: 'Procurement Dashboard',
      path: '/procurement',
      icon: ShoppingCart,
      allowedRoles: ['procurement'],
    },
    {
      name: 'Shipping Dashboard',
      path: '/shipping',
      icon: Ship,
      allowedRoles: ['shipping'],
    },
    {
      name: 'Refinery Dashboard',
      path: '/refinery',
      icon: Factory,
      allowedRoles: ['refinery'],
    },
    {
      name: 'Decision Intelligence',
      path: '/decision',
      icon: BarChart3,
      allowedRoles: ['executive'],
    },
  ];

  // Filter menu items based on user role (Admin gets all)
  const filteredMenuItems = menuItems.filter(
    (item) => isAdmin || (activeRole && item.allowedRoles.includes(activeRole))
  );

  const getPageTitle = () => {
    const activeItem = menuItems.find((item) => item.path === location.pathname);
    return activeItem ? activeItem.name : 'Operations Center';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-brand-dark text-brand-text">
      {/* Sidebar - Desktop */}
      <aside className="hidden border-r border-brand-border bg-[#0b0e14] lg:flex lg:w-64 lg:flex-col">
        {/* Brand header */}
        <div className="flex h-16 items-center border-b border-brand-border px-6">
          <Link to="/" className="flex items-center space-x-2 text-md font-bold tracking-tight text-white">
            <ShieldCheck className="h-5 w-5 text-brand-primary" />
            <span>ENERGY<span className="text-brand-primary">SHIELD</span> AI</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="border-b border-brand-border/40 p-4">
          <div className="flex items-center space-x-3 rounded bg-brand-card p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white font-semibold">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{profile?.full_name}</p>
              <p className="truncate text-[10px] text-brand-muted uppercase font-bold tracking-wider">{profile?.role}</p>
              <p className="truncate text-[10px] text-brand-muted/70 mt-0.5">{profile?.organization}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1 px-4 py-4">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-primary text-white border-l-2 border-brand-primary'
                    : 'text-brand-muted hover:bg-brand-card hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom logout */}
        <div className="border-t border-brand-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded px-3 py-2 text-xs font-medium text-brand-muted hover:bg-brand-card hover:text-brand-red transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="relative z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black"
            />
            
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed bottom-0 top-0 left-0 flex w-64 flex-col bg-[#0b0e14] border-r border-brand-border"
            >
              <div className="flex h-16 items-center justify-between border-b border-brand-border px-6">
                <Link to="/" className="flex items-center space-x-2 text-md font-bold tracking-tight text-white">
                  <ShieldCheck className="h-5 w-5 text-brand-primary" />
                  <span>ENERGYSHIELD AI</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)} className="text-brand-muted hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="border-b border-brand-border/40 p-4">
                <div className="flex items-center space-x-3 rounded bg-brand-card p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white font-semibold">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">{profile?.full_name}</p>
                    <p className="truncate text-[10px] text-brand-muted uppercase font-bold tracking-wider">{profile?.role}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 space-y-1 px-4 py-4">
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3 rounded px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-primary text-white'
                          : 'text-brand-muted hover:bg-brand-card hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-brand-border p-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 rounded px-3 py-2 text-xs font-medium text-brand-muted hover:bg-brand-card hover:text-brand-red transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-brand-border bg-[#0d121c] px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-brand-muted hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded p-2 text-brand-muted hover:bg-brand-card hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Notification Center Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative rounded p-2 text-brand-muted hover:bg-brand-card hover:text-white transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[8px] font-bold text-white ring-2 ring-[#0d121c]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Center Dropdown */}
              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotifOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 z-50 w-80 rounded border border-brand-border bg-brand-card shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-brand-border p-3">
                        <span className="text-xs font-bold text-white">Notifications ({unreadCount})</span>
                        <span className="text-[10px] text-brand-muted uppercase font-bold">Role: {profile?.role}</span>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-brand-muted">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={async () => {
                                await markAsRead(notif.id);
                              }}
                              className={`border-b border-brand-border/40 p-3 hover:bg-[#1a2130] cursor-pointer transition-colors ${
                                !notif.is_read ? 'bg-[#151b26] border-l-2 border-brand-primary' : 'opacity-70'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-brand-text">{notif.title}</span>
                                <span className="text-[9px] text-brand-muted">{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="mt-1 text-[11px] text-brand-muted leading-snug">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User details (desktop) */}
            <div className="hidden border-l border-brand-border pl-4 lg:flex lg:flex-col lg:items-end">
              <span className="text-xs font-semibold text-white">{profile?.full_name}</span>
              <span className="text-[9px] text-brand-muted/80">{profile?.organization}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#090d13]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
