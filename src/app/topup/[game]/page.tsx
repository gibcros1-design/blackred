import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DynamicCheckoutWizard } from "@/components/checkout/DynamicCheckoutWizard";
import { getGameConfig, GameConfig } from "@/lib/games";
import { getConfigValue, RekeningItem } from "@/services/config";
import { DEFAULT_REKENING, getDefaultPackagesForGame, UniversalGamePackage } from "@/services/defaults";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ package?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { game } = await params;
  const config = getGameConfig(game);
  if (!config) return { title: "Game Tidak Ditemukan" };

  return {
    title: `Top Up ${config.name} Murah & Cepat - BlackRedRoblox`,
    description: `Beli ${config.currencyName} ${config.name} resmi dan instan. Proses 1-3 menit langsung ke akun, pembayaran via QRIS dan Transfer Bank.`,
  };
}

export default async function TopupGamePage({ params, searchParams }: PageProps) {
  const { game } = await params;
  const { package: initialPackageId } = await searchParams;

  const gameConfig = getGameConfig(game);
  if (!gameConfig) {
    notFound();
  }

  const defaultPackages = getDefaultPackagesForGame(gameConfig.id);
  const [rawPackages, rekeningList, qrImageUrl] = await Promise.all([
    getConfigValue<any[]>(gameConfig.configKey, defaultPackages),
    getConfigValue<RekeningItem[]>("rekening", DEFAULT_REKENING),
    getConfigValue<string>("qr_image_url", ""),
  ]);

  const packages: UniversalGamePackage[] = (rawPackages && rawPackages.length > 0 ? rawPackages : defaultPackages).map(
    (p: any, idx: number) => {
      const amount = Number(p.amount ?? p.robux ?? 0);
      const isRoblox = gameConfig.id === "roblox";
      const defaultId = isRoblox ? `rbx-${amount}` : `${gameConfig.id}-${amount || idx}`;
      const defaultName = isRoblox
        ? `${amount.toLocaleString("id-ID")} Robux`
        : `${amount.toLocaleString("id-ID")} ${gameConfig.currencyName}`;

      return {
        id: String(p.id || defaultId),
        name: String(p.name || defaultName),
        amount,
        price: Number(p.price) || 0,
        popular: Boolean(p.popular || (isRoblox && amount === 6500)),
      };
    }
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4">
          {/* Header Banner */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
              Top Up {gameConfig.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
              {gameConfig.tagline}. Masukkan data akun dan pilih nominal {gameConfig.currencyName} yang Anda inginkan.
            </p>
          </div>

          {/* Checkout Wizard Form */}
          <DynamicCheckoutWizard
            gameConfig={gameConfig}
            packages={packages && packages.length > 0 ? packages : defaultPackages}
            rekeningList={rekeningList}
            qrImageUrl={qrImageUrl}
            initialPackageId={initialPackageId}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
