import { RekeningItem } from "@/services/config";
import { formatRupiah } from "@/lib/utils";
import { Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Step3Props {
  order: {
    orderId: string;
    code: string;
    robuxAmount: number;
    price: number;
    uniqueCode: number;
    totalPrice: number;
  };
  rekeningList: RekeningItem[];
  qrImageUrl?: string;
  onNext: () => void;
}

export function Step3Payment({ order, rekeningList, qrImageUrl, onNext }: Step3Props) {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedBank(label);
    toast.success(`${label} tersalin.`);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Transfer pembayaran</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Transfer tepat sesuai total tagihan agar verifikasi berjalan lancar.
      </p>

      <div className="mt-4 rounded-lg border border-border bg-stone-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Total tagihan</span>
          <Badge variant="secondary">Termasuk kode unik +{order.uniqueCode}</Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
          <span className="text-3xl font-bold tracking-tight">{formatRupiah(order.totalPrice)}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => copy(String(order.totalPrice), "Nominal transfer")}
          >
            <Copy className="h-4 w-4" /> Salin nominal
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            Order ID: <code className="font-mono text-foreground">{order.orderId}</code>
          </span>
          <span>
            Kode cek: <code className="font-mono font-semibold text-destructive">{order.code}</code>
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium">Rekening tujuan</h4>
        {qrImageUrl && (
          <figure className="mt-3 rounded-lg border border-border bg-stone-50 p-4 text-center">
            <img src={qrImageUrl} alt="QRIS pembayaran" className="mx-auto max-h-[28rem] w-full max-w-md rounded-md object-contain" />
            <figcaption className="mt-3 text-sm text-muted-foreground">Scan QRIS untuk membayar.</figcaption>
          </figure>
        )}
        <ul className="mt-2 space-y-2.5">
          {rekeningList.map((rek) => (
            <li
              key={`${rek.bank}-${rek.nomor}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5"
            >
              <div className="min-w-0">
                <span className="text-sm font-semibold">{rek.bank}</span>
                <p className="text-xs text-muted-foreground">a.n. {rek.atasNama}</p>
                <code className="mt-1 block font-mono text-sm font-medium">{rek.nomor}</code>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copy(rek.nomor, `Rekening ${rek.bank}`)}
              >
                {copiedBank === rek.bank ? (
                  <><Check className="h-4 w-4" /> Tersalin</>
                ) : (
                  <><Copy className="h-4 w-4" /> Salin</>
                )}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 flex items-start gap-2.5 rounded-md border border-border bg-stone-50 p-3 text-sm text-muted-foreground">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Simpan screenshot struk transfer Anda untuk diunggah pada langkah berikutnya.
      </p>

      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={onNext}>Saya sudah transfer</Button>
      </div>
    </div>
  );
}
