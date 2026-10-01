# Fix: Harden File Upload

> CRITICAL — autentikasi + allowlist ekstensi + sniff konten

## Current Code
`src/app/api/upload/route.ts`:
```ts
if (!ALLOWED_MIME_TYPES.includes(file.type)) return ... // hanya header
const ext = file.name.split(".").pop() || "jpg";        // ekstensi dari klien
const filename = `proof_${Date.now()}_${Math.random().toString(36).substring(2,8)}.${ext}`;
await writeFile(filePath, buffer);                       // ke public/
```

## Fix
1. **Autentikasi**: cek sesi admin; upload bukti transfer milik pelanggan boleh publik — tapi kemudian wajib validasi terhadap order yang ada (lihat step 3).
2. **Ekstensi dari allowlist, bukan nama file**:
```ts
const EXT_BY_TYPE = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;
const ext = EXT_BY_TYPE[file.type as keyof typeof EXT_BY_TYPE];
if (!ext) return NextResponse.json({ error: "Format tidak diizinkan" }, { status: 400 });
```
3. **Magic-byte sniff** (ringkas, tanpa lib):
```ts
const buf = Buffer.from(await file.arrayBuffer());
const ok = buf[0]===0xFF && buf[1]===0xD8 && buf[2]===0xFF      // JPEG
        || buf.subarray(0,8).equals(Buffer.from("89504E470D0A1A0A","hex")) // PNG
        || buf.subarray(0,4).toString()==="RIFF" && buf.subarray(8,12).toString()==="WEBP";
if (!ok) return NextResponse.json({ error: "File bukan gambar asli" }, { status: 400 });
```
4. **Nama file acak** dari `crypto.randomBytes(16).toString("hex")`.
5. **Jangan** simpan di `public/` bila bisa; simpan di direktori non-publik dan sajikan via route handler yang memverifikasi owner.

## Steps
- [ ] Terapkan allowlist ekstensi
- [ ] Magic-byte check
- [ ] Nama file CSPRNG
- [ ] Test: upload `.html` ber-tipe `image/png` → ditolak

## See Also
- [[vulnerabilities/unrestricted-file-upload]]
- [[security-audit]]
