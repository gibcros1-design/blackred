# Migrasi ke Supabase Postgres + Vercel Free Tier

**Tanggal:** 2026-10-02
**Status:** Disetujui user

## Tujuan

Deploy di Vercel free + Supabase free. SQLite `dev.db` dan upload lokal tidak jalan di serverless.

## Keputusan

1. **Satu database untuk semua env** — dev lokal dan produksi sama-sama pakai Supabase Postgres. Tidak ada beda SQL dev/prod. Dev butuh internet.

## Perubahan

### 1. Database driver (SQLite → Postgres)

- `src/db/index.ts`: `better-sqlite3` → `postgres-js` (`drizzle-orm/postgres-js`). Baca `process.env.DATABASE_URL`.
- `drizzle.config.ts`: `dialect: "sqlite"` → `"postgres"`, url dari `DATABASE_URL`.
- `src/db/schema.ts`: `sqliteTable` → `pgTable`.
  - `text("...", { enum: [...] })` → tetap `text` + enum via `text` biasa (drizzle pg `text` tanpa enum, atau `pgEnum` — pilih `pgEnum` hanya kalau push error).
  - `default(sql\`(CURRENT_TIMESTAMP)\`)` → tetap sama (pg dukung).
  - Kolom `proof_token` tetap `text().notNull().default("")`.
- Hapus dependency `better-sqlite3`. Tambah `postgres` dan `@types` tidak perlu (postgres-js tanpa tipe terpisah).
- Hapus dari ignore/build: `dev.db*` tidak relevan.

### 2. Upload bukti → Supabase Storage

- `src/app/api/upload/route.ts`:
  - Hapus `fs/promises` + `public/uploads`.
  - Upload ke bucket `proofs` (private) via `@supabase/supabase-js` (service role key server-side).
  - Magic-byte check tetap (jalan sebelum upload).
  - Return path relatif `/proofs/<filename>` atau objek path yang disimpan di DB.
- `src/app/actions/order.ts` (`submitPaymentProofAction`):
  - Ganti `stat()` disk check → `supabase.storage.from('proofs').list()` / `info()` check bahwa file ada.
  - Validasi regex path menyesuaikan format baru (`proofs/...`).
- Tampilkan bukti di admin: signed URL (exp 1 jam) dari Supabase — via server action, tidak expose service key.
- Telegram notification: sertakan link ke halaman admin order, bukan gambar inline (lihat `src/services/telegram.ts` — `sendPhoto` hanya untuk path `/uploads/` lama; ganti ke `sendMessage` saja atau kirim signed URL bila masih valid).
- `public/uploads/` folder: berhenti dipakai; `.gitkeep` bisa dihapus nanti.

### 3. Env

`.env.example` (baru):
```
DATABASE_URL=postgresql://...@db.<ref>.supabase.co:5432/postgres
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_JWT_SECRET=...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
TELEGRAM_BOT_TOKEN=""
TELEGRAM_ADMIN_CHAT_ID=""
NEXT_PUBLIC_APP_URL="https://<app>.vercel.app"
```

`src/lib/env.ts`: tambah required `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai server (import di route/action, bukan middleware).

### 4. Supabase setup (manual, sekali)

1. Buat project (free, region Singapore terdekat).
2. Buat bucket `proofs`, private.
3. `npm run db:push` dari lokal (dengan `DATABASE_URL` Supabase).
4. `npm run db:seed` (set `ADMIN_USERNAME`/`ADMIN_PASSWORD`).
5. Insert config default pricing/rekening — sudah ditangani seed.

### 5. Vercel setup (manual)

1. Import repo → framework Next.js auto-detect.
2. Set env vars (sama seperti `.env.example`).
3. Deploy. `DATABASE_URL` pakai pooling mode `?pgbouncer=true` (Vercel functions cold, connection direct bisa habis).
4. Drop `Dockerfile` + `.dockerignore` (Vercel tidak pakai Docker).

### 6. Pembersihan

- Hapus `Dockerfile`, `.dockerignore`.
- `package.json`: hapus `better-sqlite3`, tambah `postgres`, `@supabase/supabase-js`.
- `.gitignore`: buang `dev.db*`.

## Tidak diubah

- Logic order/checkout/status — hanya lapisan penyimpanan & upload.
- UI semua halaman.
- Middleware auth JWT.

## Risiko & mitigasi

| Risiko | Mitigasi |
|---|---|
| Supabase free pause 7 hari idle | Site rame → tidak masalah. Idle → wake manual di dashboard. |
| Connection exhaustion di Vercel | Pakai `?pgbouncer=true` |
| Signed URL admin kadang expired | Generate baru per-request, jangan cache di client |
| Seed salah jalankan dua kali | `onConflictDoNothing` sudah ada |

## Verifikasi per step

1. `npx tsc --noEmit` setelah tiap ubah file driver/schema.
2. `npm run db:push` sukses ke Supabase.
3. `npm run build` sukses.
4. Smoke test lokal: buat order → upload bukti → cek order → login admin → lihat bukti via signed URL.
