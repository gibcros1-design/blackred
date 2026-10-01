import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { PricingItem } from "@/services/config";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface PricingGridProps {
  items: PricingItem[];
}

const POPULAR_ROBUX = 6500;

export function PricingGrid({ items }: PricingGridProps) {
  const sorted = [...items].sort((a, b) => a.robux - b.robux);
  const popular = sorted.find((i) => i.robux === POPULAR_ROBUX);
  const bestUnit = sorted.reduce((best, i) => (i.price / i.robux < best.price / best.robux ? i : best));

  const groups = [
    { title: "Nominal kecil", items: sorted.filter((i) => i.robux < 10000) },
    { title: "Nominal besar", items: sorted.filter((i) => i.robux >= 10000) },
  ].filter((g) => g.items.length > 0);

  const card = (item: PricingItem) => {
    const isPopular = item.robux === POPULAR_ROBUX;
    const isBest = item.robux === bestUnit.robux;
    const unit = item.price / item.robux;
    const bestUnitPrice = bestUnit.price / bestUnit.robux;
    const ratio = bestUnitPrice / unit; // 1 = paling hemat

    return (
      <Link
        key={item.robux}
        href={`/beli?robux=${item.robux}`}
        aria-label={`Pilih paket ${item.robux} Robux seharga ${formatRupiah(item.price)}`}
        className={`group relative flex min-h-[104px] flex-col justify-between overflow-hidden rounded-lg border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          isPopular ? "border-destructive bg-destructive/5" : "border-border bg-card hover:border-foreground/40"
        }`}
      >
        {isPopular && (
          <span className="absolute -right-7 top-3 rotate-45 bg-destructive px-8 py-1 text-[10px] font-semibold tracking-wide text-destructive-foreground">
            Terlaris
          </span>
        )}
        <div>
          <span className="block text-3xl font-extrabold tabular-nums leading-none tracking-tight sm:text-4xl">
            {item.robux.toLocaleString("id-ID")}
          </span>
          <span className="mt-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Robux
          </span>
        </div>
        <div className="mt-3">
          <span className="block text-sm font-semibold tabular-nums">{formatRupiah(item.price)}</span>
          <span className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="tabular-nums">Rp {Math.round(unit)}/R$</span>
            {isBest && <span className="font-semibold text-destructive">Hemat</span>}
          </span>
          <span className="mt-2 block h-1 overflow-hidden rounded-full bg-secondary">
            <span
              className={`block h-full rounded-full ${isPopular ? "bg-destructive" : "bg-foreground/80"}`}
              style={{ width: `${Math.max(6, Math.round(ratio * 100))}%` }}
            />
          </span>
        </div>
        <ArrowRight
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden="true"
        />
      </Link>
    );
  };

  return (
    <section id="paket" className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-destructive">Harga transparan</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Pilih paket Robux</h2>
          </div>
          {popular && (
            <p className="hidden text-sm text-muted-foreground sm:block">
              Paling banyak dipilih:{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {popular.robux.toLocaleString("id-ID")} R$
              </span>
            </p>
          )}
        </div>

        <div className="mt-7 space-y-8">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</h3>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {group.items.map(card)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-stone-50 p-4 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Klik paket untuk lanjut ke pemesanan. Harga tampil sebelum Anda membayar.
          </p>
          <Link href="/beli" className={`${buttonVariants({ variant: "outline" })} mt-3 w-full sm:mt-0 sm:w-auto`}>
            Lihat semua di halaman pesan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
