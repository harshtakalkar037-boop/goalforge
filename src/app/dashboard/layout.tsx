"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import type { UserRole } from "@/lib/types";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, signOut } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar role={user.role as UserRole} onSignOut={handleSignOut} user={user} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} onSignOut={handleSignOut} />
        <main className="flex-1 overflow-auto p-6 page-fade">
          {children}
        </main>
      </div>
    </div>
  );
}
