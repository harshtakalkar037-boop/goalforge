"use client";

import { Users, ClipboardCheck, TrendingUp, AlertTriangle, Clock, BarChart3, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TeamPerformanceChart } from "@/components/charts/team-performance-chart";
import { AIInsights } from "@/components/dashboard/ai-insights";

const kpis = [
  { label: "Team Members", value: "8", sub: "2 new this cycle", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Pending Approvals", value: "3", sub: "requires action", icon: ClipboardCheck, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Team Avg Score", value: "69%", sub: "+8% from Q1", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  { label: "At-Risk Goals", value: "5", sub: "below 60% progress", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  { label: "Overdue Check-ins", value: "1", sub: "follow up needed", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
];

const team = [
  { name: "Ravi Menon", role: "QA Lead", progress: 91, status: "on_track", checkin: "Done" },
  { name: "Priya Sharma", role: "Sr. Engineer", progress: 84, status: "on_track", checkin: "Done" },
  { name: "Lalita Rao", role: "Business Analyst", progress: 72, status: "on_track", checkin: "Done" },
  { name: "Meena Joshi", role: "Data Analyst", progress: 78, status: "on_track", checkin: "Done" },
  { name: "Arun Pillai", role: "Frontend Dev", progress: 67, status: "on_track", checkin: "Pending" },
  { name: "Anita Desai", role: "Product Designer", progress: 62, status: "at_risk", checkin: "Pending" },
  { name: "Suresh Kumar", role: "Backend Dev", progress: 55, status: "at_risk", checkin: "Overdue" },
  { name: "Vikram Nair", role: "DevOps Engineer", progress: 43, status: "at_risk", checkin: "Not Started" },
];

const managerInsights = [
  { type: "warning" as const, title: "Team Risk Alert", body: "3 team members are below 60% progress. Consider scheduling 1:1s with Suresh, Vikram, and Anita this week." },
  { type: "tip" as const, title: "Approval Queue", body: "3 goal sheets are waiting for your review. Early approval helps employees start their check-ins on time." },
  { type: "prediction" as const, title: "Team Forecast", body: "At current velocity, 5 of 8 team members are on track to meet their Q2 targets. Team avg projected at 74%." },
];

export default function ManagerDashboardPage() {
  const avgProgress = Math.round(team.reduce((a, m) => a + m.progress, 0) / team.length);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">FY 2025–26 · Q2 · Engineering Team</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-4xl font-bold text-primary">{avgProgress}%</p>
          <p className="text-xs text-muted-foreground">Team Avg Progress</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>
                <k.icon className={`h-4 w-4 ${k.color}`} />
              </div>
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs font-medium mt-0.5">{k.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" />Team Performance Comparison</CardTitle></CardHeader>
            <CardContent><TeamPerformanceChart /></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />Team Members</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {team.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    {m.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`text-xs font-bold ${m.progress >= 70 ? "text-green-600" : m.progress >= 55 ? "text-yellow-600" : "text-red-600"}`}>{m.progress}%</span>
                        <Badge variant="outline" className={`text-xs ${m.checkin === "Done" ? "bg-green-100 text-green-700 border-green-200" : m.checkin === "Overdue" ? "bg-red-100 text-red-700 border-red-200" : m.checkin === "Pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-gray-100 text-gray-600"}`}>
                          {m.checkin}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={m.progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-0.5">{m.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-red-200 bg-red-50/30">
            <CardHeader><CardTitle className="text-base text-red-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Needs Attention</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {team.filter(m => m.status === "at_risk").map((m, i) => (
                <div key={i} className="p-2 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.progress}% · {m.checkin}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/30">
            <CardHeader><CardTitle className="text-base text-green-800 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Top Performers</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {team.filter(m => m.progress >= 78).slice(0, 3).map((m, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200">
                  <span className="text-sm font-bold text-yellow-500">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.progress}%</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <AIInsights insights={managerInsights} />
        </div>
      </div>
    </div>
  );
}
