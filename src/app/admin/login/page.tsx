import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10">
      <Card className="w-full max-w-md p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Login admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk untuk mengelola pesanan, rekening, dan harga.
          </p>
        </div>

        <AdminLoginForm />
      </Card>
    </div>
  );
}
