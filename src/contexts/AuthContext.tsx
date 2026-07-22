import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserRole } from '@/constants/roles';
import { fetchProfile, signInWithEmail, signUpUser, signOut } from '@/services/authService';
import type { UserProfile } from '@/services/authService';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: any }>;
  signup: (email: string, password: string, fullName: string, organization: string, role: UserRole) => Promise<{ success: boolean; error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserProfile = async (userId: string) => {
    const userProfile = await fetchProfile(userId);
    if (userProfile) {
      setProfile(userProfile);
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          // Check local stored demo session for seamless persistence across page reloads
          const storedDemoSession = localStorage.getItem('energyshield_demo_session');
          if (storedDemoSession) {
            const parsed = JSON.parse(storedDemoSession);
            setUser(parsed.user);
            setProfile(parsed.profile);
          }
        }
      } catch (err) {
        console.error('Error during initial session loading:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await signInWithEmail(email, password);
      if (res.error) {
        return { success: false, error: res.error };
      }
      setUser(res.user);
      setProfile(res.profile);

      // Persist demo session to local storage if not logged in via standard Supabase JWT
      localStorage.setItem('energyshield_demo_session', JSON.stringify({ user: res.user, profile: res.profile }));

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    organization: string,
    role: UserRole
  ) => {
    setIsLoading(true);
    try {
      const res = await signUpUser(email, password, fullName, organization, role);
      if (res.error) {
        return { success: false, error: res.error };
      }
      setUser(res.user);
      setProfile(res.profile);

      localStorage.setItem('energyshield_demo_session', JSON.stringify({ user: res.user, profile: res.profile }));

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      localStorage.removeItem('energyshield_demo_session');
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const role = profile ? profile.role : null;

  return (
    <AuthContext.Provider value={{ user, profile, role, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
