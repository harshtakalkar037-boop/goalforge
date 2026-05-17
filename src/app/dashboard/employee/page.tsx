"use client";

import { Target, CheckCircle2, TrendingUp, Clock, Star, Zap, AlertCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GoalProgressChart } from "@/components/charts/goal-progress-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { AchievementBadges } from "@/components/dashboard/achievement-badges";
import { NotificationsWidget } from "@/components/dashboard/notifications-widget";

const kpis = [
  { label: "Active Goals", value: "4", sub: "1 pending approval", icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Completed", value: "2", sub: "this cycle", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  { label: "Avg Progress", value: "72%", sub: "+12% vs last quarter", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Achievement", value: "87%", sub: "probability", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "Performance", value: "4.2/5", sub: "current rating", icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Deadlines", value: "2", sub: "due this month", icon: Clock, color: "text-red-600", bg: "bg-red-50" },
];

const goals = [
  { title: "Increase customer satisfaction score", weightage: 30, progress: 82, status: "approved", dueQ: "Q2" },
  { title: "Complete AWS certification", weightage: 20, progress: 55, status: "approved", dueQ: "Q3" },
  { title: "Reduce bug backlog by 40%", weightage: 25, progress: 91, status: "approved", dueQ: "Q2" },
  { title: "Deliver onboarding module revamp", weightage: 25, progress: 30, status: "submitted", dueQ: "Q2" },
];

const activity = [
  { msg: "Q1 check-in reviewed by manager", time: "Yesterday", type: "success" },
  { msg: "Goal 'AWS Certification' updated", time: "3 days ago", type: "info" },
  { msg: "Goal sheet submitted for approval", time: "5 days ago", type: "info" },
  { msg: "Badge 'Goal Crusher' earned", time: "1 week ago", type: "success" },
];

const overallProgress = Math.round(goals.reduce((a, g) => a + g.progress * (g.weightage / 100), 0));

export default function EmployeeDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Priya 👋</h1>
          <p className="text-muted-foreground mt-1">FY 2025–26 · Q2 Performance Cycle · <span className="text-yellow-600 font-medium">Check-in due Oct 15</span></p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-4xl font-bold text-primary">{overallProgress}%</p>
          <p className="text-xs text-muted-foreground">Overall Progress</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>
                <k.icon className={`h-4 w-4 ${k.color}`} />
              </div>
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{k.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Goal Progress Trend</CardTitle></CardHeader>
          <CardContent><GoalProgressChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Goal Category Distribution</CardTitle></CardHeader>
          <CardContent><CategoryPieChart /></CardContent>
        </Card>
      </div>

      {/* Goals + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4" /> Current Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals.map((g, i) => (
                <div key={i} className="p-3 rounded-lg border bg-card hover:bg-accent/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium truncate flex-1 mr-2">{g.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={`text-xs ${g.status === "approved" ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"}`}>{g.status}</Badge>
                      <span className="text-xs text-muted-foreground">{g.dueQ}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={g.progress} className="h-2 flex-1" />
                    <span className={`text-xs font-bold w-8 text-right shrink-0 ${g.progress >= 80 ? "text-green-600" : g.progress >= 60 ? "text-yellow-600" : "text-orange-600"}`}>{g.progress}%</span>
                    <span className="text-xs text-muted-foreground shrink-0">{g.weightage}%wt</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4" />Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${a.type === "success" ? "bg-green-500" : "bg-blue-500"}`} />
                  <p className="text-sm flex-1">{a.msg}</p>
                  <p className="text-xs text-muted-foreground shrink-0">{a.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <NotificationsWidget />
          <AIInsights />
          <AchievementBadges />
        </div>
      </div>
    </div>
  );
}
