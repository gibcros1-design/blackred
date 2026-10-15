import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Env DATABASE_URL wajib diisi (connection string Supabase).");

// pooler Supabase (?pgbouncer=true) untuk serverless — gunakan singleton di dev mode
declare global {
  // eslint-disable-next-line no-var
  var __postgres_client: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__postgres_client ??
  postgres(url, {
    max: process.env.NODE_ENV === "production" ? 5 : 2,
    idle_timeout: 10,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__postgres_client = client;
}

export const db = drizzle(client, { schema });
