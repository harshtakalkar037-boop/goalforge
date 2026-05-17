"use client";

import { useState } from "react";
import { Share2, Plus, Users, Target, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sharedGoals = [
  {
    id: "1", title: "Achieve ISO 27001 compliance", department: "All", weightage: 15,
    description: "All departments must contribute to the ISO 27001 audit readiness by Q3.",
    uom_type: "Timeline", target: "Jan 2026", pushed_to: 42, thrust_area: "Compliance",
  },
  {
    id: "2", title: "Reduce carbon footprint by 20%", department: "Operations", weightage: 10,
    description: "Operational efficiency goal shared across Ops and Engineering teams.",
    uom_type: "Max Percent", target: "20%", pushed_to: 18, thrust_area: "Sustainability",
  },
  {
    id: "3", title: "Customer NPS improvement to 65+", department: "Sales & Support", weightage: 20,
    description: "Cross-functional NPS improvement initiative requiring alignment across CX teams.",
    uom_type: "Min Numeric", target: "65", pushed_to: 28, thrust_area: "Customer Experience",
  },
];

export default function AdminSharedGoalsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shared Goals</h1>
          <p className="text-muted-foreground mt-1">Organization-wide goals pushed to multiple employees</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Create Shared Goal</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Shared Goals", value: sharedGoals.length, icon: Share2 },
          { label: "Employees Impacted", value: sharedGoals.reduce((a, g) => a + g.pushed_to, 0), icon: Users },
          { label: "Avg Weightage", value: `${Math.round(sharedGoals.reduce((a, g) => a + g.weightage, 0) / sharedGoals.length)}%`, icon: Target },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <div className="space-y-3">
        {sharedGoals.map(goal => (
          <Card key={goal.id} className="overflow-hidden">
            <div className="p-4 cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => setExpanded(expanded === goal.id ? null : goal.id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Share2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{goal.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-200">{goal.thrust_area}</Badge>
                      <span className="text-xs text-muted-foreground">{goal.department} · {goal.pushed_to} employees</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{goal.weightage}% weight</Badge>
                  {expanded === goal.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </div>
            {expanded === goal.id && (
              <div className="border-t bg-muted/30 p-4 space-y-3">
                <p className="text-sm">{goal.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground">Measurement</p><p className="font-medium">{goal.uom_type}</p></div>
                  <div><p className="text-xs text-muted-foreground">Target</p><p className="font-medium">{goal.target}</p></div>
                  <div><p className="text-xs text-muted-foreground">Pushed To</p><p className="font-medium">{goal.pushed_to} employees</p></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1 text-purple-600 border-purple-300 hover:bg-purple-50">
                    <Users className="h-3 w-3" /> Push to More
                  </Button>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
