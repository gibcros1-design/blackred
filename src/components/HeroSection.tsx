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
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Beli Robux dengan mudah.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Pilih paket, bayar, lalu lacak pesanan. Kami hanya memerlukan username Roblox—password tetap milik Anda.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/beli" className={buttonVariants({ size: "lg" })}>
              Pilih paket <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/cek-order" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Lacak pesanan
            </Link>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Tidak pernah meminta password akun
          </p>
        </div>
      </div>
    </section>
  );
}
