import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-brand-dark text-brand-text">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-brand-border bg-[#0b0e14]/95 py-4 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white">
            <ShieldCheck className="h-6 w-6 text-brand-primary" />
            <span>ENERGY<span className="text-brand-primary">SHIELD</span> AI</span>
          </Link>
          
          <nav className="hidden items-center space-x-8 md:flex">
            <a href="#features" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
              Platform Features
            </a>
            <a href="#architecture" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
              Data Pipeline
            </a>
            <a href="#tech-stack" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
              Security Stack
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="rounded bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-[#090d13] py-8 text-xs text-brand-muted">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 text-brand-teal" />
              <span className="font-semibold text-brand-text">Security Level: Classified (Top Secret)</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green"></span>
                </span>
                <span className="ml-2">System Status: Online</span>
              </span>
              <span>v1.0.0</span>
            </div>
          </div>
          
          <div className="mt-8 border-t border-brand-border/40 pt-6 text-center text-brand-muted/70">
            <p>© {new Date().getFullYear()} EnergyShield AI Platform Engineering. Prepared for National Energy Grid Infrastructure & MoPNG. All rights reserved.</p>
            <p className="mt-1">Authorized personnel access only. Actions on this network are audited in real time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
