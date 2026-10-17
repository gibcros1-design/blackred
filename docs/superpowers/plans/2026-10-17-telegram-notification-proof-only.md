# Telegram Notification Proof-Only Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghentikan notifikasi Telegram untuk pesanan yang belum dibayar / belum ada bukti transfer, dan memformat notifikasi Telegram saat bukti diunggah agar menjadi satu pesan foto komprehensif tanpa duplikasi.

**Architecture:** Modifikasi endpoint upload bukti transfer (`/api/upload/route.ts`) untuk mengirim foto dengan caption komprehensif (game, item, akun, zone id, total rupiah, link wa, status), serta menghapus pemanggilan `sendTelegramOrderNotification` saat pembuatan pesanan awal dan sesudah upload bukti di `src/app/actions/order.ts`.

**Tech Stack:** Next.js 14/15 App Router, TypeScript, Drizzle ORM, Telegram Bot API.

## Global Constraints
- Tidak merubah schema DB `orders`.
- Token otorisasi `proofToken` tetap terjaga keamanannya.
- Semua string dinamis dalam caption Telegram wajib di-escape dengan `escapeTelegramHtml`.

---

### Task 1: Format Telegram Photo Notification with Complete Order Details

**Files:**
- Modify: `src/app/api/upload/route.ts:27-56`

**Interfaces:**
- Consumes: `order: typeof orders.$inferSelect`, `file: File`
- Produces: `sendProofToTelegram(file: File, order: typeof orders.$inferSelect): Promise<boolean>`

- [x] **Step 1: Inspect existing `sendProofToTelegram` function**
Check existing implementation in `src/app/api/upload/route.ts`.

- [x] **Step 2: Update `sendProofToTelegram` with rich caption**
Update caption to include:
  - Game name mapping (MLBB, PUBG, Free Fire, FC Mobile, Roblox)
  - Account detail with Server/Zone if exists
  - Item detail (itemName or robuxAmount)
  - Customer name & formatted Rupiah total
  - WhatsApp direct link (`https://wa.me/...`)
  - Order Code and Order ID

- [x] **Step 3: Verify syntax in `src/app/api/upload/route.ts`**
Run: `npm run lint` or `npx tsc --noEmit`

---

### Task 2: Remove Premature Telegram Notification from Order Actions

**Files:**
- Modify: `src/app/actions/order.ts`

**Interfaces:**
- Consumes: `createOrderAction`, `submitPaymentProofAction`
- Produces: Cleaned action without early Telegram notification and without duplicate text message.

- [x] **Step 1: Remove `sendTelegramOrderNotification` call from `createOrderAction`**
Remove lines 115-122 in `src/app/actions/order.ts` where notification is dispatched immediately upon order creation.

- [x] **Step 2: Remove redundant text notification from `submitPaymentProofAction`**
Remove lines 170-174 in `src/app/actions/order.ts` because the rich photo notification has already been dispatched with full details by `/api/upload`.

- [x] **Step 3: Remove unused import if no longer needed**
Check if `sendTelegramOrderNotification` is still needed in `src/app/actions/order.ts`. If unused, remove or keep as needed.

---

### Task 3: Build & Verification

**Files:**
- Test/Verify: `src/app/actions/order.ts`, `src/app/api/upload/route.ts`

- [x] **Step 1: Run type checking**
Run `npx tsc --noEmit` to verify there are no TypeScript errors.

- [x] **Step 2: Verify order creation and upload routes**
Review the diffs and confirm all constraints are satisfied.
