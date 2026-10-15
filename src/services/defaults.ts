import { PricingItem, RekeningItem } from "./config";

/** Satu sumber default untuk semua page/action/seed. DB (config) tetap sumber utama. */
export const DEFAULT_PRICING: PricingItem[] = [
  { robux: 2000, price: 35000 },
  { robux: 2450, price: 45000 },
  { robux: 3100, price: 55000 },
  { robux: 3800, price: 65000 },
  { robux: 4400, price: 80000 },
  { robux: 5800, price: 90000 },
  { robux: 6500, price: 100000 },
  { robux: 13250, price: 200000 },
  { robux: 20000, price: 300000 },
  { robux: 26750, price: 400000 },
  { robux: 33500, price: 500000 },
];

export const DEFAULT_REKENING: RekeningItem[] = [
  { bank: "BCA", nomor: "8735123984", atasNama: "ROBLOX TOPUP STORE" },
  { bank: "BRI", nomor: "019283746519283", atasNama: "ROBLOX TOPUP STORE" },
  { bank: "DANA", nomor: "081234567890", atasNama: "ROBLOX TOPUP STORE" },
  { bank: "GoPay / QRIS", nomor: "081234567890", atasNama: "ROBLOX TOPUP STORE" },
];

/** Kosong = link WhatsApp disembunyikan sampai admin isi di settings. */
export const DEFAULT_ADMIN_WHATSAPP = "";

export const DEFAULT_SERVICE_HOURS = "09.00–22.00 WIB";

export interface UniversalGamePackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  popular?: boolean;
}

export const DEFAULT_MLBB_PACKAGES: UniversalGamePackage[] = [
  { id: "mlbb-86", name: "86 Diamonds", amount: 86, price: 21000 },
  { id: "mlbb-172", name: "172 Diamonds", amount: 172, price: 42000 },
  { id: "mlbb-257", name: "257 Diamonds", amount: 257, price: 63000, popular: true },
  { id: "mlbb-344", name: "344 Diamonds", amount: 344, price: 84000 },
  { id: "mlbb-706", name: "706 Diamonds", amount: 706, price: 168000 },
  { id: "mlbb-wdp", name: "Weekly Diamond Pass (WDP)", amount: 1, price: 27500, popular: true },
];

export const DEFAULT_PUBG_PACKAGES: UniversalGamePackage[] = [
  { id: "pubg-60", name: "60 UC", amount: 60, price: 15000 },
  { id: "pubg-325", name: "325 UC", amount: 325, price: 75000, popular: true },
  { id: "pubg-660", name: "660 UC", amount: 660, price: 150000, popular: true },
  { id: "pubg-1800", name: "1800 UC", amount: 1800, price: 375000 },
];

export const DEFAULT_FREEFIRE_PACKAGES: UniversalGamePackage[] = [
  { id: "ff-70", name: "70 Diamonds", amount: 70, price: 10000 },
  { id: "ff-140", name: "140 Diamonds", amount: 140, price: 20000 },
  { id: "ff-355", name: "355 Diamonds", amount: 355, price: 50000, popular: true },
  { id: "ff-720", name: "720 Diamonds", amount: 720, price: 100000, popular: true },
  { id: "ff-member", name: "Membership Mingguan", amount: 1, price: 30000 },
];

export const DEFAULT_FCMOBILE_PACKAGES: UniversalGamePackage[] = [
  { id: "fcm-100", name: "100 FC Points", amount: 100, price: 16000 },
  { id: "fcm-500", name: "500 FC Points", amount: 500, price: 79000, popular: true },
  { id: "fcm-1050", name: "1050 FC Points", amount: 1050, price: 159000, popular: true },
  { id: "fcm-2200", name: "2200 FC Points", amount: 2200, price: 319000 },
];

export function getDefaultPackagesForGame(gameId: string): UniversalGamePackage[] {
  switch (gameId.toLowerCase()) {
    case "mlbb":
      return DEFAULT_MLBB_PACKAGES;
    case "pubg":
      return DEFAULT_PUBG_PACKAGES;
    case "freefire":
      return DEFAULT_FREEFIRE_PACKAGES;
    case "fcmobile":
      return DEFAULT_FCMOBILE_PACKAGES;
    case "roblox":
    default:
      return DEFAULT_PRICING.map((p) => ({
        id: `rbx-${p.robux}`,
        name: `${p.robux.toLocaleString("id-ID")} Robux`,
        amount: p.robux,
        price: p.price,
      }));
  }
}

