"use client";

import { useState } from "react";
import { PricingItem, RekeningItem } from "@/services/config";
import { saveSettingsAction } from "@/app/actions/settings";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  initialPricing: PricingItem[];
  initialRekening: RekeningItem[];
  initialBotToken: string;
  initialChatId: string;
  initialQrImageUrl?: string;
  initialAdminWhatsapp?: string;
  initialServiceHours?: string;
  initialTestimonials?: { name: string; quote: string; robux?: number }[];
  initialBannerImageUrl?: string;
}

export function SettingsManager({
  initialPricing,
  initialRekening,
  initialBotToken,
  initialChatId,
  initialQrImageUrl = "",
  initialAdminWhatsapp = "",
  initialServiceHours = "",
  initialTestimonials = [],
  initialBannerImageUrl = "",
}: Props) {
  const [pricing, setPricing] = useState<PricingItem[]>(initialPricing);
  const [rekening, setRekening] = useState<RekeningItem[]>(initialRekening);
  const [botToken, setBotToken] = useState(initialBotToken);
  const [chatId, setChatId] = useState(initialChatId);
  const [qrImageUrl, setQrImageUrl] = useState(initialQrImageUrl);
  const [adminWhatsapp, setAdminWhatsapp] = useState(initialAdminWhatsapp);
  const [serviceHours, setServiceHours] = useState(initialServiceHours);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [bannerImageUrl, setBannerImageUrl] = useState(initialBannerImageUrl);
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [qrError, setQrError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const uploadImage = async (file: File, bucket?: string): Promise<string> => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Format harus JPG, PNG, atau WEBP.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Ukuran maksimal 5MB.");
    }
    const fd = new FormData();
    fd.append("file", file);
    if (bucket) fd.append("bucket", bucket);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Gagal unggah.");
    return data.url as string;
  };

  const handleQrChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setQrError("");
    setUploadingQr(true);
    try {
      setQrImageUrl(await uploadImage(file, "assets"));
      toast.success("Gambar QRIS diganti. Tekan Simpan untuk menerapkan.");
    } catch (err: any) {
      setQrError(err.message || "Gagal mengunggah gambar QRIS.");
    } finally {
      setUploadingQr(false);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBannerError("");
    setUploadingBanner(true);
    try {
      setBannerImageUrl(await uploadImage(file, "assets"));
      toast.success("Banner diganti. Tekan Simpan untuk menerapkan.");
    } catch (err: any) {
      setBannerError(err.message || "Gagal mengunggah banner.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handlePriceChange = (index: number, price: number) => {
    const updated = [...pricing];
    updated[index].price = price;
    setPricing(updated);
  };

  const handleAddPricing = () => {
    setPricing([...pricing, { robux: 0, price: 0 }]);
    toast.info("Baris paket baru ditambahkan.");
  };

  const handleRemovePricing = (index: number) => {
    const target = pricing[index]?.robux || 0;
    setPricing(pricing.filter((_, i) => i !== index));
    toast.info(`Paket ${target} Robux dihapus.`);
  };

  const handleAddRekening = () => {
    setRekening([...rekening, { bank: "BANK BARU", nomor: "", atasNama: "" }]);
    toast.info("Baris rekening baru ditambahkan.");
  };

  const handleRemoveRekening = (index: number) => {
    const target = rekening[index]?.bank || "Rekening";
    setRekening(rekening.filter((_, i) => i !== index));
    toast.info(`${target} dihapus dari daftar.`);
  };

  const handleRekeningChange = (index: number, field: keyof RekeningItem, val: string) => {
    const updated = [...rekening];
    updated[index][field] = val;
    setRekening(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettingsAction({
        pricingJson: JSON.stringify(pricing),
        rekeningJson: JSON.stringify(rekening),
        telegramBotToken: botToken,
        telegramChatId: chatId,
        qrImageUrl,
        adminWhatsapp,
        serviceHours,
        testimonialsJson: JSON.stringify(testimonials),
        bannerImageUrl,
      });
      toast.success("Pengaturan tersimpan.");
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-base">Harga nominal Robux</CardTitle>
            <p className="text-sm text-muted-foreground">Atur jumlah Robux dan harga tiap paket.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddPricing}>
            <Plus className="h-4 w-4" /> Tambah paket
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.map((p, idx) => (
            <div key={`${idx}-${p.robux}`} className="rounded-md border border-border bg-stone-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={`robux-${idx}`} className="text-sm font-semibold">Jumlah Robux</label>
                <button
                  type="button"
                  aria-label={`Hapus paket ${p.robux} Robux`}
                  onClick={() => handleRemovePricing(idx)}
                  className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors duration-150 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Input
                id={`robux-${idx}`}
                type="number"
                min="1"
                value={p.robux}
                onChange={(e) => {
                  const updated = [...pricing];
                  updated[idx].robux = parseInt(e.target.value, 10) || 0;
                  setPricing(updated);
                }}
                className="mt-2"
              />
              <label htmlFor={`price-${idx}`} className="mt-3 block text-sm font-medium">Harga (Rp)</label>
              <Input
                id={`price-${idx}`}
                type="number"
                min="1"
                value={p.price}
                onChange={(e) => handlePriceChange(idx, parseInt(e.target.value, 10) || 0)}
                className="mt-1.5 font-mono"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">Rekening tujuan transfer</CardTitle>
            <p className="text-sm text-muted-foreground">Ditampilkan kepada pembeli.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddRekening}>
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {rekening.map((r, idx) => (
            <div key={idx} className="flex flex-col gap-2 rounded-md border border-border bg-stone-50 p-3 sm:flex-row">
              <Input
                type="text"
                aria-label="Nama bank atau e-wallet"
                placeholder="Nama bank / e-wallet"
                value={r.bank}
                onChange={(e) => handleRekeningChange(idx, "bank", e.target.value)}
                className="sm:w-1/4"
              />
              <Input
                type="text"
                aria-label="Nomor rekening"
                placeholder="Nomor rekening / HP"
                value={r.nomor}
                onChange={(e) => handleRekeningChange(idx, "nomor", e.target.value)}
                className="sm:w-2/4 font-mono"
              />
              <Input
                type="text"
                aria-label="Atas nama"
                placeholder="Atas nama"
                value={r.atasNama}
                onChange={(e) => handleRekeningChange(idx, "atasNama", e.target.value)}
                className="sm:w-1/4"
              />
              <button
                type="button"
                aria-label="Hapus rekening"
                onClick={() => handleRemoveRekening(idx)}
                className="flex min-h-11 shrink-0 items-center justify-center text-muted-foreground transition-colors duration-150 hover:text-destructive sm:self-stretch"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Notifikasi Telegram admin</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pesanan baru beserta screenshot bukti transfer dikirim otomatis ke chat ini.
          </p>
        </CardHeader>
        <CardContent className="max-w-2xl space-y-4">
          <div>
            <label htmlFor="bot-token" className="block text-sm font-medium">Telegram bot token</label>
            <Input
              id="bot-token"
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="7123456789:AAHk..."
              className="mt-1.5 font-mono"
            />
          </div>
          <div>
            <label htmlFor="chat-id" className="block text-sm font-medium">Admin chat ID / group chat ID</label>
            <Input
              id="chat-id"
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="-100123456789 atau 123456789"
              className="mt-1.5 font-mono"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Banner homepage</CardTitle>
          <p className="text-sm text-muted-foreground">Opsional. Banner tampil di atas judul homepage dan mengarah ke halaman pemesanan.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {bannerImageUrl ? (
            <img src={bannerImageUrl} alt="Preview banner homepage" className="max-h-52 w-full rounded-md border border-border object-cover" />
          ) : (
            <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-input bg-stone-50 text-sm text-muted-foreground">
              Belum ada banner. Homepage memakai tampilan standar.
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="home-banner"
              className={`${buttonVariants({ variant: "outline", size: "sm" })} ${uploadingBanner ? "pointer-events-none opacity-50" : ""}`}
            >
              {uploadingBanner ? <><Loader2 className="h-4 w-4 animate-spin" /> Mengunggah</> : bannerImageUrl ? "Ganti banner" : "Unggah banner"}
            </label>
            <input id="home-banner" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleBannerChange} />
            <span className="text-xs text-muted-foreground">JPG, PNG, WEBP · maks. 5MB · disarankan landscape</span>
            {bannerImageUrl && (
              <button type="button" className="text-sm text-destructive underline underline-offset-4" onClick={() => setBannerImageUrl("")}>
                Hapus banner
              </button>
            )}
          </div>
          {bannerError && <p className="text-sm text-destructive" role="alert">{bannerError}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-base">Testimoni pelanggan</CardTitle>
            <p className="text-sm text-muted-foreground">Hanya tampilkan ulasan nyata dengan izin pelanggan.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTestimonials([...testimonials, { name: "", quote: "" }])}
          >
            <Plus className="h-4 w-4" /> Tambah ulasan
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {testimonials.length === 0 ? (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Belum ada testimoni. Bagian ini tidak ditampilkan di homepage sampai admin menambahkan ulasan.
            </p>
          ) : testimonials.map((item, idx) => (
            <div key={idx} className="grid gap-3 rounded-md border border-border bg-stone-50 p-3 sm:grid-cols-[1fr_2fr_120px_auto]">
              <Input
                aria-label="Nama pelanggan"
                placeholder="Nama (dengan izin)"
                value={item.name}
                onChange={(e) => {
                  const next = [...testimonials];
                  next[idx] = { ...next[idx], name: e.target.value };
                  setTestimonials(next);
                }}
              />
              <Input
                aria-label="Isi ulasan"
                placeholder="Ulasan pelanggan"
                value={item.quote}
                onChange={(e) => {
                  const next = [...testimonials];
                  next[idx] = { ...next[idx], quote: e.target.value };
                  setTestimonials(next);
                }}
              />
              <Input
                aria-label="Jumlah Robux (opsional)"
                type="number"
                min="0"
                placeholder="Robux opsional"
                value={item.robux ?? ""}
                onChange={(e) => {
                  const next = [...testimonials];
                  next[idx] = { ...next[idx], robux: parseInt(e.target.value, 10) || undefined };
                  setTestimonials(next);
                }}
              />
              <button
                type="button"
                aria-label="Hapus testimoni"
                onClick={() => setTestimonials(testimonials.filter((_, i) => i !== idx))}
                className="flex min-h-11 items-center justify-center text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">QRIS dan WhatsApp toko</CardTitle>
          <p className="text-sm text-muted-foreground">
            Gambar QRIS tampil di halaman pembayaran. Nomor WhatsApp dipakai semua tombol “Hubungi admin”.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="shrink-0">
              {qrImageUrl ? (
                <img src={qrImageUrl} alt="QRIS toko" className="h-40 w-40 rounded-md border border-border object-contain" />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-md border border-dashed border-input bg-stone-50 text-center text-sm text-muted-foreground">
                  Belum ada gambar QRIS
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="qr-image"
                className={`${buttonVariants({ variant: "outline", size: "sm" })} ${uploadingQr ? "pointer-events-none opacity-50" : ""}`}
              >
                {uploadingQr ? <><Loader2 className="h-4 w-4 animate-spin" /> Mengunggah</> : qrImageUrl ? "Ganti gambar QRIS" : "Unggah gambar QRIS"}
              </label>
              <input
                id="qr-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleQrChange}
              />
              <p className="text-xs text-muted-foreground">JPG, PNG, atau WEBP, maksimal 5MB.</p>
              {qrError && <p className="text-sm text-destructive" role="alert">{qrError}</p>}
              {qrImageUrl && (
                <button
                  type="button"
                  className="block text-sm text-destructive underline underline-offset-4"
                  onClick={() => setQrImageUrl("")}
                >
                  Hapus gambar QRIS
                </button>
              )}
            </div>
          </div>

          <div className="max-w-sm">
            <label htmlFor="admin-wa" className="block text-sm font-medium">Nomor WhatsApp admin</label>
            <Input
              id="admin-wa"
              type="tel"
              value={adminWhatsapp}
              onChange={(e) => setAdminWhatsapp(e.target.value)}
              placeholder="628xxxxxxxxxx"
              className="mt-1.5 font-mono"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Pakai format 62… Jika dikosongkan, tombol WhatsApp disembunyikan.
            </p>
          </div>

          <div className="max-w-sm">
            <label htmlFor="service-hours" className="block text-sm font-medium">Jam layanan</label>
            <Input
              id="service-hours"
              type="text"
              value={serviceHours}
              onChange={(e) => setServiceHours(e.target.value)}
              placeholder="09.00–22.00 WIB"
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Ditampilkan pada bagian &quot;Kenapa membeli di sini&quot;.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" disabled={saving} onClick={handleSave} size="lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan pengaturan
        </Button>
      </div>
    </div>
  );
}
