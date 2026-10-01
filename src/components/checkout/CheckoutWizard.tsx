"use client";

import { useState } from "react";
import { PricingItem, RekeningItem } from "@/services/config";
import { createOrderAction, submitPaymentProofAction } from "@/app/actions/order";
import { Step1Nominal } from "./Step1Nominal";
import { Step2UserData } from "./Step2UserData";
import { Step3Payment } from "./Step3Payment";
import { Step4UploadProof } from "./Step4UploadProof";
import { Step5Success } from "./Step5Success";
import { Card } from "@/components/ui/card";

interface CheckoutWizardProps {
  initialRobux?: number;
  pricing: PricingItem[];
  rekeningList: RekeningItem[];
  qrImageUrl?: string;
}

const steps = ["Nominal", "Akun", "Transfer", "Bukti", "Selesai"];

export function CheckoutWizard({ initialRobux, pricing, rekeningList, qrImageUrl }: CheckoutWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedRobux, setSelectedRobux] = useState<number | null>(
    initialRobux ?? pricing[0]?.robux ?? null,
  );
  const [selectedPrice, setSelectedPrice] = useState<number>(
    pricing.find((p) => p.robux === initialRobux)?.price ?? pricing[0]?.price ?? 0,
  );
  const [userData, setUserData] = useState({ name: "", robloxUsername: "", whatsapp: "" });
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleUserDataSubmit = async (data: typeof userData) => {
    setUserData(data);
    if (!selectedRobux || submitting) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await createOrderAction({
        robuxAmount: selectedRobux,
        price: selectedPrice,
        name: data.name,
        robloxUsername: data.robloxUsername,
        whatsapp: data.whatsapp,
      });

      if (res.success && res.order) {
        setCreatedOrder(res.order);
        setStep(3);
      } else {
        setError("Pesanan belum dapat dibuat. Coba lagi.");
      }
    } catch {
      setError("Pesanan belum dapat dibuat. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl p-5 shadow-sm sm:p-8">
      <div className="mb-8">
        <ol className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="Progres pemesanan">
          {steps.map((label, index) => {
            const state = step >= index + 1 ? "done" : "todo";
            return (
              <li key={label} className="flex flex-col items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                    state === "done"
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`w-full truncate text-center text-[11px] sm:text-xs ${
                    step === index + 1 ? "font-semibold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={step}
          aria-label={`Langkah ${step} dari 5`}
        >
          <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
      </div>

      {error && (
        <p className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {step === 1 && (
        <Step1Nominal
          pricing={pricing}
          selectedRobux={selectedRobux}
          onSelect={(robux, price) => { setSelectedRobux(robux); setSelectedPrice(price); }}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2UserData initialData={userData} onBack={() => setStep(1)} onSubmit={handleUserDataSubmit} />
      )}
      {step === 3 && createdOrder && (
        <Step3Payment order={createdOrder} rekeningList={rekeningList} qrImageUrl={qrImageUrl} onNext={() => setStep(4)} />
      )}
      {step === 4 && createdOrder && (
        <Step4UploadProof
          orderId={createdOrder.orderId}
          onSubmitProof={submitPaymentProofAction}
          onSuccess={() => setStep(5)}
        />
      )}
      {step === 5 && createdOrder && <Step5Success order={createdOrder} />}
    </Card>
  );
}
