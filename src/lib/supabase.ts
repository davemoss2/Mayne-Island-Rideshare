import { createClient } from '@supabase/supabase-js';

// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set at
// runtime (via .env.local or Vercel environment variables — see .env.example).
// Placeholder fallbacks prevent a build-time crash when the vars are absent;
// any actual API call will simply fail until real credentials are provided.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
);
