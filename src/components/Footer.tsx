import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/beli", label: "Pesan Robux" },
  { href: "/cek-order", label: "Cek status order" },
  { href: "/admin/login", label: "Admin" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-stone-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-heading text-base font-bold">
              Black<span className="text-destructive">Red</span>Roblox
            </span>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Top-up Roblox via Group Payout dan Game Pass.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-muted-foreground transition-colors duration-150 hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} BlackRedRoblox. Roblox adalah merek dagang Roblox Corporation.
        </p>
      </div>
    </footer>
  );
}
