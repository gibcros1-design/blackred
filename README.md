# LapakRobux - Platform Topup Robux Roblox Direct Seller

Platform penjualan Robux Roblox langsung (direct seller) dengan verifikasi transfer manual, pengiriman Robux via Group Payout & Game Pass, notifikasi bot Telegram otomatis, dan panel admin lengkap.

## 🚀 Fitur Utama

- **Landing Page Eksklusif (`/`):** Tampilan dark gaming responsif, daftar paket nominal Robux, tombol beli cepat, dan FAQ.
- **5-Step Checkout Wizard (`/beli`):**
  1. Pilih Paket Nominal Robux
  2. Input Data User (Nama, Username Roblox, Nomor WhatsApp)
  3. Instruksi Pembayaran Rekening + 3 Digit Nominal Unik (contoh: Rp 52.123)
  4. Upload Screenshot Bukti Transfer (Validasi max 5MB JPG/PNG/WEBP)
  5. Konfirmasi Selesai + Auto-generated Order ID & 6-char Kode Unik
- **Lacak Pesanan Real-time (`/cek-order`):** Status tracking interaktif (Menunggu Bayar $\rightarrow$ Verifikasi Admin $\rightarrow$ Approved $\rightarrow$ Payout Dikirim $\rightarrow$ Selesai).
- **Notifikasi Bot Telegram:** Admin menerima foto struk transfer beserta rincian pesanan seketika di Telegram.
- **Admin Panel Terproteksi (`/admin`):**
  - Autentikasi Admin (Password bcrypt & session JWT)
  - Dashboard statistik omset dan tabel transaksi dengan filter status
  - Detail Pesanan (`/admin/order/[id]`) lengkap dengan preview bukti transfer, tombol update status, catatan admin, dan link WhatsApp langsung ke nomor pembeli
  - Pengaturan Toko (`/admin/settings`) untuk ubah harga paket Robux, tambah rekening transfer, dan ubah token bot Telegram.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Database & ORM:** Drizzle ORM + SQLite (`better-sqlite3`) / PostgreSQL
- **Keamanan:** Jose (JWT Cookie Session) + Bcryptjs
- **Deployment:** Docker / Coolify

## 📦 Menjalankan Proyek Secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. Push schema database & jalankan seed
npx drizzle-kit push
npx tsx src/db/seed.ts

# 3. Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Akun Admin Default:
- **URL Login:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Username:** `admin`
- **Password:** `admin123`
