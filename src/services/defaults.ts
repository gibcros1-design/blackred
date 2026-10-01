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
