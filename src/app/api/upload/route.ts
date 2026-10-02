import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getConfigValue } from "@/services/config";
import { formatRupiah } from "@/lib/utils";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ASSETS_BUCKET = "assets";

function looksLikeImage(buf: Buffer, type: string): boolean {
  if (type === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (type === "image/png") return buf.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  if (type === "image/webp")
    return buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

async function sendProofToTelegram(file: File, order: typeof orders.$inferSelect): Promise<boolean> {
  const botToken = (await getConfigValue<string>("telegram_bot_token", "")) || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = (await getConfigValue<string>("telegram_admin_chat_id", "")) || process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!botToken || !chatId) return false;

  const caption = [
    "📥 <b>Bukti transfer diterima</b>",
    `Order ID: <code>${order.orderId}</code>`,
    `Nama: ${order.name}`,
    `Total: ${formatRupiah(order.totalPrice)}`,
    `Username Roblox: <b>${order.robloxUsername}</b>`,
  ].join("\n");

  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("photo", file, `proof.${EXT_BY_TYPE[file.type]}`);
  form.append("caption", caption);
  form.append("parse_mode", "HTML");
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(15_000),
    });
    return res.ok;
  } catch (error) {
    console.error("Telegram proof delivery failed:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  }

  try {
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const wantsAssets = formData.get("bucket") === ASSETS_BUCKET;
    let order: typeof orders.$inferSelect | null = null;

    if (wantsAssets) {
      if (!(await requireAdmin())) return NextResponse.json({ error: "Tidak berwenang" }, { status: 401 });
    } else {
      const orderId = String(formData.get("orderId") ?? "");
      const proofToken = String(formData.get("proofToken") ?? "");
      if (!orderId || proofToken.length !== 64) {
        return NextResponse.json({ error: "Token bukti tidak valid" }, { status: 401 });
      }
      order = (await db.query.orders.findFirst({ where: eq(orders.orderId, orderId) })) ?? null;
      if (!order || !order.proofToken || order.proofToken !== proofToken) {
        return NextResponse.json({ error: "Token bukti salah" }, { status: 401 });
      }
      if (!["pending_payment", "waiting_verify", "rejected"].includes(order.status)) {
        return NextResponse.json({ error: "Pesanan tidak menerima bukti lagi" }, { status: 403 });
      }
    }

    const ext = EXT_BY_TYPE[file.type];
    if (!ext) return NextResponse.json({ error: "Format file tidak valid. Hanya JPG, PNG, dan WEBP." }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Ukuran file maksimal 5MB." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!looksLikeImage(buffer, file.type)) return NextResponse.json({ error: "Isi file bukan gambar yang valid." }, { status: 400 });

    if (!wantsAssets && order) {
      const delivered = await sendProofToTelegram(file, order);
      if (!delivered) {
        return NextResponse.json({ error: "Bukti belum terkirim ke Telegram. Coba lagi." }, { status: 502 });
      }
      return NextResponse.json({ url: "telegram", success: true });
    }

    const filename = `asset_${Date.now()}_${randomBytes(8).toString("hex")}.${ext}`;
    const { error } = await supabaseAdmin().storage.from(ASSETS_BUCKET).upload(filename, buffer, { contentType: file.type });
    if (error) {
      if (!error.message.toLowerCase().includes("not found")) {
        console.error("Supabase asset upload error:", error.message);
        return NextResponse.json({ error: "Gagal mengunggah gambar" }, { status: 500 });
      }
      const { error: createError } = await supabaseAdmin().storage.createBucket(ASSETS_BUCKET, { public: true });
      if (createError && !createError.message.toLowerCase().includes("already exists")) {
        return NextResponse.json({ error: "Gagal menyiapkan penyimpanan gambar" }, { status: 500 });
      }
      const retry = await supabaseAdmin().storage.from(ASSETS_BUCKET).upload(filename, buffer, { contentType: file.type });
      if (retry.error) return NextResponse.json({ error: "Gagal mengunggah gambar" }, { status: 500 });
    }

    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${ASSETS_BUCKET}/${filename}`;
    return NextResponse.json({ url, success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah gambar" }, { status: 500 });
  }
}
