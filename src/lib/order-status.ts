export const ORDER_STATUSES = [
  "pending_payment",
  "waiting_verify",
  "approved",
  "processing",
  "completed",
  "rejected",
  "expired",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}
