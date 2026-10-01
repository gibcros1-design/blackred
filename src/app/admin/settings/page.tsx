import { getConfigValue, PricingItem, RekeningItem } from "@/services/config";
import { DEFAULT_ADMIN_WHATSAPP, DEFAULT_SERVICE_HOURS } from "@/services/defaults";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const pricing = await getConfigValue<PricingItem[]>("pricing", []);
  const rekening = await getConfigValue<RekeningItem[]>("rekening", []);
  const botToken = await getConfigValue<string>("telegram_bot_token", "");
  const chatId = await getConfigValue<string>("telegram_admin_chat_id", "");
  const qrImageUrl = await getConfigValue<string>("qr_image_url", "");
  const adminWhatsapp = await getConfigValue<string>("admin_whatsapp", DEFAULT_ADMIN_WHATSAPP);
  const serviceHours = await getConfigValue<string>("service_hours", DEFAULT_SERVICE_HOURS);
  const testimonials = await getConfigValue<{ name: string; quote: string; robux?: number }[]>("testimonials", []);
  const bannerImageUrl = await getConfigValue<string>("banner_image_url", "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pengaturan toko</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sesuaikan harga per nominal, kelola rekening transfer, dan token Telegram bot.
        </p>
      </div>

      <SettingsManager
        initialPricing={pricing}
        initialRekening={rekening}
        initialBotToken={botToken}
        initialChatId={chatId}
        initialQrImageUrl={qrImageUrl}
        initialAdminWhatsapp={adminWhatsapp}
        initialServiceHours={serviceHours}
        initialTestimonials={testimonials}
        initialBannerImageUrl={bannerImageUrl}
      />
    </div>
  );
}
