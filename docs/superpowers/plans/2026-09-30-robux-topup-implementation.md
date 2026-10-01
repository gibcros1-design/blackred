# Platform Topup Roblox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a direct-seller Roblox top-up web application featuring a 5-step checkout wizard, proof-of-transfer uploads, Telegram admin notifications, order tracking, and an admin management dashboard.

**Architecture:** Next.js (App Router) monolithic application with server actions and API routes. Data persistence is managed via Drizzle ORM with PostgreSQL (or SQLite for zero-config local development with seamless PostgreSQL connection string support via environment variables). Admin authentication is session-cookie based with bcrypt. File uploads are handled securely via local public storage or Supabase/S3 compatible storage, and Telegram Bot API delivers real-time order alerts.

**Tech Stack:** Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Drizzle ORM, PostgreSQL / better-sqlite3 driver, bcryptjs, Jose / Iron-session for admin auth.

## Global Constraints

- Tech Stack: Next.js (App Router) + Shadcn UI + Tailwind CSS + PostgreSQL/SQLite + Drizzle ORM + Coolify
- Business Model: Direct seller (Robux payout via manual Roblox Group Payout / Game Pass)
- Payment: Manual bank & e-wallet transfer with 3-digit unique transfer code (e.g. Rp 52.123)
- Order ID format: `RBX-YYYYMMDD-XXXXX`
- Order Code format: 6-character uppercase alphanumeric string for quick order status lookup
- Status Enum: `pending_payment`, `waiting_verify`, `approved`, `processing`, `completed`, `rejected`, `expired`
- Upload constraints: Image types (JPG, PNG, WEBP), max size 5MB
- Design Style: Dark Gaming aesthetic (dark mode `#09090b` / `#0f172a` with vibrant emerald/cyan and gold accents, glassmorphic cards, mobile-first responsive)

---

### Task 1: Project Initialization & UI Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/lib/utils.ts`
- Create: `.env.example`
- Create: `.env`

**Interfaces:**
- Produces: `cn(...inputs)` class name merge utility in `src/lib/utils.ts`
- Produces: Base responsive layout with dark theme typography and toast notifications container

- [ ] **Step 1: Initialize Next.js project and dependencies**

Install dependencies including Next.js, React, Tailwind, Lucide React, Drizzle, and helper utilities:
```bash
npm init -y
npm install next@latest react@latest react-dom@latest lucide-react clsx tailwind-merge bcryptjs jose drizzle-orm better-sqlite3 dotenv
npm install -D typescript @types/node @types/react @types/react-dom @types/better-sqlite3 @types/bcryptjs tailwindcss @tailwindcss/postcss postcss drizzle-kit
```

- [ ] **Step 2: Create TypeScript and Next.js configuration**

Write `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Write `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
```

Write `postcss.config.mjs`:
```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 3: Setup Tailwind CSS design tokens and base styles**

Write `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
```

Write `src/app/globals.css`:
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 6%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 6%;
    --popover-foreground: 0 0% 98%;
    --primary: 142.1 76.2% 42%;
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 18%;
    --input: 240 3.7% 18%;
    --ring: 142.1 76.2% 42%;
  }
}

body {
  background-color: #09090b;
  color: #f4f4f5;
  font-feature-settings: "rlig" 1, "calt" 1;
}
```

Write `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lapak Robux - Topup Robux Roblox Cepat, Murah & Terpercaya",
  description: "Beli Robux Roblox via Group Payout & Game Pass langsung ke akunmu. Proses cepat, harga terbaik, pembayaran via Transfer Bank & E-Wallet.",
  keywords: ["robux murah", "topup robux", "beli robux", "roblox indonesia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create environment files**

Write `.env.example`:
```env
DATABASE_URL="file:./dev.db"
ADMIN_JWT_SECRET="super-secret-key-change-this-in-production-min-32-chars"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_ADMIN_CHAT_ID=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Copy `.env.example` to `.env`.

- [ ] **Step 5: Verify build scaffolding**

Run: `npx next build`
Expected: Next.js builds successfully with 0 errors.

---

### Task 2: Database Schema & Migration Layer (Drizzle ORM)

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`
- Create: `drizzle.config.ts`
- Create: `src/db/seed.ts`

**Interfaces:**
- Produces: `orders`, `admins`, `config` table schemas
- Produces: `db` query client exporting standard Drizzle queries
- Produces: Seed script generating default admin credentials (`admin` / `admin123`) and default nominal pricing and bank accounts

- [ ] **Step 1: Define Drizzle schema for SQLite/Postgres compatibility**

Write `src/db/schema.ts`:
```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(), // UUID v4
  orderId: text("order_id").notNull().unique(), // RBX-YYYYMMDD-XXXXX
  code: text("code").notNull().unique(), // 6 char alphanumeric
  robuxAmount: integer("robux_amount").notNull(),
  price: integer("price").notNull(), // Base nominal price in IDR
  uniqueCode: integer("unique_code").notNull(), // 3 digit unique transfer code
  totalPrice: integer("total_price").notNull(), // price + uniqueCode
  name: text("name").notNull(),
  robloxUsername: text("roblox_username").notNull(),
  whatsapp: text("whatsapp").notNull(),
  status: text("status", {
    enum: ["pending_payment", "waiting_verify", "approved", "processing", "completed", "rejected", "expired"]
  }).notNull().default("pending_payment"),
  paymentProof: text("payment_proof"), // image URL or base64 / uploads path
  adminNote: text("admin_note"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const config = sqliteTable("config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type ConfigItem = typeof config.$inferSelect;
```

- [ ] **Step 2: Setup Database client connection**

Write `src/db/index.ts`:
```typescript
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
```

Write `drizzle.config.ts`:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./dev.db",
  },
});
```

- [ ] **Step 3: Create database seed script**

Write `src/db/seed.ts`:
```typescript
import { db } from "./index";
import { admins, config, orders } from "./schema";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  console.log("Seeding database...");

  // Default Admin
  const adminId = "adm-" + Date.now();
  const passwordHash = await bcrypt.hash("admin123", 10);
  
  try {
    await db.insert(admins).values({
      id: adminId,
      username: "admin",
      passwordHash,
    }).onConflictDoNothing();
    console.log("Admin account created: username 'admin', password 'admin123'");
  } catch (e) {
    console.log("Admin already exists or error:", e);
  }

  // Default Pricing
  const defaultPricing = [
    { robux: 100, price: 12000 },
    { robux: 200, price: 24000 },
    { robux: 300, price: 35000 },
    { robux: 500, price: 58000 },
    { robux: 800, price: 92000 },
    { robux: 1000, price: 114000 },
    { robux: 1500, price: 170000 },
    { robux: 2000, price: 225000 },
    { robux: 3000, price: 335000 },
    { robux: 5000, price: 550000 },
  ];

  // Default Rekening
  const defaultRekening = [
    { bank: "BCA", nomor: "8735123984", atasNama: "ROBLOX TOPUP STORE" },
    { bank: "BRI", nomor: "019283746519283", atasNama: "ROBLOX TOPUP STORE" },
    { bank: "DANA", nomor: "081234567890", atasNama: "ROBLOX TOPUP STORE" },
    { bank: "GoPay / QRIS", nomor: "081234567890", atasNama: "ROBLOX TOPUP STORE" },
  ];

  await db.insert(config).values([
    { key: "pricing", value: JSON.stringify(defaultPricing) },
    { key: "rekening", value: JSON.stringify(defaultRekening) },
    { key: "telegram_bot_token", value: "" },
    { key: "telegram_admin_chat_id", value: "" },
  ]).onConflictDoNothing();

  console.log("Config seeded.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
```

- [ ] **Step 4: Execute database push and seeding**

Run:
```bash
npx drizzle-kit push
npx tsx src/db/seed.ts
```
Expected: SQLite tables `orders`, `admins`, `config` created in `dev.db`, default records populated.

---

### Task 3: Core Services (Order Generator, Telegram Bot & Proof Upload)

**Files:**
- Create: `src/services/order.ts`
- Create: `src/services/telegram.ts`
- Create: `src/services/config.ts`
- Create: `src/app/api/upload/route.ts`

**Interfaces:**
- Produces: `generateOrderId()` returning `RBX-YYYYMMDD-XXXXX`
- Produces: `generateOrderCode()` returning 6-character uppercase alphanumeric string
- Produces: `generateUniqueCode()` returning random 100-999
- Produces: `sendTelegramOrderNotification(order: Order, proofBase64OrUrl?: string)`
- Produces: `/api/upload` endpoint for saving proof image with validation (max 5MB, JPG/PNG/WEBP)

- [ ] **Step 1: Write order generation helpers**

Write `src/services/order.ts`:
```typescript
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export function generateOrderCode(length: number = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars I, O, 0, 1
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateOrderId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const suffix = generateOrderCode(5);
  return `RBX-${yyyy}${mm}${dd}-${suffix}`;
}

export function generateUniqueCode(): number {
  return Math.floor(Math.random() * 900) + 100; // 100 - 999
}
```

- [ ] **Step 2: Write Config helper**

Write `src/services/config.ts`:
```typescript
import { db } from "@/db";
import { config } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface PricingItem {
  robux: number;
  price: number;
}

export interface RekeningItem {
  bank: string;
  nomor: string;
  atasNama: string;
}

export async function getConfigValue<T>(key: string, defaultValue: T): Promise<T> {
  const row = await db.query.config.findFirst({
    where: eq(config.key, key),
  });
  if (!row || !row.value) return defaultValue;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return (row.value as unknown) as T;
  }
}

