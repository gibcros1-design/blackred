import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";

// IP-keyed rate limit sederhana. ponytail: cukup untuk 1 instance,
// pindah ke Redis kalau nanti multi-instance.
const WINDOW_MS = 60_000;
const MAX_REQ = 10;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || rec.reset <= now) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_REQ;
}

// Field yang memang dipakai tampilan pelanggan — jangan bocorkan sisanya.
// robloxUsername, whatsapp, dan paymentProof sengaja tidak disertakan.
const SAFE_FIELDS = [
  orders.orderId,
  orders.code,
  orders.status,
  orders.robuxAmount,
  orders.totalPrice,
  orders.adminNote,
  orders.createdAt,
];

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "Query parameter q dibutuhkan" }, { status: 400 });
  }
  if (q.length < 3 || q.length > 64) {
    return NextResponse.json({ error: "Format pencarian tidak valid" }, { status: 400 });
  }

  const order = await db
    .select({ order: orders })
    .from(orders)
    .where(or(eq(orders.code, q), eq(orders.orderId, q)))
    .limit(1);

  if (!order.length) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const safe = Object.fromEntries(
    SAFE_FIELDS.map((f) => [f.name, order[0].order[f.name as never]]),
  );

  return NextResponse.json({ order: safe });
}
