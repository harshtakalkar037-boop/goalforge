"use client";

import { useState, useEffect, useCallback } from "react";
import { Target, CheckCircle2, Clock, TrendingUp, AlertCircle, Loader2, Award, BookOpen, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import type { Goal, GoalSheet, PerformanceCycle } from "@/lib/types";

export default function EmployeeDashboard() {
  const { user } = useUser();
  const supabase = createClient();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sheet, setSheet] = useState<GoalSheet | null>(null);
  const [cycle, setCycle] = useState<PerformanceCycle | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: cycleData } = await supabase.from("performance_cycles").select("*").eq("status", "active").order("created_at", { ascending: true }).limit(1).then(r => ({ data: r.data?.[0] ?? null }));
      setCycle(cycleData);
      if (cycleData) {
        const { data: sheetData } = await supabase.from("goal_sheets").select("*").eq("employee_id", user.id).eq("cycle_id", cycleData.id).order("created_at", { ascending: false }).limit(1).then(r => ({ data: r.data?.[0] ?? null }));
        setSheet(sheetData);
        if (sheetData) {
          const { data: goalsData } = await supabase.from("goals").select("*, thrust_area:thrust_areas(name)").eq("goal_sheet_id", sheetData.id).order("sort_order");
          setGoals(goalsData as Goal[] || []);
        }
      }
    } finally { setLoading(false); }
  }, [user, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const totalWeightage = goals.reduce((a, g) => a + g.weightage, 0);
  const sheetStatus = sheet?.status || "draft";

  const statusConfig = {
    draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100", icon: Clock },
    submitted: { label: "Submitted", color: "text-blue-600", bg: "bg-blue-100", icon: Clock },
    approved: { label: "Approved", color: "text-green-600", bg: "bg-green-100", icon: CheckCircle2 },
    rejected: { label: "Rejected", color: "text-red-600", bg: "bg-red-100", icon: AlertCircle },
  };

  const sc = statusConfig[sheetStatus as keyof typeof statusConfig] || statusConfig.draft;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-fade">
      {/* Welcome header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
            <span className="text-primary">{user?.full_name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {cycle ? `${cycle.name} · ${cycle.financial_year}` : "No active performance cycle"}
          </p>
        </div>
        <Link href="/dashboard/employee/goals">
          <Button className="rounded-xl gap-2 shadow-sm">
            <Target className="h-4 w-4" /> Manage Goals
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-card border-primary/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
            </div>
            <p className="text-2xl font-bold">{goals.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Goals this cycle</p>
          </CardContent>
        </Card>
        <Card className="gradient-card border-primary/10">
          <CardContent className="p-5">
            <div className="h-9 w-9 rounded-xl bg-green-100 flex items-center justify-center mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{totalWeightage}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total weightage</p>
            <Progress value={totalWeightage} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="gradient-card border-primary/10">
          <CardContent className="p-5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground mt-0.5">Overall score</p>
          </CardContent>
        </Card>
        <Card className="gradient-card border-primary/10">
          <CardContent className="p-5">
            <div className="h-9 w-9 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-0.5">Check-ins done</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal sheet status */}
      {!sheet || sheetStatus === "draft" ? (
        <Card className="border-dashed border-2 border-primary/20 bg-primary/2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {!sheet ? "Get started — create your goals" : `Goal sheet is in draft · ${totalWeightage}% of 100% weightage set`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {!sheet
                    ? "No goal sheet found for this cycle. Add your first goal to get started."
                    : totalWeightage < 100
                      ? `Add ${100 - totalWeightage}% more weightage to submit your goal sheet for approval.`
                      : "Your goal sheet is complete! Submit it for manager approval."}
                </p>
                <Link href="/dashboard/employee/goals">
                  <Button size="sm" className="mt-3 rounded-xl gap-2">
                    <Target className="h-3.5 w-3.5" />
                    {!sheet ? "Add First Goal" : "Go to Goals"}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : sheetStatus === "approved" ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-5 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Goal sheet approved!</p>
              <p className="text-sm text-green-700">Your goals have been approved by your manager. Check-in season starts soon.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-5 flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-600 shrink-0" />
            <div>
              <p className="font-semibold text-blue-800">Awaiting manager approval</p>
              <p className="text-sm text-blue-700">Your goal sheet has been submitted and is pending review.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals preview */}
      {goals.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">My Goals</CardTitle>
              <Link href="/dashboard/employee/goals"><Button size="sm" variant="ghost" className="text-xs">View all</Button></Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {goals.slice(0, 4).map(goal => (
              <div key={goal.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{goal.title}</p>
                  <p className="text-xs text-muted-foreground">{goal.weightage}% weight</p>
                </div>
                <span className="text-xs font-bold text-muted-foreground shrink-0">—</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/objectives", icon: BookOpen, label: "Company Objectives", desc: "See org-wide OKRs" },
          { href: "/dashboard/projects", icon: Briefcase, label: "Projects", desc: "Track active projects" },
          { href: "/dashboard/leaderboard", icon: Award, label: "Leaderboard", desc: "Team performance rankings" },
        ].map(link => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/8 group-hover:bg-primary/12 flex items-center justify-center shrink-0 transition-colors">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
