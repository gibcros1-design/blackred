# Design Specification: Telegram Notification Filtering (Proof-Only)

**Date:** 2026-10-17  
**Status:** Approved  
**Topic:** Menghentikan notifikasi Telegram untuk pesanan tanpa bukti transfer dan menyempurnakan notifikasi saat bukti transfer diunggah.

---

## 1. Problem Statement
Saat ini, setiap kali pengguna mengisi formulir checkout dan mengklik tombol submit (tahap awal pembuatan pesanan), sistem memanggil `sendTelegramOrderNotification` di `createOrderAction`. Hal ini menyebabkan admin Telegram dibanjiri notifikasi dari pengguna iseng atau calon pembeli yang belum mentransfer dana sama sekali.

Selain itu, ketika pembeli akhirnya mengunggah bukti transfer, admin menerima dua notifikasi berturut-turut:
1. Satu pesan foto dari endpoint `/api/upload` dengan rincian minimal.
2. Satu pesan teks dari `submitPaymentProofAction` dengan template pesanan umum.

## 2. Goals & Success Criteria
- **Goal 1:** Pesanan yang baru dibuat (`pending_payment`) tetap tersimpan di database untuk keperluan pencatatan riwayat atau pelacakan admin, tetapi **TIDAK** memicu notifikasi ke Telegram admin.
- **Goal 2:** Notifikasi Telegram hanya dikirim saat pembeli berhasil mengunggah bukti transfer (status: `waiting_verify`).
- **Goal 3:** Format notifikasi Telegram saat bukti transfer diunggah disatukan menjadi 1 pesan foto struk yang memiliki caption lengkap:
  - Header: Notifikasi Pesanan Masuk (Bukti Diterima)
  - ID Pesanan & Kode Cek
  - Game & Detail Item / Nominal Robux
  - Data Akun (User ID / Username & Server / Zone ID bila ada)
  - Nama Pembeli & Total Pembayaran (termasuk kode unik)
  - Link langsung WhatsApp pembeli (`https://wa.me/...`)
  - Status Pesanan: `MENUNGGU VERIFIKASI`
- **Goal 4:** Menghilangkan pesan teks duplikat dari `submitPaymentProofAction`.

## 3. Architecture & Impact Analysis

### 3.1 Flow Comparison
- **Current Flow:**
  - Submit checkout -> DB insert (`pending_payment`) -> Telegram message 1 (Draft/unpaid).
  - Upload proof -> Telegram photo 2 (Simple caption) -> DB update (`waiting_verify`) -> Telegram message 3 (Duplicate text).
- **New Streamlined Flow:**
  - Submit checkout -> DB insert (`pending_payment`) -> (Silent / No Telegram notification).
  - Upload proof -> DB update (`waiting_verify`) -> Single Telegram photo sent with complete formatted caption containing all order details.

### 3.2 Security & Integrity
- Tidak ada perubahan pada skema database atau token verifikasi keamanan (`proofToken` tetap divalidasi dengan aman).
- Validasi file (format JPG/PNG/WEBP, batas ukuran 5MB, pengecekan magic bytes) tetap aktif di `/api/upload`.

## 4. Implementation Details

### File 1: `src/app/actions/order.ts`
- Pada `createOrderAction`: Hapus pemanggilan `sendTelegramOrderNotification` setelah `db.insert(orders)`.
- Pada `submitPaymentProofAction`: Hapus pemanggilan `sendTelegramOrderNotification(updatedOrder)` untuk menghindari pesan teks duplikat setelah foto terkirim.

### File 2: `src/app/api/upload/route.ts`
- Perbarui fungsi `sendProofToTelegram`:
  - Ambil dan format detail game secara dinamis (Roblox, MLBB, PUBG, Free Fire, FC Mobile).
  - Format detail akun (termasuk Zone ID jika game MLBB, dsb).
  - Format detail item (itemName atau Robux amount).
  - Format caption lengkap berstruktur HTML yang informatif dan menyertakan link WhatsApp.
