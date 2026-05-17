"use client";

import { useState } from "react";
import { ClipboardCheck, CheckCircle, XCircle, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const pendingSheets = [
  {
    id: "1", employee: "Anita Desai", designation: "Product Designer", submitted: "2025-10-13",
    goals: [
      { title: "Redesign design system components", weightage: 35, uom: "Timeline", target: "Dec 2025" },
      { title: "Conduct 10 user research sessions", weightage: 25, uom: "Min Numeric", target: "10" },
      { title: "Reduce design-to-dev handoff time", weightage: 25, uom: "Max Percent", target: "20%" },
      { title: "Create accessibility audit report", weightage: 15, uom: "Timeline", target: "Nov 2025" },
    ],
  },
  {
    id: "2", employee: "Suresh Kumar", designation: "Backend Developer", submitted: "2025-10-10",
    goals: [
      { title: "Migrate legacy APIs to microservices", weightage: 40, uom: "Min Percent", target: "80%" },
      { title: "Improve API response time", weightage: 30, uom: "Max Numeric", target: "200ms" },
      { title: "Write unit tests for core modules", weightage: 20, uom: "Min Percent", target: "85%" },
      { title: "Document all new services", weightage: 10, uom: "Timeline", target: "Nov 2025" },
    ],
  },
  {
    id: "3", employee: "Vikram Nair", designation: "DevOps Engineer", submitted: "2025-10-14",
    goals: [
      { title: "Implement CI/CD pipeline for 5 services", weightage: 35, uom: "Min Numeric", target: "5" },
      { title: "Reduce deployment failures by 60%", weightage: 35, uom: "Max Percent", target: "60%" },
      { title: "Set up monitoring and alerting", weightage: 30, uom: "Timeline", target: "Oct 2025" },
    ],
  },
];

export default function ManagerApprovalsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState<Record<string, string>>({});
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [approved, setApproved] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const active = pendingSheets.filter(s => !approved.includes(s.id) && !rejected.includes(s.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Goal Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve your team's goal sheets</p>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="flex items-center gap-1 text-orange-700"><ClipboardCheck className="h-4 w-4" />{active.length} pending</span>
        <span className="flex items-center gap-1 text-green-700"><CheckCircle className="h-4 w-4" />{approved.length} approved</span>
        <span className="flex items-center gap-1 text-red-700"><XCircle className="h-4 w-4" />{rejected.length} rejected</span>
      </div>

      {active.length === 0 && (
        <Card><CardContent className="p-10 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <p className="font-semibold">All caught up!</p>
          <p className="text-muted-foreground text-sm">No pending approvals at this time.</p>
        </CardContent></Card>
      )}

      <div className="space-y-4">
        {active.map(sheet => (
          <Card key={sheet.id}>
            <div
              className="p-4 cursor-pointer hover:bg-accent/20 transition-colors"
              onClick={() => setExpanded(expanded === sheet.id ? null : sheet.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{sheet.employee.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{sheet.employee}</p>
                    <p className="text-xs text-muted-foreground">{sheet.designation} · {sheet.goals.length} goals · submitted {sheet.submitted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">Pending Review</Badge>
                  {expanded === sheet.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </div>

            {expanded === sheet.id && (
              <div className="border-t">
                <div className="p-4 bg-muted/30 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Goals</p>
                  {sheet.goals.map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border text-sm">
                      <div>
                        <p className="font-medium">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{g.uom} · Target: {g.target}</p>
                      </div>
                      <Badge variant="outline">{g.weightage}%</Badge>
                    </div>
                  ))}
                </div>

                {rejecting === sheet.id && (
                  <div className="p-4 border-t space-y-3">
                    <p className="text-sm font-medium">Reason for rejection</p>
                    <Textarea
                      placeholder="Explain why the goal sheet needs revision..."
                      value={rejectionNote[sheet.id] || ""}
                      onChange={e => setRejectionNote(prev => ({ ...prev, [sheet.id]: e.target.value }))}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" onClick={() => { setRejected(prev => [...prev, sheet.id]); setRejecting(null); }}>
                        Confirm Rejection
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setRejecting(null)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {rejecting !== sheet.id && (
                  <div className="p-4 border-t flex gap-3">
                    <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => setApproved(prev => [...prev, sheet.id])}>
                      <CheckCircle className="h-4 w-4" /> Approve Goals
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 text-red-600 border-red-300 hover:bg-red-50" onClick={() => setRejecting(sheet.id)}>
                      <XCircle className="h-4 w-4" /> Reject with Note
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
