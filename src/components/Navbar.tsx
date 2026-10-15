import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950 text-white border-t-2 border-t-red-600 border-b-2 border-b-red-600 shadow-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-900 border border-red-600/60 font-heading text-sm font-bold text-white shadow-xs group-hover:border-red-500 transition-colors">
            R$
          </span>
          <span className="font-heading text-lg font-bold tracking-tight sm:text-xl text-white">
            Black<span className="text-red-500">Red</span>Roblox
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/#katalog"
            className="hidden sm:inline-flex items-center text-sm font-medium text-zinc-300 hover:text-white transition-colors px-2.5 py-1"
          >
            Katalog Game
          </Link>
          <Link
            href="/cek-order"
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-3.5 rounded-md text-xs font-semibold border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-500 transition-colors flex-1 sm:flex-none"
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <span className="truncate">Lacak Order</span>
          </Link>
          <Link
            href="/#katalog"
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-3.5 rounded-md text-xs font-semibold bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-xs flex-1 sm:flex-none"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Top Up</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
