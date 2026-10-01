# Fix: Require JWT Secret

> HIGH — gagal startup kalau secret belum diisi, jangan diam-diam pakai default

## Current Code
`src/middleware.ts:4` dan `src/lib/auth.ts:4`:
```ts
const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "lapak-robux-default-jwt-secret-key-32chars"
);
```

## Fix
1. Buat satu sumber: `src/lib/env.ts`:
```ts
function required(name: string): string {
  const v = process.env[name];
  if (!v || v.length < 32) throw new Error(`Env ${name} wajib diisi (min 32 karakter)`);
  return v;
}
export const ADMIN_JWT_SECRET = required("ADMIN_JWT_SECRET");
```
2. Ganti kedua file agar `import { ADMIN_JWT_SECRET } from "@/lib/env"`.
3. Ganti isi `.env.example` jadi placeholder tanpa nilai nyata: `ADMIN_JWT_SECRET=`.
4. Generate secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

Trade-off: app akan crash saat dev pertama kali tanpa env — itu yang diinginkan, daripada diam-diam memakai secret publik.

## Steps
- [ ] Tambah `src/lib/env.ts`
- [ ] Pakai di `middleware.ts` + `lib/auth.ts`
- [ ] Kosongkan nilai contoh di `.env.example`
- [ ] Pastikan deployment isi `ADMIN_JWT_SECRET`

## See Also
- [[vulnerabilities/jwt-secret-default]]
- [[security-audit]]
