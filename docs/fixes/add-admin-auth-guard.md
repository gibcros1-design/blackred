# Fix: Add Admin Auth Guard

> CRITICAL — tambahkan `verifyAdminSession()` ke semua server action admin

## Current Code
`src/app/actions/admin-order.ts:7` dan `src/app/actions/settings.ts:6` langsung menulis DB:
```ts
export async function updateOrderStatusAction(orderId: string, status: any, adminNote?: string) {
  await db.update(orders)...
```

## Fix
1. Tambahkan helper guard di `src/lib/auth.ts`:
```ts
export async function requireAdmin(): Promise<{ ok: boolean }> {
  const session = await verifyAdminSession();
  if (!session) return { ok: false };
  return { ok: true };
}
```
2. Panggil di awal **setiap** action mutasi admin, dan return error bila gagal:
```ts
const { ok } = await requireAdmin();
if (!ok) return { success: false, error: "Tidak berwenang." };
```
3. `saveSettingsAction` dan `updateOrderStatusAction` — wajib.
4. `loginAdminAction`/`logoutAdminAction` — izinkan tanpa guard (login memang publik), tapi tambahkan rate limit (lihat fix lain).

## Steps
- [ ] Guard `saveSettingsAction`
- [ ] Guard `updateOrderStatusAction`
- [ ] Guard `submitPaymentProofAction` (pelanggan harus sudah punya order valid; minimal validasi orderId ada & status sesuai)
- [ ] Test: `curl` action tanpa cookie → harus ditolak

## See Also
- [[vulnerabilities/unauthenticated-server-actions]]
- [[security-audit]]
