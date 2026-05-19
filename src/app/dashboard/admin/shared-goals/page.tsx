"use client";
import { useState, useEffect, useCallback } from "react";
import { Share2, Plus, Users, Target, Loader2, X, Save, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

interface Profile { id: string; full_name: string; department: string | null; role: string; }
interface ThrustArea { id: string; name: string; }

function PushGoalModal({ open, onClose, onSave, userId }: { open: boolean; onClose: () => void; onSave: () => void; userId: string; }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [thrustAreas, setThrustAreas] = useState<ThrustArea[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [form, setForm] = useState({ title: "", description: "", thrust_area_id: "", uom_type: "timeline", target_value: "", target_date: "", department: "" });

  useEffect(() => {
    if (!open) return;
    Promise.all([
      supabase.from("profiles").select("id, full_name, department, role").eq("role", "employee").eq("is_active", true).order("full_name"),
      supabase.from("thrust_areas").select("id, name").eq("is_active", true),
    ]).then(([{ data: p }, { data: ta }]) => { setProfiles(p as Profile[] || []); setThrustAreas(ta as ThrustArea[] || []); });
  }, [open, supabase]);

  if (!open) return null;

  const filteredProfiles = form.department ? profiles.filter(p => p.department === form.department) : profiles;
  const departments = [...new Set(profiles.map(p => p.department).filter(Boolean))];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployees.length === 0) { setError("Select at least one employee"); return; }
    setLoading(true); setError(null);
    try {
      const { data: cycle } = await supabase.from("performance_cycles").select("id").eq("status", "active").order("created_at", { ascending: true }).limit(1).then(r => ({ data: r.data?.[0] ?? null }));
      if (!cycle) throw new Error("No active cycle");

      for (const empId of selectedEmployees) {
        let { data: sheet } = await supabase.from("goal_sheets").select("id, status, is_locked").eq("employee_id", empId).eq("cycle_id", cycle.id).order("created_at", { ascending: false }).limit(1).then(r => ({ data: r.data?.[0] ?? null }));
        if (!sheet) {
          const { data: newSheet } = await supabase.from("goal_sheets").insert({ employee_id: empId, cycle_id: cycle.id, status: "draft" }).select().single();
          sheet = newSheet;
        }
        if (!sheet || sheet.is_locked) continue;

        await supabase.from("goals").insert({
          goal_sheet_id: sheet.id,
          title: form.title,
          description: form.description || null,
          thrust_area_id: form.thrust_area_id || null,
          uom_type: form.uom_type,
          target_value: form.target_value ? parseFloat(form.target_value) : null,
          target_date: form.target_date || null,
          weightage: 10,
          is_shared: true,
          shared_owner_id: userId,
          is_title_locked: true,
          is_target_locked: true,
        });

        await supabase.from("notifications").insert({
          user_id: empId,
          title: "New shared goal assigned",
          message: `A shared goal "${form.title}" has been assigned to you. You may adjust its weightage only.`,
          type: "info",
          is_read: false,
        });
      }
      onSave(); onClose();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to push goal"); }
    finally { setLoading(false); }
  };

  const toggleEmployee = (id: string) => setSelectedEmployees(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelectedEmployees(selectedEmployees.length === filteredProfiles.length ? [] : filteredProfiles.map(p => p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-xl border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center"><Share2 className="h-5 w-5 text-primary" /></div>
            <h2 className="font-bold text-base">Push Shared Goal</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Goal Title * (read-only for recipients)</label>
            <input className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g., Achieve ISO 27001 Compliance" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Thrust Area</label>
              <select className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.thrust_area_id} onChange={e => setForm(p => ({ ...p, thrust_area_id: e.target.value }))}>
                <option value="">Select…</option>
                {thrustAreas.map(ta => <option key={ta.id} value={ta.id}>{ta.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Measurement *</label>
              <select className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.uom_type} onChange={e => setForm(p => ({ ...p, uom_type: e.target.value }))} required>
                <option value="timeline">Timeline</option>
                <option value="min_numeric">Numeric ↑</option>
                <option value="max_numeric">Numeric ↓</option>
                <option value="min_percent">Percent ↑</option>
                <option value="zero">Zero = Success</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target Value (locked)</label>
              <input type="number" className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.target_value} onChange={e => setForm(p => ({ ...p, target_value: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target Date</label>
              <input type="date" className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.target_date} onChange={e => setForm(p => ({ ...p, target_date: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select Recipients ({selectedEmployees.length} selected)</label>
              <div className="flex gap-2">
                <select className="text-xs rounded-lg border px-2 py-1" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}>
                  <option value="">All departments</option>
                  {departments.map(d => <option key={d!} value={d!}>{d}</option>)}
                </select>
                <button type="button" onClick={toggleAll} className="text-xs text-primary hover:underline font-medium">
                  {selectedEmployees.length === filteredProfiles.length ? "Deselect all" : "Select all"}
                </button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto border rounded-xl divide-y">
              {filteredProfiles.map(p => (
                <label key={p.id} className="flex items-center gap-3 p-3 hover:bg-accent/30 cursor-pointer">
                  <input type="checkbox" className="rounded" checked={selectedEmployees.includes(p.id)} onChange={() => toggleEmployee(p.id)} />
                  <div>
                    <p className="text-sm font-medium">{p.full_name}</p>
                    <p className="text-xs text-muted-foreground">{p.department || "—"}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 rounded-xl gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Push to {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SharedGoalsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [sharedGoals, setSharedGoals] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("goals").select("*, thrust_area:thrust_areas(name), goal_sheet:goal_sheets(employee:profiles!goal_sheets_employee_id_fkey(full_name, department))").eq("is_shared", true).order("created_at", { ascending: false });
    setSharedGoals(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  // Group by title
  const grouped = sharedGoals.reduce((acc: Record<string, Record<string, unknown>[]>, g) => {
    const key = g.title as string;
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

  return (
    <div className="space-y-6 page-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shared Goals</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Push departmental KPIs to multiple employees at once</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" /> Push Shared Goal
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="gradient-card border-primary/8"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{Object.keys(grouped).length}</p><p className="text-xs text-muted-foreground mt-1">Unique Goals</p></CardContent></Card>
        <Card className="gradient-card border-primary/8"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{sharedGoals.length}</p><p className="text-xs text-muted-foreground mt-1">Total Assignments</p></CardContent></Card>
        <Card className="gradient-card border-primary/8"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{[...new Set(sharedGoals.map(g => ((g.goal_sheet as Record<string, unknown>)?.employee as Record<string, unknown>)?.full_name))].length}</p><p className="text-xs text-muted-foreground mt-1">Employees</p></CardContent></Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <Card className="border-dashed"><CardContent className="p-12 text-center"><Share2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" /><p className="font-semibold text-lg">No shared goals yet</p><p className="text-muted-foreground text-sm mt-1">Push a departmental KPI to multiple employees.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([title, instances]) => (
            <Card key={title} className="overflow-hidden">
              <div className="p-4 cursor-pointer hover:bg-accent/20" onClick={() => setExpanded(expanded === title ? null : title)}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0"><Share2 className="h-4 w-4 text-violet-600" /></div>
                  <div className="flex-1">
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{instances.length} employee{instances.length !== 1 ? "s" : ""} assigned</p>
                  </div>
                  {expanded === title ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
              {expanded === title && (
                <div className="border-t p-4 space-y-2">
                  {instances.map((g, i) => {
                    const sheet = g.goal_sheet as Record<string, unknown> | null;
                    const emp = sheet?.employee as { full_name: string; department: string | null } | null;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{emp?.full_name?.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium">{emp?.full_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{emp?.department || "—"} · Weight: {g.weightage as number}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {user && <PushGoalModal open={showModal} onClose={() => setShowModal(false)} onSave={loadData} userId={user.id} />}
    </div>
  );
}
