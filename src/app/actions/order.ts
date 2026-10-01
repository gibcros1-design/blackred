"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { generateOrderId, generateOrderCode, generateUniqueCode } from "@/services/order";
import { sendTelegramOrderNotification } from "@/services/telegram";
import { getConfigValue, PricingItem } from "@/services/config";
import { DEFAULT_PRICING } from "@/services/defaults";
import { stat } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function createOrderAction(formData: {
  robuxAmount: number;
  price: number;
  name: string;
  robloxUsername: string;
  whatsapp: string;
}) {
  if (typeof formData.robuxAmount !== "number" || !Number.isFinite(formData.robuxAmount)) {
    return { success: false as const, error: "Nominal tidak valid." };
  }

  // Harga selalu dari server — input klien tidak pernah dipercaya.
  const pricing = await getConfigValue<PricingItem[]>("pricing", DEFAULT_PRICING);
  const match = pricing.find((p) => p.robux === formData.robuxAmount);
  if (!match) {
    return { success: false as const, error: "Nominal tidak tersedia." };
  }
  const price = match.price;

  const name = (formData.name ?? "").trim().slice(0, 80);
  const robloxUsername = (formData.robloxUsername ?? "").trim().slice(0, 40);
  const whatsapp = (formData.whatsapp ?? "").trim().replace(/[^\d+]/g, "").slice(0, 20);

  if (!name || !robloxUsername || !whatsapp) {
    return { success: false as const, error: "Data pemesan tidak lengkap." };
  }

  const uniqueCode = generateUniqueCode();
  const totalPrice = price + uniqueCode;
  const orderId = generateOrderId();
  const code = generateOrderCode(6);
  const id = uuidv4();

  const newOrder = {
    id,
    orderId,
    code,
    robuxAmount: formData.robuxAmount,
    price,
    uniqueCode,
    totalPrice,
    name,
    robloxUsername,
    whatsapp,
    status: "pending_payment" as const,
  };

  await db.insert(orders).values(newOrder);

  return { success: true as const, order: newOrder };
}

export async function submitPaymentProofAction(orderId: string, proofUrl: string) {
  if (typeof orderId !== "string" || typeof proofUrl !== "string") {
    return { success: false, error: "Permintaan tidak valid" };
  }
  // Hanya izinkan URL internal hasil upload kita sendiri.
  if (!/^\/uploads\/[\w.-]+$/.test(proofUrl)) {
    return { success: false, error: "File bukti tidak valid" };
  }
  // Wajib benar-benar ada di disk — path tebakan tidak bisa dipakai.
  const proofPath = path.join(process.cwd(), "public", proofUrl);
  try {
    await stat(proofPath);
  } catch {
    return { success: false, error: "File bukti tidak ditemukan" };
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.orderId, orderId),
  });

  if (!order) {
    return { success: false, error: "Pesanan tidak ditemukan" };
  }
  // Boleh unggah ulang selama belum diproses admin: pending, menunggu verifikasi, atau ditolak.
  if (order.status !== "pending_payment" && order.status !== "waiting_verify" && order.status !== "rejected") {
    return { success: false, error: "Pesanan tidak menerima bukti pembayaran lagi." };
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
    sendTelegramOrderNotification(updatedOrder).catch((err) =>
      console.error("Telegram notification error:", err)
    );
  }

  return { success: true };
}
