import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderTracker } from "@/components/tracking/OrderTracker";
import { db } from "@/db";
import { getConfigValue } from "@/services/config";
import { DEFAULT_ADMIN_WHATSAPP } from "@/services/defaults";
import { orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface CekOrderPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function CekOrderPage({ searchParams }: CekOrderPageProps) {
  const params = await searchParams;
  const adminWhatsapp = await getConfigValue<string>("admin_whatsapp", DEFAULT_ADMIN_WHATSAPP);
  let initialOrder = null;

  if (params.code) {
    initialOrder = await db.query.orders.findFirst({
      where: or(eq(orders.code, params.code), eq(orders.orderId, params.code)),
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-14 px-4">
        <OrderTracker initialCode={params.code} initialOrder={initialOrder} adminWhatsapp={adminWhatsapp} />
      </main>
      <Footer />
    </div>
  );
}
