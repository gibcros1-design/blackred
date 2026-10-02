"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdminAction } from "@/app/actions/auth";
import { LayoutDashboard, Settings, LogOut, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const pathname = usePathname();

  const isOrdersActive = pathname === "/admin" || pathname.startsWith("/admin/order");
  const isSettingsActive = pathname.startsWith("/admin/settings");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        {/* Desktop Header (md and up) */}
        <div className="hidden md:flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-heading text-xs font-bold text-primary-foreground shadow-xs">
                R$
              </span>
              <div className="flex flex-col">
                <span className="font-heading text-sm font-bold leading-tight tracking-tight">Admin Portal</span>
                <span className="text-[10px] text-muted-foreground">BlackRedRoblox</span>
              </div>
            </Link>

            <div className="h-5 w-px bg-border" aria-hidden="true" />

            <nav className="flex items-center gap-1.5 text-sm" aria-label="Menu Admin Desktop">
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                  isOrdersActive
                    ? "bg-secondary text-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Pesanan
              </Link>
              <Link
                href="/admin/settings"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                  isSettingsActive
                    ? "bg-secondary text-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                Pengaturan
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-muted-foreground hover:text-foreground")}
            >
              Lihat web <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                )}
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Header (< md) */}
        <div className="flex md:hidden flex-col py-2.5 space-y-2.5">
          {/* Top Row: Brand & Actions */}
          <div className="flex items-center justify-between gap-2">
            <Link href="/admin" className="flex items-center gap-2 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary font-heading text-xs font-bold text-primary-foreground">
                R$
              </span>
              <span className="font-heading text-sm font-bold truncate">Admin</span>
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                )}
              >
                <span className="hidden xs:inline">Web</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
                  )}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Row: Navigation Tabs */}
          <nav className="grid grid-cols-2 gap-1.5 rounded-lg border border-border/80 bg-stone-100/80 p-1" aria-label="Menu Admin Mobile">
            <Link
              href="/admin"
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all duration-150",
                isOrdersActive
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
              <span>Pesanan</span>
            </Link>
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all duration-150",
                isSettingsActive
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Settings className="h-3.5 w-3.5 shrink-0" />
              <span>Pengaturan</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
