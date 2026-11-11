import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Load Supabase environment variables from Vite runtime
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

/**
 * Flag indicating whether Supabase environment variables have been provided.
 */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://')
);

/**
 * Reusable Supabase client instance.
 * Initialized only when valid configuration is present to prevent runtime crashes.
 */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'averiq-ims-supabase-auth'
      }
    })
  : null;

/**
 * Getter for Supabase client that provides safe runtime diagnostics.
 */
export const getSupabase = (): SupabaseClient<Database> => {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
  }
  return supabase;
};

/**
 * Utility to verify actual network connectivity and authentication against the Supabase backend.
 * Non-destructive: checks auth session reachability without requiring any database tables.
 */
export const verifySupabaseConnection = async (): Promise<{
  connected: boolean;
  message: string;
  url?: string;
}> => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase configuration is missing or incomplete (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set).'
    };
  }

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      return {
        connected: false,
        message: `Supabase connection error: ${error.message}`,
        url: supabaseUrl
      };
    }
    return {
      connected: true,
      message: 'Successfully reached Supabase project API gateway.',
      url: supabaseUrl
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to contact Supabase: ${err?.message || 'Unknown network error'}`,
      url: supabaseUrl
    };
  }
};
