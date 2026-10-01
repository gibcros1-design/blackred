/**
 * Ambil nilai env wajib. Gagal cepat kalau deployment lupa mengisi —
 * jangan diam-diam memakai nilai default yang ada di source code.
 */
function required(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length < 32) {
    throw new Error(`Env ${name} wajib diisi dengan minimal 32 karakter.`);
  }
  return v.trim();
}

/** Secret JWT admin. Selalu dari env — tidak ada fallback hardcoded. */
export const ADMIN_JWT_SECRET = required("ADMIN_JWT_SECRET");
