import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckoutWizard } from "@/components/checkout/CheckoutWizard";
import { getConfigValue, PricingItem, RekeningItem } from "@/services/config";
import { DEFAULT_PRICING, DEFAULT_REKENING } from "@/services/defaults";

export const dynamic = "force-dynamic";

interface BeliPageProps {
  searchParams: Promise<{ robux?: string }>;
}

export default async function BeliPage({ searchParams }: BeliPageProps) {
  const params = await searchParams;
  const initialRobux = params.robux ? parseInt(params.robux, 10) : undefined;

  const pricing = await getConfigValue<PricingItem[]>("pricing", DEFAULT_PRICING);
  const rekeningList = await getConfigValue<RekeningItem[]>("rekening", DEFAULT_REKENING);

  const qrImageUrl = await getConfigValue<string>("qr_image_url", "");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pemesanan Robux
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Isi formulir pemesanan di bawah dengan teliti. Proses verifikasi & pengiriman cepat.
          </p>
        </div>
        <CheckoutWizard
          initialRobux={initialRobux}
          pricing={pricing}
          rekeningList={rekeningList}
          qrImageUrl={qrImageUrl}
        />
      </main>
      <Footer />
    </div>
  );
}
