import { db } from "@/db";
import { orders, aktivasiCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatRupiah, formatDate } from "@/lib/utils";
import { OrderDetailActions } from "@/components/admin/OrderDetailActions";
import { AktivasiCodeCard } from "@/components/admin/AktivasiCodeCard";
import { statusLabels, statusBadge } from "@/components/admin/OrdersTable";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });

  if (!order) notFound();

  const aktivasi = await db.query.aktivasiCodes.findFirst({
    where: eq(aktivasiCodes.orderId, order.orderId),
  });

  const waLink = `https://wa.me/${order.whatsapp.replace(/^0/, "62")}?text=${encodeURIComponent(
    `Halo ${order.name}, kami dari Admin BlackRedRoblox mengenai pesanan Anda (${order.orderId}).`,
  )}`;

  const details = [
    ["Kode cek publik", order.code],
    ["Nama pelanggan", order.name],
    ["Username Roblox", order.robloxUsername],
    ["Nomor WhatsApp", order.whatsapp],
    ["Jumlah Robux", `${order.robuxAmount.toLocaleString("id-ID")} R$`],
    ["Kode unik transfer", `+${order.uniqueCode}`],
    ["Total pembayaran", formatRupiah(order.totalPrice)],
    ["Dibuat pada", formatDate(order.createdAt)],
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
      <Link
        href="/admin"
        className="inline-flex min-h-11 items-center gap-1.5 text-xs sm:text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar pesanan
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Detail pesanan</h1>
          <p className="mt-1 font-mono text-xs sm:text-sm text-muted-foreground break-all">{order.orderId}</p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants(), "w-full sm:w-auto justify-center gap-2")}
        >
          <MessageSquare className="h-4 w-4" /> Hubungi pelanggan
        </a>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Rincian transaksi</CardTitle>
              <Badge variant="outline" className={cn(statusBadge[order.status])}>
                {statusLabels[order.status] || order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border text-xs sm:text-sm">
              {details.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 py-2.5">
                  <dt className="text-muted-foreground shrink-0">{label}</dt>
                  <dd className={`text-right font-medium break-all ${label === "Total pembayaran" ? "font-semibold text-primary" : ""}`}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bukti transfer</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-border bg-stone-50 p-4">
              {order.paymentProof ? (
                <p className="py-12 text-center text-xs sm:text-sm text-muted-foreground">
                  Bukti transfer diterima — lihat screenshot di Telegram admin.
                </p>
              ) : (
                <p className="py-12 text-center text-xs sm:text-sm text-muted-foreground">
                  Bukti transfer belum diunggah oleh pembeli.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tindakan admin</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderDetailActions
            orderId={order.id}
            currentStatus={order.status}
            initialNote={order.adminNote}
          />
          <div className="mt-5">
            <AktivasiCodeCard orderId={order.id} initialCode={aktivasi?.code ?? null} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
