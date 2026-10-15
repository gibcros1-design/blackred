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
      <h3 className="text-lg font-semibold text-white">Transfer pembayaran</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Transfer tepat sesuai total tagihan agar verifikasi berjalan lancar.
      </p>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 border-t-2 border-t-red-600 border-b-2 border-b-red-600 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-zinc-400">Total tagihan</span>
          <Badge variant="outline" className="border-red-900/60 bg-red-950/40 text-red-300 text-xs">
            Termasuk kode unik +{order.uniqueCode}
          </Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
          <span className="text-3xl font-bold tracking-tight text-white">{formatRupiah(order.totalPrice)}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => copy(String(order.totalPrice), "Nominal transfer")}
            className="text-red-400 hover:text-red-300 hover:bg-zinc-800"
          >
            <Copy className="h-4 w-4" /> Salin nominal
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
          <span>
            Order ID: <code className="font-mono text-zinc-200">{order.orderId}</code>
          </span>
          <span>
            Kode cek: <code className="font-mono font-semibold text-red-400">{order.code}</code>
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-zinc-200">Rekening tujuan</h4>
        {qrImageUrl && (
          <figure className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <img src={qrImageUrl} alt="QRIS pembayaran" className="mx-auto max-h-[28rem] w-full max-w-md rounded-md object-contain bg-white p-2" />
            <figcaption className="mt-3 text-sm text-zinc-400">Scan QRIS untuk membayar.</figcaption>
          </figure>
        )}
        <ul className="mt-2 space-y-2.5">
          {rekeningList.map((rek) => (
            <li
              key={`${rek.bank}-${rek.nomor}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 border-t-2 border-t-red-600/30 border-b-2 border-b-red-600/30"
            >
              <div className="min-w-0">
                <span className="text-sm font-semibold text-white">{rek.bank}</span>
                <p className="text-xs text-zinc-400">a.n. {rek.atasNama}</p>
                <code className="mt-1 block font-mono text-sm font-medium text-zinc-200">{rek.nomor}</code>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copy(rek.nomor, `Rekening ${rek.bank}`)}
                className="border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
              >
                {copiedBank === rek.bank ? (
                  <><Check className="h-4 w-4 text-green-400" /> Tersalin</>
                ) : (
                  <><Copy className="h-4 w-4" /> Salin</>
                )}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 flex items-start gap-2.5 rounded-md border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-zinc-300">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
        Simpan screenshot struk transfer Anda untuk diunggah pada langkah berikutnya.
      </p>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          onClick={onNext}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-950/50"
        >
          Saya sudah transfer
        </Button>
      </div>
    </div>
  );
}
