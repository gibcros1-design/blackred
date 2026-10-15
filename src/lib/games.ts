export interface GamePackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  popular?: boolean;
}

export interface GameFieldConfig {
  key: "gameUserId" | "gameZoneId" | "robloxUsername";
  label: string;
  placeholder: string;
  helperText?: string;
  type?: "text" | "number";
  required: boolean;
}

export interface GameConfig {
  id: "roblox" | "mlbb" | "pubg" | "freefire" | "fcmobile";
  name: string;
  shortName: string;
  publisher: string;
  badge?: string;
  currencyName: string;
  currencyUnit: string;
  icon: string;
  bannerGradient: string;
  tagline: string;
  idGuide: string;
  fields: GameFieldConfig[];
  configKey: string;
  orderPrefix: string;
}

export const GAMES: Record<string, GameConfig> = {
  roblox: {
    id: "roblox",
    name: "Roblox",
    shortName: "Roblox",
    publisher: "Roblox Corporation",
    badge: "Paling Populer",
    currencyName: "Robux",
    currencyUnit: "R$",
    icon: "🎮",
    bannerGradient: "from-red-600/20 via-zinc-900 to-black",
    tagline: "Top up Robux instan via Gamepass & Group Payout",
    idGuide: "Masukkan Username akun Roblox Anda tanpa spasi.",
    fields: [
      {
        key: "robloxUsername",
        label: "Username Roblox",
        placeholder: "Contoh: GamerSejati123",
        helperText: "Pastikan username benar dan akun tidak di-private.",
        required: true,
      },
    ],
    configKey: "pricing",
    orderPrefix: "RBX",
  },
  mlbb: {
    id: "mlbb",
    name: "Mobile Legends: Bang Bang",
    shortName: "MLBB",
    publisher: "Moonton",
    badge: "Instan 1-3 Menit",
    currencyName: "Diamonds",
    currencyUnit: "💎",
    icon: "⚔️",
    bannerGradient: "from-amber-600/20 via-zinc-900 to-black",
    tagline: "Top up Diamond & Weekly Diamond Pass resmi & legal",
    idGuide: "User ID (angka 8-10 digit) dan Zone ID (angka dalam kurung 4-5 digit) ada di profil game.",
    fields: [
      {
        key: "gameUserId",
        label: "User ID",
        placeholder: "Contoh: 12345678",
        helperText: "Contoh: 123456789 (lihat di profil MLBB Anda).",
        type: "number",
        required: true,
      },
      {
        key: "gameZoneId",
        label: "Zone ID / Server",
        placeholder: "Contoh: 2134",
        helperText: "4-5 digit angka di dalam tanda kurung.",
        type: "number",
        required: true,
      },
    ],
    configKey: "pricing_mlbb",
    orderPrefix: "MLB",
  },
  pubg: {
    id: "pubg",
    name: "PUBG Mobile",
    shortName: "PUBG Mobile",
    publisher: "Level Infinite / Krafton",
    badge: "Resmi Indonesia",
    currencyName: "Unknown Cash (UC)",
    currencyUnit: "UC",
    icon: "🪖",
    bannerGradient: "from-yellow-600/20 via-zinc-900 to-black",
    tagline: "Isi UC PUBG Mobile langsung ke Character ID Anda",
    idGuide: "Buka profil PUBG Mobile Anda, Character ID (UID) tertera di bawah avatar profil.",
    fields: [
      {
        key: "gameUserId",
        label: "Character ID (UID)",
        placeholder: "Contoh: 5123456789",
        helperText: "Kombinasi angka Player ID karakter PUBG Mobile Anda.",
        type: "number",
        required: true,
      },
    ],
    configKey: "pricing_pubg",
    orderPrefix: "PBG",
  },
  freefire: {
    id: "freefire",
    name: "Free Fire",
    shortName: "Free Fire",
    publisher: "Garena",
    badge: "Flash Auto",
    currencyName: "Diamonds",
    currencyUnit: "💎",
    icon: "🔥",
    bannerGradient: "from-orange-600/20 via-zinc-900 to-black",
    tagline: "Top up FF Diamond & Membership proses kilat",
    idGuide: "Lihat Player ID di profil akun Free Fire Anda (tertera di bawah nickname).",
    fields: [
      {
        key: "gameUserId",
        label: "Player ID Free Fire",
        placeholder: "Contoh: 1234567890",
        helperText: "Nomor Player ID akun Free Fire Anda.",
        type: "number",
        required: true,
      },
    ],
    configKey: "pricing_freefire",
    orderPrefix: "FF",
  },
  fcmobile: {
    id: "fcmobile",
    name: "EA SPORTS FC™ Mobile",
    shortName: "FC Mobile",
    publisher: "Electronic Arts (EA)",
    badge: "Event Special",
    currencyName: "FC Points / Silver",
    currencyUnit: "⚽",
    icon: "⚽",
    bannerGradient: "from-emerald-600/20 via-zinc-900 to-black",
    tagline: "Beli FC Points resmi untuk pack pemain & event terbaru",
    idGuide: "UID Akun dapat dilihat pada menu Settings > Customer Service > UID Akun.",
    fields: [
      {
        key: "gameUserId",
        label: "UID Akun FC Mobile",
        placeholder: "Contoh: 1029384756",
        helperText: "UID akun FC Mobile Anda di menu pengaturan.",
        required: true,
      },
    ],
    configKey: "pricing_fcmobile",
    orderPrefix: "FCM",
  },
};

export const GAME_LIST: GameConfig[] = Object.values(GAMES);

export function getGameConfig(gameId: string): GameConfig | null {
  return GAMES[gameId.toLowerCase()] ?? null;
}
