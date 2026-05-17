"use client";

import { useState } from "react";
import { CheckSquare, TrendingUp, MessageSquare, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const quarters = ["Q1", "Q2", "Q3", "Q4"];

const checkins = [
  {
    id: "1", goal_title: "Increase customer satisfaction score",
    quarter: "Q1", status: "completed", progress_score: 88,
    planned_value: 4.2, actual_value: 4.4, employee_comments: "Achieved 4.4 CSAT this quarter through new response templates.",
    manager_comments: "Great work! Keep maintaining this standard.", manager_reviewed: true,
  },
  {
    id: "2", goal_title: "Increase customer satisfaction score",
    quarter: "Q2", status: "on_track", progress_score: 82,
    planned_value: 4.3, actual_value: 4.35, employee_comments: "",
    manager_comments: "", manager_reviewed: false,
  },
  {
    id: "3", goal_title: "Reduce open bug backlog by 40%",
    quarter: "Q1", status: "completed", progress_score: 95,
    planned_value: 200, actual_value: 188, employee_comments: "Closed 62 bugs this quarter ahead of schedule.",
    manager_comments: "Exceptional output. Carry this momentum.", manager_reviewed: true,
  },
  {
    id: "4", goal_title: "Reduce open bug backlog by 40%",
    quarter: "Q2", status: "not_started", progress_score: 0,
    planned_value: 150, actual_value: null, employee_comments: "",
    manager_comments: "", manager_reviewed: false,
  },
];

const statusColor: Record<string, string> = {
  completed: "bg-green-100 text-green-700 border-green-200",
  on_track: "bg-yellow-100 text-yellow-700 border-yellow-200",
  not_started: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function EmployeeCheckinsPage() {
  const [activeQ, setActiveQ] = useState("Q2");
  const [actualValues, setActualValues] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const qCheckins = checkins.filter(c => c.quarter === activeQ);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Check-ins</h1>
        <p className="text-muted-foreground mt-1">Record quarterly progress against your goals</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {quarters.map(q => {
          const qData = checkins.filter(c => c.quarter === q);
          const avgScore = qData.length ? Math.round(qData.reduce((a, c) => a + c.progress_score, 0) / qData.length) : 0;
          const allDone = qData.length > 0 && qData.every(c => c.status !== "not_started");
          return (
            <button
              key={q}
              onClick={() => setActiveQ(q)}
              className={`p-4 rounded-xl border text-left transition-all ${activeQ === q ? "border-primary bg-primary/10 shadow-sm" : "hover:bg-accent"}`}
            >
              <p className="font-bold text-lg">{q}</p>
              <p className="text-2xl font-bold text-primary">{avgScore}%</p>
              <p className="text-xs text-muted-foreground mt-1">{allDone ? "✓ Submitted" : "Pending"}</p>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{activeQ} Check-ins</h2>
        {qCheckins.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No check-ins for this quarter yet.</CardContent></Card>
        )}
        {qCheckins.map((checkin) => (
          <Card key={checkin.id} className={checkin.status === "completed" ? "border-green-200" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{checkin.goal_title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-xs ${statusColor[checkin.status]}`}>{checkin.status.replace(/_/g, " ")}</Badge>
                    {checkin.manager_reviewed && <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-200">Manager Reviewed</Badge>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{checkin.progress_score}%</p>
                  <p className="text-xs text-muted-foreground">score</p>
                </div>
              </div>
              <Progress value={checkin.progress_score} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Planned Value</Label>
                  <p className="font-semibold">{checkin.planned_value ?? "—"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Actual Value</Label>
                  {checkin.status === "not_started" ? (
                    <Input
                      type="number"
                      placeholder="Enter actual"
                      value={actualValues[checkin.id] || ""}
                      onChange={e => setActualValues(prev => ({ ...prev, [checkin.id]: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  ) : (
                    <p className="font-semibold">{checkin.actual_value ?? "—"}</p>
                  )}
                </div>
              </div>

              {checkin.employee_comments && (
                <div className="p-3 bg-muted/40 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Your Comments</p>
                  <p className="text-sm">{checkin.employee_comments}</p>
                </div>
              )}

              {checkin.status === "not_started" && (
                <div>
                  <Label className="text-xs text-muted-foreground">Add Comments</Label>
                  <Textarea
                    placeholder="Describe your progress, blockers, or notes for your manager..."
                    value={comments[checkin.id] || ""}
                    onChange={e => setComments(prev => ({ ...prev, [checkin.id]: e.target.value }))}
                    className="mt-1 text-sm resize-none"
                    rows={3}
                  />
                </div>
              )}

              {checkin.manager_comments && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Manager Feedback</p>
                  <p className="text-sm text-purple-900">{checkin.manager_comments}</p>
                </div>
              )}

              {checkin.status === "not_started" && (
                <Button size="sm" className="gap-2">
                  <Save className="h-4 w-4" /> Save Check-in
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
