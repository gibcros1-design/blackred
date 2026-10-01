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

  await setConfigValue("pricing", formData.pricingJson);
  await setConfigValue("rekening", formData.rekeningJson);
  await setConfigValue("telegram_bot_token", formData.telegramBotToken.trim());
  await setConfigValue("telegram_admin_chat_id", formData.telegramChatId.trim());
  await setConfigValue("qr_image_url", (formData.qrImageUrl ?? "").trim());
  await setConfigValue("admin_whatsapp", (formData.adminWhatsapp ?? "").trim());
  await setConfigValue("service_hours", (formData.serviceHours ?? "").trim());
  await setConfigValue("testimonials", formData.testimonialsJson ?? "[]");
  await setConfigValue("banner_image_url", (formData.bannerImageUrl ?? "").trim());

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/beli");
  revalidatePath("/cek-order");
  return { success: true as const };
}
