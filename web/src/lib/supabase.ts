import { createClient, SupabaseClient } from "@supabase/supabase-js";

declare global {
  // eslint-disable-next-line no-var
  var _supabase: SupabaseClient | undefined;
  // eslint-disable-next-line no-var
  var _supabaseAdmin: SupabaseClient | undefined;
}

export function getSupabase(): SupabaseClient {
  if (!globalThis._supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error("Missing Supabase env vars");
    }

    globalThis._supabase = createClient(url, key);
  }
  return globalThis._supabase;
}

/** Service role client — bypasses RLS. Server-side only. */
export function getSupabaseAdmin(): SupabaseClient {
  if (!globalThis._supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env var");
    }

    globalThis._supabaseAdmin = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return globalThis._supabaseAdmin;
}
