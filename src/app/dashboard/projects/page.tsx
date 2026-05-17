"use client";

import { Briefcase, Plus, Users, Calendar, ChevronDown, ChevronUp, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const projects = [
  {
    id: "1", name: "Customer Portal Redesign", description: "Complete UX overhaul of the customer-facing portal with new design system.",
    owner: "Anita Desai", team: ["Anita D.", "Priya S.", "Arun P."], status: "active", priority: "high",
    progress: 72, due: "Dec 2025", linked_goals: 3,
  },
  {
    id: "2", name: "Microservices Migration", description: "Migrate legacy monolith to microservices architecture for scalability.",
    owner: "Suresh Kumar", team: ["Suresh K.", "Vikram N.", "Arun P."], status: "active", priority: "high",
    progress: 45, due: "Feb 2026", linked_goals: 5,
  },
  {
    id: "3", name: "ISO 27001 Audit Readiness", description: "Documentation, controls, and employee training for ISO certification.",
    owner: "Aditya Verma", team: ["Meena J.", "Lalita R.", "All Teams"], status: "active", priority: "critical",
    progress: 68, due: "Jan 2026", linked_goals: 14,
  },
  {
    id: "4", name: "Employee Onboarding LMS", description: "New LMS-integrated employee onboarding module with automated workflows.",
    owner: "Priya Sharma", team: ["Priya S.", "Anita D."], status: "on_hold", priority: "medium",
    progress: 30, due: "Mar 2026", linked_goals: 2,
  },
  {
    id: "5", name: "Q2 Sales Enablement", description: "Sales team enablement with new pitch decks, demo environments, and training.",
    owner: "Ravi Menon", team: ["Ravi M.", "Lalita R."], status: "completed", priority: "medium",
    progress: 100, due: "Oct 2025", linked_goals: 4,
  },
];

const priorityColor: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-gray-100 text-gray-600 border-gray-200",
};

const statusColor: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  on_hold: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
  planning: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function ProjectsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Track your current projects and their progress</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Project</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: projects.length, color: "text-primary" },
          { label: "Active", value: projects.filter(p => p.status === "active").length, color: "text-green-600" },
          { label: "On Hold", value: projects.filter(p => p.status === "on_hold").length, color: "text-yellow-600" },
          { label: "Completed", value: projects.filter(p => p.status === "completed").length, color: "text-blue-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="space-y-3">
        {projects.map(project => (
          <Card key={project.id} className={project.priority === "critical" ? "border-red-200" : ""}>
            <div className="p-4 cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => setExpanded(expanded === project.id ? null : project.id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold">{project.name}</p>
                      {project.priority === "critical" && <Flame className="h-3 w-3 text-red-500" />}
                      <Badge variant="outline" className={`text-xs ${statusColor[project.status]}`}>{project.status.replace("_", " ")}</Badge>
                      <Badge variant="outline" className={`text-xs ${priorityColor[project.priority]}`}>{project.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{project.owner}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due {project.due}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={project.progress} className="h-2 flex-1" />
                      <span className={`text-sm font-bold shrink-0 ${project.progress === 100 ? "text-blue-600" : project.progress >= 60 ? "text-green-600" : project.progress >= 40 ? "text-yellow-600" : "text-red-600"}`}>{project.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">{expanded === project.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
              </div>
            </div>
            {expanded === project.id && (
              <div className="border-t bg-muted/30 p-4 space-y-3">
                <p className="text-sm">{project.description}</p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Team Members</p>
                  <div className="flex flex-wrap gap-2">
                    {project.team.map(m => (
                      <span key={m} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{m}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{project.linked_goals} goals linked to this project</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit Project</Button>
                  <Button size="sm" variant="outline">View Goals</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
