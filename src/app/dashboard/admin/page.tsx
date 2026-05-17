"use client";

import { Users, Calendar, Target, TrendingUp, BarChart3, Activity, Shield, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SimpleBarChart } from "@/components/charts/bar-chart";
import { AIInsights } from "@/components/dashboard/ai-insights";

const kpis = [
  { label: "Total Employees", value: "142", sub: "+8 this month", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Managers", value: "18", sub: "across 7 depts", icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Active Cycles", value: "1", sub: "FY 2025-26 Q2", icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
  { label: "Org Goal Completion", value: "68%", sub: "+5% from Q1", icon: Target, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Avg Rating", value: "3.8/5", sub: "org-wide average", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
];

const deptData = [
  { label: "HR", value: 84, color: "#10b981" },
  { label: "Design", value: 78, color: "#10b981" },
  { label: "Eng", value: 72, color: "#10b981" },
  { label: "Ops", value: 71, color: "#f59e0b" },
  { label: "Sales", value: 65, color: "#f59e0b" },
  { label: "Finance", value: 59, color: "#ef4444" },
];

const ratingData = [
  { label: "5 Stars", value: 22 },
  { label: "4 Stars", value: 48 },
  { label: "3 Stars", value: 41 },
  { label: "2 Stars", value: 19 },
  { label: "1 Star", value: 12 },
];

const auditLogs = [
  { action: "approve", msg: "Goal sheet approved for Priya Sharma", by: "Sunita Patel", time: "5m ago" },
  { action: "create", msg: "New user registered: Karan Shah", by: "Admin", time: "1h ago" },
  { action: "update", msg: "Q2 deadline extended to Oct 20", by: "Admin", time: "3h ago" },
  { action: "reject", msg: "Goal sheet rejected for Suresh Kumar", by: "Sunita Patel", time: "5h ago" },
  { action: "push", msg: "Shared goal pushed to 42 employees", by: "Admin", time: "Yesterday" },
];

const actionColor: Record<string, string> = {
  approve: "bg-green-100 text-green-700",
  create: "bg-blue-100 text-blue-700",
  update: "bg-yellow-100 text-yellow-700",
  reject: "bg-red-100 text-red-700",
  push: "bg-purple-100 text-purple-700",
};

const adminInsights = [
  { type: "warning" as const, title: "Department Alert", body: "Finance dept is at 59% avg progress — lowest in org. Recommend a manager sync this week." },
  { type: "success" as const, title: "Strong Performance", body: "HR team leads the org at 84% avg. This is the 3rd consecutive quarter of top performance." },
  { type: "prediction" as const, title: "Executive Forecast", body: "Organization is on track to achieve 74% weighted avg score by end of Q2, up from 63% in Q1." },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Organization-wide performance overview · FY 2025–26</p>
      </div>

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
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Department Progress</CardTitle></CardHeader>
              <CardContent><SimpleBarChart data={deptData} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Rating Distribution</CardTitle></CardHeader>
              <CardContent><SimpleBarChart data={ratingData} /></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" />Department Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { dept: "HR", emp: 12, progress: 84 },
                { dept: "Engineering", emp: 42, progress: 72 },
                { dept: "Design", emp: 8, progress: 78 },
                { dept: "Operations", emp: 24, progress: 71 },
                { dept: "Sales", emp: 28, progress: 65 },
                { dept: "Finance", emp: 18, progress: 59 },
              ].map(d => (
                <div key={d.dept}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="font-medium">{d.dept}</span>
                    <span className="text-xs text-muted-foreground">{d.emp} employees · <span className={`font-bold ${d.progress >= 75 ? "text-green-600" : d.progress >= 65 ? "text-yellow-600" : "text-red-600"}`}>{d.progress}%</span></span>
                  </div>
                  <Progress value={d.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <AIInsights insights={adminInsights} />

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" />Recent Audit Logs</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${actionColor[log.action]}`}>{log.action}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{log.msg}</p>
                    <p className="text-xs text-muted-foreground">{log.by} · {log.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-700">638</p>
                <p className="text-xs text-green-600 mt-1">Total Goals</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-700">12</p>
                <p className="text-xs text-purple-600 mt-1">Shared Goals</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
