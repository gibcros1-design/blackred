"use client";

import { useState } from "react";
import { loginAdminAction } from "@/app/actions/auth";
import { Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAdminAction(formData);
      if (res && res.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (err: any) {
      // Next.js redirect throws a NEXT_REDIRECT error which is caught by framework
      if (err?.message?.includes("NEXT_REDIRECT")) return;
      setError("Terjadi kesalahan saat login.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && (
        <p className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium">Username</label>
        <div className="relative mt-1.5">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input id="username" name="username" type="text" required placeholder="admin" className="pl-9" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input id="password" name="password" type="password" required placeholder="••••••••" className="pl-9" />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Memeriksa" : "Masuk ke dashboard"}
      </Button>
    </form>
  );
}
