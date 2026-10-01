"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { isOrderStatus, OrderStatus } from "@/lib/order-status";

export async function updateOrderStatusAction(orderId: string, status: OrderStatus, adminNote?: string) {
  if (!(await requireAdmin())) return { success: false, error: "Tidak berwenang." };
  if (!isOrderStatus(status)) return { success: false, error: "Status tidak valid." };

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
