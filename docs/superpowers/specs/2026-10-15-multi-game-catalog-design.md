# Spesifikasi Desain: Katalog Multi-Game (MLBB, PUBG Mobile, Free Fire, FC Mobile)

- **Tanggal**: 2026-10-15
- **Status**: Disetujui
- **Target**: Memperluas BlackRedRoblox menjadi toko multi-game yang mendukung top-up Mobile Legends, PUBG Mobile, Free Fire, dan FC Mobile di samping Roblox.

---

## 1. Latar Belakang & Tujuan

Sebelumnya, sistem hanya melayani transaksi Robux Roblox dengan schema dan formulir yang terikat erat pada kolom Roblox (`robux_amount` dan `roblox_username`). Toko membutuhkan perluasan katalog untuk mencakup game mobile populer di Indonesia:
1. **Mobile Legends: Bang Bang (MLBB)**
2. **PUBG Mobile**
3. **Free Fire**
4. **FC Mobile**

Perluasan ini harus tetap mempertahankan:
- Branding utama **BlackRedRoblox**.
- Kompatibilitas mundur penuh terhadap 350+ data order lama di database Supabase.
- Alur transaksi cepat, transparan, terintegrasi QRIS / Transfer Bank, dan bot Telegram admin.

---

## 2. Arsitektur Data & Model Game

### 2.1 Definisi Registry Game (`src/lib/games.ts`)

Setiap game memiliki spesifikasi input akun dan paket nominal unik:

```ts
export interface GamePackage {
  id: string;
  name: string;      // Contoh: "86 Diamonds", "Weekly Diamond Pass", "60 UC"
  amount: number;    // Nominal angka (misal 86, 60, dll)
  price: number;     // Harga IDR
}

export interface GameFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  helperText?: string;
  pattern?: string;
  required: boolean;
}

export interface GameConfig {
  id: "roblox" | "mlbb" | "pubg" | "freefire" | "fcmobile";
  name: string;
  publisher: string;
  badge?: string;
  currencyName: string; // "Robux", "Diamonds", "UC", "FC Points"
  icon: string;
  fields: GameFieldConfig[];
  defaultPackages: GamePackage[];
}
```

### 2.2 Spesifikasi Detail Game

| Game ID | Nama Game | Field Input Akun | Satuan Item | Paket Default Awal |
|---|---|---|---|---|
| `roblox` | Roblox | `roblox_username` (Username Roblox) | Robux | Paket bawaan yang sudah ada (2.000 s/d 33.500 Robux) |
| `mlbb` | Mobile Legends | `user_id` (User ID) + `zone_id` (Zone ID / Server 4-5 digit) | Diamonds | 86, 172, 257, 344, 706 Diamonds, Weekly Diamond Pass |
| `pubg` | PUBG Mobile | `player_id` (Player ID / UID Karakter) | UC | 60, 325, 660, 1800 UC |
| `freefire` | Free Fire | `player_id` (Player ID akun) | Diamonds | 70, 140, 355, 720 Diamonds, Membership Mingguan |
| `fcmobile` | FC Mobile | `uid` (UID Akun FC Mobile) | FC Points | 100, 500, 1050, 2200 FC Points |

---

## 3. Perubahan Skema Database (`src/db/schema.ts`)

Tabel `orders` diperluas dengan kolom baru yang bersifat opsional / bernilai default agar tidak merusak data lama:

```ts
export const orders = pgTable("orders", {
  id: text("id").primaryKey(), // UUID v4
  orderId: text("order_id").notNull().unique(), // [PREFIX]-YYYYMMDD-XXXXX
  code: text("code").notNull().unique(), // 8 char alphanumeric
  game: text("game").notNull().default("roblox"), // "roblox", "mlbb", "pubg", "freefire", "fcmobile"
  itemName: text("item_name").notNull().default("Robux"), // Nama paket spesifik
  gameUserId: text("game_user_id").notNull().default(""), // User ID / Player ID / Roblox Username
  gameZoneId: text("game_zone_id").notNull().default(""), // Server ID (khusus MLBB)
  robuxAmount: integer("robux_amount").notNull().default(0), // Dipertahankan untuk backward compatibility
  price: integer("price").notNull(),
  uniqueCode: integer("unique_code").notNull(),
  totalPrice: integer("total_price").notNull(),
  name: text("name").notNull(),
  robloxUsername: text("roblox_username").notNull().default(""),
  whatsapp: text("whatsapp").notNull(),
  status: text("status", {
    enum: ["pending_payment", "waiting_verify", "approved", "processing", "completed", "rejected", "expired"]
  }).notNull().default("pending_payment"),
  paymentProof: text("payment_proof"),
  proofToken: text("proof_token").notNull().default(""),
  adminNote: text("admin_note"),
  createdAt: text("created_at").default(sql`...`).notNull(),
  updatedAt: text("updated_at").default(sql`...`).notNull(),
});
```

