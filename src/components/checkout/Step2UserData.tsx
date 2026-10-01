import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step2Props {
  initialData: { name: string; robloxUsername: string; whatsapp: string };
  onBack: () => void;
  onSubmit: (data: { name: string; robloxUsername: string; whatsapp: string }) => void;
}

export function Step2UserData({ initialData, onBack, onSubmit }: Step2Props) {
  const [name, setName] = useState(initialData.name);
  const [robloxUsername, setRobloxUsername] = useState(initialData.robloxUsername);
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !robloxUsername.trim() || !whatsapp.trim()) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    setError("");
    onSubmit({ name, robloxUsername, whatsapp });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold">Data pemesan</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Pastikan username Roblox benar. Kami tidak meminta password.
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nama pemesan</label>
          <Input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Budi Santoso"
            className="mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium">Username Roblox tujuan</label>
          <Input
            id="username"
            type="text"
            required
            value={robloxUsername}
            onChange={(e) => setRobloxUsername(e.target.value)}
            placeholder="RobloxGamer_ID"
            className="mt-1.5"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Akun tempat Robux dikirim.
          </p>
        </div>

        <div>
          <label htmlFor="wa" className="block text-sm font-medium">Nomor WhatsApp aktif</label>
          <Input
            id="wa"
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="081234567890"
            className="mt-1.5"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Untuk konfirmasi jika ada kendala.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>Kembali</Button>
        <Button type="submit">Lanjut ke pembayaran</Button>
      </div>
    </form>
  );
}
