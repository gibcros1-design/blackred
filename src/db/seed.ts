import { db } from "./index";
import { admins, config } from "./schema";
import { DEFAULT_PRICING, DEFAULT_REKENING } from "@/services/defaults";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Admin account is created only when credentials are explicitly configured.
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (username && password) {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(admins).values({ id: "adm-" + Date.now(), username, passwordHash }).onConflictDoNothing();
    console.log("Admin account seeded from environment.");
  } else {
    console.log("Admin seeding skipped: set ADMIN_USERNAME and ADMIN_PASSWORD.");
  }

  try {
    await db.insert(config).values([
      { key: "pricing", value: JSON.stringify(DEFAULT_PRICING) },
      { key: "rekening", value: JSON.stringify(DEFAULT_REKENING) },
      { key: "telegram_bot_token", value: "" },
      { key: "telegram_admin_chat_id", value: "" },
    ]).onConflictDoNothing();
    console.log("Default configs inserted.");
  } catch (e) {
    console.log("Config seeding info:", e);
  }

  console.log("Seeding finished successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
