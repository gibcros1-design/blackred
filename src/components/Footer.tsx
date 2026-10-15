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
    <footer className="border-t-2 border-t-red-600 border-b-2 border-b-red-600 bg-zinc-950 text-white py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              Black<span className="text-red-500">Red</span>Roblox
            </span>
            <p className="mt-1.5 max-w-sm text-sm text-zinc-400 leading-relaxed">
              Layanan top up game cepat & terpercaya: Roblox, MLBB, Free Fire, PUBG Mobile, dan FC Mobile.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-zinc-400 transition-colors duration-150 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 border-t border-zinc-800/80 pt-5 text-xs text-zinc-500">
          © {new Date().getFullYear()} BlackRedRoblox. Roblox adalah merek dagang Roblox Corporation.
        </p>
      </div>
    </footer>
  );
}
