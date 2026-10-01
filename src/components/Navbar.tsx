import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">
            R$
          </span>
          <span className="font-heading text-lg font-bold tracking-tight sm:text-xl">
            Black<span className="text-destructive">Red</span>Roblox
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/cek-order" className={`${buttonVariants({ variant: "outline", size: "sm" })} flex-1 sm:flex-none`}>
            <Search className="h-4 w-4 shrink-0" />
            <span className="truncate">Lacak Order</span>
          </Link>
          <Link href="/beli" className={`${buttonVariants({ size: "sm" })} flex-1 sm:flex-none`}>
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span className="truncate">Beli Sekarang</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
