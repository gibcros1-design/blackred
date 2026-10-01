import Link from "next/link";
import { logoutAdminAction } from "@/app/actions/auth";
import { LayoutDashboard, Settings, LogOut, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-5">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              R$
            </span>
            <span className="font-heading text-sm font-semibold">Admin</span>
          </Link>

          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors duration-150 hover:bg-accent"
            >
              <LayoutDashboard className="h-4 w-4" /> Pesanan
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
            >
              <Settings className="h-4 w-4" /> Pengaturan
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className={`${buttonVariants({ variant: "ghost", size: "sm" })} hidden sm:inline-flex`}
          >
            Lihat web <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className={buttonVariants({ variant: "outline", size: "sm", className: "text-destructive hover:text-destructive" })}
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
