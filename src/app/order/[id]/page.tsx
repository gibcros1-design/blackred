import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderTracker } from "@/components/tracking/OrderTracker";
import { getConfigValue } from "@/services/config";
import { DEFAULT_ADMIN_WHATSAPP } from "@/services/defaults";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderAliasPage({ params }: Props) {
  const { id } = await params;
  const initialOrder = await db.query.orders.findFirst({
    where: or(eq(orders.orderId, id), eq(orders.code, id)),
  });

  const adminWhatsapp = await getConfigValue<string>("admin_whatsapp", DEFAULT_ADMIN_WHATSAPP);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <OrderTracker
          initialCode={initialOrder ? id : ""}
          initialOrder={initialOrder ?? undefined}
          adminWhatsapp={adminWhatsapp}
        />
      </main>
      <Footer />
    </div>
  );
}