export async function setConfigValue(key: string, value: string): Promise<void> {
  const existing = await db.query.config.findFirst({
    where: eq(config.key, key),
  });
  if (existing) {
    await db.update(config).set({ value }).where(eq(config.key, key));
  } else {
    await db.insert(config).values({ key, value });
  }
}
```

- [ ] **Step 3: Write Telegram notification service**

Write `src/services/telegram.ts`:
```typescript
import { getConfigValue } from "./config";
import { Order } from "@/db/schema";
import { formatRupiah } from "@/lib/utils";

export async function sendTelegramOrderNotification(order: Order): Promise<boolean> {
  const botToken = (await getConfigValue<string>("telegram_bot_token", "")) || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = (await getConfigValue<string>("telegram_admin_chat_id", "")) || process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram bot token or chat ID is missing. Notification skipped.");
    return false;
  }

  const message = `
📦 <b>ORDER MASUK BARU!</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>Order ID:</b> <code>${order.orderId}</code>
🔑 <b>Kode Cek:</b> <code>${order.code}</code>
👤 <b>Nama:</b> ${order.name}
🎮 <b>Roblox Username:</b> <b>${order.robloxUsername}</b>
💎 <b>Jumlah Robux:</b> <b>${order.robuxAmount.toLocaleString("id-ID")} R$</b>
💰 <b>Total Bayar:</b> <b>${formatRupiah(order.totalPrice)}</b>
📱 <b>WhatsApp:</b> https://wa.me/${order.whatsapp.replace(/^0/, "62")}
📊 <b>Status:</b> ${order.status.toUpperCase()}
━━━━━━━━━━━━━━━━━━
<i>Silakan verifikasi bukti transfer di admin dashboard.</i>
`.trim();

  try {
    // If order has payment proof photo
    if (order.paymentProof && order.paymentProof.startsWith("data:image")) {
      const base64Data = order.paymentProof.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("caption", message);
      formData.append("parse_mode", "HTML");
      const blob = new Blob([buffer], { type: "image/jpeg" });
      formData.append("photo", blob, "bukti_transfer.jpg");

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData,
      });
      return res.ok;
    } else {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });
      return res.ok;
    }
  } catch (error) {
    console.error("Failed to send telegram notification:", error);
    return false;
  }
}
```

- [ ] **Step 4: Write proof upload API route**

Write `src/app/api/upload/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak valid. Hanya JPG, PNG, dan WEBP yang diizinkan." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimal 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `proof_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah gambar" }, { status: 500 });
  }
}
```

---

### Task 4: Public Landing Page (`/`)

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/HeroSection.tsx`
- Create: `src/components/PricingGrid.tsx`
- Create: `src/components/FaqSection.tsx`
- Create: `src/components/HowToOrder.tsx`
- Create: `src/app/page.tsx`

**Interfaces:**
- Produces: Visual homepage with responsive navigation, quick buy triggers, pricing cards linking directly to checkout `/beli?robux=XXX`, FAQ accordion, and trust indicators

- [ ] **Step 1: Create Navbar and Footer components**

Write `src/components/Navbar.tsx`:
```tsx
import Link from "next/link";
import { ShieldCheck, Search, ShoppingBag } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 font-black text-black">
            R$
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            LAPAK<span className="text-emerald-400">ROBUX</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/cek-order"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:border-emerald-500 hover:text-white"
          >
            <Search className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Lacak</span> Order
          </Link>
          <Link
            href="/beli"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            <ShoppingBag className="h-4 w-4" />
            Beli Sekarang
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

Write `src/components/Footer.tsx`:
```tsx
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-10 text-zinc-400">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500 text-xs font-bold text-black">
                R$
              </div>
              <span className="text-lg font-bold text-white">
                LAPAK<span className="text-emerald-400">ROBUX</span>
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Layanan top-up Robux Roblox terpercaya, cepat, dan aman via Group Payout & Game Pass.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-emerald-400">Beranda</Link>
            <Link href="/beli" className="hover:text-emerald-400">Pesan Robux</Link>
            <Link href="/cek-order" className="hover:text-emerald-400">Cek Status Order</Link>
            <Link href="/admin/login" className="text-zinc-600 hover:text-zinc-400">Admin</Link>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800/80 pt-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} LapakRobux. Seluruh hak cipta dilindungi. Roblox adalah merek dagang Roblox Corporation.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Create Hero, Pricing Grid, and FAQ components**

