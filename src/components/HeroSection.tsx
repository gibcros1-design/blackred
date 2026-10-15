import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function HeroSection({ bannerUrl = "" }: { bannerUrl?: string }) {
  return (
    <section className="border-b border-border bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {bannerUrl ? (
          <Link href="/beli" className="mb-8 block overflow-hidden rounded-lg border border-border">
            <img src={bannerUrl} alt="Banner promo BlackRedRoblox" className="max-h-72 w-full object-cover" />
          </Link>
        ) : null}
        <div className="max-w-3xl">
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl font-heading">
            Top Up Robux & Game Favorit.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Pilih paket, bayar, lalu lacak pesanan secara instan. Proses cepat 1–3 menit dan kami tidak pernah meminta password akun Anda.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="#katalog" className={buttonVariants({ size: "lg" })}>
              Lihat Katalog Game <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/topup/roblox" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Beli Robux
            </Link>
            <Link href="/cek-order" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              Lacak Pesanan
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Jaminan 100% legal & tanpa password akun
          </p>
        </div>
      </div>
    </section>
  );
}
