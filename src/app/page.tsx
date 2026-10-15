import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { TrustSection } from "@/components/TrustSection";
import { Testimonials, Testimonial } from "@/components/Testimonials";
import { PaymentStrip } from "@/components/PaymentStrip";
import { FaqSection } from "@/components/FaqSection";
import { getConfigValue, RekeningItem } from "@/services/config";
import { DEFAULT_REKENING, DEFAULT_ADMIN_WHATSAPP, DEFAULT_SERVICE_HOURS } from "@/services/defaults";
import { GameCatalogGrid } from "@/components/GameCatalogGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [testimonials, adminWhatsapp, bannerUrl, rekeningList, serviceHours, qrImageUrl] =
    await Promise.all([
      getConfigValue<Testimonial[]>("testimonials", []),
      getConfigValue<string>("admin_whatsapp", DEFAULT_ADMIN_WHATSAPP),
      getConfigValue<string>("banner_image_url", ""),
      getConfigValue<RekeningItem[]>("rekening", DEFAULT_REKENING),
      getConfigValue<string>("service_hours", DEFAULT_SERVICE_HOURS),
      getConfigValue<string>("qr_image_url", ""),
    ]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-24 sm:pb-0">
        <HeroSection bannerUrl={bannerUrl} />
        <GameCatalogGrid />
        <PaymentStrip rekeningList={rekeningList} qrImageUrl={qrImageUrl} />
        <TrustSection whatsapp={adminWhatsapp} serviceHours={serviceHours} />
        <Testimonials items={testimonials} />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
