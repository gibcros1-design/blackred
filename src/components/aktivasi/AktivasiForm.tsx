"use client";

import { useState } from "react";
import { Loader2, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  adminWhatsapp: string;
}

export function AktivasiForm({ adminWhatsapp }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [order, setOrder] = useState<{ orderId: string; status: string; adminNote: string | null } | null>(null);

  const shake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setOrder(null);
    setError("");
    try {
      const res = await fetch("/api/aktivasi/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
        toast.success("Nomor aktivasi ditemukan.");
      } else {
        setError(data.error || "Nomor aktivasi tidak ditemukan.");
        shake();
      }
    } catch {
      setError("Gagal memeriksa. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const waHref = `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(
    `Halo Admin, saya mau aktivasi nomor ${code.trim().toUpperCase()}${order ? ` (Order ID: ${order.orderId})` : ""}.`,
  )}`;

  return (
    <div className="mx-auto max-w-lg">
      <CardShell>
        <form onSubmit={handleCheck} className="space-y-4">
          <label htmlFor="aktivasi-code" className="block text-sm font-medium">
            Nomor aktivasi
          </label>
          <p className="-mt-2 text-xs text-muted-foreground">
            Nomor yang diberikan admin melalui WhatsApp.
          </p>
          <Input
            id="aktivasi-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Masukkan nomor aktivasi"
            className="font-mono uppercase"
            maxLength={16}
          />
          <Button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Cek aktivasi
          </Button>
        </form>

        {error && (
          <p
            className={`mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive ${shaking ? "shake" : ""}`}
            role="alert"
          >
            {error}
          </p>
        )}
      </CardShell>

      {order && (
        <div className="mt-6">
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-lg border border-border bg-stone-50 p-3">
              <CheckCircle2 className="h-7 w-7 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">Nomor aktivasi ditemukan</h2>
            <p className="mt-2 font-mono text-sm text-muted-foreground">Order ID: {order.orderId}</p>
            {order.adminNote && <p className="mt-3 text-sm text-muted-foreground">{order.adminNote}</p>}
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 font-semibold text-white transition-transform duration-150 hover:scale-[1.02]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hubungi admin sekarang
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-8">
      {children}
    </div>
  );
}
