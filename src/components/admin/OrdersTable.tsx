"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Eye, Search, User, Gamepad2, Coins, ArrowRight } from "lucide-react";
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
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Order ID, nama, username..."
            aria-label="Cari pesanan"
            className="pl-9 text-sm"
          />
        </div>

        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 -mx-1 px-1 scrollbar-none"
          role="tablist"
          aria-label="Filter status pesanan"
        >
          {filters.map((st) => (
            <button
              key={st}
              type="button"
              role="tab"
              aria-selected={filter === st}
              onClick={() => setFilter(st)}
              className={cn(
                "min-h-9 shrink-0 whitespace-nowrap rounded-md border px-3 text-xs sm:text-sm transition-colors duration-150 cursor-pointer",
                filter === st
                  ? "border-foreground bg-secondary font-medium text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {filterLabels[st]}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card View (< md) */}
      <div className="space-y-3 md:hidden">
        {filteredOrders.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-xs">
            Tidak ada pesanan yang sesuai filter.
          </div>
        ) : (
          filteredOrders.map((o) => (
            <div key={o.id} className="rounded-lg border border-border bg-card p-3.5 shadow-xs space-y-3">
              {/* Header: Order ID & Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono text-sm font-semibold tracking-tight text-foreground truncate">
                    {o.orderId}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    Kode cek: <span className="font-medium text-foreground">{o.code}</span>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-block shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    statusBadge[o.status] || "border-border bg-secondary text-muted-foreground",
                  )}
                >
                  {statusLabels[o.status] || o.status}
                </span>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-2.5 rounded-md bg-stone-50/80 p-2.5 text-xs border border-border/60">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> Pelanggan
                  </span>
                  <div className="font-medium text-foreground truncate">{o.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{o.whatsapp}</div>
                </div>

                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Gamepad2 className="h-3 w-3" /> Roblox User
                  </span>
                  <div className="font-medium text-foreground truncate">{o.robloxUsername}</div>
                </div>

                <div className="space-y-0.5 border-t border-border/40 pt-2 min-w-0">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Coins className="h-3 w-3" /> Nominal Robux
                  </span>
                  <div className="font-bold text-foreground">
                    {o.robuxAmount.toLocaleString("id-ID")} R$
                  </div>
                </div>

                <div className="space-y-0.5 border-t border-border/40 pt-2 min-w-0">
                  <span className="text-[11px] text-muted-foreground">Total Bayar</span>
                  <div className="font-bold text-primary">
                    {formatRupiah(o.totalPrice)}
                  </div>
                </div>
              </div>

              {/* Footer: Date & Action Link */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</span>
                <Link
                  href={`/admin/order/${o.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-8 px-3 text-xs gap-1.5 font-medium"
                  )}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Detail</span>
                  <ArrowRight className="h-3 w-3 opacity-60" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border bg-card shadow-xs">
        <table className="w-full min-w-[760px] text-left text-sm">
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
                    <div className="font-mono text-sm font-medium">{o.orderId}</div>
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
