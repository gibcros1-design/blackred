import { db } from "@/db";
import { config } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface PricingItem {
  robux: number;
  price: number;
}

export interface RekeningItem {
  bank: string;
  nomor: string;
  atasNama: string;
}

export async function getConfigValue<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const row = await db.query.config.findFirst({
      where: eq(config.key, key),
    });
    if (!row || !row.value) return defaultValue;
    return JSON.parse(row.value) as T;
  } catch {
    return defaultValue;
  }
}

export async function setConfigValue(key: string, value: string): Promise<void> {
  const existing = await db.query.config.findFirst({
    where: eq(config.key, key),
  });
  if (existing) {
    await db.update(config).set({ value }).where(eq(config.key, key));
  } else {
    await db.insert(config).values({ key, value });
  }
}
