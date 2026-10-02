import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const PROOFS_BUCKET = "proofs";

function env(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Env ${name} wajib diisi.`);
  return v.trim();
}

// Server-side only: pakai service role key untuk upload/read bucket private.
// Jangan pernah import file ini di komponen client.
// Validasi lazy (saat pertama dipakai, bukan saat import) supaya `next build`
// tidak gagal ketika env produksi belum terisi di mesin build.
let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (!cached) {
    cached = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

/** Signed URL berumur pendek untuk menampilkan/membuka bukti transfer. */
export async function getProofSignedUrl(objectPath: string): Promise<string | null> {
  if (!objectPath) return null;
  try {
    const { data, error } = await supabaseAdmin()
      .storage.from(PROOFS_BUCKET)
      .createSignedUrl(objectPath, 60 * 60); // 1 jam
    if (error) {
      console.error("Signed URL error:", error.message);
      return null;
    }
    return data.signedUrl;
  } catch (e) {
    console.error("Signed URL error:", e);
    return null;
  }
}

/** Cek keberadaan file di bucket (pengganti stat() filesystem). */
export async function proofExists(objectPath: string): Promise<boolean> {
  try {
    const dir = objectPath.includes("/") ? objectPath.slice(0, objectPath.lastIndexOf("/")) : "";
    const base = objectPath.slice(objectPath.lastIndexOf("/") + 1);
    const { data, error } = await supabaseAdmin().storage.from(PROOFS_BUCKET).list(dir, {
      search: base,
      limit: 1,
    });
    if (error) return false;
    return !!data?.some((f) => f.name === base);
  } catch {
    return false;
  }
}
