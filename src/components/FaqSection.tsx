"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Berapa lama proses pengiriman Robux?",
    a: "Setelah bukti transfer diverifikasi admin, pengiriman memakan waktu 5 hingga 30 menit pada jam operasional.",
  },
  {
    q: "Metode apa yang digunakan untuk mengirimkan Robux?",
    a: "Pengiriman dilakukan via Group Payout resmi atau pembelian Game Pass langsung dari akun Roblox Anda.",
  },
  {
    q: "Apakah akun Roblox saya aman? Butuh password?",
    a: "Kami tidak pernah meminta password akun Roblox Anda. Kami hanya memerlukan username Roblox Anda saja.",
  },
  {
    q: "Bagaimana cara memeriksa status pesanan saya?",
    a: "Setiap transaksi mendapatkan Order ID dan kode cek 8 karakter. Anda bisa memeriksa statusnya di halaman Cek Order.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-border bg-stone-50 py-14 sm:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Pertanyaan umum
        </h2>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-colors duration-150 hover:text-muted-foreground"
                >
                  {faq.q}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div className="accordion" data-open={isOpen}>
                  <div>
                    <p className="pb-4 pr-8 text-sm leading-6 text-muted-foreground">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
