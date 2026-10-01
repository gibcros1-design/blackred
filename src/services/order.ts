import { randomInt, randomBytes } from "crypto";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa 0, O, 1, I

export function generateOrderCode(length: number = 6): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CODE_CHARS.charAt(randomInt(CODE_CHARS.length));
  }
  return result;
}

export function generateOrderId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const suffix = generateOrderCode(5);
  return `RBX-${yyyy}${mm}${dd}-${suffix}`;
}

export function generateUniqueCode(): number {
  return randomInt(100, 1000); // 100 - 999
}

/** Token acak kriptografis (16 byte hex). */
export function randomToken(): string {
  return randomBytes(16).toString("hex");
}
