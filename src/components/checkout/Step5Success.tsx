import Link from "next/link";
import { CheckCircle, Search, Home } from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Step5Props {
  order: {
    orderId: string;
    code: string;
    game?: string;
    itemName?: string;
    gameUserId?: string;
    gameZoneId?: string;
    robuxAmount?: number;
    totalPrice: number;
    robloxUsername?: string;
  };
}

export function Step5Success({ order }: Step5Props) {
  const accountText = order.gameZoneId
    ? `${order.gameUserId || order.robloxUsername} (Zone: ${order.gameZoneId})`
    : (order.gameUserId || order.robloxUsername || "-");

  const itemText = order.itemName || (order.robuxAmount ? `${order.robuxAmount.toLocaleString("id-ID")} Robux` : "-");

  const rows = [
    { label: "Order ID", value: order.orderId, mono: true },
    { label: "Kode cek status", value: order.code, mono: true, accent: true },
    { label: "Game", value: (order.game ? order.game.toUpperCase() : "ROBLOX") },
    { label: "Akun / Player ID", value: accountText },
    { label: "Paket Item", value: itemText },
    { label: "Total dibayar", value: formatRupiah(order.totalPrice) },
  ];

  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-950/60 border border-red-600/50 text-red-500 shadow-md shadow-red-950/50">
        <CheckCircle className="h-8 w-8" aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-2xl font-bold tracking-tight text-white font-heading">Pesanan dibuat</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Bukti transfer diteruskan ke admin untuk diverifikasi.
      </p>

      <dl className="mx-auto mt-6 max-w-md divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/90 border-t-2 border-t-red-600 border-b-2 border-b-red-600 px-4 text-left shadow-lg">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <dt className="text-zinc-400">{r.label}</dt>
            <dd className={`text-right ${r.accent ? "font-mono font-semibold text-red-400" : "font-medium text-white"}`}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={`/cek-order?code=${order.code}`}
          className={cn(buttonVariants(), "bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-950/50")}
        >
          <Search className="h-4 w-4" /> Cek status pesanan
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white")}
        >
          <Home className="h-4 w-4" /> Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
