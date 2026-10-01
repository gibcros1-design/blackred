# Vulnerability: Server Action Tanpa Autentikasi

> CRITICAL — semua mutasi admin bisa dipanggil pihak luar tanpa sesi

## Description

Lima server action diekspor dengan `"use server"` dan tidak ada satu pun yang memanggil `verifyAdminSession()` dari `src/lib/auth.ts`. Server action Next.js berupa endpoint HTTP POST yang bisa dipanggil dari situs mana pun; proteksi `middleware.ts` **hanya** mencocokkan `admin/:path*`, sehingga `/_next/action/*` tidak pernah melewati pemeriksaan sesi.

Server Action terdampak:
- `src/app/actions/admin-order.ts` — `updateOrderStatusAction`
- `src/app/actions/settings.ts` — `saveSettingsAction`
- `src/app/actions/auth.ts` — `loginAdminAction` (brute force), `logoutAdminAction`
- `src/app/actions/order.ts` — `createOrderAction`, `submitPaymentProofAction`

## Proof of Concept

Dari origin mana pun, kirim request action dengan header `Next-Action` (id diambil dari bundle halaman mana pun yang memakai action tersebut):

```
POST /_next/action/<ACTION_ID> HTTP/1.1
Host: <origin>
Next-Action: <ACTION_ID>
Content-Type: text/plain;charset=UTF-8

[<orderId>,"completed",""]
```

Tidak ada cookie `lapak_admin_session` yang dikirim; respons sukses dan status order di DB berubah.

Cara praktis tanpa mem-petakan id: panggil `saveSettingsAction` lewat form post ke origin dari `http://attacker.tld` — tanpa origin check, payload diterima.

## Impact

- Ubah status order apa pun jadi `completed` / `rejected` (manipulasi penipuan)
- Ganti **seluruh daftar harga dan rekening transfer** toko → pembeli mengirim uang ke rekening penyerang
- Ganti nomor WhatsApp admin & gambar QRIS → alihkan korban
- Isi `telegram_bot_token` milik penyerang → bocorkan data order ke channel eksternal
- `loginAdminAction` tanpa rate limit → brute force kredensial admin

## Fix

Panggil guard di setiap mutasi. Lihat [[fixes/add-admin-auth-guard]].

## See Also
- [[security-audit]]
