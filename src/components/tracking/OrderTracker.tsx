"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderTrackerProps {
  initialCode?: string;
  initialOrder?: any;
  adminWhatsapp?: string;
}

const statusMap: Record<string, { label: string; className: string; desc: string }> = {
  pending_payment: {
    label: "Menunggu pembayaran",
    className: "border-amber-300 bg-amber-50 text-amber-900",
    desc: "Silakan selesaikan pembayaran dan unggah bukti transfer.",
  },
  waiting_verify: {
    label: "Menunggu verifikasi",
    className: "border-blue-300 bg-blue-50 text-blue-900",
    desc: "Bukti transfer diterima. Admin sedang memverifikasi pembayaran.",
  },
  approved: {
    label: "Pembayaran disetujui",
    className: "border-green-300 bg-green-50 text-green-900",
    desc: "Pembayaran terverifikasi. Pesanan masuk antrean pengiriman Robux.",
  },
  processing: {
    label: "Sedang dikirim",
    className: "border-blue-300 bg-blue-50 text-blue-900",
    desc: "Admin sedang mengirim Robux ke akun Roblox Anda.",
  },
  completed: {
    label: "Pesanan selesai",
    className: "border-green-300 bg-green-50 text-green-900",
    desc: "Robux berhasil dikirim ke akun Roblox Anda. Terima kasih!",
  },
  rejected: {
    label: "Pesanan ditolak",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    desc: "Pesanan dibatalkan atau bukti transfer tidak valid.",
  },
  expired: {
    label: "Kedaluwarsa",
    className: "border-border bg-secondary text-muted-foreground",
    desc: "Batas waktu transfer 24 jam telah habis.",
  },
};

export function OrderTracker({ initialCode, initialOrder, adminWhatsapp = "" }: OrderTrackerProps) {
  const [query, setQuery] = useState(initialCode || "");
  const [order, setOrder] = useState<any>(initialOrder || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/order/check?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.order) {
        setError(data.error || "Pesanan tidak ditemukan. Periksa kembali kode atau Order ID Anda.");
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Gagal menghubungkan ke server.");
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = order ? statusMap[order.status] || statusMap.pending_payment : null;

  return (
    <Card className="mx-auto max-w-xl p-5 shadow-sm sm:p-8">
      <h2 className="text-center text-2xl font-semibold tracking-tight">Lacak pesanan</h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Masukkan kode cek 6 karakter atau nomor Order ID.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          placeholder="Contoh: A3X7K9 atau RBX-2026..."
          aria-label="Kode cek atau Order ID"
          className="min-w-0 uppercase"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Cari
        </Button>
      </form>

      {error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {order && currentStatus ? (
        <div className="mt-6 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Status pesanan</span>
            <Badge variant="outline" className={currentStatus.className}>{currentStatus.label}</Badge>
          </div>
          <p className="mt-3 rounded-md bg-secondary p-3 text-sm leading-6 text-secondary-foreground">
            {currentStatus.desc}
          </p>

          {order.adminNote && (
            <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
              <strong>Catatan admin:</strong> {order.adminNote}
            </p>
          )}

          <dl className="mt-4 divide-y divide-border rounded-lg border border-border px-4 text-sm">
            {[
              ["Order ID", order.orderId],
              ["Username Roblox", order.robloxUsername],
              ["Jumlah Robux", `${order.robuxAmount.toLocaleString("id-ID")} R$`],
              ["Total harga", formatRupiah(order.totalPrice)],
              ["Waktu order", formatDate(order.createdAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 text-center">
            {adminWhatsapp && (
              <a
                href={`https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(`Halo Admin, saya ingin menanyakan status pesanan saya dengan Order ID: ${order.orderId} (Kode: ${order.code})`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4 transition-colors duration-150 hover:text-muted-foreground"
              >
                Butuh bantuan? Hubungi admin via WhatsApp
              </a>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-md bg-stone-50 p-3 text-sm text-muted-foreground">
          Setelah membuat pesanan, masukkan kode cek di atas untuk melihat status pembayaran dan pengiriman.
        </p>
      )}
    </Card>
  );
}
