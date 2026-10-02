"use server";

import { db } from "@/db";
import { orders, aktivasiCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { generateOrderCode } from "@/services/order";

export async function createAktivasiCodeAction(orderId: string) {
  if (!(await requireAdmin())) return { success: false as const, error: "Tidak berwenang." };

  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) return { success: false as const, error: "Pesanan tidak ditemukan." };

  const code = generateOrderCode(8);

  const existing = await db.query.aktivasiCodes.findFirst({
    where: eq(aktivasiCodes.orderId, order.orderId),
  });
  if (existing) {
    // Regenerasi: kode lama hangus, kode baru berlaku.
    await db.update(aktivasiCodes).set({ code }).where(eq(aktivasiCodes.orderId, order.orderId));
  } else {
    await db.insert(aktivasiCodes).values({ code, orderId: order.orderId });
  }

  revalidatePath(`/admin/order/${orderId}`);
  return { success: true as const, code };
}
