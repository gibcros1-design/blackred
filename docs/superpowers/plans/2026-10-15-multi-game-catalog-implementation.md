# Multi-Game Catalog (MLBB, PUBG Mobile, Free Fire, FC Mobile) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memperluas platform BlackRedRoblox agar mendukung katalog top-up multi-game (Mobile Legends, PUBG Mobile, Free Fire, FC Mobile, dan Roblox) dengan input akun dinamis, pengelolaan harga di admin settings, notifikasi bot Telegram, dan backward compatibility penuh terhadap 350+ data order lama.

**Architecture:** Menggunakan Game Registry terpusat (`src/lib/games.ts`) yang mengatur metadata dan field akun tiap game. Database Drizzle diperluas dengan kolom `game`, `itemName`, `gameUserId`, dan `gameZoneId` dengan default value. Alur pemesanan disatukan pada route dinamis `/topup/[game]`, dengan redirect otomatis dari `/beli` ke `/topup/roblox`. Admin settings dilengkapi tab per-game untuk pengelolaan harga.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Drizzle ORM, PostgreSQL (Supabase), Lucide React, Sonner.

## Global Constraints

- **Branding**: Pertahankan nama utama BlackRedRoblox.
- **Kompatibilitas Mundur**: 350+ data order yang sudah ada di Supabase tidak boleh rusak atau hilang; kolom lama `robux_amount` dan `roblox_username` tetap dipertahankan.
- **Routing**: Link `/beli` harus otomatis redirect ke `/topup/roblox`.
- **Katalog Game**: Mendukung 5 game: `roblox`, `mlbb`, `pubg`, `freefire`, `fcmobile`.

---

### Task 1: Game Registry & Default Packages

**Files:**
- Create: `src/lib/games.ts`
- Modify: `src/services/defaults.ts`
- Test: `test/games.test.ts` (atau one-off validation script)

**Interfaces:**
- Produces:
  - `GAMES: Record<string, GameConfig>`
  - `getGameConfig(id: string): GameConfig | null`
  - `DEFAULT_GAME_PACKAGES: Record<string, GamePackage[]>`

- [ ] **Step 1: Buat registry game terpusat di `src/lib/games.ts`**
  Mendefinisikan tipe `GameConfig`, metadata untuk 5 game (nama, publisher, icon, currencyName, field input akun seperti User ID + Zone ID untuk MLBB, Player ID untuk FF/PUBG, UID untuk FC Mobile, Username untuk Roblox).

- [ ] **Step 2: Tambahkan default pricing per game di `src/services/defaults.ts`**
  Tambahkan konstanta paket bawaan:
  - `DEFAULT_MLBB_PACKAGES` (86, 172, 257, 344, 706 Diamonds, Weekly Diamond Pass)
  - `DEFAULT_PUBG_PACKAGES` (60, 325, 660, 1800 UC)
  - `DEFAULT_FREEFIRE_PACKAGES` (70, 140, 355, 720 Diamonds, Membership Mingguan)
  - `DEFAULT_FCMOBILE_PACKAGES` (100, 500, 1050, 2200 FC Points)

- [ ] **Step 3: Uji fungsi registry `getGameConfig`**
  Pastikan setiap game ID valid dapat diambil dan me-return konfigurasi field akun yang benar.

- [ ] **Step 4: Commit Task 1**
  ```bash
  git add src/lib/games.ts src/services/defaults.ts
  git commit -m "feat: add multi-game registry and default packages"
  ```

---

### Task 2: Perluasan Skema Database Drizzle & Supabase

**Files:**
- Modify: `src/db/schema.ts:4-24`

**Interfaces:**
- Produces:
  - `orders.game` (text default "roblox")
  - `orders.itemName` (text default "Robux")
  - `orders.gameUserId` (text default "")
  - `orders.gameZoneId` (text default "")

- [ ] **Step 1: Perbarui definisi tabel `orders` di `src/db/schema.ts`**
  Tambahkan kolom baru:
  ```ts
  game: text("game").notNull().default("roblox"),
  itemName: text("item_name").notNull().default("Robux"),
  gameUserId: text("game_user_id").notNull().default(""),
  gameZoneId: text("game_zone_id").notNull().default(""),
  ```
  Pastikan `robuxAmount` dan `robloxUsername` memiliki `.default(0)` dan `.default("")`.

- [ ] **Step 2: Jalankan Drizzle push untuk sinkronisasi Supabase**
  Jalankan `npx drizzle-kit push` untuk menambahkan 4 kolom baru ke database Supabase tanpa mengubah baris lama.

