import { RekeningItem } from "@/services/config";

export function PaymentStrip({
  rekeningList,
  qrImageUrl,
}: {
  rekeningList: RekeningItem[];
  qrImageUrl?: string;
}) {
  if (!rekeningList.length && !qrImageUrl) return null;

  // QRIS dikonfigurasi terpisah (gambar di settings) — tetap tampil di strip.
  const methods = qrImageUrl
    ? Array.from(new Set([...rekeningList.map((r) => r.bank), "QRIS"]))
    : Array.from(new Set(rekeningList.map((r) => r.bank)));

  return (
    <section className="border-y border-border bg-stone-50 py-5" aria-label="Metode pembayaran">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Metode pembayaran
        </span>
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {methods.map((bank) => (
            <li
              key={bank}
              className="rounded-md border border-border bg-card px-3.5 py-1.5 text-sm font-semibold shadow-sm"
            >
              {bank}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
