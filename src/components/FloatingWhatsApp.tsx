"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp({ whatsapp }: { whatsapp: string }) {
  const pathname = usePathname();

  // Di panel admin tidak perlu tombol "hubungi admin".
  if (!whatsapp || pathname.startsWith("/admin")) return null;

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Halo, saya ingin bertanya soal pembelian Robux.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat admin via WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-150 hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
