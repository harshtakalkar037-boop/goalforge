"use client";

import { useState } from "react";
import { Target, Plus, Edit2, Trash2, ChevronDown, ChevronUp, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WeightageIndicator } from "@/components/goals/weightage-indicator";

const mockGoals = [
  {
    id: "1", title: "Increase customer satisfaction score", description: "Achieve CSAT score of 4.5/5 or higher across all support tickets by end of FY",
    uom_type: "min_numeric", target_value: 4.5, weightage: 30, status: "approved", progress: 82,
    thrust_area: "Customer Experience", is_shared: false,
  },
  {
    id: "2", title: "Complete AWS Solutions Architect certification", description: "Pass AWS SAA-C03 exam and get certified before Q3",
    uom_type: "timeline", target_value: null, weightage: 20, status: "approved", progress: 55,
    thrust_area: "Learning & Development", is_shared: false,
  },
  {
    id: "3", title: "Reduce open bug backlog by 40%", description: "Triage and resolve all P1/P2 bugs; reduce total open count from 250 to 150",
    uom_type: "max_numeric", target_value: 150, weightage: 25, status: "approved", progress: 91,
    thrust_area: "Quality", is_shared: true,
  },
  {
    id: "4", title: "Deliver onboarding module revamp", description: "Redesign and launch the new employee onboarding experience with LMS integration",
    uom_type: "timeline", target_value: null, weightage: 25, status: "submitted", progress: 30,
    thrust_area: "Organizational Effectiveness", is_shared: false,
  },
];

const statusColor: Record<string, string> = {
  approved: "bg-green-100 text-green-700 border-green-200",
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

export default function EmployeeGoalsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const totalWeightage = mockGoals.reduce((a, g) => a + g.weightage, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Goals</h1>
          <p className="text-muted-foreground mt-1">FY 2025–26 · Manage and track your performance goals</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Goal
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <WeightageIndicator current={totalWeightage} required={100} goalCount={mockGoals.length} maxGoals={8} />
          {totalWeightage === 100 && (
            <div className="flex items-center gap-2 mt-3 text-green-700 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Goal sheet ready for submission — weightage totals 100%</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {mockGoals.map((goal) => (
          <Card key={goal.id} className="overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-accent/20 transition-colors"
              onClick={() => setExpanded(expanded === goal.id ? null : goal.id)}
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-sm">{goal.title}</p>
                    <Badge variant="outline" className={`text-xs ${statusColor[goal.status]}`}>{goal.status}</Badge>
                    {goal.is_shared && <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-200">Shared</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span>{goal.thrust_area}</span>
                    <span>Weight: <strong>{goal.weightage}%</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={goal.progress} className="h-1.5 flex-1" />
                    <span className={`text-xs font-bold shrink-0 ${goal.progress >= 80 ? "text-green-600" : goal.progress >= 60 ? "text-yellow-600" : "text-orange-600"}`}>
                      {goal.progress}%
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-muted-foreground">
                  {expanded === goal.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </div>

            {expanded === goal.id && (
              <div className="border-t bg-muted/30 p-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm">{goal.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Measurement Type</p>
                    <p>{goal.uom_type.replace(/_/g, " ")}</p>
                  </div>
                  {goal.target_value && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Target Value</p>
                      <p>{goal.target_value}</p>
                    </div>
                  )}
                </div>
                {goal.status === "draft" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Edit2 className="h-3 w-3" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                )}
                {goal.status === "approved" && (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Clock className="h-4 w-4" />
                    <span>Q2 check-in due: Oct 15, 2025</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {mockGoals.filter(g => g.status === "draft").length === 0 && totalWeightage === 100 && (
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center">
            <Button size="lg" className="w-full max-w-xs">Submit Goal Sheet for Approval</Button>
            <p className="text-xs text-muted-foreground mt-2">Once submitted, goals will be sent to your manager for review</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
