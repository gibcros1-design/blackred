import { RekeningItem } from "@/services/config";

export function PaymentStrip({ rekeningList }: { rekeningList: RekeningItem[] }) {
  if (!rekeningList.length) return null;

  const methods = Array.from(new Set(rekeningList.map((r) => r.bank)));

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
