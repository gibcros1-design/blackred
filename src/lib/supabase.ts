import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const ASSETS_BUCKET = "assets";

function env(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Env ${name} wajib diisi.`);
  return v.trim();
}

// Server-side only: service role key digunakan hanya untuk upload/read asset admin.
let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (!cached) {
    cached = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
