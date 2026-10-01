import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    // Tanpa next/image pemakaikan host remote — biarkan kosong agar tidak
    // bisa dipakai untuk fetch sembarang host (SSRF).
    remotePatterns: [],
  },
};

export default nextConfig;
