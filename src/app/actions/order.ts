"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { generateOrderId, generateOrderCode, generateUniqueCode, randomToken } from "@/services/order";
import { getConfigValue, PricingItem } from "@/services/config";
import { DEFAULT_PRICING } from "@/services/defaults";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { getGameConfig } from "@/lib/games";
import { getDefaultPackagesForGame, UniversalGamePackage } from "@/services/defaults";

export async function createOrderAction(formData: {
  game?: string;
  itemName?: string;
  packageId?: string;
  robuxAmount?: number;
  price?: number;
  name: string;
  robloxUsername?: string;
  gameUserId?: string;
  gameZoneId?: string;
  whatsapp: string;
}) {
  try {
    const game = (formData.game || "roblox").toLowerCase();
    const gameConfig = getGameConfig(game);

    let price = 0;
    let itemName = formData.itemName || "";
    let robuxAmount = 0;

    if (game === "roblox") {
      const amount = formData.robuxAmount;
      if (typeof amount !== "number" || !Number.isFinite(amount)) {
        return { success: false as const, error: "Nominal Robux tidak valid." };
      }
      const pricing = await getConfigValue<PricingItem[]>("pricing", DEFAULT_PRICING);
      const match = pricing.find((p) => p.robux === amount);
      if (!match) {
        return { success: false as const, error: "Nominal paket tidak tersedia." };
      }
      price = match.price;
      robuxAmount = match.robux;
      itemName = `${match.robux.toLocaleString("id-ID")} Robux`;
    } else {
      if (!gameConfig) {
        return { success: false as const, error: "Game tidak dikenali." };
      }
      const defaultPackages = getDefaultPackagesForGame(game);
      const packages = await getConfigValue<UniversalGamePackage[]>(gameConfig.configKey, defaultPackages);

      // Cari paket berdasarkan packageId atau itemName atau amount
      const match = packages.find(
        (p) =>
          (formData.packageId && p.id === formData.packageId) ||
          (formData.itemName && p.name.toLowerCase() === formData.itemName.toLowerCase()) ||
          (formData.robuxAmount && p.amount === formData.robuxAmount)
      );

      if (!match) {
        return { success: false as const, error: "Paket item tidak ditemukan atau tidak aktif." };
      }

      price = match.price;
      itemName = match.name;
      robuxAmount = match.amount || 0;
    }

    const name = (formData.name ?? "").trim().slice(0, 80);
    const gameUserId = (formData.gameUserId || formData.robloxUsername || "").trim().slice(0, 60);
    const gameZoneId = (formData.gameZoneId ?? "").trim().slice(0, 20);
    const robloxUsername = game === "roblox" ? gameUserId : "";
    const whatsapp = (formData.whatsapp ?? "").trim().replace(/[^\d+]/g, "").slice(0, 20);

    if (!name || !gameUserId || !whatsapp) {
      return { success: false as const, error: "Data pemesan dan ID akun wajib diisi." };
    }

    if (game === "mlbb" && !gameZoneId) {
      return { success: false as const, error: "Zone ID / Server MLBB wajib diisi." };
    }

    const uniqueCode = generateUniqueCode();
    const totalPrice = price + uniqueCode;
    const prefix = gameConfig?.orderPrefix || "RBX";
    const orderId = generateOrderId(prefix);
    const code = generateOrderCode(8);
    const id = uuidv4();
    const proofToken = randomToken();

    const newOrder = {
      id,
      orderId,
      code,
      game,
      itemName,
      gameUserId,
      gameZoneId,
      robuxAmount,
      price,
      uniqueCode,
      totalPrice,
      name,
      robloxUsername: robloxUsername || gameUserId,
      whatsapp,
      proofToken,
      status: "pending_payment" as const,
    };

    await db.insert(orders).values(newOrder);

    // Token tidak boleh ikut ke klien — cukup di session wizard
    const { proofToken: _hidden, ...order } = newOrder;
    return { success: true as const, order, proofToken };
  } catch (error) {
    console.error("createOrderAction error:", error);
    return { success: false as const, error: `Gagal membuat pesanan: ${(error as Error).message}` };
  }
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

  return { success: true };
}
