import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/#katalog", label: "Katalog Game" },
  { href: "/beli", label: "Top Up Robux" },
  { href: "/cek-order", label: "Cek Status Order" },
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
              Layanan top up game cepat & terpercaya: Roblox, MLBB, Free Fire, PUBG Mobile, dan FC Mobile.
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