- [ ] **Step 3: Verifikasi kolom database baru di Supabase**
  Eksekusi query `SELECT game, item_name, game_user_id, game_zone_id FROM orders LIMIT 1;` untuk memastikan kolom terbaca tanpa error.

- [ ] **Step 4: Commit Task 2**
  ```bash
  git add src/db/schema.ts
  git commit -m "feat(db): extend orders schema with game and account fields"
  ```

---

### Task 3: Order Actions & Telegram Notifications

**Files:**
- Modify: `src/app/actions/order.ts`
- Modify: `src/services/order.ts`
- Modify: `src/services/telegram.ts`

**Interfaces:**
- Consumes: `src/lib/games.ts`, `src/db/schema.ts`
- Produces:
  - `createOrderAction(input: CreateOrderInput)` yang menerima `game`, `itemName`, `gameUserId`, `gameZoneId`.
  - Format pesan notifikasi Telegram yang memuat nama game dan detail akun.

- [ ] **Step 1: Perbarui `createOrderAction` di `src/app/actions/order.ts`**
  Terima parameter baru: `game`, `itemName`, `gameUserId`, `gameZoneId`.
  Beri prefix order ID sesuai game (misal: `MLB-` untuk MLBB, `PBG-` untuk PUBG, `FF-` untuk Free Fire, `FCM-` untuk FC Mobile, `RBX-` untuk Roblox).

- [ ] **Step 2: Perbarui notifikasi Telegram di `src/services/telegram.ts`**
  Ubah template pesan bot agar menampilkan nama game, paket item yang dibeli, serta User ID (+ Zone ID jika ada).

- [ ] **Step 3: Uji fungsi pembuat order baru via script**
  Buat order uji coba untuk game MLBB dan pastikan record di database tersimpan lengkap dengan field game.

- [ ] **Step 4: Commit Task 3**
  ```bash
  git add src/app/actions/order.ts src/services/order.ts src/services/telegram.ts
  git commit -m "feat: support multi-game order creation and notifications"
  ```

---

### Task 4: Komponen Katalog Game di Homepage

