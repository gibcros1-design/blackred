import { getConfigValue, PricingItem, RekeningItem } from "@/services/config";
import {
  DEFAULT_ADMIN_WHATSAPP,
  DEFAULT_SERVICE_HOURS,
  DEFAULT_MLBB_PACKAGES,
  DEFAULT_PUBG_PACKAGES,
  DEFAULT_FREEFIRE_PACKAGES,
  DEFAULT_FCMOBILE_PACKAGES,
  UniversalGamePackage,
} from "@/services/defaults";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [
    pricing,
    pricingMlbb,
    pricingPubg,
    pricingFreefire,
    pricingFcmobile,
    rekening,
    botToken,
    chatId,
    qrImageUrl,
    adminWhatsapp,
    serviceHours,
    testimonials,
    bannerImageUrl,
  ] = await Promise.all([
    getConfigValue<PricingItem[]>("pricing", []),
    getConfigValue<UniversalGamePackage[]>("pricing_mlbb", DEFAULT_MLBB_PACKAGES),
    getConfigValue<UniversalGamePackage[]>("pricing_pubg", DEFAULT_PUBG_PACKAGES),
    getConfigValue<UniversalGamePackage[]>("pricing_freefire", DEFAULT_FREEFIRE_PACKAGES),
    getConfigValue<UniversalGamePackage[]>("pricing_fcmobile", DEFAULT_FCMOBILE_PACKAGES),
    getConfigValue<RekeningItem[]>("rekening", []),
    getConfigValue<string>("telegram_bot_token", ""),
    getConfigValue<string>("telegram_admin_chat_id", ""),
    getConfigValue<string>("qr_image_url", ""),
    getConfigValue<string>("admin_whatsapp", DEFAULT_ADMIN_WHATSAPP),
    getConfigValue<string>("service_hours", DEFAULT_SERVICE_HOURS),
    getConfigValue<{ name: string; quote: string; robux?: number }[]>("testimonials", []),
    getConfigValue<string>("banner_image_url", ""),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pengaturan toko</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sesuaikan harga per nominal Roblox, MLBB, PUBG, Free Fire, FC Mobile, kelola rekening transfer, dan token Telegram bot.
        </p>
      </div>

      <SettingsManager
        initialPricing={pricing}
        initialPricingMlbb={pricingMlbb}
        initialPricingPubg={pricingPubg}
        initialPricingFreefire={pricingFreefire}
        initialPricingFcmobile={pricingFcmobile}
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
