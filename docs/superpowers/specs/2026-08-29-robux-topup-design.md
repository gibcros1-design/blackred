# Design Doc: Platform Topup Roblox

**Tanggal:** 2026-08-29
**Status:** Approved
**Tech Stack:** Next.js (App Router) + Shadcn UI + Tailwind CSS + PostgreSQL + Drizzle ORM + Coolify

---

## 1. Ringkasan

Platform jual Robux langsung (direct seller). User pilih nominal Robux, bayar manual via bank transfer, upload bukti, admin verifikasi lalu kirim Robux via Group Payout manual. Telegram bot untuk notifikasi admin.

## 2. Keputusan Design

| Aspek | Keputusan |
|-------|-----------|
| Model bisnis | Direct seller (bukan marketplace) |
| Pembayaran | Manual transfer, admin verifikasi |
| Delivery | Game Pass, Group Payout manual oleh admin |
| Akun user | Tidak perlu — order ID + kode unik untuk cek status |
| Verifikasi | User upload bukti transfer di halaman order |
| Notifikasi admin | Telegram bot, kirim detail order ke admin |
| Checkout flow | Multi-step wizard, 5 step |
| Admin panel | Web admin panel + Telegram notif |

## 3. User Flow

```
Landing page
  → Multi-step checkout
    → Telegram notif ke admin (dengan bukti transfer)
      → Admin approve di web panel
        → Admin payout manual di Roblox (Group Payout)
          → Admin tandai completed
            → User cek status via /cek-order
```

## 4. Pages

| Halaman | Path | Fungsi |
|---------|------|--------|
| Landing/Home | `/` | Hero, daftar nominal & harga, FAQ, tombol beli |
| Checkout | `/beli` | Multi-step wizard 5 step |
| Cek Order | `/cek-order` | Input kode order, lihat status |
| Admin Login | `/admin/login` | Auth admin |
| Admin Dashboard | `/admin` | List order, filter status, approve/reject |
| Admin Order Detail | `/admin/order/[id]` | Detail order, approve/reject, catatan admin |
| Admin Settings | `/admin/settings` | Manage rekening, manage harga per nominal |

## 5. Multi-Step Checkout Flow

### Step 1: Pilih Nominal
- Grid cards menampilkan nominal Robux: 100 / 200 / 300 / 500 / 800 / 1000 / 1500 / 2000 / 3000 / 5000
- Harga per nominal (dikelola admin di settings)

### Step 2: Isi Data
- Nama (untuk admin)
- Username Roblox (tujuan kirim)
- Nomor WhatsApp (follow-up)

### Step 3: Pembayaran
- Tampilkan rekening tujuan transfer (dikelola admin)
- Harga final + nominal unik (contoh: Rp 52.123)
- Auto-generate order ID + kode unik

### Step 4: Upload Bukti
- Upload screenshot bukti transfer
- Status order: `waiting_verify`
- Telegram bot kirim notifikasi ke admin

### Step 5: Status
- Tampilkan order ID, kode unik, status
- Link ke `/cek-order`

## 6. Database Schema

### Table: `orders`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Auto generate |
| order_id | TEXT (UNIQUE) | Format: `RBX-YYYYMMDD-XXXXX` |
| code | TEXT (UNIQUE) | 6 char alphanumeric untuk cek order |
| robux_amount | INTEGER | Jumlah Robux |
| price | INTEGER | Harga dalam Rupiah |
| unique_code | INTEGER | Nominal unik untuk transfer (3 digit) |
| name | TEXT | Nama user |
| roblox_username | TEXT | Username Roblox tujuan |
| whatsapp | TEXT | Nomor WhatsApp |
| status | ENUM | `pending_payment`, `waiting_verify`, `approved`, `processing`, `completed`, `rejected`, `expired` |
| payment_proof | TEXT | URL/path gambar bukti transfer |
| admin_note | TEXT | Catatan admin (nullable) |
| created_at | TIMESTAMP | Waktu order dibuat |
| updated_at | TIMESTAMP | Waktu terakhir update |

### Table: `admins`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID (PK) | Auto generate |
| username | TEXT (UNIQUE) | Username login |
| password_hash | TEXT | Hashed password |

### Table: `config`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| key | TEXT (PK) | Nama config |
| value | TEXT | Nilai config |

Config keys yang dipakai:
- `rekening` — JSON array daftar rekening tujuan
- `pricing` — JSON object nominal → harga
- `telegram_bot_token` — Token bot Telegram
- `telegram_admin_chat_id` — Chat ID admin/group

## 7. Telegram Bot

### Notifikasi ke Admin

Ketika user submit bukti transfer, bot kirim ke admin group:

```
📦 Order: RBX-20260829-A3X7K
👤 Nama: John
🎮 Roblox: JohnPlayz
💰 Robux: 1000
💲 Harga: Rp 52.123
📱 WA: 081234567890

📷 Bukti transfer (photo)
```

Admin approve/reject dari web panel. Bukan dari Telegram command (keamanan lebih baik di web).

## 8. Admin Panel

### Dashboard (`/admin`)
- Tabel order: order ID, nama, Robux, harga, status, tanggal
- Filter: semua / pending / waiting / approved / completed / rejected
- Search by order ID atau nama

### Order Detail (`/admin/order/[id]`)
- Detail lengkap order
- Lihat bukti transfer (image preview)
- Tombol Approve / Reject
- Input catatan admin
- Update status manual

### Settings (`/admin/settings`)
- Kelola rekening tujuan transfer (tambah/hapus/edit)
- Kelola harga per nominal Robux
- Telegram bot config

## 9. Error Handling

| Skenario | Penanganan |
|----------|------------|
| Order expired | Auto expire setelah 24 jam tanpa bukti |
| Upload gagal | Retry button, validasi tipe file (jpg/png/webp, max 5MB) |
| Order ID duplikat | Generate ulang |
| Admin belum approve | Status tetap `waiting_verify` + timer |
| Roblox username salah | Admin catat di `admin_note`, reject order |

## 10. Non-Functional

- **Mobile-first** — user mayoritas dari HP
- **SEO** — landing page indexable
- **Performance** — lazy load image bukti transfer
- **Security** — admin auth (bcrypt), rate limit, input sanitization
- **Hosting** — Coolify, auto deploy dari git
