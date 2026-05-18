"use client";

import { useState, useEffect, useCallback } from "react";
import { Target, TrendingUp, Users, Plus, ChevronDown, ChevronUp, Loader2, X, Save, AlertCircle, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

interface Objective {
  id: string;
  title: string;
  description: string | null;
  owner_id: string | null;
  target_value: number | null;
  current_value: number | null;
  progress: number | null;
  status: string | null;
  due_date: string | null;
  department: string | null;
  cycle_id: string | null;
  created_by: string | null;
  created_at: string;
  owner?: { full_name: string } | null;
}

const statusStyles: Record<string, string> = {
  on_track: "badge-success",
  at_risk: "badge-danger",
  completed: "badge-info",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  behind: "badge-warning",
};

function ObjectiveModal({ open, onClose, onSave, edit, userId }: {
  open: boolean; onClose: () => void; onSave: () => void;
  edit?: Objective | null; userId: string;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", status: "draft", target_value: "", current_value: "0", due_date: "", department: "" });

  useEffect(() => {
    if (edit) {
      setForm({
        title: edit.title,
        description: edit.description || "",
        status: edit.status || "draft",
        target_value: edit.target_value?.toString() || "",
        current_value: edit.current_value?.toString() || "0",
        due_date: edit.due_date || "",
        department: edit.department || "",
      });
    } else {
      setForm({ title: "", description: "", status: "draft", target_value: "", current_value: "0", due_date: "", department: "" });
    }
    setError(null);
  }, [edit, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const progress = form.target_value && parseFloat(form.target_value) > 0
        ? Math.min(100, Math.round((parseFloat(form.current_value) / parseFloat(form.target_value)) * 100))
        : 0;
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        target_value: form.target_value ? parseFloat(form.target_value) : null,
        current_value: parseFloat(form.current_value) || 0,
        progress,
        due_date: form.due_date || null,
        department: form.department.trim() || null,
        owner_id: userId,
        created_by: userId,
      };
      if (edit) {
        const { error: err } = await supabase.from("company_objectives").update(payload).eq("id", edit.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("company_objectives").insert(payload);
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
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-base font-bold">{edit ? "Edit Objective" : "New Company Objective"}</h2>
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
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Objective Title *</label>
            <input className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="e.g., Achieve ISO 27001 Compliance" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
            <textarea className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all min-h-[72px] resize-none" placeholder="Describe this company-wide objective…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Department</label>
              <input className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" placeholder="e.g., Engineering" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
              <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="on_track">On Track</option>
                <option value="at_risk">At Risk</option>
                <option value="behind">Behind</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target Value</label>
              <input type="number" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" placeholder="100" value={form.target_value} onChange={e => setForm(p => ({ ...p, target_value: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current Value</label>
              <input type="number" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" placeholder="0" value={form.current_value} onChange={e => setForm(p => ({ ...p, current_value: e.target.value }))} />
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
              {edit ? "Update" : "Create Objective"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ObjectivesPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editObj, setEditObj] = useState<Objective | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("company_objectives")
      .select("*, owner:profiles!company_objectives_owner_id_fkey(full_name)")
      .order("created_at", { ascending: false });
    setObjectives(data as Objective[] || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const canManage = user?.role === "admin" || user?.role === "manager";

  const stats = [
    { label: "Total", value: objectives.length, color: "text-primary" },
    { label: "On Track", value: objectives.filter(o => o.status === "on_track").length, color: "text-green-600" },
    { label: "At Risk", value: objectives.filter(o => o.status === "at_risk" || o.status === "behind").length, color: "text-red-600" },
    { label: "Completed", value: objectives.filter(o => o.status === "completed").length, color: "text-blue-600" },
  ];

  return (
    <div className="space-y-6 page-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Company Objectives</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Organization-wide OKRs · FY 2025–26</p>
        </div>
        {canManage && (
          <Button className="gap-2 rounded-xl shadow-sm" onClick={() => { setEditObj(null); setShowModal(true); }}>
            <Plus className="h-4 w-4" /> New Objective
          </Button>
        )}
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
      ) : objectives.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-primary/50" />
            </div>
            <p className="font-semibold text-lg">No objectives yet</p>
            <p className="text-muted-foreground text-sm mt-1">{canManage ? "Create the first company objective to align your team." : "No objectives have been defined yet."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {objectives.map(obj => (
            <Card key={obj.id} className={`overflow-hidden transition-shadow hover:shadow-md ${obj.status === "at_risk" || obj.status === "behind" ? "border-red-200" : obj.status === "completed" ? "border-blue-200" : ""}`}>
              <div className="p-5 cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => setExpanded(expanded === obj.id ? null : obj.id)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold">{obj.title}</p>
                        <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[obj.status || "draft"] || statusStyles.draft}`}>
                          {(obj.status || "draft").replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        {obj.owner && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{(obj.owner as { full_name: string }).full_name}</span>}
                        {obj.department && <span>{obj.department}</span>}
                        {obj.due_date && <span>Due: {new Date(obj.due_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={obj.progress || 0} className="h-2 flex-1" />
                        <span className={`text-sm font-bold shrink-0 ${(obj.progress || 0) >= 70 ? "text-green-600" : (obj.progress || 0) >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                          {obj.progress || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-muted-foreground mt-1">
                    {expanded === obj.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>
              {expanded === obj.id && (
                <div className="border-t bg-accent/20 p-5 space-y-4">
                  {obj.description && <p className="text-sm">{obj.description}</p>}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Current Value</p><p className="font-semibold">{obj.current_value ?? "—"}</p></div>
                    <div><p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Target Value</p><p className="font-semibold">{obj.target_value ?? "—"}</p></div>
                    <div><p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">Progress</p><p className="font-semibold">{obj.progress || 0}%</p></div>
                  </div>
                  {canManage && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2 rounded-xl" onClick={() => { setEditObj(obj); setShowModal(true); }}>
                        <Edit2 className="h-3 w-3" /> Edit Objective
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {user && (
        <ObjectiveModal
          open={showModal}
          onClose={() => { setShowModal(false); setEditObj(null); }}
          onSave={loadData}
          edit={editObj}
          userId={user.id}
        />
      )}
    </div>
  );
}
