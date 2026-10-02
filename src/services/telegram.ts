import { getConfigValue } from "./config";
import { Order } from "@/db/schema";
import { formatRupiah } from "@/lib/utils";
import { getProofSignedUrl } from "@/lib/supabase";

export async function sendTelegramOrderNotification(order: Order): Promise<boolean> {
  const botToken = (await getConfigValue<string>("telegram_bot_token", "")) || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = (await getConfigValue<string>("telegram_admin_chat_id", "")) || process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram bot token or chat ID is missing. Notification skipped.");
    return false;
  }

  const base = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");
  const adminLink = base ? `${base}/admin/order/${order.id}` : null;

  const message = `
📦 <b>ORDER MASUK BARU!</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>Order ID:</b> <code>${order.orderId}</code>
🔑 <b>Kode Cek:</b> <code>${order.code}</code>
👤 <b>Nama:</b> ${order.name}
🎮 <b>Roblox Username:</b> <b>${order.robloxUsername}</b>
💎 <b>Jumlah Robux:</b> <b>${order.robuxAmount.toLocaleString("id-ID")} R$</b>
💰 <b>Total Bayar:</b> <b>${formatRupiah(order.totalPrice)}</b>
📱 <b>WhatsApp:</b> https://wa.me/${order.whatsapp.replace(/^0/, "62")}
📊 <b>Status:</b> ${order.status.toUpperCase()}
${adminLink ? `🔗 <a href="${adminLink}">Verifikasi bukti transfer</a>` : ""}
━━━━━━━━━━━━━━━━━━
<i>Silakan verifikasi bukti transfer di admin dashboard.</i>
`.trim();

  try {
    // Kirim foto bukti langsung kalau ada (signed URL berumur pendek — Telegram
    // akan mengunduhnya saat request, jadi cukup waktu).
    if (order.paymentProof) {
      const signedUrl = await getProofSignedUrl(order.paymentProof.replace(/^proofs\//, ""));
      if (signedUrl) {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            photo: signedUrl,
            caption: message,
            parse_mode: "HTML",
          }),
        });
        if (res.ok) return true;
      }
    }

    // Fallback: text message
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to send telegram notification:", error);
    return false;
  }
}
