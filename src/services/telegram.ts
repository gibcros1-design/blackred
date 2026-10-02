import { getConfigValue } from "./config";
import { Order } from "@/db/schema";
import { formatRupiah, escapeTelegramHtml } from "@/lib/utils";

export async function sendTelegramOrderNotification(order: Order): Promise<boolean> {
  const botToken = (await getConfigValue<string>("telegram_bot_token", "")) || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = (await getConfigValue<string>("telegram_admin_chat_id", "")) || process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram bot token or chat ID is missing. Notification skipped.");
    return false;
  }

  const esc = escapeTelegramHtml;
  const message = `
📦 <b>ORDER MASUK BARU!</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>Order ID:</b> <code>${esc(order.orderId)}</code>
🔑 <b>Kode Cek:</b> <code>${esc(order.code)}</code>
👤 <b>Nama:</b> ${esc(order.name)}
🎮 <b>Roblox Username:</b> <b>${esc(order.robloxUsername)}</b>
💎 <b>Jumlah Robux:</b> <b>${order.robuxAmount.toLocaleString("id-ID")} R$</b>
💰 <b>Total Bayar:</b> <b>${formatRupiah(order.totalPrice)}</b>
📱 <b>WhatsApp:</b> https://wa.me/${esc(order.whatsapp.replace(/^0/, "62"))}
📊 <b>Status:</b> ${esc(order.status.toUpperCase())}
━━━━━━━━━━━━━━━━━━
${order.paymentProof ? "🧾 <b>Bukti transfer menyusul / sudah dikirim</b> — verifikasi di chat ini." : ""}
<i>Verifikasi pesanan di admin dashboard atau chat ini.</i>
`.trim();

  try {
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
