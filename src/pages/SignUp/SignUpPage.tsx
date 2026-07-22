import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/constants/roles';
import { AlertTriangle, UserPlus, ArrowLeft } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('government');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { success, error: signUpError } = await signup(
      email,
      password,
      fullName,
      organization,
      role
    );

    if (success) {
      const targetPath = role === 'executive' ? '/decision' : `/${role}`;
      navigate(targetPath, { replace: true });
    } else {
      setError(signUpError?.message || 'Failed to provision operative account.');
      setIsLoading(false);
    }
  };

  const roleOptions: { value: UserRole; label: string; org: string }[] = [
    { value: 'government', label: 'Government Security Officer (MoPNG)', org: 'Ministry of Petroleum & Natural Gas' },
    { value: 'procurement', label: 'Procurement Officer (IOCL / BPCL / HPCL)', org: 'Indian Oil Corporation' },
    { value: 'shipping', label: 'Logistics & Maritime Manager', org: 'National Port Authority' },
    { value: 'refinery', label: 'Refinery Operations Head', org: 'Paradip Refinery Complex' },
    { value: 'executive', label: 'Executive Leadership / CEO Desk', org: 'Executive Directorate' },
  ];

  return (
    <>
      <style>{`
        .glass-panel {
            background-color: rgba(18, 23, 33, 0.85);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .glass-panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(0, 224, 255, 0.3), transparent);
            z-index: 10;
        }

        .cyber-input {
            background-color: #0B101A;
            border: 1px solid #2A3341;
            transition: all 0.2s ease-in-out;
        }

        .cyber-input:focus {
            border-color: #00e0ff;
            box-shadow: 0 0 15px rgba(0, 224, 255, 0.15);
            outline: none;
        }

        .btn-primary-gradient {
            background: linear-gradient(135deg, #00e0ff 0%, #7000ff 100%);
            position: relative;
            overflow: hidden;
            transition: transform 0.1s ease, box-shadow 0.2s ease;
        }

        .btn-primary-gradient:hover {
            box-shadow: 0 0 20px rgba(0, 224, 255, 0.3);
        }

        .btn-primary-gradient:active {
            transform: scale(0.98);
        }

        .auth-bg {
            background-color: #0e131d;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            background-position: center center;
        }
      `}</style>
      
      <div className="auth-bg text-[#dee2f1] min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        {/* Decorative ambient lights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00e0ff]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7000ff]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        
        <main className="w-full max-w-[520px] glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col gap-6 text-left">
          {/* Header */}
          <header className="text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-[#252a35] border border-white/10 flex items-center justify-center mb-1 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[#baf2ff]/10"></div>
              <UserPlus className="text-[#00daf8] h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Create Operative Account</h1>
            <p className="text-xs text-[#bac9cd] uppercase tracking-widest">EnergyShield Security Registration</p>
          </header>

          {error && (
            <div className="flex items-center space-x-2 rounded border border-[#ffb4ab] bg-[#93000a]/10 p-3 text-xs text-[#ffb4ab]">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bac9cd]" htmlFor="fullName">FULL NAME</label>
              <input 
                className="cyber-input w-full h-[44px] rounded-lg px-3 text-sm text-[#dee2f1] placeholder:text-[#859397]" 
                id="fullName" 
                placeholder="Officer Vikram Sharma" 
                required 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bac9cd]" htmlFor="email">OFFICIAL EMAIL</label>
              <input 
                className="cyber-input w-full h-[44px] rounded-lg px-3 text-sm text-[#dee2f1] placeholder:text-[#859397]" 
                id="email" 
                placeholder="v.sharma@energyshield.gov" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bac9cd]" htmlFor="role">OPERATIONAL ROLE</label>
              <select
                id="role"
                className="cyber-input w-full h-[44px] rounded-lg px-3 text-sm text-[#dee2f1] bg-[#0B101A]"
                value={role}
                onChange={(e) => {
                  const selectedRole = e.target.value as UserRole;
                  setRole(selectedRole);
                  const matched = roleOptions.find(r => r.value === selectedRole);
                  if (matched) setOrganization(matched.org);
                }}
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0B101A] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bac9cd]" htmlFor="organization">ORGANIZATION / DEPT</label>
              <input 
                className="cyber-input w-full h-[44px] rounded-lg px-3 text-sm text-[#dee2f1] placeholder:text-[#859397]" 
                id="organization" 
                placeholder="Ministry of Petroleum & Natural Gas" 
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bac9cd]" htmlFor="password">ACCESS TOKEN / PASSWORD</label>
              <input 
                className="cyber-input w-full h-[44px] rounded-lg px-3 text-sm text-[#dee2f1] placeholder:text-[#859397]" 
                id="password" 
                placeholder="••••••••••••" 
                required 
                minLength={6}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              className="btn-primary-gradient w-full h-[48px] rounded-lg text-sm font-semibold text-white uppercase tracking-wider mt-3 flex items-center justify-center gap-2 disabled:opacity-50" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Registering Operative...' : 'Complete Registration'}
              <UserPlus className="h-4 w-4" />
            </button>
          </form>

          {/* Footer Navigation */}
          <footer className="text-center pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#bac9cd]">
            <Link to="/login" className="flex items-center space-x-1 hover:text-[#00e0ff] transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
            <span className="text-[10px] text-[#bac9cd]/60">Aegis Security Standard v4.2</span>
          </footer>
        </main>
      </div>
    </>
  );
};

export default SignUpPage;
