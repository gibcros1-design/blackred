"use client";

import { useState } from "react";
import { GameConfig } from "@/lib/games";
import { UniversalGamePackage } from "@/services/defaults";
import { RekeningItem } from "@/services/config";
import { createOrderAction, submitPaymentProofAction } from "@/app/actions/order";
import { Step3Payment } from "./Step3Payment";
import { Step4UploadProof } from "./Step4UploadProof";
import { Step5Success } from "./Step5Success";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, cn } from "@/lib/utils";
import { Check, Info, Loader2, ArrowLeft } from "lucide-react";

interface DynamicCheckoutWizardProps {
  gameConfig: GameConfig;
  packages: UniversalGamePackage[];
  rekeningList: RekeningItem[];
  qrImageUrl?: string;
  initialPackageId?: string;
}

const steps = ["Pilih Item", "Data Akun", "Bayar", "Bukti", "Selesai"];

export function DynamicCheckoutWizard({
  gameConfig,
  packages,
  rekeningList,
  qrImageUrl,
  initialPackageId,
}: DynamicCheckoutWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<UniversalGamePackage>(
    packages.find((p) => p.id === initialPackageId) || packages[0] || { id: "", name: "", amount: 0, price: 0 }
  );

  const [formData, setFormData] = useState({
    name: "",
    gameUserId: "",
    gameZoneId: "",
    whatsapp: "",
  });

  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [proofToken, setProofToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !selectedPackage.price) {
      setError("Pilih nominal paket terlebih dahulu.");
      return;
    }
    if (!formData.name.trim() || !formData.gameUserId.trim() || !formData.whatsapp.trim()) {
      setError("Semua kolom data pemesan dan akun wajib diisi.");
      return;
    }
    if (gameConfig.id === "mlbb" && !formData.gameZoneId.trim()) {
      setError("Zone ID / Server MLBB wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await createOrderAction({
        game: gameConfig.id,
        packageId: selectedPackage.id,
        itemName: selectedPackage.name,
        robuxAmount: selectedPackage.amount,
        price: selectedPackage.price,
        name: formData.name,
        gameUserId: formData.gameUserId,
        gameZoneId: formData.gameZoneId,
        robloxUsername: formData.gameUserId,
        whatsapp: formData.whatsapp,
      });

      if (res.success && res.order && res.proofToken) {
        setCreatedOrder(res.order);
        setProofToken(res.proofToken);
        setStep(3);
      } else {
        setError(res.error || "Gagal membuat pesanan. Silakan coba lagi.");
      }
    } catch (err: any) {
      setError(`Terjadi kesalahan sistem: ${err?.message || "Coba lagi nanti."}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl p-5 shadow-sm sm:p-8 border-border/80">
      {/* Progress Steps Header */}
      <div className="mb-8">
        <ol className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="Progres pemesanan">
          {steps.map((label, index) => {
            const state = step >= index + 1 ? "done" : "todo";
            return (
              <li key={label} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200",
                    state === "done"
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-border bg-background text-muted-foreground"
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "w-full truncate text-center text-[10px] sm:text-xs",
                    step === index + 1 ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
        <div
          className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={step}
        >
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Nominal Selection */}
      {step === 1 && (
        <div>
          <div className="flex items-center justify-between gap-3 mb-1">
            <h3 className="text-lg font-semibold text-foreground font-heading">
              1. Pilih Paket {gameConfig.currencyName}
            </h3>
            <Badge variant="outline" className="text-xs">
              {gameConfig.name}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Pilih denominasi item yang ingin Anda kirimkan ke akun game.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {packages.map((item) => {
              const isSelected = selectedPackage.id === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedPackage(item)}
                  aria-pressed={isSelected}
                  className={cn(
                    "relative rounded-xl border-2 p-3.5 text-left transition-all duration-150 cursor-pointer flex flex-col justify-between",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card hover:border-foreground/40 hover:shadow-xs"
                  )}
                >
                  <div className="flex items-start justify-between gap-1 w-full">
                    <span className={cn("text-[11px] font-semibold uppercase tracking-wider", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {gameConfig.shortName}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                        isSelected
                          ? "border-primary-foreground bg-primary-foreground text-primary"
                          : "border-border text-transparent"
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  </div>

                  <div className="mt-2 text-base sm:text-lg font-bold tracking-tight line-clamp-2">
                    {item.name}
                  </div>

                  <div className={cn("mt-2 text-xs sm:text-sm font-semibold", isSelected ? "text-primary-foreground" : "text-primary")}>
                    {formatRupiah(item.price)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/70">
            <div className="text-sm">
              <span className="text-muted-foreground">Total: </span>
              <span className="font-bold text-foreground text-base">
                {selectedPackage.price ? formatRupiah(selectedPackage.price) : "Pilih paket"}
              </span>
            </div>
            <Button
              type="button"
              disabled={!selectedPackage || !selectedPackage.price}
              onClick={() => setStep(2)}
            >
              Lanjut ke Data Akun
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Account & Buyer Data Form */}
      {step === 2 && (
        <form onSubmit={handleCreateOrder}>
          <div className="flex items-center justify-between gap-3 mb-1">
            <h3 className="text-lg font-semibold text-foreground font-heading">
              2. Masukkan Data Akun {gameConfig.shortName}
            </h3>
            <span className="text-xs text-muted-foreground font-medium">Langkah 2 dari 5</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Isi identitas akun game tempat item akan dikirimkan. Kami tidak pernah meminta password.
          </p>

          {/* Guide Banner */}
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>{gameConfig.idGuide}</span>
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="mt-5 space-y-4">
            {/* Game Specific Fields */}
            {gameConfig.fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium">
                  {field.label} <span className="text-destructive">*</span>
                </label>
                <Input
                  id={field.key}
                  type={field.type || "text"}
                  required={field.required}
                  value={field.key === "gameZoneId" ? formData.gameZoneId : formData.gameUserId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.key === "gameZoneId" ? "gameZoneId" : "gameUserId"]: e.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className="mt-1.5"
                />
                {field.helperText && (
                  <p className="mt-1 text-xs text-muted-foreground">{field.helperText}</p>
                )}
              </div>
            ))}

            {/* Buyer Contact Fields */}
            <div>
              <label htmlFor="buyerName" className="block text-sm font-medium">
                Nama Pemesan <span className="text-destructive">*</span>
              </label>
              <Input
                id="buyerName"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Budi Santoso"
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="waNumber" className="block text-sm font-medium">
                Nomor WhatsApp Aktif <span className="text-destructive">*</span>
              </label>
              <Input
                id="waNumber"
                type="tel"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="Contoh: 081234567890"
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Digunakan untuk notifikasi status pesanan atau jika ada kendala akun.
              </p>
            </div>
          </div>

          {/* Selected Summary Card */}
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-3.5 flex items-center justify-between text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Paket Terpilih:</span>
              <span className="font-semibold text-foreground">{selectedPackage.name}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Harga:</span>
              <span className="font-bold text-primary">{formatRupiah(selectedPackage.price)}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={submitting}>
              <ArrowLeft className="h-4 w-4" /> Ganti Paket
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
                </>
              ) : (
                "Lanjut ke Pembayaran"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: Payment Details */}
      {step === 3 && createdOrder && (
        <Step3Payment
          order={createdOrder}
          rekeningList={rekeningList}
          qrImageUrl={qrImageUrl}
          onNext={() => setStep(4)}
        />
      )}

      {/* Step 4: Upload Payment Proof */}
      {step === 4 && createdOrder && (
        <Step4UploadProof
          orderId={createdOrder.orderId}
          proofToken={proofToken}
          onSubmitProof={submitPaymentProofAction}
          onSuccess={() => setStep(5)}
        />
      )}

      {/* Step 5: Success Summary */}
      {step === 5 && createdOrder && <Step5Success order={createdOrder} />}
    </Card>
  );
}
