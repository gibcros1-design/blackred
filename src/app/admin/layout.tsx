import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-foreground">
      <AdminHeader />
      <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">{children}</div>
    </div>
  );
}
