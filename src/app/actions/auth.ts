"use server";

import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createAdminSession, deleteAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// ponytail: in-memory, per-instance. Cukup untuk satu proses;
// pindah ke Redis kalau nanti multi-instance / perlu persistensi.
const WINDOW_MS = 5 * 60_000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; reset: number }>();

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || rec.reset <= now) {
    attempts.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

export async function loginAdminAction(formData: FormData) {
  const username = (formData.get("username") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";

  if (!username || !password) {
    return { error: "Username dan password wajib di isi." };
  }

  // IP dari header proxy — tidak pernah dari payload klien.
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooManyAttempts(`${ip}:${username}`)) {
    return { error: "Terlalu banyak percobaan. Coba lagi dalam beberapa menit." };
  }

  const admin = await db.query.admins.findFirst({
    where: eq(admins.username, username.trim()),
  });

  if (!admin) {
    return { error: "Username atau password salah." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "Username atau password salah." };
  }

  attempts.delete(`${ip}:${username}`);

  await createAdminSession(admin.id, admin.username);
  redirect("/admin");
}

export async function logoutAdminAction() {
  await deleteAdminSession();
  redirect("/admin/login");
}
