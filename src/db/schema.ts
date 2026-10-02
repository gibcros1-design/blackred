import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const orders = pgTable("orders", {
  id: text("id").primaryKey(), // UUID v4
  orderId: text("order_id").notNull().unique(), // RBX-YYYYMMDD-XXXXX
  code: text("code").notNull().unique(), // 8 char alphanumeric
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
  paymentProof: text("payment_proof"), // path objek Supabase Storage (proofs/...)
  proofToken: text("proof_token").notNull().default(""), // wajib untuk submitPaymentProofAction
  adminNote: text("admin_note"),
  createdAt: text("created_at").default(sql`(to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))`).notNull(),
  updatedAt: text("updated_at").default(sql`(to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))`).notNull(),
});

export const admins = pgTable("admins", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`(to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))`).notNull(),
});

export const config = pgTable("config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const aktivasiCodes = pgTable("aktivasi_codes", {
  code: text("code").primaryKey(), // 8 char dari generateOrderCode
  orderId: text("order_id").notNull().unique(), // order_id format publik (RBX-…), satu kode per order
  createdAt: text("created_at").default(sql`(to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))`).notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type ConfigItem = typeof config.$inferSelect;
