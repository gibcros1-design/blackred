# Vulnerability: Order Code Pakai Math.random()

> HIGH — kode cek dan kode unik transfer bukan CSPRNG

## Description
`src/services/order.ts` memakai `Math.random()` untuk semua token:
- `generateOrderCode(6)` → kode cek pelanggan (dipakai `Lacak Order`)
- `generateOrderId()` → suffix 5 karakter
- `generateUniqueCode()` → kode unik transfer

`Math.random()` bukan cryptographically secure; output-nya bisa diprediksi dari sebagian output yang diamati.

## Proof of Concept
`generateUniqueCode` (`100..999`) dihitung **sebelum** order dibuat, dan nilai `totalPrice` ditampilkan ke pelanggan. Dengan beberapa sample `totalPrice - price`, penyerang mendapat beberapa output berturut-turut dari PRNG yang sama → bisa memperkirakan `generateOrderCode(6)` pesanan berikutnya, lalu membuka status order via `/cek-order`.

## Impact
Pengungkapan status & detail order pihak ketiga; mengetahui kode sebelum pelanggan memakainya.

## Fix
Ganti ke `crypto`:
```ts
import { randomInt, randomBytes } from "crypto";
// randomInt(32) untuk tiap karakter, atau base32 dari randomBytes
```

## See Also
- [[security-audit]]
