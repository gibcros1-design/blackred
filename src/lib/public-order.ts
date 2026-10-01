import type { Order } from "@/db/schema";

/** Baris aman untuk dikirim ke klien (tampilan tracking). */
export type PublicOrder = Pick<
  Order,
  "orderId" | "code" | "status" | "robuxAmount" | "totalPrice" | "adminNote" | "createdAt"
>;

export function toPublicOrder(order: Order): PublicOrder {
  return {
    orderId: order.orderId,
    code: order.code,
    status: order.status,
    robuxAmount: order.robuxAmount,
    totalPrice: order.totalPrice,
    adminNote: order.adminNote,
    createdAt: order.createdAt,
  };
}
