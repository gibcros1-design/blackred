import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AktivasiForm } from "@/components/aktivasi/AktivasiForm";
import { getConfigValue } from "@/services/config";
import { DEFAULT_ADMIN_WHATSAPP } from "@/services/defaults";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aktivasi Pesanan - BlackRedRoblox",
  description: "Cek dan aktivasi nomor pesanan yang diberikan admin.",
};

export default async function AktivasiPage() {
  const adminWhatsapp = await getConfigValue<string>("admin_whatsapp", DEFAULT_ADMIN_WHATSAPP);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Aktivasi Pesanan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masukkan nomor aktivasi yang diberikan admin melalui WhatsApp.
          </p>
        </div>
        <AktivasiForm adminWhatsapp={adminWhatsapp} />
      </main>
      <Footer />
    </div>
  );
}
