import Link from "next/link";
import { CheckCircle, Search, Home } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Step5Props {
  order: {
    orderId: string;
    code: string;
    robuxAmount: number;
    totalPrice: number;
    robloxUsername: string;
  };
}

export function Step5Success({ order }: Step5Props) {
  const rows = [
    { label: "Order ID", value: order.orderId, mono: true },
    { label: "Kode cek status", value: order.code, mono: true, accent: true },
    { label: "Username Roblox", value: order.robloxUsername },
    { label: "Jumlah Robux", value: `${order.robuxAmount.toLocaleString("id-ID")} R$` },
    { label: "Total dibayar", value: formatRupiah(order.totalPrice) },
  ];

  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex h-12 w-20 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle className="h-8 w-8" aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-2xl font-bold tracking-tight">Pesanan dibuat</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Bukti transfer diteruskan ke admin untuk diverifikasi.
      </p>

      <dl className="mx-auto mt-6 max-w-md divide-y divide-border rounded-lg border border-border bg-card px-4 text-left">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className={`text-right ${r.accent ? "font-mono font-semibold text-destructive" : "font-medium"}`}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href={`/cek-order?code=${order.code}`} className={buttonVariants()}>
          <Search className="h-4 w-4" /> Cek status pesanan
        </Link>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <Home className="h-4 w-4" /> Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
