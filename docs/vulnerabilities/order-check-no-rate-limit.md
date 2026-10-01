# Vulnerability: Order Check Tanpa Rate Limit

> HIGH — endpoint publik mengembalikan seluruh row order, bisa dibrute force

## Description
`GET /api/order/check?q=<k>` (`src/app/api/order/check/route.ts`) tanpa autentikasi dan tanpa rate limit. Responsnya `NextResponse.json({ order })` — seluruh row, termasuk:
- `whatsapp` pelanggan
- `name` pelanggan
- `robloxUsername`
- `totalPrice`, `paymentProof`

Pencarian menerima `code` (6 karakter dari 32 set) **atau** `orderId`.

## Proof of Concept
```
while true; do curl -s "http://origin/api/order/check?q=ABC123"; done
```
32^6 ≈ 1 miliar, tapi tanpa rate limit penyerang bisa menjalankan ribuan request/detik dari banyak IP. `orderId` malah lebih mudah: format `RBX-YYYYMMDD-XXXXX` → 32^5 ≈ 33 juta per tanggal, dengan tanggal pesanan yang sudah diketahui dari skema.

## Impact
Kebocoran PII pelanggan (nama, nomor WhatsApp) dalam skala besar; phishing “Anda salah transfer, hubungi WhatsApp ini”.

## Fix
1. Rate limit per IP (mis. `lib/ratelimit.ts` 5 req/menit) — belum ada di repo, buat baru.
2. Kembalikan hanya field yang dibutuhkan tampilan, jangan `*`.
3. Validasi format `q` sebelum query.

## See Also
- [[security-audit]]
