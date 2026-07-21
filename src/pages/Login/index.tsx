import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/constants/roles';
import { AlertTriangle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { success, error: loginError } = await login(email, password);
    if (success) {
      // Role should be correctly set from Supabase Profile via the AuthContext
      // But we can extract it from email for quick nav if needed, or rely on AuthContext role
      const role = email.split('@')[0] as UserRole;
      const targetPath = role === 'executive' ? '/decision' : `/${role}`;
      navigate(targetPath, { replace: true });
    } else {
      setError(loginError?.message || 'Invalid credentials or system authentication failure.');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);
    const mockEmail = `${role}@energyshield.ai`;
    const mockPassword = 'admin123';

    const { success, error: loginError } = await login(mockEmail, mockPassword);
    if (success) {
      const targetPath = role === 'executive' ? '/decision' : `/${role}`;
      navigate(targetPath, { replace: true });
    } else {
      setError(loginError?.message || 'Authentication failed.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-bg text-[#dee2f1] min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        {/* Decorative ambient lights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00e0ff]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7000ff]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        
        <main className="w-full max-w-[480px] glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col gap-8">
          {/* Header */}
          <header className="text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-[#252a35] border border-white/10 flex items-center justify-center mb-2 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[#baf2ff]/10"></div>
              <span className="material-symbols-outlined text-[#00daf8] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">EnergyShield AI</h1>
            <p className="text-sm text-[#bac9cd] uppercase tracking-widest">Enterprise Authentication</p>
          </header>

          {error && (
            <div className="flex items-center space-x-2 rounded border border-[#ffb4ab] bg-[#93000a]/10 p-3 text-xs text-[#ffb4ab]">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bac9cd]" htmlFor="email">OPERATIVE ID / EMAIL</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bac9cd] text-[18px]">person</span>
                <input 
                  className="cyber-input w-full h-[48px] rounded-lg pl-10 pr-3 text-base text-[#dee2f1] placeholder:text-[#859397] focus:text-[#00daf8]" 
                  id="email" 
                  placeholder="admin@energyshield.gov" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#bac9cd]" htmlFor="password">ACCESS TOKEN</label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bac9cd] text-[18px]">key</span>
                <input 
                  className="cyber-input w-full h-[48px] rounded-lg pl-10 pr-3 text-base text-[#dee2f1] placeholder:text-[#859397] focus:text-[#00daf8]" 
                  id="password" 
                  placeholder="••••••••••••" 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button 
              className="btn-primary-gradient w-full h-[48px] rounded-lg text-sm font-semibold text-white uppercase tracking-wider mt-2 flex items-center justify-center gap-2 disabled:opacity-50" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Initiate Secure Session'}
              <span className="material-symbols-outlined text-[18px]">login</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 opacity-50">
            <div className="h-px bg-[#3b494c] flex-1"></div>
            <span className="text-xs text-[#bac9cd] uppercase">Select Portal</span>
            <div className="h-px bg-[#3b494c] flex-1"></div>
          </div>

          {/* Portals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button onClick={() => handleQuickLogin('government')} disabled={isLoading} className="portal-card bg-[#1b202a] border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center gap-1 text-center min-h-[80px]">
              <span className="material-symbols-outlined text-[#bac9cd] text-[24px] transition-colors">account_balance</span>
              <span className="text-xs text-[#dee2f1]">Government</span>
            </button>
            <button onClick={() => handleQuickLogin('procurement')} disabled={isLoading} className="portal-card bg-[#1b202a] border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center gap-1 text-center min-h-[80px]">
              <span className="material-symbols-outlined text-[#bac9cd] text-[24px] transition-colors">shopping_cart</span>
              <span className="text-xs text-[#dee2f1]">Procurement</span>
            </button>
            <button onClick={() => handleQuickLogin('shipping')} disabled={isLoading} className="portal-card bg-[#1b202a] border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center gap-1 text-center min-h-[80px]">
              <span className="material-symbols-outlined text-[#bac9cd] text-[24px] transition-colors">directions_boat</span>
              <span className="text-xs text-[#dee2f1]">Shipping</span>
            </button>
            <button onClick={() => handleQuickLogin('refinery')} disabled={isLoading} className="portal-card bg-[#1b202a] border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center gap-1 text-center min-h-[80px]">
              <span className="material-symbols-outlined text-[#bac9cd] text-[24px] transition-colors">factory</span>
              <span className="text-xs text-[#dee2f1]">Refinery</span>
            </button>
            <button onClick={() => handleQuickLogin('executive')} disabled={isLoading} className="portal-card bg-[#1b202a] border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center gap-1 text-center min-h-[80px] col-span-2 md:col-span-2">
              <span className="material-symbols-outlined text-[#bac9cd] text-[24px] transition-colors">admin_panel_settings</span>
              <span className="text-xs text-[#dee2f1]">Executive Overview</span>
            </button>
          </div>

          {/* Footer Info */}
          <footer className="text-center pt-2 border-t border-white/5">
            <p className="text-xs text-[#bac9cd]/60 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Secured by Aegis Protocol v4.2
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default LoginPage;
