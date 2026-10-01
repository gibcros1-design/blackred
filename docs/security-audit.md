# Security Audit — BlackRedRoblox

Tanggal: 2026-10-01
Scope: `src/app/**`, `src/app/actions/**`, `src/middleware.ts`, `src/lib/auth.ts`, `src/services/**`, `next.config.ts`

## Ringkasan Temuan

| # | Severity | Temuan | Status |
|---|----------|--------|--------|
| 1 | CRITICAL | 5 server action tanpa autentikasi — siapa pun bisa ubah status order & pengaturan toko | ✅ Ditutup |
| 2 | CRITICAL | `/api/upload` terbuka tanpa auth & tanpa validasi konten file (stored XSS/deface) | ✅ Ditutup |
| 3 | HIGH | Secret JWT punya default hardcoded — sesi admin bisa di-forged kalau env kosong | ✅ Ditutup |
| 4 | HIGH | `/api/order/check` balikkan seluruh row order tanpa rate limit (enumeration) | ✅ Ditutup |
| 5 | HIGH | Kode cek order dihasilkan `Math.random()` — bukan CSPRNG, bisa ditebak | ✅ Ditutup |
| 6 | MEDIUM | Ekstensi file upload dari nama file klien (`.html`, `.svg` bisa dipasang) | ✅ Ditutup |
| 7 | MEDIUM | Validasi tipe `status` di `updateOrderStatusAction` lolos `any` | ⏳ Belum ditangani |
| 8 | LOW | `images.remotePatterns` `hostname: "**"` — boleh fetch host mana pun | ✅ Ditutup |
| 9 | LOW | Tidak ada rate limit pada login admin (`loginAdminAction`) | ✅ Ditutup |
| 10 | LOW | Debug route (`__nextjs_original-stack-frame`) tidak dibatasi — hanya masalah `NODE_ENV !== production` | ⏳ Belum ditangani |
| — | INFO | Cookie `httpOnly` + `sameSite=lax`; bcrypt pada password admin; `.env` sudah `gitignore` | Positif |

Dampak agregat awal: **siapa pun** yang menemukan origin situs ini dapat menulis ke database tanpa login (temuan 1), menaruh file HTML di domain yang sama (temuan 2), lalu menyusun sesi admin kalau secret default terpakai (temuan 3). Ketiganya kini tertutup.

### Perubahan yang diterapkan (2026-10-01)
- `src/lib/env.ts` (baru) — `ADMIN_JWT_SECRET` wajib, gagal cepat kalau kosong/pendek; dipakai `middleware.ts` dan `lib/auth.ts`
- `src/lib/auth.ts` — tambah `requireAdmin()`
- `saveSettingsAction`, `updateOrderStatusAction` — guard `requireAdmin()`
- `createOrderAction` — harga diambil dari DB, input klien tak dipakai; sanitasi field
- `submitPaymentProofAction` — `proofUrl` wajib cocok `/^\/uploads\/[\w.-]+$/`
- `/api/upload` — allowlist ekstensi dari `Content-Type` (bukan nama file), magic-byte check, nama file `randomBytes`, body rusak → 400
- `/api/order/check` — rate limit 10 req/menit/IP, validasi panjang query, projection field aman saja
- `services/order.ts` — `crypto.randomInt` untuk kode & kode unik
- `actions/auth.ts` — rate limit login 5x/5 menit per IP+username (IP dari `headers()`)
- `next.config.ts` — `remotePatterns: []`
- `.env` — secret dirotasi (sebelumnya identik dengan `.env.example`); `.env.example` dikosongkan

Terverifikasi: `npm run build` lolos, `tsc --noEmit` 0 error, uji runtime — semua rute 200, `POST /api/upload` tanpa body → 400, upload HTML palsu ber-tipe `image/png` → 400 "Isi file bukan gambar yang valid."

Detail per temuan: [[vulnerabilities/unauthenticated-server-actions]], [[vulnerabilities/unrestricted-file-upload]], [[vulnerabilities/jwt-secret-default]], [[vulnerabilities/order-check-no-rate-limit]], [[vulnerabilities/weak-order-code-rng]]

Rencana perbaikan: [[fixes/add-admin-auth-guard]], [[fixes/harden-file-upload]], [[fixes/require-jwt-secret]]

Lihat juga: [[00-index]]
