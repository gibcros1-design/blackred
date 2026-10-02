"use client";

import { useState } from "react";
import { createAktivasiCodeAction } from "@/app/actions/aktivasi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, Check, KeyRound, Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  initialCode: string | null;
}

export function AktivasiCodeCard({ orderId, initialCode }: Props) {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await createAktivasiCodeAction(orderId);
      if (res.success) {
        setCode(res.code);
        toast.success("Kode aktivasi dibuat.");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Gagal membuat kode aktivasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Kode tersalin.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-stone-50 p-4">
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm font-medium">Kode aktivasi</span>
      </div>

      {code ? (
        <div className="flex flex-wrap items-center gap-3">
          <code className="rounded-md border border-border bg-card px-3 py-2 font-mono text-lg font-semibold tracking-widest">
            {code}
          </code>
          <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Tersalin" : "Salin"}
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Belum dibuat. Kode dikirim ke pembeli via WhatsApp, lalu dipakai di halaman <code className="font-mono">/aktivasi</code>.
        </p>
      )}

      <Button
        type="button"
        variant={code ? "ghost" : "outline"}
        size="sm"
        disabled={loading}
        onClick={handleCreate}
        className="w-fit gap-1.5 self-start"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {code ? "Buat kode baru" : "Buat kode aktivasi"}
      </Button>
    </div>
  );
}
