import Link from "next/link";
import { ArrowRight } from "lucide-react";

const GAME_CARDS = [
  {
    id: "roblox",
    name: "Roblox",
    publisher: "Roblox Corp",
    item: "Robux",
    method: "Gamepass & Payout",
    logoUrl: "/games/roblox.png",
    borderHover: "hover:border-red-500/60",
    imgClass: "max-h-9 max-w-[85%]",
  },
  {
    id: "mlbb",
    name: "Mobile Legends",
    publisher: "Moonton",
    item: "Diamonds",
    method: "User ID & Server",
    logoUrl: "/games/mlbb.png",
    borderHover: "hover:border-blue-500/60",
    imgClass: "max-h-11 max-w-[85%]",
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    publisher: "Krafton",
    item: "UC Cash",
    method: "Character ID",
    logoUrl: "/games/pubg.png",
    borderHover: "hover:border-amber-500/60",
    imgClass: "max-h-12 max-w-[70%]",
  },
  {
    id: "freefire",
    name: "Free Fire",
    publisher: "Garena",
    item: "Diamonds",
    method: "Player ID",
    logoUrl: "/games/freefire.png",
    borderHover: "hover:border-orange-500/60",
    imgClass: "max-h-8 max-w-[88%]",
  },
  {
    id: "fcmobile",
    name: "FC Mobile",
    publisher: "EA Sports",
    item: "FC Points",
    method: "UID Akun",
    logoUrl: "/games/fcmobile.png",
    borderHover: "hover:border-emerald-500/60",
    imgClass: "max-h-12 max-w-[65%]",
  },
];

export function GameCatalogGrid() {
  return (
    <section id="katalog" className="py-10 sm:py-14 border-b border-border bg-stone-50/50 scroll-mt-16" aria-label="Katalog Game">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-destructive">Katalog Game</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Pilih Game & Top Up</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pengiriman instan langsung ke akun tanpa password
          </p>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {GAME_CARDS.map((game) => (
            <Link
              key={game.id}
              href={`/topup/${game.id}`}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${game.borderHover}`}
            >
              {/* Game Official Logo Banner */}
              <div className="relative mb-3 flex h-24 w-full items-center justify-center overflow-hidden rounded-md bg-stone-100/90 border border-border/70 p-3 transition-colors group-hover:bg-stone-200/60">
                <img
                  src={game.logoUrl}
                  alt={`Logo ${game.name}`}
                  className={`${game.imgClass} object-contain transition-transform duration-200 group-hover:scale-105`}
                  loading="lazy"
                />

                {/* Top-right item currency badge */}
                <span className="absolute top-2 right-2 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground bg-white/90 px-1.5 py-0.5 rounded border border-border/80 shadow-2xs">
                  {game.item}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-destructive transition-colors">
                  {game.name}
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {game.publisher}
                </p>
                <p className="mt-1.5 text-[11px] text-muted-foreground/80 leading-snug">
                  {game.method}
                </p>
              </div>

              {/* Footer Action */}
              <div className="mt-3.5 pt-2.5 border-t border-border flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground text-[11px]">Beli Sekarang</span>
                <span className="inline-flex items-center gap-1 text-foreground group-hover:text-destructive transition-colors group-hover:translate-x-0.5">
                  Top Up <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
