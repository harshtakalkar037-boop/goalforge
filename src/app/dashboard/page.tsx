"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    // Wait until auth/profile loading is complete
    if (loading) return;

    // If for some reason there is no user, go to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Redirect based on role
    switch (user.role) {
      case "admin":
        router.replace("/dashboard/admin");
        break;

      case "manager":
        router.replace("/dashboard/manager");
        break;

      case "employee":
      default:
        router.replace("/dashboard/employee");
        break;
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}