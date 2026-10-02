# Bukti Transfer via Telegram (tanpa Supabase Storage)

**Tanggal:** 2026-10-02 · **Status:** Disetujui user

## Keputusan

Bukti transfer **tidak disimpan** di Supabase Storage. Diteruskan (forward) langsung ke Telegram admin, fire-and-forget. Kolom `paymentProof` cuma penanda `"telegram"`.

## Alur

1. Step4UploadProof → `POST /api/upload` (orderId + proofToken) → file dibaca ke memori → `sendPhoto` ke Telegram (caption: order ID, nama, total) → response OK. Tidak ada penyimpanan.
2. Step4 → `submitPaymentProofAction(orderId, proofToken)` → validasi token + status → set `status=waiting_verify`, `paymentProof="telegram"`.
3. Admin detail order: kotak bukti = teks "Bukti transfer diterima — lihat di Telegram admin". Tanpa signed URL.

## Hapus

- `proofExists()` + bucket `proofs` (hanya `assets` untuk QRIS/banner, tetap).
- Validasi file existence di submit action.
- Signed URL proof di admin page & telegram service (sendPhoto kini pakai buffer langsung).

## Gagal

- Telegram tidak dikonfigurasi → upload dibalas 502 + pesan jelas (jangan telan diam-diam — bukti hilang permanen).

## Verifikasi

`tsc --noEmit` + `next build` lulus.
