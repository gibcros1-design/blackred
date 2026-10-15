"use server";

import { setConfigValue } from "@/services/config";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function saveSettingsAction(formData: {
  pricingJson: string;
  rekeningJson: string;
  telegramBotToken: string;
  telegramChatId: string;
  qrImageUrl?: string;
  adminWhatsapp?: string;
  serviceHours?: string;
  testimonialsJson?: string;
  bannerImageUrl?: string;
}) {
  if (!(await requireAdmin())) return { success: false as const, error: "Tidak berwenang." };

  try {
    await setConfigValue("pricing", String(formData.pricingJson ?? "[]"));
    await setConfigValue("rekening", String(formData.rekeningJson ?? "[]"));
    await setConfigValue("telegram_bot_token", String(formData.telegramBotToken ?? "").trim());
    await setConfigValue("telegram_admin_chat_id", String(formData.telegramChatId ?? "").trim());
    await setConfigValue("qr_image_url", String(formData.qrImageUrl ?? "").trim());
    await setConfigValue("admin_whatsapp", String(formData.adminWhatsapp ?? "").trim());
    await setConfigValue("service_hours", String(formData.serviceHours ?? "").trim());
    await setConfigValue("testimonials", String(formData.testimonialsJson ?? "[]"));
    await setConfigValue("banner_image_url", String(formData.bannerImageUrl ?? "").trim());

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/beli");
    revalidatePath("/cek-order");
    return { success: true as const };
  } catch (err: any) {
    console.error("Gagal menyimpan pengaturan:", err);
    return { success: false as const, error: err?.message || "Gagal menyimpan ke database." };
  }
}
