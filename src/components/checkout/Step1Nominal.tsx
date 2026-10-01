import { PricingItem } from "@/services/config";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step1Props {
  pricing: PricingItem[];
  selectedRobux: number | null;
  onSelect: (robux: number, price: number) => void;
  onNext: () => void;
}

export function Step1Nominal({ pricing, selectedRobux, onSelect, onNext }: Step1Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold">Pilih nominal Robux</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Pilih jumlah Robux yang ingin Anda beli.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {pricing.map((item) => {
          const isSelected = selectedRobux === item.robux;
          return (
            <button
              type="button"
              key={item.robux}
              onClick={() => onSelect(item.robux, item.price)}
              aria-pressed={isSelected}
              className={cn(
                "relative rounded-lg border-2 p-4 text-left transition-all duration-150 cursor-pointer",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card hover:border-foreground/50 hover:shadow-sm",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-150",
                  isSelected
                    ? "border-primary-foreground bg-primary-foreground text-primary"
                    : "border-border text-transparent",
                )}
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <div className={cn("text-xs font-medium", isSelected ? "text-primary-foreground/75" : "text-muted-foreground")}>
                Robux
              </div>
              <div className="mt-1 pr-8 text-xl font-bold tracking-tight">
                {item.robux.toLocaleString("id-ID")}
              </div>
              <div className={cn("mt-2 text-sm font-medium", isSelected ? "text-primary-foreground" : "text-muted-foreground")}>
                {formatRupiah(item.price)}
              </div>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-4 rounded-md bg-secondary px-4 py-3 text-sm">
        {selectedRobux
          ? `Pilihan Anda: ${selectedRobux.toLocaleString("id-ID")} R$ seharga ${formatRupiah(pricing.find((p) => p.robux === selectedRobux)?.price ?? 0)}.`
          : "Belum ada paket terpilih."}
      </p>

      <div className="mt-6 flex justify-end">
        <Button type="button" disabled={!selectedRobux} onClick={onNext}>
          {selectedRobux ? `Lanjut ${selectedRobux.toLocaleString("id-ID")} R$` : "Lanjut ke data akun"}
        </Button>
      </div>
    </div>
  );
}
