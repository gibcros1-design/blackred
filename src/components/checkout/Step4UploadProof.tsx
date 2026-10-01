import { useState } from "react";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step4Props {
  orderId: string;
  proofToken: string;
  onSuccess: () => void;
  onSubmitProof: (orderId: string, proofUrl: string, proofToken: string) => Promise<{ success: boolean; error?: string }>;
}

export function Step4UploadProof({ orderId, proofToken, onSuccess, onSubmitProof }: Step4Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setError("Hanya format JPG, PNG, atau WEBP yang diperbolehkan.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5MB.");
      return;
    }

    setError("");
    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleUploadAndSubmit = async () => {
    if (!file) {
      setError("Pilih foto bukti transfer terlebih dahulu.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Gagal mengunggah foto.");

      const result = await onSubmitProof(orderId, data.url, proofToken);
      if (!result.success) throw new Error(result.error || "Gagal menyimpan konfirmasi.");

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat upload bukti.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Unggah bukti transfer</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Kirimkan screenshot struk transfer bank atau e-wallet Anda.
      </p>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-input bg-stone-50 p-8 text-center transition-colors duration-150 hover:border-foreground/40">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileChange}
        />
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview bukti transfer"
              className="max-h-56 rounded-md border border-border object-contain"
            />
            <span className="mt-3 text-sm text-muted-foreground">
              Klik untuk mengganti gambar
            </span>
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <span className="mt-3 text-sm font-medium">
              Klik untuk memilih screenshot bukti transfer
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, atau WEBP, maksimal 5MB
            </span>
          </>
        )}
      </label>

      <div className="mt-6 flex justify-end">
        <Button type="button" disabled={!file || uploading} onClick={handleUploadAndSubmit}>
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          {uploading ? "Mengirim bukti" : "Konfirmasi pembayaran"}
        </Button>
      </div>
    </div>
  );
}
