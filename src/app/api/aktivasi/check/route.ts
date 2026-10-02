import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aktivasiCodes, orders } from "@/db/schema";
import { eq } from "drizzle-orm";

// Pola rate-limit yang sama dengan api/order/check — IP-keyed, cukup 1 instance.
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

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan" }, { status: 429 });
  }

  let body: { code?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
  if (code.length < 6 || code.length > 16) {
    return NextResponse.json({ error: "Format nomor aktivasi tidak valid" }, { status: 400 });
  }

  const found = await db.query.aktivasiCodes.findFirst({ where: eq(aktivasiCodes.code, code) });
  if (!found) {
    return NextResponse.json({ error: "Nomor aktivasi tidak ditemukan atau salah." }, { status: 404 });
  }

  const order = await db.query.orders.findFirst({ where: eq(orders.orderId, found.orderId) });
  if (!order) {
    return NextResponse.json({ error: "Nomor aktivasi tidak ditemukan atau salah." }, { status: 404 });
  }

  // Hanya field publik — whatsapp, nama, dan username pembeli tidak ikut.
  return NextResponse.json({
    order: {
      orderId: order.orderId,
      status: order.status,
      adminNote: order.adminNote,
    },
  });
}
