"use client";

import { MessageSquare, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const teamCheckins = [
  {
    id: "1", employee: "Priya Sharma", goal: "Increase system uptime to 99.9%", quarter: "Q2",
    planned: "99.9%", actual: "99.95%", progress: 100, status: "completed",
    employee_comment: "Achieved through better monitoring and proactive alerting.",
    manager_reviewed: false,
  },
  {
    id: "2", employee: "Ravi Menon", goal: "Reduce test execution time by 30%", quarter: "Q2",
    planned: "30%", actual: "28%", progress: 93, status: "on_track",
    employee_comment: "Parallel test execution implemented. Minor gap remaining.",
    manager_reviewed: false,
  },
  {
    id: "3", employee: "Meena Joshi", goal: "Build 3 automated dashboards", quarter: "Q2",
    planned: "3", actual: "3", progress: 100, status: "completed",
    employee_comment: "All 3 dashboards live and actively used by leadership.",
    manager_reviewed: true,
  },
  {
    id: "4", employee: "Lalita Rao", goal: "Complete process mapping for 5 departments", quarter: "Q2",
    planned: "5", actual: "3", progress: 60, status: "on_track",
    employee_comment: "2 more departments scheduled for next week.",
    manager_reviewed: false,
  },
];

export default function ManagerTeamCheckinsPage() {
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState<string[]>(teamCheckins.filter(c => c.manager_reviewed).map(c => c.id));

  const pending = teamCheckins.filter(c => !reviewed.includes(c.id));
  const done = teamCheckins.filter(c => reviewed.includes(c.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Check-ins</h1>
        <p className="text-muted-foreground mt-1">Review and comment on your team's Q2 progress submissions</p>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="flex items-center gap-1 text-orange-700"><Clock className="h-4 w-4" />{pending.length} pending review</span>
        <span className="flex items-center gap-1 text-green-700"><CheckCircle2 className="h-4 w-4" />{done.length} reviewed</span>
      </div>

      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-orange-700 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Awaiting Your Review</h2>
          {pending.map(checkin => (
            <Card key={checkin.id} className="border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{checkin.employee}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{checkin.goal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{checkin.progress}%</p>
                    <Badge variant="outline" className={`text-xs ${checkin.status === "completed" ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}`}>
                      {checkin.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <Progress value={checkin.progress} className="h-2 mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground">Quarter</p><p className="font-medium">{checkin.quarter}</p></div>
                  <div><p className="text-xs text-muted-foreground">Planned</p><p className="font-medium">{checkin.planned}</p></div>
                  <div><p className="text-xs text-muted-foreground">Actual</p><p className="font-medium">{checkin.actual}</p></div>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Employee Comments</p>
                  <p className="text-sm">{checkin.employee_comment}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Your Feedback</p>
                  <Textarea
                    placeholder="Add feedback for the employee..."
                    value={feedback[checkin.id] || ""}
                    onChange={e => setFeedback(prev => ({ ...prev, [checkin.id]: e.target.value }))}
                    rows={2}
                    className="text-sm resize-none"
                  />
                </div>
                <Button size="sm" className="gap-2" onClick={() => setReviewed(prev => [...prev, checkin.id])}>
                  <CheckCircle2 className="h-4 w-4" /> Mark as Reviewed
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-green-700 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Reviewed</h2>
          {done.map(checkin => (
            <Card key={checkin.id} className="border-green-200 bg-green-50/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{checkin.employee}</p>
                  <p className="text-xs text-muted-foreground">{checkin.goal}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-green-700">{checkin.progress}%</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs">Reviewed</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