Write `src/components/HeroSection.tsx`:
```tsx
import Link from "next/link";
import { Zap, ShieldCheck, Clock, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />
      
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          <Zap className="h-3.5 w-3.5" />
          Proses Cepat via Group Payout & Game Pass
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl text-white">
          Beli Robux Roblox <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Mudah, Murah & Bergaransi
          </span>
        </h1>

        <p className="mt-4 text-base text-zinc-400 sm:text-lg">
          Tanpa ribet bikin akun, cukup pilih nominal, bayar transfer manual, konfirmasi via kode unik, dan Robux langsung dikirimkan ke username Roblox kamu.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/beli"
            className="w-full rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-bold text-black shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 sm:w-auto"
          >
            Mulai Topup Sekarang
          </Link>
          <Link
            href="/cek-order"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-8 py-3.5 text-base font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white sm:w-auto"
          >
            Lacak Pesanan Saya
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-8 sm:grid-cols-4 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Pengiriman</p>
              <p className="text-sm font-bold text-white">5 - 30 Menit</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Keamanan</p>
              <p className="text-sm font-bold text-white">100% Legal & Aman</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Layanan</p>
              <p className="text-sm font-bold text-white">Setiap Hari</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Pelanggan</p>
              <p className="text-sm font-bold text-white">1.000+ Terlayani</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Write `src/components/PricingGrid.tsx`:
```tsx
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { PricingItem } from "@/services/config";
import { ArrowRight, Flame } from "lucide-react";

interface PricingGridProps {
  items: PricingItem[];
}

