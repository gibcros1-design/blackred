import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ADMIN_JWT_SECRET } from "@/lib/env";

const SECRET = new TextEncoder().encode(ADMIN_JWT_SECRET);

const COOKIE_NAME = "lapak_admin_session";

export async function createAdminSession(adminId: string, username: string) {
  const token = await new SignJWT({ adminId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return token;
}

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { adminId: string; username: string };
  } catch {
    return null;
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Guard untuk server action admin. True bila sesi admin valid. */
export async function requireAdmin(): Promise<boolean> {
  return (await verifyAdminSession()) !== null;
}
