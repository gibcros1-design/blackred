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
    imgClass: "max-h-8 sm:max-h-9 max-w-[85%]",
  },
  {
    id: "mlbb",
    name: "Mobile Legends",
    publisher: "Moonton",
    item: "Diamonds",
    method: "User ID & Server",
    logoUrl: "/games/mlbb.png",
    imgClass: "max-h-9 sm:max-h-11 max-w-[85%]",
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    publisher: "Krafton",
    item: "UC Cash",
    method: "Character ID",
    logoUrl: "/games/pubg.png",
    imgClass: "max-h-10 sm:max-h-12 max-w-[70%]",
  },
  {
    id: "freefire",
    name: "Free Fire",
    publisher: "Garena",
    item: "Diamonds",
    method: "Player ID",
    logoUrl: "/games/freefire.png",
    imgClass: "max-h-7 sm:max-h-8 max-w-[88%]",
  },
  {
    id: "fcmobile",
    name: "FC Mobile",
    publisher: "EA Sports",
    item: "FC Points",
    method: "UID Akun",
    logoUrl: "/games/fcmobile.png",
    imgClass: "max-h-10 sm:max-h-12 max-w-[65%]",
  },
];

export function GameCatalogGrid() {
  return (
    <section id="katalog" className="py-8 sm:py-14 border-b border-border bg-stone-50/50 scroll-mt-16" aria-label="Katalog Game">
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 mb-5 sm:mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Katalog Game</p>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight sm:text-3xl text-foreground font-heading">
              Pilih Game & Top Up
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pengiriman instan langsung ke akun tanpa password
          </p>
        </div>

        {/* Game Cards Grid: 2 cols on mobile, 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {GAME_CARDS.map((game) => (
            <Link
              key={game.id}
              href={`/topup/${game.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-zinc-800 border-t-2 border-t-red-600 border-b-2 border-b-red-600 bg-zinc-950 p-2.5 sm:p-3 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-red-500 hover:shadow-lg hover:shadow-red-950/20"
            >
              {/* Game Official Logo Banner */}
              <div className="relative mb-2.5 flex h-20 sm:h-24 w-full items-center justify-center overflow-hidden rounded-md bg-zinc-900 border border-zinc-800/80 p-2 sm:p-3 transition-colors group-hover:bg-zinc-850">
                <div className="absolute inset-0 bg-red-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <img
                  src={game.logoUrl}
                  alt={`Logo ${game.name}`}
                  className={`${game.imgClass} relative z-10 object-contain brightness-0 invert transition-transform duration-200 group-hover:scale-105`}
                  loading="lazy"
                />

                {/* Top-right item currency badge */}
                <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-zinc-300 bg-black/70 px-1 sm:px-1.5 py-0.5 rounded border border-zinc-700/80 backdrop-blur-xs">
                  {game.item}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-xs sm:text-base text-white group-hover:text-red-500 transition-colors truncate">
                  {game.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate mt-0.5">
                  {game.publisher}
                </p>
                <p className="mt-1 text-[10px] sm:text-[11px] text-zinc-400 leading-snug line-clamp-1">
                  {game.method}
                </p>
              </div>

              {/* Footer Action */}
              <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-zinc-800/90 flex items-center justify-between text-[11px] sm:text-xs font-semibold">
                <span className="text-zinc-400 text-[10px] sm:text-[11px] hidden xs:inline">Beli</span>
                <span className="inline-flex items-center gap-1 text-red-500 group-hover:text-red-400 transition-colors group-hover:translate-x-0.5">
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
