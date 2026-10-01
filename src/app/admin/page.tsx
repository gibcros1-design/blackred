import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { formatRupiah } from "@/lib/utils";
import { ShoppingBag, Clock, CheckCircle, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

const metrics = [
  { key: "total", label: "Total order", icon: ShoppingBag, accent: false },
  { key: "waiting", label: "Menunggu verifikasi", icon: Clock, accent: true },
  { key: "done", label: "Order selesai", icon: CheckCircle, accent: false },
  { key: "revenue", label: "Total omset", icon: Wallet, accent: false },
];

export default async function AdminDashboardPage() {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
  });

  const waitingVerify = allOrders.filter((o) => o.status === "waiting_verify").length;
  const completedOrders = allOrders.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const values: Record<string, { display: string; valueClass?: string }> = {
    total: { display: String(allOrders.length) },
    waiting: { display: String(waitingVerify), valueClass: "text-destructive" },
    done: { display: String(completedOrders.length) },
    revenue: { display: formatRupiah(totalRevenue) },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard pesanan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola dan proses transaksi top-up Roblox.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm">{label}</span>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className={`mt-2 text-xl font-bold tracking-tight sm:text-2xl ${values[key].valueClass || ""}`}>
              {values[key].display}
            </div>
          </div>
        ))}
      </div>

      <OrdersTable orders={allOrders} />
    </div>
  );
}
