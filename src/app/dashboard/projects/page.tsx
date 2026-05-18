"use client";

import { useState, useEffect, useCallback } from "react";
import { Briefcase, Plus, Users, Calendar, ChevronDown, ChevronUp, Flame, Loader2, X, Save, AlertCircle, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string | null;
  status: string | null;
  priority: string | null;
  progress: number | null;
  due_date: string | null;
  created_at: string;
  owner?: { full_name: string } | null;
}

const priorityStyles: Record<string, string> = {
  critical: "badge-danger",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "badge-warning",
  low: "bg-gray-100 text-gray-600 border-gray-200",
};

const statusStyles: Record<string, string> = {
  active: "badge-success",
  on_hold: "badge-warning",
  completed: "badge-info",
  planning: "bg-gray-100 text-gray-600 border-gray-200",
};

function ProjectModal({ open, onClose, onSave, edit, userId }: {
  open: boolean; onClose: () => void; onSave: () => void;
  edit?: Project | null; userId: string;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", status: "planning", priority: "medium", progress: "0", due_date: "" });

  useEffect(() => {
    if (edit) {
      setForm({ name: edit.name, description: edit.description || "", status: edit.status || "planning", priority: edit.priority || "medium", progress: edit.progress?.toString() || "0", due_date: edit.due_date || "" });
    } else {
      setForm({ name: "", description: "", status: "planning", priority: "medium", progress: "0", due_date: "" });
    }
    setError(null);
  }, [edit, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() || null, status: form.status, priority: form.priority, progress: parseFloat(form.progress) || 0, due_date: form.due_date || null, owner_id: userId };
      if (edit) {
        const { error: err } = await supabase.from("projects").update(payload).eq("id", edit.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("projects").insert(payload);
        if (err) throw err;
      }
      onSave(); onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg border">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-base font-bold">{edit ? "Edit Project" : "New Project"}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 hover:bg-accent transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project Name *</label>
            <input className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="e.g., Customer Portal Redesign" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
            <textarea className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all min-h-[72px] resize-none" placeholder="What does this project aim to achieve?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
              <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority</label>
              <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Progress</label>
                <span className="text-sm font-bold text-primary">{form.progress}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" className="w-full accent-primary" value={form.progress} onChange={e => setForm(p => ({ ...p, progress: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Due Date</label>
              <input type="date" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 rounded-xl gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {edit ? "Update" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editProj, setEditProj] = useState<Project | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*, owner:profiles!projects_owner_id_fkey(full_name)")
      .order("created_at", { ascending: false });
    setProjects(data as Project[] || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = [
    { label: "Total", value: projects.length, color: "text-primary" },
    { label: "Active", value: projects.filter(p => p.status === "active").length, color: "text-green-600" },
    { label: "On Hold", value: projects.filter(p => p.status === "on_hold").length, color: "text-yellow-600" },
    { label: "Completed", value: projects.filter(p => p.status === "completed").length, color: "text-blue-600" },
  ];

  return (
    <div className="space-y-6 page-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Track projects and their progress</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm" onClick={() => { setEditProj(null); setShowModal(true); }}>
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="gradient-card border-primary/8">
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-primary/50" />
            </div>
            <p className="font-semibold text-lg">No projects yet</p>
            <p className="text-muted-foreground text-sm mt-1">Create a project to start tracking team work and goals.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <Card key={project.id} className={`overflow-hidden transition-shadow hover:shadow-md ${project.priority === "critical" ? "border-red-200" : ""}`}>
              <div className="p-4 cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => setExpanded(expanded === project.id ? null : project.id)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <p className="font-semibold">{project.name}</p>
                        {project.priority === "critical" && <Flame className="h-3 w-3 text-red-500" />}
                        <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[project.status || "planning"]}`}>
                          {(project.status || "planning").replace("_", " ")}
                        </span>
                        <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityStyles[project.priority || "medium"]}`}>
                          {project.priority || "medium"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
                        {project.owner && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{(project.owner as { full_name: string }).full_name}</span>}
                        {project.due_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due {new Date(project.due_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={project.progress || 0} className="h-2 flex-1" />
                        <span className={`text-sm font-bold shrink-0 ${project.progress === 100 ? "text-blue-600" : (project.progress || 0) >= 60 ? "text-green-600" : (project.progress || 0) >= 30 ? "text-yellow-600" : "text-red-500"}`}>
                          {project.progress || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-muted-foreground mt-1">
                    {expanded === project.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>
              {expanded === project.id && (
                <div className="border-t bg-accent/20 p-4 space-y-3">
                  {project.description && <p className="text-sm">{project.description}</p>}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2 rounded-xl" onClick={() => { setEditProj(project); setShowModal(true); }}>
                      <Edit2 className="h-3 w-3" /> Edit Project
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {user && (
        <ProjectModal
          open={showModal}
          onClose={() => { setShowModal(false); setEditProj(null); }}
          onSave={loadData}
          edit={editProj}
          userId={user.id}
        />
      )}
    </div>
  );
}
