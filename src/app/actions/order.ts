"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { generateOrderId, generateOrderCode, generateUniqueCode, randomToken } from "@/services/order";
import { sendTelegramOrderNotification } from "@/services/telegram";
import { getConfigValue, PricingItem } from "@/services/config";
import { DEFAULT_PRICING } from "@/services/defaults";
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
  const code = generateOrderCode(8);
  const id = uuidv4();
  const proofToken = randomToken();

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
    proofToken,
    status: "pending_payment" as const,
  };

  await db.insert(orders).values(newOrder);

  // Token tidak boleh ikut ke klien — cukup di session wizard.
  const { proofToken: _hidden, ...order } = newOrder;
  return { success: true as const, order, proofToken };
}

export async function submitPaymentProofAction(orderId: string, proofToken: string) {
  if (typeof orderId !== "string" || typeof proofToken !== "string") {
    return { success: false, error: "Permintaan tidak valid" };
  }
  if (proofToken.length !== 64) {
    return { success: false, error: "Token bukti tidak valid" };
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.orderId, orderId),
  });

  if (!order) {
    return { success: false, error: "Pesanan tidak ditemukan" };
  }
  // Token bukti hanya diketahui browser yang membuat order ini.
  if (!order.proofToken || order.proofToken !== proofToken) {
    return { success: false, error: "Token bukti salah" };
  }
  // Boleh unggah ulang selama belum diproses admin: pending, menunggu verifikasi, atau ditolak.
  if (order.status !== "pending_payment" && order.status !== "waiting_verify" && order.status !== "rejected") {
    return { success: false, error: "Pesanan tidak menerima bukti pembayaran lagi." };
  }

  await db
    .update(orders)
    .set({
      paymentProof: "telegram",
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
