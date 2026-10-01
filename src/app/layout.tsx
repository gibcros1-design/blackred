import type { Metadata } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BlackRedRoblox - Topup Robux Roblox Cepat & Murah",
  description:
    "Beli Robux Roblox via Group Payout & Game Pass langsung ke akun. Proses cepat 5-30 menit, harga murah, bayar via Transfer Bank & E-Wallet.",
  keywords: ["robux murah", "topup robux", "beli robux", "roblox indonesia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${rubik.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
