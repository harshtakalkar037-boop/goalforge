"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  ArrowRight,
  Target,
  CheckCircle,
  BarChart3,
  Users,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <div className="max-w-3xl space-y-8 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <Target className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold md:text-6xl">
              Welcome to <span className="text-primary">GoalForge</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Enterprise Goal Setting & Tracking Portal
            </p>
          </div>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Streamline your organization's performance management with
            structured goal setting, quarterly check-ins, and real-time
            analytics.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 pt-8 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 space-y-2 text-left">
              <CheckCircle className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Goal Management</h3>
              <p className="text-sm text-muted-foreground">
                Set clear measurable goals with approval workflows
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-2 text-left">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Quarterly check-ins with automatic score calculation
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-2 text-left">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Team Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Real-time dashboards for managers and admins
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}