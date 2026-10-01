import { ShieldCheck, RotateCcw, MessageSquare } from "lucide-react";

const guarantees = (serviceHours: string) => [
  {
    icon: ShieldCheck,
    title: "Tanpa password",
    detail: "Kami hanya perlu username Roblox. Password akun tetap milik Anda, tidak pernah diminta.",
  },
  {
    icon: RotateCcw,
    title: "Salah transfer? Kami telusuri",
    detail: "Setiap pesanan punya kode cek. Jika ada masalah, sebutkan kode itu saat menghubungi kami.",
  },
  {
    icon: MessageSquare,
    title: "Ada yang bertanya langsung",
    detail: `Hubungi admin lewat WhatsApp dan dapat jawaban di jam layanan ${serviceHours}.`,
  },
];

export function TrustSection({ whatsapp, serviceHours }: { whatsapp: string; serviceHours: string }) {
  const guaranteesList = guarantees(serviceHours);
  return (
    <section className="border-t border-border py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">Kenapa membeli di sini</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Bebas risiko sejak pesanan dibuat</h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {guaranteesList.map(({ icon: Icon, title, detail }) => (
            <article key={title} className="rounded-r-lg border border-l-4 border-l-foreground bg-card p-5">
              <Icon className="h-5 w-5 text-destructive" aria-hidden="true" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
        {whatsapp && (
          <p className="mt-6 text-sm text-muted-foreground">
            Masih ragu?{" "}
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Halo, saya ingin bertanya soal pembelian Robux.")}`}
              target="_blank"
            rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
            >
              Tanya admin lewat WhatsApp
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
