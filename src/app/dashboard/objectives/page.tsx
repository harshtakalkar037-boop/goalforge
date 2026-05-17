"use client";

import { Target, TrendingUp, Users, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const objectives = [
  {
    id: "1", title: "Achieve ISO 27001 Compliance", description: "Ensure all departments meet ISO 27001 security standards by Q3 end.",
    owner: "Aditya Verma", status: "on_track", progress: 68, target: 100, current: 68, due: "Jan 2026",
    linked_goals: 14, dept: "All Departments",
  },
  {
    id: "2", title: "Grow Customer NPS to 65+", description: "Improve net promoter score across all customer-facing teams.",
    owner: "Sunita Patel", status: "at_risk", progress: 52, target: 65, current: 52, due: "Mar 2026",
    linked_goals: 8, dept: "Sales & Support",
  },
  {
    id: "3", title: "Reduce Operational Costs by 15%", description: "Streamline processes and reduce redundant expenditure across operations.",
    owner: "Meena Joshi", status: "on_track", progress: 74, target: 100, current: 74, due: "Mar 2026",
    linked_goals: 6, dept: "Operations & Finance",
  },
  {
    id: "4", title: "Launch 3 New Product Features", description: "Deliver 3 major product features tied to Q2-Q4 roadmap.",
    owner: "Ravi Menon", status: "completed", progress: 100, target: 3, current: 3, due: "Oct 2025",
    linked_goals: 12, dept: "Engineering & Design",
  },
];

const statusColor: Record<string, string> = {
  on_track: "bg-green-100 text-green-700 border-green-200",
  at_risk: "bg-red-100 text-red-700 border-red-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function ObjectivesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Objectives</h1>
          <p className="text-muted-foreground mt-1">Organization-wide OKRs · FY 2025–26</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Objective</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total Objectives", value: objectives.length, color: "text-primary" },
          { label: "On Track", value: objectives.filter(o => o.status === "on_track").length, color: "text-green-600" },
          { label: "At Risk", value: objectives.filter(o => o.status === "at_risk").length, color: "text-red-600" },
          { label: "Completed", value: objectives.filter(o => o.status === "completed").length, color: "text-blue-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="space-y-3">
        {objectives.map(obj => (
          <Card key={obj.id} className={obj.status === "at_risk" ? "border-red-200" : obj.status === "completed" ? "border-blue-200" : ""}>
            <div className="p-5 cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => setExpanded(expanded === obj.id ? null : obj.id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold">{obj.title}</p>
                      <Badge variant="outline" className={`text-xs ${statusColor[obj.status]}`}>{obj.status.replace("_", " ")}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{obj.owner}</span>
                      <span>{obj.dept}</span>
                      <span>Due: {obj.due}</span>
                      <span>{obj.linked_goals} linked goals</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={obj.progress} className="h-2 flex-1" />
                      <span className={`text-sm font-bold shrink-0 ${obj.progress >= 70 ? "text-green-600" : obj.progress >= 50 ? "text-yellow-600" : "text-red-600"}`}>{obj.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">{expanded === obj.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
              </div>
            </div>
            {expanded === obj.id && (
              <div className="border-t bg-muted/30 p-5 space-y-3">
                <p className="text-sm">{obj.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground">Current Value</p><p className="font-semibold">{obj.current}</p></div>
                  <div><p className="text-xs text-muted-foreground">Target Value</p><p className="font-semibold">{obj.target}</p></div>
                  <div><p className="text-xs text-muted-foreground">Linked Goals</p><p className="font-semibold">{obj.linked_goals} goals</p></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit Objective</Button>
                  <Button size="sm" variant="outline">View Linked Goals</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
