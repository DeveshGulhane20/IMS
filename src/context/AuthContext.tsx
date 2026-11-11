import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database, UserSystemRole, InstituteRole } from '../types/database';
import { Role } from '../types/ims';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  system_role: UserSystemRole;
  created_at: string;
  updated_at: string;
}

export interface UserMembership {
  id: string;
  institute_id: string;
  user_id: string;
  role: InstituteRole;
  status: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  memberships: UserMembership[];
  isPlatformAdmin: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  getAppRoleForProfile: (requestedRole?: Role) => { allowed: boolean; role: Role; reason?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [memberships, setMemberships] = useState<UserMembership[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!supabase) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.warn('[Averiq Auth] Error fetching user profile:', profileError.message);
      } else if (profileData) {
        setProfile(profileData as UserProfile);
      }

      // Fetch active institute memberships
      const { data: membershipData, error: membershipError } = await supabase
        .from('institute_memberships')
        .select('id, institute_id, user_id, role, status')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (membershipError) {
        console.warn('[Averiq Auth] Error fetching memberships:', membershipError.message);
      } else if (membershipData) {
        setMemberships(membershipData as UserMembership[]);
      }
    } catch (err: any) {
      console.warn('[Averiq Auth] Unexpected error fetching profile data:', err?.message);
    }
  }, []);

  // Initialize session on mount and subscribe to auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Restore existing session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;

      if (error) {
        console.warn('[Averiq Auth] Error restoring session:', error.message);
        setAuthError(error.message);
      }

      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id).finally(() => {
          if (isMounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }).catch(err => {
      if (isMounted) {
        console.warn('[Averiq Auth] Failed to retrieve session:', err?.message);
        setIsLoading(false);
      }
    });

    // 2. Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      } else {
        setProfile(null);
        setMemberships([]);
      }

      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      const msg = 'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        await fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Failed to establish session.' };
    } catch (err: any) {
      const msg = err?.message || 'An unexpected authentication error occurred.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const signOut = async (): Promise<void> => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err: any) {
        console.warn('[Averiq Auth] Sign-out warning:', err?.message);
      }
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setMemberships([]);
    setAuthError(null);
  };

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const isPlatformAdmin = profile?.system_role === 'platform_admin';

  /**
   * Evaluates whether the authenticated user has authorization for a given role portal.
   * Enforces that standard_user cannot access SUPER_ADMIN.
   */
  const getAppRoleForProfile = (requestedRole?: Role): { allowed: boolean; role: Role; reason?: string } => {
    // If user is a platform admin, they can access SUPER_ADMIN or any lower role
    if (isPlatformAdmin) {
      return {
        allowed: true,
        role: requestedRole || 'SUPER_ADMIN'
      };
    }

    // A standard user must NOT gain platform_admin / SUPER_ADMIN access
    if (requestedRole === 'SUPER_ADMIN') {
      return {
        allowed: false,
        role: 'ADMIN',
        reason: 'Access Denied: Your account does not have platform administrator privileges.'
      };
    }

    // Check institute memberships if available
    if (memberships.length > 0) {
      const adminMembership = memberships.find(m => m.role === 'institute_admin');
      if (adminMembership) {
        return { allowed: true, role: 'ADMIN' };
      }

      const facultyMembership = memberships.find(m => m.role === 'faculty' || m.role === 'staff');
      if (facultyMembership) {
        return { allowed: true, role: 'TEACHER' };
      }

      const parentMembership = memberships.find(m => m.role === 'parent');
      if (parentMembership) {
        return { allowed: true, role: 'PARENT' };
      }

      return { allowed: true, role: 'STUDENT' };
    }

    // If no memberships table records found yet, fallback gracefully to requested portal role (except SUPER_ADMIN)
    return {
      allowed: true,
      role: requestedRole || 'ADMIN'
    };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        memberships,
        isPlatformAdmin,
        isLoading,
        isConfigured: isSupabaseConfigured,
        authError,
        signIn,
        signOut,
        refreshProfile,
        getAppRoleForProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
