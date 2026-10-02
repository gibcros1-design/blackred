"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/app/actions/admin-order";
import type { OrderStatus } from "@/lib/order-status";
import { Check, X, PlayCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  orderId: string;
  currentStatus: string;
  initialNote: string | null;
}

const actions = [
  { status: "approved", label: "Setujui pembayaran", icon: Check, destructive: false },
  { status: "processing", label: "Mulai pengiriman", icon: PlayCircle, destructive: false },
  { status: "completed", label: "Tandai selesai", icon: Check, destructive: false },
  { status: "rejected", label: "Tolak pesanan", icon: X, destructive: true },
] as const;

export function OrderDetailActions({ orderId, currentStatus, initialNote }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState(initialNote || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: OrderStatus) => {
    setLoading(true);
    try {
      await updateOrderStatusAction(orderId, newStatus, note);
      setStatus(newStatus);
      toast.success(`Status pesanan diperbarui: ${newStatus.replace("_", " ")}.`);
    } catch {
      toast.error("Gagal memperbarui status pesanan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="admin-note" className="block text-sm font-medium">Catatan admin</label>
        <p className="mt-1 text-xs text-muted-foreground">Catatan ini dapat dilihat oleh pembeli pada halaman status pesanan.</p>
        <Input
          id="admin-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: Robux telah dikirim via Group Payout."
          className="mt-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
        {actions.map(({ status: nextStatus, label, icon: Icon, destructive = false }) => (
          <Button
            key={nextStatus}
            type="button"
            variant={destructive ? "destructive" : status === nextStatus ? "secondary" : "outline"}
            disabled={loading}
            onClick={() => handleUpdate(nextStatus)}
            className="w-full justify-center h-10 text-xs sm:text-sm font-medium"
          >
            {loading && status === nextStatus ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
            <span>{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
