import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(), // UUID v4
  orderId: text("order_id").notNull().unique(), // RBX-YYYYMMDD-XXXXX
  code: text("code").notNull().unique(), // 6 char alphanumeric
  robuxAmount: integer("robux_amount").notNull(),
  price: integer("price").notNull(), // Base nominal price in IDR
  uniqueCode: integer("unique_code").notNull(), // 3 digit unique transfer code
  totalPrice: integer("total_price").notNull(), // price + uniqueCode
  name: text("name").notNull(),
  robloxUsername: text("roblox_username").notNull(),
  whatsapp: text("whatsapp").notNull(),
  status: text("status", {
    enum: ["pending_payment", "waiting_verify", "approved", "processing", "completed", "rejected", "expired"]
  }).notNull().default("pending_payment"),
  paymentProof: text("payment_proof"), // image URL or base64 / uploads path
  adminNote: text("admin_note"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const config = sqliteTable("config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type ConfigItem = typeof config.$inferSelect;