export function PricingGrid({ items }: PricingGridProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Pilihan Nominal Robux & Harga
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Pilih nominal yang kamu inginkan, klik beli untuk langsung masuk ke form pemesanan
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => {
            const isPopular = item.robux === 800 || item.robux === 1000;
            return (
              <div
                key={item.robux}
                className={`relative flex flex-col justify-between rounded-xl border p-4 transition hover:-translate-y-1 ${
                  isPopular
                    ? "border-emerald-500/60 bg-gradient-to-b from-emerald-950/20 to-zinc-900 shadow-lg shadow-emerald-950/30"
                    : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-black">
                    <Flame className="h-3 w-3 fill-black" /> Populer
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="font-semibold text-emerald-400">R$</span>
                    <span className="text-xs font-medium">Robux</span>
                  </div>
                  <p className="mt-1 text-2xl font-black text-white">
                    {item.robux.toLocaleString("id-ID")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-emerald-400">
                    {formatRupiah(item.price)}
                  </p>
                </div>

                <Link
                  href={`/beli?robux=${item.robux}`}
                  className={`mt-4 flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold transition ${
                    isPopular
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  Beli Sekarang <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

Write `src/components/FaqSection.tsx`:
```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Berapa lama proses pengiriman Robux?",
    a: "Setelah bukti transfer diverifikasi oleh admin kami, pengiriman memakan waktu antara 5 hingga 30 menit pada jam operasional toko.",
  },
  {
    q: "Metode apa yang digunakan untuk mengirimkan Robux?",
    a: "Pengiriman menggunakan metode Group Payout resmi atau Game Pass pembelian langsung dari inventaris Roblox akun kamu.",
  },
  {
    q: "Apakah akun Roblox saya aman? Butuh password?",
    a: "Sangat aman! Kami SAMA SEKALI TIDAK MEMINTA PASSWORD akun Roblox Anda. Kami hanya memerlukan username Roblox Anda saja.",
  },
  {
    q: "Bagaimana cara memeriksa status pesanan saya?",
    a: "Setiap transaksi akan mendapatkan Order ID dan Kode Unik 6 Karakter. Anda dapat memeriksa progress status secara real-time di halaman Cek Order.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 border-t border-zinc-800/80">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          Pertanyaan Sering Diajukan (FAQ)
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-zinc-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
                      isOpen ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-zinc-800/60 px-4 py-3 text-sm text-zinc-400">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Assemble Landing Page `src/app/page.tsx`**

Write `src/app/page.tsx`:
```tsx
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { PricingGrid } from "@/components/PricingGrid";
import { FaqSection } from "@/components/FaqSection";
import { getConfigValue, PricingItem } from "@/services/config";

export const revalidate = 60; // ISR cache 60s

export default async function HomePage() {
  const pricing = await getConfigValue<PricingItem[]>("pricing", [
    { robux: 100, price: 12000 },
    { robux: 200, price: 24000 },
    { robux: 300, price: 35000 },
    { robux: 500, price: 58000 },
    { robux: 800, price: 92000 },
    { robux: 1000, price: 114000 },
    { robux: 1500, price: 170000 },
    { robux: 2000, price: 225000 },
    { robux: 3000, price: 335000 },
    { robux: 5000, price: 550000 },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PricingGrid items={pricing} />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
```

---

### Task 5: 5-Step Checkout Wizard (`/beli`)

**Files:**
- Create: `src/app/beli/page.tsx`
- Create: `src/components/checkout/CheckoutWizard.tsx`
- Create: `src/components/checkout/Step1Nominal.tsx`
- Create: `src/components/checkout/Step2UserData.tsx`
- Create: `src/components/checkout/Step3Payment.tsx`
- Create: `src/components/checkout/Step4UploadProof.tsx`
- Create: `src/components/checkout/Step5Success.tsx`
- Create: `src/app/actions/order.ts`

**Interfaces:**
- Produces: Server action `createOrderAction(data)` persisting order in `pending_payment` status with unique transfer code
- Produces: Server action `submitPaymentProofAction(orderId, proofUrl)` updating status to `waiting_verify` and triggering Telegram alert
- Produces: 5-step wizard client experience with state persistence and back/forward navigation

- [ ] **Step 1: Write Order Server Actions**

Write `src/app/actions/order.ts`:
```typescript
"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { generateOrderId, generateOrderCode, generateUniqueCode } from "@/services/order";
import { sendTelegramOrderNotification } from "@/services/telegram";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function createOrderAction(formData: {
  robuxAmount: number;
  price: number;
  name: string;
  robloxUsername: string;
  whatsapp: string;
}) {
  const uniqueCode = generateUniqueCode();
  const totalPrice = formData.price + uniqueCode;
  const orderId = generateOrderId();
  const code = generateOrderCode(6);
  const id = uuidv4();

  const newOrder = {
    id,
    orderId,
    code,
    robuxAmount: formData.robuxAmount,
    price: formData.price,
    uniqueCode,
    totalPrice,
    name: formData.name.trim(),
    robloxUsername: formData.robloxUsername.trim(),
    whatsapp: formData.whatsapp.trim(),
    status: "pending_payment" as const,
  };

  await db.insert(orders).values(newOrder);

  return { success: true, order: newOrder };
}

export async function submitPaymentProofAction(orderId: string, proofUrl: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.orderId, orderId),
  });

  if (!order) {
    return { success: false, error: "Pesanan tidak ditemukan" };
  }

  await db
    .update(orders)
    .set({
      paymentProof: proofUrl,
      status: "waiting_verify",
      updatedAt: new Date().toISOString(),
    })
    .where(eq(orders.orderId, orderId));

  const updatedOrder = await db.query.orders.findFirst({
    where: eq(orders.orderId, orderId),
  });

  if (updatedOrder) {
    // Fire-and-forget Telegram notification
    sendTelegramOrderNotification(updatedOrder).catch((err) =>
      console.error("Telegram notification error:", err)
    );
  }

  return { success: true };
}
```

- [ ] **Step 2: Create Checkout Wizard Steps components**

Write `src/components/checkout/Step1Nominal.tsx`:
```tsx
import { PricingItem } from "@/services/config";
import { formatRupiah } from "@/lib/utils";

interface Step1Props {
  pricing: PricingItem[];
  selectedRobux: number | null;
  onSelect: (robux: number, price: number) => void;
  onNext: () => void;
}

export function Step1Nominal({ pricing, selectedRobux, onSelect, onNext }: Step1Props) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white">Langkah 1: Pilih Nominal Robux</h3>
      <p className="text-xs text-zinc-400 mt-1">
        Pilih jumlah Robux yang ingin Anda beli.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {pricing.map((item) => {
          const isSelected = selectedRobux === item.robux;
          return (
            <button
              type="button"
              key={item.robux}
              onClick={() => onSelect(item.robux, item.price)}
              className={`rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/50"
                  : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
              }`}
            >
              <div className="text-xs font-semibold text-emerald-400">R$ ROBUX</div>
              <div className="mt-1 text-xl font-black text-white">{item.robux.toLocaleString("id-ID")}</div>
              <div className="mt-2 text-xs font-medium text-zinc-300">{formatRupiah(item.price)}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!selectedRobux}
          onClick={onNext}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:opacity-40"
        >
          Lanjut ke Data Akun →
        </button>
      </div>
    </div>
  );
}
```

Write `src/components/checkout/Step2UserData.tsx`:
```tsx
import { useState } from "react";

interface Step2Props {
  initialData: { name: string; robloxUsername: string; whatsapp: string };
  onBack: () => void;
  onSubmit: (data: { name: string; robloxUsername: string; whatsapp: string }) => void;
}

export function Step2UserData({ initialData, onBack, onSubmit }: Step2Props) {
  const [name, setName] = useState(initialData.name);
  const [robloxUsername, setRobloxUsername] = useState(initialData.robloxUsername);
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !robloxUsername.trim() || !whatsapp.trim()) {
      setError("Semua kolom data wajib diisi.");
      return;
    }
    setError("");
    onSubmit({ name, robloxUsername, whatsapp });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-bold text-white">Langkah 2: Isi Data Pemesan & Akun</h3>
      <p className="text-xs text-zinc-400 mt-1">
        Pastikan Username Roblox Anda benar. Password TIDAK dibutuhkan!
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300">Nama Lengkap</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300">Username Roblox Tujuan</label>
          <input
            type="text"
            required
            value={robloxUsername}
            onChange={(e) => setRobloxUsername(e.target.value)}
            placeholder="Contoh: RobloxPlayer123"
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-zinc-500">
            Username game Roblox Anda yang akan menerima Robux.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300">Nomor WhatsApp Aktif</label>
          <input
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-zinc-500">
            Untuk konfirmasi atau update pesanan oleh admin jika dibutuhkan.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
        >
          ← Kembali
        </button>
        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400"
        >
          Lanjut ke Pembayaran →
        </button>
      </div>
    </form>
  );
}
```

Write `src/components/checkout/Step3Payment.tsx`:
```tsx
import { RekeningItem } from "@/services/config";
import { formatRupiah } from "@/lib/utils";
import { Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Step3Props {
  order: {
    orderId: string;
    code: string;
    robuxAmount: number;
    price: number;
    uniqueCode: number;
    totalPrice: number;
  };
  rekeningList: RekeningItem[];
  onNext: () => void;
}

export function Step3Payment({ order, rekeningList, onNext }: Step3Props) {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const handleCopy = (nomor: string, bank: string) => {
    navigator.clipboard.writeText(nomor);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-white">Langkah 3: Pembayaran Transfer</h3>
      <p className="text-xs text-zinc-400 mt-1">
        Silakan transfer <b>tepat sesuai nominal unik</b> di bawah ini agar verifikasi otomatis/cepat.
      </p>

      <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Total Yang Harus Ditransfer:</span>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
            Kode Unik: +{order.uniqueCode}
          </span>
        </div>
        <div className="mt-1 text-2xl font-black text-emerald-400">
          {formatRupiah(order.totalPrice)}
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          Order ID: <code className="text-zinc-200">{order.orderId}</code> (Kode Cek: <code className="text-emerald-400">{order.code}</code>)
        </p>
      </div>

      <div className="mt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pilihan Rekening Pembayaran</h4>
        <div className="mt-2 space-y-2">
          {rekeningList.map((rek, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5"
            >
              <div>
                <span className="font-bold text-white">{rek.bank}</span>
                <p className="text-xs text-zinc-400">a.n. {rek.atasNama}</p>
                <code className="text-sm font-semibold text-emerald-300">{rek.nomor}</code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(rek.nomor, rek.bank)}
                className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-emerald-500 hover:text-white"
              >
                {copiedBank === rek.bank ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Salin
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          Simpan bukti screenshot transfer setelah berhasil melakukan pembayaran untuk di-upload pada langkah berikutnya.
        </span>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400"
        >
          Saya Sudah Transfer (Upload Bukti) →
        </button>
      </div>
    </div>
  );
}
```

Write `src/components/checkout/Step4UploadProof.tsx`:
```tsx
import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface Step4Props {
  orderId: string;
  onSuccess: () => void;
  onSubmitProof: (orderId: string, proofUrl: string) => Promise<{ success: boolean; error?: string }>;
}

export function Step4UploadProof({ orderId, onSuccess, onSubmitProof }: Step4Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setError("Hanya format JPG, PNG, atau WEBP yang diperbolehkan.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5MB.");
      return;
    }

    setError("");
    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleUploadAndSubmit = async () => {
    if (!file) {
      setError("Silakan pilih foto bukti transfer terlebih dahulu.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Upload file to /api/upload
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah foto.");
      }

      // Submit proof to database and Telegram
      const result = await onSubmitProof(orderId, data.url);
      if (!result.success) {
        throw new Error(result.error || "Gagal menyimpan konfirmasi.");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-white">Langkah 4: Upload Bukti Transfer</h3>
      <p className="text-xs text-zinc-400 mt-1">
        Kirimkan screenshot struk transfer bank atau e-wallet Anda.
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5">
        <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-6 text-center cursor-pointer transition hover:border-emerald-500">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          {preview ? (
            <div className="flex flex-col items-center">
              <img
                src={preview}
                alt="Preview Bukti"
                className="max-h-56 rounded-lg object-contain border border-zinc-700 shadow"
              />
              <span className="mt-3 text-xs text-emerald-400 font-medium">
                Klik untuk mengganti foto
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="h-10 w-10 text-zinc-400" />
              <p className="mt-2 text-sm font-semibold text-white">
                Klik atau seret foto bukti transfer ke sini
              </p>
              <p className="mt-1 text-xs text-zinc-500">JPG, PNG, atau WEBP (Maksimal 5MB)</p>
            </div>
          )}
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!file || uploading}
          onClick={handleUploadAndSubmit}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:opacity-40"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Mengirim Bukti...
            </>
          ) : (
            "Konfirmasi Pembayaran →"
          )}
        </button>
      </div>
    </div>
  );
}
```

Write `src/components/checkout/Step5Success.tsx`:
```tsx
import Link from "next/link";
import { CheckCircle, Search, MessageSquare } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface Step5Props {
  order: {
    orderId: string;
    code: string;
    robuxAmount: number;
    totalPrice: number;
    robloxUsername: string;
  };
}

export function Step5Success({ order }: Step5Props) {
  return (
    <div className="text-center py-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
        <CheckCircle className="h-10 w-10" />
      </div>

      <h3 className="mt-4 text-2xl font-black text-white">Pesanan Berhasil Dikirim!</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Bukti transfer Anda telah diterima dan diteruskan ke admin untuk diverifikasi.
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 text-left max-w-md mx-auto space-y-2.5">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Order ID:</span>
          <span className="font-mono font-bold text-white">{order.orderId}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Kode Cek Status:</span>
          <span className="font-mono font-black text-emerald-400 text-sm">{order.code}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Username Roblox:</span>
          <span className="font-semibold text-white">{order.robloxUsername}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Jumlah Robux:</span>
          <span className="font-semibold text-emerald-400">{order.robuxAmount.toLocaleString("id-ID")} R$</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Total Dibayar:</span>
          <span className="font-bold text-white">{formatRupiah(order.totalPrice)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/cek-order?code=${order.code}`}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black hover:bg-emerald-400"
        >
          <Search className="h-4 w-4" /> Cek Status Pesanan
        </Link>
        <Link
          href="/"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-300 hover:text-white"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Connect master Wizard component and page `/beli`**

Write `src/components/checkout/CheckoutWizard.tsx`:
```tsx
"use client";

import { useState } from "react";
import { PricingItem, RekeningItem } from "@/services/config";
import { Step1Nominal } from "./Step1Nominal";
import { Step2UserData } from "./Step2UserData";
import { Step3Payment } from "./Step3Payment";
import { Step4UploadProof } from "./Step4UploadProof";
import { Step5Success } from "./Step5Success";
import { createOrderAction, submitPaymentProofAction } from "@/app/actions/order";

interface CheckoutWizardProps {
  initialRobux?: number;
  pricing: PricingItem[];
  rekeningList: RekeningItem[];
}

export function CheckoutWizard({ initialRobux, pricing, rekeningList }: CheckoutWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedRobux, setSelectedRobux] = useState<number | null>(
    initialRobux || (pricing[0]?.robux ?? 100)
  );
  const [selectedPrice, setSelectedPrice] = useState<number>(
    pricing.find((p) => p.robux === initialRobux)?.price || (pricing[0]?.price ?? 12000)
  );

  const [userData, setUserData] = useState({
    name: "",
    robloxUsername: "",
    whatsapp: "",
  });

  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const handleSelectNominal = (robux: number, price: number) => {
    setSelectedRobux(robux);
    setSelectedPrice(price);
  };

  const handleUserDataSubmit = async (data: typeof userData) => {
    setUserData(data);
    if (!selectedRobux) return;

    const res = await createOrderAction({
      robuxAmount: selectedRobux,
      price: selectedPrice,
      name: data.name,
      robloxUsername: data.robloxUsername,
      whatsapp: data.whatsapp,
    });

    if (res.success && res.order) {
      setCreatedOrder(res.order);
      setStep(3);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-md">
      {/* Wizard Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
          <span className={step >= 1 ? "text-emerald-400 font-bold" : ""}>1. Nominal</span>
          <span className={step >= 2 ? "text-emerald-400 font-bold" : ""}>2. Akun</span>
          <span className={step >= 3 ? "text-emerald-400 font-bold" : ""}>3. Transfer</span>
          <span className={step >= 4 ? "text-emerald-400 font-bold" : ""}>4. Bukti</span>
          <span className={step >= 5 ? "text-emerald-400 font-bold" : ""}>5. Selesai</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-800">
          <div
            className="h-1.5 rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <Step1Nominal
          pricing={pricing}
          selectedRobux={selectedRobux}
          onSelect={handleSelectNominal}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2UserData
          initialData={userData}
          onBack={() => setStep(1)}
          onSubmit={handleUserDataSubmit}
        />
      )}

      {step === 3 && createdOrder && (
        <Step3Payment
          order={createdOrder}
          rekeningList={rekeningList}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && createdOrder && (
        <Step4UploadProof
          orderId={createdOrder.orderId}
          onSubmitProof={submitPaymentProofAction}
          onSuccess={() => setStep(5)}
        />
      )}

      {step === 5 && createdOrder && <Step5Success order={createdOrder} />}
    </div>
  );
}
```

Write `src/app/beli/page.tsx`:
```tsx
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckoutWizard } from "@/components/checkout/CheckoutWizard";
import { getConfigValue, PricingItem, RekeningItem } from "@/services/config";

interface BeliPageProps {
  searchParams: Promise<{ robux?: string }>;
}

export default async function BeliPage({ searchParams }: BeliPageProps) {
  const params = await searchParams;
  const initialRobux = params.robux ? parseInt(params.robux, 10) : undefined;

  const pricing = await getConfigValue<PricingItem[]>("pricing", [
    { robux: 100, price: 12000 },
    { robux: 200, price: 24000 },
    { robux: 500, price: 58000 },
    { robux: 1000, price: 114000 },
  ]);

  const rekeningList = await getConfigValue<RekeningItem[]>("rekening", [
    { bank: "BCA", nomor: "8735123984", atasNama: "ROBLOX TOPUP STORE" },
    { bank: "DANA", nomor: "081234567890", atasNama: "ROBLOX TOPUP STORE" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <CheckoutWizard
          initialRobux={initialRobux}
          pricing={pricing}
          rekeningList={rekeningList}
        />
      </main>
      <Footer />
    </div>
  );
}
```

---

### Task 6: Order Status Tracking Page (`/cek-order`)

**Files:**
- Create: `src/app/cek-order/page.tsx`
- Create: `src/components/tracking/OrderTracker.tsx`

**Interfaces:**
- Produces: Fast order lookup by 6-character Code or full Order ID (`RBX-YYYYMMDD-XXXXX`)
- Produces: Timeline status tracker displaying step progression: `pending_payment` -> `waiting_verify` -> `approved` -> `processing` -> `completed` (or `rejected` / `expired`)
- Produces: Direct WhatsApp support button with pre-filled message

- [ ] **Step 1: Create Order Tracker component**

Write `src/components/tracking/OrderTracker.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Search, Clock, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";

interface OrderTrackerProps {
  initialCode?: string;
  initialOrder?: any;
}

const statusMap: Record<string, { label: string; color: string; desc: string }> = {
  pending_payment: {
    label: "Menunggu Pembayaran",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    desc: "Silakan selesaikan pembayaran dan upload bukti transfer.",
  },
  waiting_verify: {
    label: "Menunggu Verifikasi Admin",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    desc: "Bukti transfer telah diterima. Admin sedang memverifikasi mutasi bank.",
  },
  approved: {
    label: "Pembayaran Disetujui",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    desc: "Pembayaran terverifikasi. Masuk dalam antrean pengiriman Robux.",
  },
  processing: {
    label: "Sedang Dikirim (Payout)",
    color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    desc: "Admin sedang memproses transfer Robux ke akun Roblox Anda.",
  },
  completed: {
    label: "Pesanan Selesai",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    desc: "Robux telah berhasil dikirim ke akun Roblox Anda. Terima kasih!",
  },
  rejected: {
    label: "Pesanan Ditolak",
    color: "text-red-400 bg-red-400/10 border-red-400/30",
    desc: "Pesanan dibatalkan atau bukti transfer tidak valid.",
  },
  expired: {
    label: "Kedaluwarsa",
    color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/30",
    desc: "Batas waktu transfer 24 jam telah habis.",
  },
};

export function OrderTracker({ initialCode, initialOrder }: OrderTrackerProps) {
  const [query, setQuery] = useState(initialCode || "");
  const [order, setOrder] = useState<any>(initialOrder || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/order/check?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.order) {
        setError(data.error || "Pesanan tidak ditemukan. Periksa kembali Kode atau Order ID Anda.");
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Gagal menghubungkan ke server.");
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = order ? statusMap[order.status] || statusMap.pending_payment : null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white text-center">Lacak Status Pesanan</h2>
        <p className="text-xs text-zinc-400 text-center mt-1">
          Masukkan 6 Karakter Kode Cek atau Nomor Order ID Anda
        </p>

        <form onSubmit={handleSearch} className="mt-5 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Contoh: A3X7K9 atau RBX-2026..."
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white uppercase placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-emerald-400 disabled:opacity-50"
          >
            <Search className="h-4 w-4" /> Cari
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        {order && currentStatus && (
          <div className="mt-6 border-t border-zinc-800 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Status Pesanan:</span>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${currentStatus.color}`}>
                {currentStatus.label}
              </span>
            </div>

            <p className="mt-2 text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
              {currentStatus.desc}
            </p>

            {order.adminNote && (
              <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                <b>Catatan Admin:</b> {order.adminNote}
              </div>
            )}

            <div className="mt-4 space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Order ID:</span>
                <span className="font-mono text-zinc-200">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Username Roblox:</span>
                <span className="font-bold text-emerald-400">{order.robloxUsername}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Jumlah Robux:</span>
                <span className="font-semibold text-white">{order.robuxAmount.toLocaleString("id-ID")} R$</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Harga:</span>
                <span className="font-bold text-white">{formatRupiah(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Waktu Order:</span>
                <span className="text-zinc-400">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className="mt-5 text-center">
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo Admin, saya ingin menanyakan status pesanan saya dengan Order ID: ${order.orderId} (Kode: ${order.code})`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
              >
                Butuh bantuan? Hubungi Admin via WhatsApp →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create API Route `/api/order/check` and Page `/cek-order`**

Write `src/app/api/order/check/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "Query parameter q dibutuhkan" }, { status: 400 });
  }

  const order = await db.query.orders.findFirst({
    where: or(eq(orders.code, q), eq(orders.orderId, q)),
  });

  if (!order) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
```

Write `src/app/cek-order/page.tsx`:
```tsx
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderTracker } from "@/components/tracking/OrderTracker";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";

interface CekOrderPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function CekOrderPage({ searchParams }: CekOrderPageProps) {
  const params = await searchParams;
  let initialOrder = null;

  if (params.code) {
    initialOrder = await db.query.orders.findFirst({
      where: or(eq(orders.code, params.code), eq(orders.orderId, params.code)),
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <OrderTracker initialCode={params.code} initialOrder={initialOrder} />
      </main>
      <Footer />
    </div>
  );
}
```

---

### Task 7: Admin Authentication & Session Security

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/middleware.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/actions/auth.ts`

**Interfaces:**
- Produces: JWT / cookie-based session management (`createAdminSession`, `verifyAdminSession`, `deleteAdminSession`)
- Produces: `/admin/login` page with secure form submission and error handling
- Produces: Route protection middleware guarding `/admin/*` routes (except `/admin/login`)

- [ ] **Step 1: Write auth session helpers with Jose**

Write `src/lib/auth.ts`:
```typescript
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "lapak-robux-default-jwt-secret-key-32chars"
);

const COOKIE_NAME = "lapak_admin_session";

export async function createAdminSession(adminId: string, username: string) {
  const token = await new SignJWT({ adminId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return token;
}

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(SECRET, token);
    return payload as { adminId: string; username: string };
  } catch {
    return null;
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
```

- [ ] **Step 2: Create Auth server actions**

Write `src/app/actions/auth.ts`:
```typescript
"use server";

import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createAdminSession, deleteAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAdminAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  const admin = await db.query.admins.findFirst({
    where: eq(admins.username, username.trim()),
  });

  if (!admin) {
    return { error: "Username atau password salah." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "Username atau password salah." };
  }

  await createAdminSession(admin.id, admin.username);
  redirect("/admin");
}

export async function logoutAdminAction() {
  await deleteAdminSession();
  redirect("/admin/login");
}
```

- [ ] **Step 3: Create Login Page and Protection Middleware**

Write `src/app/admin/login/page.tsx`:
```tsx
import { loginAdminAction } from "@/app/actions/auth";
import { ShieldAlert, Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">Login Admin Panel</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Masuk untuk mengelola pesanan Robux, rekening, dan harga.
          </p>
        </div>

        <form action={loginAdminAction} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300">Username</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                name="username"
                required
                placeholder="admin"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
          >
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
```

Write `src/middleware.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "lapak-robux-default-jwt-secret-key-32chars"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("lapak_admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      await jwtVerify(SECRET, token);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

---

### Task 8: Admin Dashboard (`/admin`)

**Files:**
- Create: `src/components/admin/AdminHeader.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/OrdersTable.tsx`

**Interfaces:**
- Produces: Header navigation with links to Orders (`/admin`), Settings (`/admin/settings`), and Logout
- Produces: Metrics summary cards (Total Revenue, Pending Verify, Completed Orders)
- Produces: Filterable & searchable order list with status badges and quick links to detail

- [ ] **Step 1: Create Admin Header & Layout**

Write `src/components/admin/AdminHeader.tsx`:
```tsx
import Link from "next/link";
import { logoutAdminAction } from "@/app/actions/auth";
import { LayoutDashboard, Settings, LogOut, ExternalLink } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-4 py-3">
      <div className="container mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500 text-xs font-black text-black">
              R$
            </div>
            <span className="font-bold text-white">ADMIN PANEL</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/admin" className="flex items-center gap-1.5 text-zinc-200 hover:text-emerald-400">
              <LayoutDashboard className="h-4 w-4" /> Pesanan
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400">
              <Settings className="h-4 w-4" /> Pengaturan
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            Lihat Web <ExternalLink className="h-3 w-3" />
          </Link>
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-zinc-800"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
```

Write `src/app/admin/layout.tsx`:
```tsx
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <AdminHeader />
      <div className="container mx-auto max-w-7xl p-4 sm:p-6">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create Admin Orders Table and Dashboard Page**

Write `src/components/admin/OrdersTable.tsx`:
```tsx
"use client";

import Link from "next/link";
import { formatRupiah, formatDate } from "@/lib/utils";
import { ExternalLink, Eye } from "lucide-react";

interface OrdersTableProps {
  orders: any[];
}

const statusBadge: Record<string, string> = {
  pending_payment: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  waiting_verify: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  processing: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  rejected: "bg-red-500/10 text-red-400 border-red-500/30",
  expired: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
};

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 uppercase">
          <tr>
            <th className="p-3.5">Order ID & Kode</th>
            <th className="p-3.5">Pelanggan</th>
            <th className="p-3.5">Roblox Username</th>
            <th className="p-3.5">Robux</th>
            <th className="p-3.5">Total Bayar</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5">Tanggal</th>
            <th className="p-3.5 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-8 text-center text-zinc-500">
                Belum ada pesanan yang masuk.
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o.id} className="hover:bg-zinc-900/30 transition">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-white">{o.orderId}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Kode: {o.code}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-semibold text-zinc-200">{o.name}</div>
                  <div className="text-zinc-500">{o.whatsapp}</div>
                </td>
                <td className="p-3.5 font-bold text-emerald-400">{o.robloxUsername}</td>
                <td className="p-3.5 font-semibold text-white">{o.robuxAmount.toLocaleString("id-ID")} R$</td>
                <td className="p-3.5 font-bold text-white">{formatRupiah(o.totalPrice)}</td>
                <td className="p-3.5">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                      statusBadge[o.status] || "text-zinc-400 border-zinc-800"
                    }`}
                  >
                    {o.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3.5 text-zinc-400">{formatDate(o.createdAt)}</td>
                <td className="p-3.5 text-center">
                  <Link
                    href={`/admin/order/${o.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-semibold text-zinc-200 hover:border-emerald-500 hover:text-white"
                  >
                    <Eye className="h-3.5 w-3.5 text-emerald-400" /> Detail
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

Write `src/app/admin/page.tsx`:
```tsx
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { formatRupiah } from "@/lib/utils";
import { ShoppingBag, Clock, CheckCircle, DollarSign } from "lucide-react";

export default async function AdminDashboardPage() {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
  });

  const waitingVerify = allOrders.filter((o) => o.status === "waiting_verify").length;
  const completedOrders = allOrders.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Pesanan</h1>
        <p className="text-xs text-zinc-400 mt-1">Kelola dan proses transaksi top-up Roblox.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Order</span>
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{allOrders.length}</div>
        </div>

        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-semibold">Menunggu Verifikasi</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-400">{waitingVerify}</div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold">Order Selesai</span>
            <CheckCircle className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">{completedOrders.length}</div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Pendapatan</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-black text-white">{formatRupiah(totalRevenue)}</div>
        </div>
      </div>

      <OrdersTable orders={allOrders} />
    </div>
  );
}
```

---

### Task 9: Admin Order Detail & Status Management (`/admin/order/[id]`)

**Files:**
- Create: `src/app/admin/order/[id]/page.tsx`
- Create: `src/components/admin/OrderDetailActions.tsx`
- Create: `src/app/actions/admin-order.ts`

**Interfaces:**
- Produces: Proof preview modal / zoom
- Produces: Server actions for updating status (`approved`, `processing`, `completed`, `rejected`) and saving `adminNote`
- Produces: Direct WhatsApp link to user's phone for instant customer communication

- [ ] **Step 1: Write admin order server action**

Write `src/app/actions/admin-order.ts`:
```typescript
"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(orderId: string, status: any, adminNote?: string) {
  await db
    .update(orders)
    .set({
      status,
      adminNote: adminNote !== undefined ? adminNote : undefined,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(orders.id, orderId));

  revalidatePath(`/admin/order/${orderId}`);
  revalidatePath("/admin");
  return { success: true };
}
```

- [ ] **Step 2: Create OrderDetailActions and Page**

Write `src/components/admin/OrderDetailActions.tsx`:
```tsx
"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/app/actions/admin-order";
import { Check, X, Clock, PlayCircle, Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  currentStatus: string;
  initialNote: string | null;
}

export function OrderDetailActions({ orderId, currentStatus, initialNote }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState(initialNote || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateOrderStatusAction(orderId, newStatus, note);
      setStatus(newStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-zinc-300">Catatan Admin (Bisa dilihat user)</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: Robux telah dikirim via Game Pass, silakan cek inventory."
          className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleUpdate("approved")}
          className="flex items-center gap-1 rounded-xl bg-blue-500 px-4 py-2 text-xs font-bold text-black hover:bg-blue-400 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> Approve Pembayaran
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleUpdate("processing")}
          className="flex items-center gap-1 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-black hover:bg-cyan-400 disabled:opacity-50"
        >
          <PlayCircle className="h-3.5 w-3.5" /> Proses Payout
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleUpdate("completed")}
          className="flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> Tandai Selesai
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleUpdate("rejected")}
          className="flex items-center gap-1 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 px-4 py-2 text-xs font-bold hover:bg-red-500/30 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" /> Tolak Pesanan
        </button>
      </div>
    </div>
  );
}
```

Write `src/app/admin/order/[id]/page.tsx`:
```tsx
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatRupiah, formatDate } from "@/lib/utils";
import { OrderDetailActions } from "@/components/admin/OrderDetailActions";
import Link from "next/link";
import { ArrowLeft, MessageSquare, ExternalLink } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) {
    notFound();
  }

  const waLink = `https://wa.me/${order.whatsapp.replace(/^0/, "62")}?text=${encodeURIComponent(
    `Halo ${order.name}, kami dari LapakRobux mengenai pesanan Anda (${order.orderId}).`
  )}`;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Daftar Pesanan
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Detail Pesanan</h1>
          <p className="font-mono text-xs text-emerald-400 mt-0.5">{order.orderId}</p>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 w-fit"
        >
          <MessageSquare className="h-4 w-4" /> Hubungi Pelanggan via WA
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Order */}
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-xs">
          <h2 className="font-bold text-white uppercase tracking-wider text-[11px]">Informasi Pesanan</h2>
          <div className="space-y-2">
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Status:</span>
              <span className="font-bold text-emerald-400 uppercase">{order.status}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Kode Cek:</span>
              <span className="font-mono font-bold text-white">{order.code}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Nama Pelanggan:</span>
              <span className="font-semibold text-white">{order.name}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Username Roblox:</span>
              <span className="font-bold text-emerald-400">{order.robloxUsername}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">WhatsApp:</span>
              <span className="text-white">{order.whatsapp}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Jumlah Robux:</span>
              <span className="font-bold text-white">{order.robuxAmount.toLocaleString("id-ID")} R$</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-2">
              <span className="text-zinc-400">Kode Unik:</span>
              <span className="font-mono text-zinc-300">+{order.uniqueCode}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold">
              <span className="text-zinc-200">Total Tagihan:</span>
              <span className="text-emerald-400">{formatRupiah(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Bukti Transfer */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-xs">
          <h2 className="font-bold text-white uppercase tracking-wider text-[11px]">Bukti Transfer Pembeli</h2>
          <div className="mt-3 flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            {order.paymentProof ? (
              <a href={order.paymentProof} target="_blank" rel="noreferrer" className="group relative">
                <img
                  src={order.paymentProof}
                  alt="Bukti Transfer"
                  className="max-h-64 rounded object-contain transition group-hover:opacity-90"
                />
                <span className="mt-2 flex items-center justify-center gap-1 text-[11px] text-emerald-400 group-hover:underline">
                  Buka Gambar Penuh <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            ) : (
              <p className="py-12 text-zinc-500">Belum ada bukti transfer di-upload.</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Update */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h2 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Tindakan Admin</h2>
        <OrderDetailActions
          orderId={order.id}
          currentStatus={order.status}
          initialNote={order.adminNote}
        />
      </div>
    </div>
  );
}
```

---

### Task 10: Admin Settings Management (`/admin/settings`)

**Files:**
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/components/admin/SettingsManager.tsx`
- Create: `src/app/actions/settings.ts`

**Interfaces:**
- Produces: Rekening CRUD management (Add/Remove bank/e-wallet accounts)
- Produces: Pricing CRUD management (Edit price per Robux tier, add new tier)
- Produces: Telegram bot token and chat ID configuration form with immediate test notification button

- [ ] **Step 1: Write Settings Server Action**

Write `src/app/actions/settings.ts`:
```typescript
"use server";

import { setConfigValue } from "@/services/config";
import { revalidatePath } from "next/cache";

export async function saveSettingsAction(formData: {
  pricingJson: string;
  rekeningJson: string;
  telegramBotToken: string;
  telegramChatId: string;
}) {
  await setConfigValue("pricing", formData.pricingJson);
  await setConfigValue("rekening", formData.rekeningJson);
  await setConfigValue("telegram_bot_token", formData.telegramBotToken.trim());
  await setConfigValue("telegram_admin_chat_id", formData.telegramChatId.trim());

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/beli");
  return { success: true };
}
```

- [ ] **Step 2: Create SettingsManager Component and Page**

Write `src/components/admin/SettingsManager.tsx`:
```tsx
"use client";

import { useState } from "react";
import { PricingItem, RekeningItem } from "@/services/config";
import { saveSettingsAction } from "@/app/actions/settings";
import { Plus, Trash2, Save, CheckCircle2 } from "lucide-react";

interface Props {
  initialPricing: PricingItem[];
  initialRekening: RekeningItem[];
  initialBotToken: string;
  initialChatId: string;
}

export function SettingsManager({
  initialPricing,
  initialRekening,
  initialBotToken,
  initialChatId,
}: Props) {
  const [pricing, setPricing] = useState<PricingItem[]>(initialPricing);
  const [rekening, setRekening] = useState<RekeningItem[]>(initialRekening);
  const [botToken, setBotToken] = useState(initialBotToken);
  const [chatId, setChatId] = useState(initialChatId);
  const [saved, setSaved] = useState(false);

  const handlePriceChange = (index: number, price: number) => {
    const updated = [...pricing];
    updated[index].price = price;
    setPricing(updated);
  };

  const handleAddRekening = () => {
    setRekening([...rekening, { bank: "BANK BARU", nomor: "", atasNama: "" }]);
  };

  const handleRemoveRekening = (index: number) => {
    setRekening(rekening.filter((_, i) => i !== index));
  };

  const handleRekeningChange = (index: number, field: keyof RekeningItem, val: string) => {
    const updated = [...rekening];
    updated[index][field] = val;
    setRekening(updated);
  };

  const handleSave = async () => {
    await saveSettingsAction({
      pricingJson: JSON.stringify(pricing),
      rekeningJson: JSON.stringify(rekening),
      telegramBotToken: botToken,
      telegramChatId: chatId,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> Pengaturan berhasil disimpan.
        </div>
      )}

      {/* Pricing Management */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h2 className="text-sm font-bold uppercase text-white">Kelola Harga Nominal Robux</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pricing.map((p, idx) => (
            <div key={p.robux} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs">
              <span className="font-bold text-emerald-400">{p.robux.toLocaleString("id-ID")} Robux</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-zinc-500">Rp</span>
                <input
                  type="number"
                  value={p.price}
                  onChange={(e) => handlePriceChange(idx, parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rekening Management */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white">Kelola Rekening Tujuan Transfer</h2>
          <button
            type="button"
            onClick={handleAddRekening}
            className="flex items-center gap-1 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Rekening
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {rekening.map((r, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-xs">
              <input
                type="text"
                placeholder="Nama Bank/E-Wallet"
                value={r.bank}
                onChange={(e) => handleRekeningChange(idx, "bank", e.target.value)}
                className="w-full sm:w-1/4 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-white"
              />
              <input
                type="text"
                placeholder="Nomor Rekening/HP"
                value={r.nomor}
                onChange={(e) => handleRekeningChange(idx, "nomor", e.target.value)}
                className="w-full sm:w-2/4 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-white font-mono"
              />
              <input
                type="text"
                placeholder="Atas Nama"
                value={r.atasNama}
                onChange={(e) => handleRekeningChange(idx, "atasNama", e.target.value)}
                className="w-full sm:w-1/4 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-white"
              />
              <button
                type="button"
                onClick={() => handleRemoveRekening(idx)}
                className="self-center p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Telegram Bot Config */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h2 className="text-sm font-bold uppercase text-white">Konfigurasi Bot Telegram Admin</h2>
        <div className="mt-4 space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300">Telegram Bot Token</label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Contoh: 123456789:ABCdefGHIjklMNOpqr..."
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-zinc-300">Admin Chat ID / Group Chat ID</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Contoh: -100123456789 atau 987654321"
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-2 text-white font-mono"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black hover:bg-emerald-400"
        >
          <Save className="h-4 w-4" /> Simpan Seluruh Pengaturan
        </button>
      </div>
    </div>
  );
}
```

Write `src/app/admin/settings/page.tsx`:
```tsx
import { getConfigValue, PricingItem, RekeningItem } from "@/services/config";
import { SettingsManager } from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  const pricing = await getConfigValue<PricingItem[]>("pricing", []);
  const rekening = await getConfigValue<RekeningItem[]>("rekening", []);
  const botToken = await getConfigValue<string>("telegram_bot_token", "");
  const chatId = await getConfigValue<string>("telegram_admin_chat_id", "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pengaturan Toko</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Sesuaikan harga per nominal, kelola rekening transfer, dan token Telegram bot.
        </p>
      </div>

      <SettingsManager
        initialPricing={pricing}
        initialRekening={rekening}
        initialBotToken={botToken}
        initialChatId={chatId}
      />
    </div>
  );
}
```

---

### Task 11: Deployment Scaffolding (Dockerfile & Coolify Config) & End-to-End Build Verification

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`
- Create: `coolify.yaml`
- Create: `README.md`

- [ ] **Step 1: Write Dockerfile and Coolify deployment configuration**

Write `Dockerfile`:
```dockerfile
FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx drizzle-kit push
RUN npx tsx src/db/seed.ts
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dev.db ./dev.db
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]
```

Write `.dockerignore`:
```
node_modules
.next
.git
```

- [ ] **Step 2: Build and verify Next.js production build**

Run: `npm run build`
Expected: Output showing compiled routes `/`, `/beli`, `/cek-order`, `/admin`, `/admin/login`, `/admin/order/[id]`, `/admin/settings`, `/api/upload`, `/api/order/check`. Zero lint or TypeScript errors.
