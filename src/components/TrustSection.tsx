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
  const guaranteesList = [
    {
      icon: ShieldCheck,
      title: "Tanpa password",
      detail: "Kami hanya perlu User ID atau Username game Anda. Password akun tetap milik Anda, tidak pernah diminta.",
    },
    {
      icon: RotateCcw,
      title: "Salah transfer? Kami telusuri",
      detail: "Setiap pesanan punya kode cek unik. Jika ada kendala, cukup sebutkan kode tersebut saat menghubungi kami.",
    },
    {
      icon: MessageSquare,
      title: "Ada yang bertanya langsung",
      detail: `Hubungi admin lewat WhatsApp dan dapat jawaban cepat di jam operasional ${serviceHours}.`,
    },
  ];

  return (
    <section className="border-t border-border py-12 sm:py-16 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Kenapa membeli di sini</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-foreground font-heading">
            Bebas risiko sejak pesanan dibuat
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {guaranteesList.map(({ icon: Icon, title, detail }) => (
            <article
              key={title}
              className="group relative flex flex-col justify-between rounded-lg border border-zinc-800 border-t-2 border-t-red-600 border-b-2 border-b-red-600 bg-zinc-950 p-5 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-red-500 hover:shadow-lg hover:shadow-red-950/20"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-red-500 group-hover:border-red-600/50 group-hover:scale-105 transition-all">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-bold text-base text-white group-hover:text-red-400 transition-colors">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {detail}
                </p>
              </div>
            </article>
          ))}
        </div>

        {whatsapp && (
          <p className="mt-8 text-sm text-muted-foreground">
            Masih ragu?{" "}
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Halo, saya ingin bertanya soal pembelian top up game.")}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-red-600 transition-colors"
            >
              Tanya admin lewat WhatsApp
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
