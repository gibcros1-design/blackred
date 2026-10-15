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
  const normalizedPackages: UniversalGamePackage[] = packages.map((p: any, idx: number) => {
    const amount = Number(p.amount ?? p.robux ?? 0);
    const isRoblox = gameConfig.id === "roblox";
    const defaultId = isRoblox ? `rbx-${amount}` : `${gameConfig.id}-${amount || idx}`;
    const defaultName = isRoblox
      ? `${amount.toLocaleString("id-ID")} Robux`
      : `${amount.toLocaleString("id-ID")} ${gameConfig.currencyName}`;

    return {
      id: String(p.id || defaultId),
      name: String(p.name || defaultName),
      amount,
      price: Number(p.price) || 0,
      popular: Boolean(p.popular || (isRoblox && amount === 6500)),
    };
  });

  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<UniversalGamePackage>(() => {
    const found = initialPackageId ? normalizedPackages.find((p) => p.id === initialPackageId) : null;
    return found || normalizedPackages[0] || { id: "", name: "", amount: 0, price: 0 };
  });

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
    <Card className="mx-auto max-w-2xl rounded-2xl p-5 sm:p-8 bg-zinc-950 text-white border border-zinc-800 border-t-2 border-t-red-600 border-b-2 border-b-red-600 shadow-xl shadow-black/50">
      {/* Progress Steps Header */}
      <div className="mb-8">
        <ol className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="Progres pemesanan">
          {steps.map((label, index) => {
            const isCompletedOrActive = step >= index + 1;
            const isCurrent = step === index + 1;
            return (
              <li key={label} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200",
                    isCompletedOrActive
                      ? "bg-red-600 text-white shadow-sm shadow-red-900/50"
                      : "border-2 border-zinc-800 bg-zinc-900 text-zinc-500"
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "w-full truncate text-center text-[10px] sm:text-xs",
                    isCurrent ? "font-semibold text-white" : isCompletedOrActive ? "text-zinc-300" : "text-zinc-500"
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
        <div
          className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-zinc-900 border border-zinc-800/80"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={step}
        >
          <div
            className="h-full bg-red-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(220,38,38,0.6)]"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Nominal Selection */}
      {step === 1 && (
        <div>
          <div className="flex items-center justify-between gap-3 mb-1">
            <h3 className="text-lg font-semibold text-white font-heading">
              1. Pilih Paket {gameConfig.currencyName}
            </h3>
            <Badge variant="outline" className="text-xs border-zinc-800 bg-zinc-900 text-zinc-300">
              {gameConfig.name}
            </Badge>
          </div>
          <p className="text-sm text-zinc-400">
            Pilih denominasi item yang ingin Anda kirimkan ke akun game.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {normalizedPackages.map((item) => {
              const isSelected = selectedPackage.id === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedPackage(item)}
                  aria-pressed={isSelected}
                  className={cn(
                    "relative rounded-xl p-3.5 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border-t-2 border-b-2",
                    isSelected
                      ? "border-x border-red-600 border-t-red-600 border-b-red-600 bg-zinc-900 text-white shadow-lg shadow-red-950/60 ring-1 ring-red-600/60"
                      : "border-x border-zinc-800/90 border-t-red-600/40 border-b-red-600/40 bg-zinc-900/80 text-zinc-200 hover:border-zinc-700 hover:border-t-red-600 hover:border-b-red-600 hover:bg-zinc-900"
                  )}
                >
                  <div className="flex items-start justify-between gap-1 w-full">
                    <span className={cn("text-[11px] font-semibold uppercase tracking-wider", isSelected ? "text-red-400" : "text-zinc-500")}>
                      {gameConfig.shortName}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                        isSelected
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-zinc-700 bg-zinc-800/60 text-transparent"
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  </div>

                  <div className="mt-2 text-base sm:text-lg font-bold tracking-tight line-clamp-2 text-white">
                    {item.name}
                  </div>

                  <div className={cn("mt-2 text-xs sm:text-sm font-bold", isSelected ? "text-red-500 font-extrabold" : "text-red-400")}>
                    {formatRupiah(item.price)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="text-sm">
              <span className="text-zinc-400">Total: </span>
              <span className="font-bold text-white text-base">
                {selectedPackage.price ? formatRupiah(selectedPackage.price) : "Pilih paket"}
              </span>
            </div>
            <Button
              type="button"
              disabled={!selectedPackage || !selectedPackage.price}
              onClick={() => setStep(2)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-950/50 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
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
            <h3 className="text-lg font-semibold text-white font-heading">
              2. Masukkan Data Akun {gameConfig.shortName}
            </h3>
            <span className="text-xs text-zinc-400 font-medium">Langkah 2 dari 5</span>
          </div>
          <p className="text-sm text-zinc-400">
            Isi identitas akun game tempat item akan dikirimkan. Kami tidak pernah meminta password.
          </p>

          {/* Guide Banner */}
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-xs text-zinc-300">
            <Info className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <span>{gameConfig.idGuide}</span>
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-red-800/50 bg-red-950/40 px-3 py-2 text-sm text-red-300" role="alert">
              {error}
            </p>
          )}

          <div className="mt-5 space-y-4">
            {/* Game Specific Fields */}
            {gameConfig.fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-zinc-200">
                  {field.label} <span className="text-red-500">*</span>
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
                  className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-red-600 focus-visible:border-red-600"
                />
                {field.helperText && (
                  <p className="mt-1 text-xs text-zinc-400">{field.helperText}</p>
                )}
              </div>
            ))}

            {/* Buyer Contact Fields */}
            <div>
              <label htmlFor="buyerName" className="block text-sm font-medium text-zinc-200">
                Nama Pemesan <span className="text-red-500">*</span>
              </label>
              <Input
                id="buyerName"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Budi Santoso"
                className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-red-600 focus-visible:border-red-600"
              />
            </div>

            <div>
              <label htmlFor="waNumber" className="block text-sm font-medium text-zinc-200">
                Nomor WhatsApp Aktif <span className="text-red-500">*</span>
              </label>
              <Input
                id="waNumber"
                type="tel"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="Contoh: 081234567890"
                className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-red-600 focus-visible:border-red-600"
              />
              <p className="mt-1 text-xs text-zinc-400">
                Digunakan untuk notifikasi status pesanan atau jika ada kendala akun.
              </p>
            </div>
          </div>

          {/* Selected Summary Card */}
          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/80 border-t-2 border-t-red-600/50 border-b-2 border-b-red-600/50 p-3.5 flex items-center justify-between text-sm">
            <div>
              <span className="text-xs text-zinc-400 block">Paket Terpilih:</span>
              <span className="font-semibold text-white">{selectedPackage.name}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">Harga:</span>
              <span className="font-bold text-red-500">{formatRupiah(selectedPackage.price)}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              disabled={submitting}
              className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Ganti Paket
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-950/50"
            >
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
