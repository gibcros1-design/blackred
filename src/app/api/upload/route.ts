import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin, PROOFS_BUCKET } from "@/lib/supabase";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/** Cek magic bytes agar konten benar-benar gambar, bukan sekadar header. */
function looksLikeImage(buf: Buffer, type: string): boolean {
  if (type === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (type === "image/png") return buf.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  if (type === "image/webp")
    return buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  }

  try {
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Ekstensi dari allowlist berdasarkan tipe, bukan dari nama file klien.
    const ext = EXT_BY_TYPE[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Format file tidak valid. Hanya JPG, PNG, dan WEBP yang diizinkan." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimal 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!looksLikeImage(buffer, file.type)) {
      return NextResponse.json({ error: "Isi file bukan gambar yang valid." }, { status: 400 });
    }

    const filename = `proof_${Date.now()}_${randomBytes(8).toString("hex")}.${ext}`;
    const objectPath = filename; // flat di root bucket

    const { error } = await supabaseAdmin()
      .storage.from(PROOFS_BUCKET)
      .upload(objectPath, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error("Supabase upload error:", error.message);
      return NextResponse.json({ error: "Gagal mengunggah gambar" }, { status: 500 });
    }

    return NextResponse.json({
      url: `proofs/${objectPath}`,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah gambar" }, { status: 500 });
  }
}
