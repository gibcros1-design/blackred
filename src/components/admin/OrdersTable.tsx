"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrdersTableProps {
  orders: any[];
}

export const statusLabels: Record<string, string> = {
  pending_payment: "Menunggu bayar",
  waiting_verify: "Menunggu verifikasi",
  approved: "Disetujui",
  processing: "Diproses",
  completed: "Selesai",
  rejected: "Ditolak",
  expired: "Kedaluwarsa",
};

export const statusBadge: Record<string, string> = {
  pending_payment: "border-amber-300 bg-amber-50 text-amber-900",
  waiting_verify: "border-blue-300 bg-blue-50 text-blue-900",
  approved: "border-green-300 bg-green-50 text-green-900",
  processing: "border-blue-300 bg-blue-50 text-blue-900",
  completed: "border-green-300 bg-green-50 text-green-900",
  rejected: "border-destructive/30 bg-destructive/10 text-destructive",
  expired: "border-border bg-secondary text-muted-foreground",
};

const filters = ["all", "waiting_verify", "approved", "processing", "completed", "rejected"];

const filterLabels: Record<string, string> = {
  all: "Semua",
  waiting_verify: "Menunggu verifikasi",
  approved: "Disetujui",
  processing: "Diproses",
  completed: "Selesai",
  rejected: "Ditolak",
};

export function OrdersTable({ orders }: OrdersTableProps) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      o.orderId.toLowerCase().includes(q) ||
      o.code.toLowerCase().includes(q) ||
      o.name.toLowerCase().includes(q) ||
      o.robloxUsername.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Order ID, kode, nama..."
            aria-label="Cari pesanan"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0" role="tablist" aria-label="Filter status">
          {filters.map((st) => (
            <button
              key={st}
              type="button"
              role="tab"
              aria-selected={filter === st}
              onClick={() => setFilter(st)}
              className={cn(
                "min-h-9 shrink-0 whitespace-nowrap rounded-md border px-3 text-sm transition-colors duration-150 cursor-pointer",
                filter === st
                  ? "border-foreground bg-secondary font-medium"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {filterLabels[st]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-stone-50 text-muted-foreground">
            <tr>
              <th className="p-3.5 font-medium">Order ID</th>
              <th className="p-3.5 font-medium">Pelanggan</th>
              <th className="p-3.5 font-medium">Roblox username</th>
              <th className="p-3.5 font-medium">Robux</th>
              <th className="p-3.5 font-medium">Total bayar</th>
              <th className="p-3.5 font-medium">Status</th>
              <th className="p-3.5 font-medium">Tanggal</th>
              <th className="p-3.5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">
                  Tidak ada pesanan yang sesuai filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="transition-colors duration-150 hover:bg-stone-50">
                  <td className="p-3.5">
                    <div className="font-mono text-sm">{o.orderId}</div>
                    <div className="font-mono text-xs text-muted-foreground">Kode: {o.code}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium">{o.name}</div>
                    <div className="text-xs text-muted-foreground">{o.whatsapp}</div>
                  </td>
                  <td className="p-3.5 font-medium">{o.robloxUsername}</td>
                  <td className="p-3.5">{o.robuxAmount.toLocaleString("id-ID")} R$</td>
                  <td className="p-3.5 font-medium">{formatRupiah(o.totalPrice)}</td>
                  <td className="p-3.5">
                    <span
                      className={cn(
                        "inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        statusBadge[o.status] || "border-border bg-secondary text-muted-foreground",
                      )}
                    >
                      {statusLabels[o.status] || o.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-muted-foreground">{formatDate(o.createdAt)}</td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/admin/order/${o.id}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      <Eye className="h-3.5 w-3.5" /> Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
