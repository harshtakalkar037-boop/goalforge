"use client";

import { FileText, Download, TrendingUp, Users, Target, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const reports = [
  { id: "1", name: "My Performance Report", type: "Individual", period: "FY 2025-26 Q2", generated: "Oct 14, 2025", status: "ready", icon: Target },
  { id: "2", name: "Team Performance Report", type: "Team", period: "FY 2025-26 Q1-Q2", generated: "Oct 12, 2025", status: "ready", icon: Users },
  { id: "3", name: "Executive Summary", type: "Organization", period: "FY 2025-26 Mid-Year", generated: "Pending", status: "generating", icon: BarChart3 },
];

const myStats = [
  { label: "Goals Active", value: 4 },
  { label: "Goals Completed", value: 2 },
  { label: "Avg Progress", value: "72%" },
  { label: "Check-ins Done", value: "6/8" },
  { label: "Performance Rating", value: "4.2/5" },
  { label: "Achievement Score", value: "87%" },
];

const goalBreakdown = [
  { title: "Increase CSAT score", progress: 82, weightage: 30 },
  { title: "Complete AWS Certification", progress: 55, weightage: 20 },
  { title: "Reduce bug backlog", progress: 91, weightage: 25 },
  { title: "Onboarding module revamp", progress: 30, weightage: 25 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Performance reports and exports</p>
      </div>

      {/* Report cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {reports.map(r => (
          <Card key={r.id} className={r.status === "generating" ? "opacity-70" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <r.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className={`text-xs ${r.status === "ready" ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}`}>
                  {r.status}
                </Badge>
              </div>
              <p className="font-semibold text-sm mb-1">{r.name}</p>
              <p className="text-xs text-muted-foreground mb-1">{r.type} · {r.period}</p>
              <p className="text-xs text-muted-foreground mb-4">Generated: {r.generated}</p>
              {r.status === "ready" ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1 flex-1 text-xs">
                    <Download className="h-3 w-3" /> PDF
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 flex-1 text-xs">
                    <Download className="h-3 w-3" /> CSV
                  </Button>
                </div>
              ) : (
                <Button size="sm" disabled className="w-full text-xs">Generating...</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inline preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-base flex items-center gap-2"><FileText className="h-4 w-4" />My Performance Report Preview</span>
            <Button size="sm" variant="outline" className="gap-2"><Download className="h-4 w-4" />Export PDF</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {myStats.map(s => (
              <div key={s.label} className="p-3 bg-muted/40 rounded-lg">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Goal-wise Progress</h3>
            <div className="space-y-3">
              {goalBreakdown.map((g, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="truncate flex-1 mr-2">{g.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{g.weightage}% weight · <span className={`font-bold ${g.progress >= 80 ? "text-green-600" : g.progress >= 60 ? "text-yellow-600" : "text-orange-600"}`}>{g.progress}%</span></span>
                  </div>
                  <Progress value={g.progress} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-semibold text-primary mb-1">Manager Summary</p>
            <p className="text-sm text-muted-foreground">"Priya has shown exceptional performance this quarter, particularly on the bug reduction goal. The AWS certification progress needs attention. Overall a strong contributor to the team."</p>
            <p className="text-xs text-muted-foreground mt-2">— Sunita Patel, Engineering Manager</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