Format `orderId`:
- Roblox: `RBX-YYYYMMDD-XXXXX`
- MLBB: `MLB-YYYYMMDD-XXXXX`
- PUBG: `PBG-YYYYMMDD-XXXXX`
- Free Fire: `FF-YYYYMMDD-XXXXX`
- FC Mobile: `FCM-YYYYMMDD-XXXXX`

---

## 4. Perubahan Halaman & Komponen Antarmuka (UI/UX)

### 4.1 Homepage (`src/app/page.tsx`)
- Tetap memuat Hero Banner BlackRedRoblox.
- Menambahkan section **Katalog Game Pilihan** (`GameCatalogGrid`):
  - Kartu visual untuk masing-masing game (Roblox, MLBB, PUBG, FF, FC Mobile).
  - Badge publisher (Moonton, Garena, Krafton, EA Sports, Roblox Corp).
  - Tombol aksi langsung "Top Up Sekarang" mengarah ke `/topup/[game]`.
- Section PricingGrid Robux tetap tampil sebagai produk unggulan di bawah katalog.

### 4.2 Halaman Checkout Dinamis (`src/app/topup/[game]/page.tsx`)
- Mendukung pemesanan untuk setiap game:
  - Step 1: Input data akun (User ID & Zone ID untuk MLBB; Player ID untuk FF/PUBG; UID untuk FC Mobile; Roblox username untuk Roblox) dengan gambar/ilustrasi panduan letak ID.
  - Step 2: Pemilihan nominal paket item (Diamond / UC / FC Points / Robux).
  - Step 3: Pilihan pembayaran (QRIS / Transfer Bank) + detail transfer & kode unik.
  - Step 4: Konfirmasi & unggah bukti transfer.
  - Step 5: Tampilan sukses & pelacakan status.
- Link lama `/beli` diarahkan (*redirect*) ke `/topup/roblox` agar link lama dari WhatsApp atau bookmark pelanggan tidak rusak.

### 4.3 Admin Settings (`src/components/admin/SettingsManager.tsx`)
- Menambahkan tab selector per game:
  - Tab Roblox
  - Tab Mobile Legends
  - Tab PUBG Mobile
  - Tab Free Fire
  - Tab FC Mobile
- Pengaturan paket harga masing-masing game disimpan dalam tabel `config` (`pricing_mlbb`, `pricing_pubg`, `pricing_freefire`, `pricing_fcmobile`, dan `pricing` untuk roblox).
- Admin dapat menambah, mengedit nominal, mengubah harga, atau menghapus paket untuk setiap game secara bebas.

### 4.4 Notifikasi Telegram Admin (`src/services/telegram.ts`)
Pesan bot Telegram yang dikirim ke admin otomatis menyesuaikan format game:
```
🔔 ORDER BARU DITERIMA!
ID Order: MLB-20261015-81920
Game: Mobile Legends: Bang Bang
Item: 257 Diamonds
User ID: 12345678 (Zone: 2021)
Atas Nama: Budi
WhatsApp: 6281234567890
Total Bayar: Rp 65.234
Status: Menunggu Pembayaran
```

---

## 5. Rencana Pengujian & Validasi

1. **Database Migration**:
   - Jalankan `npx drizzle-kit push` untuk memperbarui tabel Supabase tanpa menghapus record lama.
2. **End-to-End Checkout Test**:
   - Test pemesanan MLBB: input User ID + Zone ID -> pilih paket -> buat order -> verifikasi order di database dan dashboard admin.
   - Test pemesanan FF / PUBG / FC Mobile -> verifikasi field unik masing-masing.
   - Test pemesanan Roblox -> pastikan alur Robux yang sudah ada tidak terganggu.
3. **Admin Dashboard Test**:
   - Buka `/admin/orders` -> pastikan nama game dan akun pemain tampil jelas di tabel order.
   - Buka `/admin/settings` -> ubah harga paket MLBB -> simpan -> buka `/topup/mlbb` dan pastikan harga baru muncul.
4. **Verifikasi Build**:
   - Jalankan `npm run build` untuk menjamin tidak ada error linting / typecheck.
