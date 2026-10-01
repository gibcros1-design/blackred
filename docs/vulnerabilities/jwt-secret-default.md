# Vulnerability: JWT Secret Default Hardcoded

> HIGH — sesi admin bisa di-forged jika `ADMIN_JWT_SECRET` kosong

## Description
`src/middleware.ts:4` dan `src/lib/auth.ts:4` sama-sama memakai fallback:
```ts
process.env.ADMIN_JWT_SECRET || "lapak-robux-default-jwt-secret-key-32chars"
```
Nilai fallback ini ada di source code yang ter-commit. Jika env tidak terisi (deploy baru, Docker tanpa `-e`, pengembang lupa), siapa pun bisa menandatangani token HS256 sendiri.

Catatan: `.env` sudah `.gitignore`, tapi `.env.example` berisi `ADMIN_JWT_SECRET="super-secret-key-change-this-in-production-min-32-chars-lapakrobux"` — nilai contoh itu pun bisa dipakai penyerang yang membaca repo.

## Proof of Concept
Jika env kosong:
```
token = HS256(header, {adminId:"x",username:"admin"}, "lapak-robux-default-jwt-secret-key-32chars")
Cookie: lapak_admin_session=<token>
```
→ lolos `jwtVerify` di middleware, akses `/admin/*` penuh.

## Impact
Takeover panel admin (ubah harga, rekening, status order) tanpa kredensial.

## Fix
Lihat [[fixes/require-jwt-secret]].

## See Also
- [[security-audit]]
