"use client";

import { BarChart3, TrendingUp, Users, Target, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const deptData = [
  { dept: "HR", progress: 84, employees: 12, completed: 10, atRisk: 0 },
  { dept: "Engineering", progress: 72, employees: 42, completed: 28, atRisk: 6 },
  { dept: "Design", progress: 78, employees: 8, completed: 6, atRisk: 1 },
  { dept: "Operations", progress: 71, employees: 24, completed: 16, atRisk: 3 },
  { dept: "Sales", progress: 65, employees: 28, completed: 16, atRisk: 5 },
  { dept: "Finance", progress: 59, employees: 18, completed: 9, atRisk: 4 },
  { dept: "Analytics", progress: 76, employees: 10, completed: 7, atRisk: 1 },
];

const quarterlyTrend = [
  { q: "Q4 FY24", score: 62 },
  { q: "Q1 FY25", score: 69 },
  { q: "Q2 FY25", score: 71 },
  { q: "Q3 FY25", score: 74 },
  { q: "Q4 FY25", score: 78 },
  { q: "Q1 FY26", score: 63 },
  { q: "Q2 FY26 (now)", score: 68 },
];

const topPerformers = [
  { name: "Ravi Menon", dept: "Quality", score: 91 },
  { name: "Priya Sharma", dept: "Engineering", score: 84 },
  { name: "Lalita Rao", dept: "Strategy", score: 82 },
  { name: "Meena Joshi", dept: "Analytics", score: 78 },
];

const maxScore = Math.max(...quarterlyTrend.map(q => q.score));

export default function AdminAnalyticsPage() {
  const orgAvg = Math.round(deptData.reduce((a, d) => a + d.progress, 0) / deptData.length);
  const totalAtRisk = deptData.reduce((a, d) => a + d.atRisk, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Organization-wide performance insights · FY 2025-26</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Report</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Org Avg Progress", value: `${orgAvg}%`, icon: TrendingUp, color: "text-primary" },
          { label: "Total Employees", value: deptData.reduce((a, d) => a + d.employees, 0), icon: Users, color: "text-blue-600" },
          { label: "Goals Completed", value: deptData.reduce((a, d) => a + d.completed, 0), icon: CheckCircle2, color: "text-green-600" },
          { label: "At Risk", value: totalAtRisk, icon: AlertTriangle, color: "text-red-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Department Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deptData.sort((a, b) => b.progress - a.progress).map(d => (
              <div key={d.dept}>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="font-medium">{d.dept}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {d.atRisk > 0 && <span className="text-red-600 font-medium">{d.atRisk} at risk</span>}
                    <span>{d.employees} employees</span>
                    <span className={`font-bold ${d.progress >= 75 ? "text-green-600" : d.progress >= 65 ? "text-yellow-600" : "text-orange-600"}`}>{d.progress}%</span>
                  </div>
                </div>
                <Progress value={d.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Quarterly Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-36">
                {quarterlyTrend.map(q => (
                  <div key={q.q} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-primary">{q.score}%</span>
                    <div
                      className={`w-full rounded-t-sm ${q.q.includes("now") ? "bg-primary" : "bg-primary/40"}`}
                      style={{ height: `${(q.score / 100) * 96}px` }}
                    />
                    <span className="text-xs text-muted-foreground text-center leading-tight" style={{ fontSize: "10px" }}>{q.q.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Performers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPerformers.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className={`text-sm font-bold w-5 ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-muted-foreground"}`}>
                    #{i + 1}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{p.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.dept}</p>
                  </div>
                  <span className="font-bold text-green-600">{p.score}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
