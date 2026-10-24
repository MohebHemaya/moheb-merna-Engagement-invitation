import { createClient } from '@supabase/supabase-js';

const metaEnv =
  typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseKey =
  metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = (() => {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
})();
