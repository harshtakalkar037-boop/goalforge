"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import type { UserRole } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, signOut } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  useEffect(() => {
    // Redirect only after loading is finished
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Show spinner while auth state is loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no user, show spinner while redirecting
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar
          role={user.role as UserRole}
          onSignOut={handleSignOut}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}