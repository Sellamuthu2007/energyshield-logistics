import { supabase } from '@/lib/supabaseClient';
import type { UserRole } from '@/constants/roles';

export interface UserProfile {
  id: string;
  full_name: string;
  organization: string;
  role: UserRole;
  created_at?: string;
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as UserProfile;
}

export async function signInWithEmail(email: string, password: string) {
  // Real Supabase Auth login
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // If login fails (e.g. user doesn't exist), try to sign them up automatically for this demo!
  if (error && error.message.includes('Invalid login credentials')) {
    const signUpResponse = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpResponse.error) {
      return { user: null, profile: null, session: null, error: signUpResponse.error };
    }
    
    // After sign up, data contains the new user
    data = signUpResponse.data as typeof data;
    
    // Small delay to allow the database trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));
  } else if (error) {
    return { user: null, profile: null, session: null, error };
  }

  if (data?.user) {
    const profile = await fetchProfile(data.user.id);
    return { user: data.user, profile, session: data.session, error: null };
  }

  return { user: null, profile: null, session: null, error: new Error('User not found') };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error during signout:', error);
  }
}
