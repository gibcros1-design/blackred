import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { PricingGrid } from "@/components/PricingGrid";
import { TrustSection } from "@/components/TrustSection";
import { Testimonials, Testimonial } from "@/components/Testimonials";
import { PaymentStrip } from "@/components/PaymentStrip";
import { FaqSection } from "@/components/FaqSection";
import { getConfigValue, PricingItem, RekeningItem } from "@/services/config";
import { DEFAULT_PRICING, DEFAULT_REKENING, DEFAULT_ADMIN_WHATSAPP, DEFAULT_SERVICE_HOURS } from "@/services/defaults";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [pricing, testimonials, adminWhatsapp, bannerUrl, rekeningList, serviceHours] = await Promise.all([
    getConfigValue<PricingItem[]>("pricing", DEFAULT_PRICING),
    getConfigValue<Testimonial[]>("testimonials", []),
    getConfigValue<string>("admin_whatsapp", DEFAULT_ADMIN_WHATSAPP),
    getConfigValue<string>("banner_image_url", ""),
    getConfigValue<RekeningItem[]>("rekening", DEFAULT_REKENING),
    getConfigValue<string>("service_hours", DEFAULT_SERVICE_HOURS),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-24 sm:pb-0">
        <HeroSection bannerUrl={bannerUrl} />
        <PricingGrid items={pricing} />
        <PaymentStrip rekeningList={rekeningList} />
        <TrustSection whatsapp={adminWhatsapp} serviceHours={serviceHours} />
        <Testimonials items={testimonials} />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
