"use client";

import { useState } from "react";
import { Calendar, Plus, Edit2, CheckCircle, Clock, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cycles = [
  {
    id: "1", name: "FY 2025-26", financial_year: "2025-26", status: "active",
    goal_setting_start: "2025-04-01", goal_setting_end: "2025-05-15",
    q1_start: "2025-07-01", q1_end: "2025-07-31",
    q2_start: "2025-10-01", q2_end: "2025-10-31",
    q3_start: "2026-01-01", q3_end: "2026-01-31",
    q4_start: "2026-03-15", q4_end: "2026-04-15",
  },
  {
    id: "2", name: "FY 2024-25", financial_year: "2024-25", status: "closed",
    goal_setting_start: "2024-04-01", goal_setting_end: "2024-05-15",
    q1_start: "2024-07-01", q1_end: "2024-07-31",
    q2_start: "2024-10-01", q2_end: "2024-10-31",
    q3_start: "2025-01-01", q3_end: "2025-01-31",
    q4_start: "2025-03-15", q4_end: "2025-04-15",
  },
];

const statusColor: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AdminCyclesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Cycles</h1>
          <p className="text-muted-foreground mt-1">Manage financial year performance cycles and check-in windows</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Cycle</Button>
      </div>

      <div className="space-y-4">
        {cycles.map(cycle => (
          <Card key={cycle.id} className={cycle.status === "active" ? "border-green-300" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{cycle.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Financial Year: {cycle.financial_year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusColor[cycle.status]}>{cycle.status}</Badge>
                  {cycle.status !== "closed" && (
                    <Button size="sm" variant="outline" className="gap-1"><Edit2 className="h-3 w-3" /> Edit</Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted/40 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Goal Setting</p>
                  <p className="font-medium">{cycle.goal_setting_start}</p>
                  <p className="text-muted-foreground">to {cycle.goal_setting_end}</p>
                </div>
                {[["Q1", cycle.q1_start, cycle.q1_end], ["Q2", cycle.q2_start, cycle.q2_end], ["Q3", cycle.q3_start, cycle.q3_end], ["Q4 / Annual", cycle.q4_start, cycle.q4_end]].map(([q, s, e]) => (
                  <div key={q as string} className="p-3 bg-muted/40 rounded-lg">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{q} Check-in</p>
                    <p className="font-medium">{s}</p>
                    <p className="text-muted-foreground">to {e}</p>
                  </div>
                ))}
              </div>
              {cycle.status === "active" && (
                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-2 text-red-600 border-red-300 hover:bg-red-50">
                    <Lock className="h-3 w-3" /> Close Cycle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
