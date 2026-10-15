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
  { id: "mlbb-250", name: "250 Diamonds", amount: 250, price: 50000 },
  { id: "mlbb-350", name: "350 Diamonds", amount: 350, price: 75000 },
  { id: "mlbb-500", name: "500 Diamonds", amount: 500, price: 100000, popular: true },
  { id: "mlbb-750", name: "750 Diamonds", amount: 750, price: 200000 },
  { id: "mlbb-1000", name: "1.000 Diamonds", amount: 1000, price: 300000 },
  { id: "mlbb-1200", name: "1.200 Diamonds", amount: 1200, price: 400000 },
  { id: "mlbb-1800", name: "1.800 Diamonds", amount: 1800, price: 500000 },
];

export const DEFAULT_PUBG_PACKAGES: UniversalGamePackage[] = [
  { id: "pubg-1000", name: "1.000 UC", amount: 1000, price: 35000 },
  { id: "pubg-1200", name: "1.200 UC", amount: 1200, price: 45000 },
  { id: "pubg-1700", name: "1.700 UC", amount: 1700, price: 55000 },
  { id: "pubg-2100", name: "2.100 UC", amount: 2100, price: 80000 },
  { id: "pubg-2600", name: "2.600 UC", amount: 2600, price: 100000, popular: true },
  { id: "pubg-3600", name: "3.600 UC", amount: 3600, price: 200000 },
  { id: "pubg-4200", name: "4.200 UC", amount: 4200, price: 300000 },
  { id: "pubg-5300", name: "5.300 UC", amount: 5300, price: 400000 },
  { id: "pubg-6100", name: "6.100 UC", amount: 6100, price: 500000 },
];

export const DEFAULT_FREEFIRE_PACKAGES: UniversalGamePackage[] = [
  { id: "ff-600", name: "600 Diamonds", amount: 600, price: 50000 },
  { id: "ff-1000", name: "1.000 Diamonds", amount: 1000, price: 70000 },
  { id: "ff-1200", name: "1.200 Diamonds", amount: 1200, price: 100000, popular: true },
  { id: "ff-1800", name: "1.800 Diamonds", amount: 1800, price: 150000 },
  { id: "ff-2500", name: "2.500 Diamonds", amount: 2500, price: 200000 },
  { id: "ff-3200", name: "3.200 Diamonds", amount: 3200, price: 300000 },
  { id: "ff-4000", name: "4.000 Diamonds", amount: 4000, price: 400000 },
  { id: "ff-5200", name: "5.200 Diamonds", amount: 5200, price: 500000 },
];

export const DEFAULT_FCMOBILE_PACKAGES: UniversalGamePackage[] = [
  { id: "fcm-578", name: "578 Coins", amount: 578, price: 50000 },
  { id: "fcm-788", name: "788 Coins", amount: 788, price: 75000 },
  { id: "fcm-1000", name: "1.000 Coins", amount: 1000, price: 100000, popular: true },
  { id: "fcm-1800", name: "1.800 Coins", amount: 1800, price: 200000 },
  { id: "fcm-2400", name: "2.400 Coins", amount: 2400, price: 300000 },
  { id: "fcm-3000", name: "3.000 Coins", amount: 3000, price: 400000 },
  { id: "fcm-4200", name: "4.200 Coins", amount: 4200, price: 500000 },
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

