import type { Order } from "@/db/schema";

/** Baris aman untuk dikirim ke klien (tampilan tracking). */
export type PublicOrder = Pick<
  Order,
  | "orderId"
  | "code"
  | "status"
  | "game"
  | "itemName"
  | "gameUserId"
  | "gameZoneId"
  | "robuxAmount"
  | "totalPrice"
  | "adminNote"
  | "createdAt"
>;

export function toPublicOrder(order: Order): PublicOrder {
  return {
    orderId: order.orderId,
    code: order.code,
    status: order.status,
    game: order.game,
    itemName: order.itemName,
    gameUserId: order.gameUserId,
    gameZoneId: order.gameZoneId,
    robuxAmount: order.robuxAmount,
    totalPrice: order.totalPrice,
    adminNote: order.adminNote,
    createdAt: order.createdAt,
  };
}
