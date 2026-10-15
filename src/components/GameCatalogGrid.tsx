import Link from "next/link";
import { GAME_LIST } from "@/lib/games";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GameCatalogGrid() {
  return (
    <section className="relative py-12 sm:py-16 bg-muted/20 border-b border-border/70" aria-label="Katalog Game">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Pilihan Game Terlengkap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
              Katalog Top Up Game Populer
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-xl">
              Pilih game favoritmu. Proses otomatis 1–3 menit, harga termurah, dan jaminan 100% legal & aman.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistem Pemrosesan Aktif 24 Jam</span>
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {GAME_LIST.map((game) => (
            <Link
              key={game.id}
              href={`/topup/${game.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header: Icon & Badge */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-2xl border border-border group-hover:scale-105 transition-transform duration-200 shadow-xs">
                    {game.icon}
                  </div>
                  {game.badge && (
                    <Badge variant="outline" className="text-[11px] font-semibold border-primary/30 bg-primary/5 text-primary py-0.5">
                      {game.badge}
                    </Badge>
                  )}
                </div>

                {/* Game Title & Publisher */}
                <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {game.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {game.publisher}
                </p>

                {/* Tagline / Subtitle */}
                <p className="mt-2.5 text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                  {game.tagline}
                </p>
              </div>

              {/* Footer CTA */}
              <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
                <span className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground transition-colors">
                  <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                  {game.currencyName}
                </span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Top Up <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
