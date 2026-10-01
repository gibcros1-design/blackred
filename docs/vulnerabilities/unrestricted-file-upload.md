# Vulnerability: Unrestricted File Upload

> CRITICAL — `/api/upload` tanpa autentikasi dan tanpa verifikasi isi file

## Description
`src/app/api/upload/route.ts` menerima POST apa pun (tanpa cek sesi admin), hanya memvalidasi `file.type` dari header Content-Type klien, lalu menulis ke `public/uploads/` dengan ekstensi yang diambil dari `file.name` klien.

Dua celah: (1) endpoint publik, (2) ekstensi bebas.

## Proof of Concept
```
POST /api/upload
Content-Type: multipart/form-data; boundary=...
--...
Content-Disposition: form-data; name="file"; filename="payload.html"
Content-Type: image/png
...isi HTML...
```
Validasi lolos karena `Content-Type: image/png`, tapi file tersimpan sebagai `/uploads/proof_1712345678900_abc.html`. Buka URL itu di origin yang sama → HTML dieksekusi (stored XSS), cukup untuk membaca cookie dan memanggil server action admin.

Ekstensi `svg` juga berbahaya (embedded `<script>`).

## Impact
Stored XSS pada origin toko → pencurian sesi admin (`httpOnly` tidak melindungi dari pemanggilan action di halaman yang sama), manipulasi konten, redirect ke phishing.

## Fix
Lihat [[fixes/harden-file-upload]].

## See Also
- [[security-audit]]