**Files:**
- Create: `src/components/GameCatalogGrid.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `src/lib/games.ts` (daftar game dan metadatanya)
- Produces: Komponen kartu game interaktif di halaman depan dengan logo, publisher, badge, dan link ke `/topup/[game]`.

- [ ] **Step 1: Buat komponen `GameCatalogGrid.tsx`**
  Desain kartu modern dengan gambar/ikon game berkualitas, efek hover, badge publisher, dan tombol Call-to-Action menuju `/topup/[game]`.

- [ ] **Step 2: Integrasikan `GameCatalogGrid` ke dalam `src/app/page.tsx`**
  Letakkan di bawah `HeroSection` sebelum `PricingGrid` Robux.
  Perbarui teks penjelasan halaman agar mencakup Robux dan Top Up Game Populer.

- [ ] **Step 3: Uji visual homepage**
  Buka homepage di browser dan pastikan ke-5 game tampil responsif di desktop maupun mobile.

- [ ] **Step 4: Commit Task 4**
  ```bash
  git add src/components/GameCatalogGrid.tsx src/app/page.tsx
  git commit -m "feat: add game catalog grid to homepage"
  ```

---

### Task 5: Halaman Checkout Dinamis Multi-Game (`/topup/[game]`)

**Files:**
- Create: `src/app/topup/[game]/page.tsx`
- Create: `src/components/checkout/DynamicCheckoutWizard.tsx`
- Modify: `src/app/beli/page.tsx` (redirect ke `/topup/roblox`)

**Interfaces:**
- Consumes: `getGameConfig`, `getConfigValue` (paket harga dari DB), `createOrderAction`
- Produces: Alur checkout lengkap 5 langkah yang adaptif terhadap input game yang dipilih.

- [ ] **Step 1: Buat `DynamicCheckoutWizard.tsx`**
  - Step 1: Input Akun game (User ID, Zone ID, dsb.) dengan panduan letak ID.
  - Step 2: Pilih Nominal item / diamond game.
  - Step 3: Pilih Pembayaran (QRIS / Rekening Bank).
  - Step 4: Konfirmasi & Unggah Bukti Bayar.
  - Step 5: Berhasil & Kode Pelacakan.

- [ ] **Step 2: Buat route dinamis `src/app/topup/[game]/page.tsx`**
  Validasi param game (jika tidak valid, return notFound).
  Ambil harga dari config DB (`pricing_${game}` atau fallback ke default).

- [ ] **Step 3: Tambahkan redirect di `src/app/beli/page.tsx`**
  Arahkan secara permanen/server-side ke `/topup/roblox`.

- [ ] **Step 4: Commit Task 5**
  ```bash
  git add src/app/topup/[game]/page.tsx src/components/checkout/DynamicCheckoutWizard.tsx src/app/beli/page.tsx
  git commit -m "feat: implement dynamic checkout wizard for all games"
  ```

---

### Task 6: Pengelolaan Harga Multi-Game di Admin Settings

**Files:**
- Modify: `src/components/admin/SettingsManager.tsx`
- Modify: `src/app/admin/settings/page.tsx`
- Modify: `src/app/actions/settings.ts`

**Interfaces:**
- Consumes: `src/lib/games.ts`
- Produces: Antarmuka tab per-game di Admin Settings untuk mengatur nominal item & harga tiap game.

- [ ] **Step 1: Perbarui `src/app/admin/settings/page.tsx`**
  Muat konfigurasi harga untuk semua game (`pricing`, `pricing_mlbb`, `pricing_pubg`, `pricing_freefire`, `pricing_fcmobile`).

- [ ] **Step 2: Perbarui `src/components/admin/SettingsManager.tsx`**
  Tambahkan tab navigasi (*Roblox | MLBB | PUBG | Free Fire | FC Mobile*) pada kartu pengaturan harga.
  Izinkan penambahan, pengeditan nama item, nominal, dan harga untuk setiap game.

- [ ] **Step 3: Perbarui `saveSettingsAction` di `src/app/actions/settings.ts`**
  Simpan konfigurasi JSON paket masing-masing game ke dalam tabel `config`.

- [ ] **Step 4: Uji simpan harga game lain dari dashboard admin**
  Buka `/admin/settings`, ubah salah satu harga paket MLBB, klik simpan, dan periksa apakah tersimpan di DB.

- [ ] **Step 5: Commit Task 6**
  ```bash
  git add src/components/admin/SettingsManager.tsx src/app/admin/settings/page.tsx src/app/actions/settings.ts
  git commit -m "feat: multi-game pricing tabs in admin settings"
  ```

---

### Task 7: Adaptasi Tampilan Admin Orders & Cek Order

**Files:**
- Modify: `src/components/admin/OrdersTable.tsx`
- Modify: `src/app/admin/order/[id]/page.tsx`
- Modify: `src/components/tracking/OrderTracker.tsx`
- Modify: `src/lib/public-order.ts`

**Interfaces:**
- Produces: Tampilan riwayat order yang memuat badge game, ID akun pemain (User ID / Server / Player ID), dan nama item yang dibeli.

- [ ] **Step 1: Perbarui `OrdersTable.tsx`**
  Tampilkan kolom Game & Akun Pemain (misal: "Mobile Legends - ID: 12345 (2021)") sebagai ganti hanya "Robux / Roblox Username".

- [ ] **Step 2: Perbarui halaman detail order admin `src/app/admin/order/[id]/page.tsx`**
  Tampilkan rincian game, nama item, dan ID akun pemain lengkap.

- [ ] **Step 3: Perbarui pelacak order publik `src/components/tracking/OrderTracker.tsx`**
  Tampilkan detail game dan paket yang dibeli pelanggan saat mengecek resi/status order di `/cek-order` atau `/order/[id]`.

- [ ] **Step 4: Commit Task 7**
  ```bash
  git add src/components/admin/OrdersTable.tsx src/app/admin/order/[id]/page.tsx src/components/tracking/OrderTracker.tsx src/lib/public-order.ts
  git commit -m "feat: show game and item details across admin and tracking views"
  ```

---

### Task 8: Verifikasi End-to-End & Build Testing

**Files:**
- Seluruh file proyek

- [ ] **Step 1: Jalankan `npm run build`**
  Pastikan build Next.js lulus dengan status sukses (Exit code 0), tanpa error TypeScript dan linting.

- [ ] **Step 2: Uji browser flow lengkap**
  - Homepage: klik kartu MLBB -> diarahkan ke `/topup/mlbb`.
  - Halaman topup: input User ID & Server -> pilih paket 257 Diamonds -> pilih bayar -> submit order.
  - Verifikasi di database dan dashboard admin `/admin`.
  - Cek order status di `/cek-order`.

- [ ] **Step 3: Commit final verification**
  ```bash
  git commit --allow-empty -m "chore: verify multi-game catalog completion"
  ```
