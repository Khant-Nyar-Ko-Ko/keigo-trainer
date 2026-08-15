import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Returns null when Supabase hasn't been configured (no env vars set) — every
// caller must treat that as "auth/sync unavailable" and no-op, not throw.
// This keeps the app fully usable in anonymous/local-only mode before (or
// without) any backend setup.
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
