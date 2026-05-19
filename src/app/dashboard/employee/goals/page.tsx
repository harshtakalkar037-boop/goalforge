"use client";

import { useState, useEffect, useCallback } from "react";
import { Target, Plus, Edit2, Trash2, ChevronDown, ChevronUp, CheckCircle2, Clock, Loader2, AlertCircle, X, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WeightageIndicator } from "@/components/goals/weightage-indicator";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import type { Goal, GoalSheet, ThrustArea, PerformanceCycle } from "@/lib/types";

const UOM_LABELS: Record<string, string> = {
  min_numeric: "Minimum Numeric",
  max_numeric: "Maximum Numeric",
  min_percent: "Minimum Percent",
  max_percent: "Maximum Percent",
  timeline: "Timeline / Milestone",
  zero: "Zero Defects",
};

const statusStyles: Record<string, string> = {
  approved: "badge-success",
  submitted: "badge-info",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  rejected: "badge-danger",
};

function GoalFormModal({ open, onClose, onSave, goalSheet, thrustAreas, editGoal }: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  goalSheet: GoalSheet | null;
  thrustAreas: ThrustArea[];
  editGoal?: Goal | null;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    thrust_area_id: "",
    uom_type: "timeline" as string,
    target_value: "",
    target_date: "",
    weightage: "10",
  });

  useEffect(() => {
    if (editGoal) {
      setForm({
        title: editGoal.title,
        description: editGoal.description || "",
        thrust_area_id: editGoal.thrust_area_id || "",
        uom_type: editGoal.uom_type,
        target_value: editGoal.target_value?.toString() || "",
        target_date: editGoal.target_date || "",
        weightage: editGoal.weightage.toString(),
      });
    } else {
      setForm({ title: "", description: "", thrust_area_id: "", uom_type: "timeline", target_value: "", target_date: "", weightage: "10" });
    }
    setError(null);
  }, [editGoal, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalSheet) { setError("Goal sheet not loaded yet — please wait a moment and try again."); return; }
    if (goalSheet.status !== "draft") { setError("Your goal sheet is " + goalSheet.status + " and cannot be edited. Contact your admin to unlock."); return; }
    setLoading(true); setError(null);
    try {
      const payload: Record<string, unknown> = {
        goal_sheet_id: goalSheet.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        thrust_area_id: form.thrust_area_id || null,
        uom_type: form.uom_type,
        target_value: form.target_value ? parseFloat(form.target_value) : null,
        target_date: form.target_date || null,
        weightage: parseInt(form.weightage),
        sort_order: 0,
      };
      if (editGoal) {
        const { error: err } = await supabase.from("goals").update(payload).eq("id", editGoal.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("goals").insert(payload);
        if (err) throw err;
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold">{editGoal ? "Edit Goal" : "Add New Goal"}</h2>
              <p className="text-xs text-muted-foreground">FY 2025–26 Goal Sheet</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 hover:bg-accent transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Goal Title *</label>
            <input
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="e.g., Achieve CSAT score of 4.5+"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
            <textarea
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all min-h-[80px] resize-none"
              placeholder="Describe how you'll achieve this goal…"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Thrust Area</label>
              <select
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={form.thrust_area_id}
                onChange={e => setForm(p => ({ ...p, thrust_area_id: e.target.value }))}
              >
                <option value="">Select area…</option>
                {thrustAreas.map(ta => <option key={ta.id} value={ta.id}>{ta.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Measurement *</label>
              <select
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={form.uom_type}
                onChange={e => setForm(p => ({ ...p, uom_type: e.target.value }))}
                required
              >
                {Object.entries(UOM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {form.uom_type !== "timeline" && form.uom_type !== "zero" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target Value</label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  placeholder="e.g., 4.5"
                  value={form.target_value}
                  onChange={e => setForm(p => ({ ...p, target_value: e.target.value }))}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target Date</label>
              <input
                type="date"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={form.target_date}
                onChange={e => setForm(p => ({ ...p, target_date: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Weightage</label>
              <span className="text-sm font-bold text-primary">{form.weightage}%</span>
            </div>
            <input
              type="range"
              min="10" max="100" step="10"
              className="w-full accent-primary"
              value={form.weightage}
              onChange={e => setForm(p => ({ ...p, weightage: e.target.value }))}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10%</span><span>50%</span><span>100%</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 rounded-xl gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editGoal ? "Update Goal" : "Add Goal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EmployeeGoalsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalSheet, setGoalSheet] = useState<GoalSheet | null>(null);
  const [thrustAreas, setThrustAreas] = useState<ThrustArea[]>([]);
  const [cycle, setCycle] = useState<PerformanceCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get active cycle
      const { data: cycleRows } = await supabase
        .from("performance_cycles")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: true })
        .limit(1);
      const cycleData = cycleRows?.[0] ?? null;
      setCycle(cycleData);

      // Get or create goal sheet
      let sheet: GoalSheet | null = null;
      if (cycleData) {
        // Fetch sheet - prefer approved > submitted > draft
        const { data: sheetRows } = await supabase
          .from("goal_sheets")
          .select("*")
          .eq("employee_id", user.id)
          .eq("cycle_id", cycleData.id)
          .order("created_at", { ascending: false });
        
        if (sheetRows && sheetRows.length > 0) {
          // Pick best status: approved first, then submitted, then draft
          const priority = ["approved", "submitted", "draft"];
          const sorted = [...sheetRows].sort((a, b) => 
            priority.indexOf(a.status) - priority.indexOf(b.status)
          );
          sheet = sorted[0];
        } else {
          // Create new draft sheet
          const { data: newSheet } = await supabase
            .from("goal_sheets")
            .insert({ employee_id: user.id, cycle_id: cycleData.id, status: "draft" })
            .select()
            .single();
          sheet = newSheet;
        }
      }
      setGoalSheet(sheet);

      // Get goals for this sheet
      if (sheet) {
        const { data: goalsData } = await supabase
          .from("goals")
          .select("*, thrust_area:thrust_areas(*)")
          .eq("goal_sheet_id", sheet.id)
          .order("sort_order");
        setGoals(goalsData as Goal[] || []);
      }

      // Get thrust areas
      const { data: taData } = await supabase
        .from("thrust_areas")
        .select("*")
        .eq("is_active", true)
        .order("name");
      setThrustAreas(taData as ThrustArea[] || []);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (goalId: string) => {
    if (!confirm("Delete this goal?")) return;
    await supabase.from("goals").delete().eq("id", goalId);
    await loadData();
  };

  const handleSubmitSheet = async () => {
    if (!goalSheet) return;
    setSubmitting(true);
    await supabase.from("goal_sheets").update({ status: "submitted", submitted_at: new Date().toISOString() }).eq("id", goalSheet.id);
    await loadData();
    setSubmitting(false);
  };

  const totalWeightage = goals.reduce((a, g) => a + g.weightage, 0);
  const sheetStatus = goalSheet?.status || "draft";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your goals…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Goals</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {cycle ? `${cycle.name} · ${cycle.financial_year}` : "No active cycle"} · Manage your performance goals
          </p>
        </div>
        {sheetStatus === "draft" && (
          <Button
            className="gap-2 rounded-xl shadow-sm"
            onClick={() => { setEditGoal(null); setShowModal(true); }}
            >
            <Plus className="h-4 w-4" /> Add Goal
          </Button>
        )}
      </div>

      {/* Weightage card */}
      <Card className="gradient-card border-primary/10">
        <CardContent className="p-5">
          <WeightageIndicator current={totalWeightage} required={100} goalCount={goals.length} maxGoals={8} />
          {totalWeightage === 100 && (
            <div className="flex items-center gap-2 mt-3 text-green-700 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Goal sheet ready for submission — weightage totals 100%
            </div>
          )}
          {totalWeightage > 100 && (
            <div className="flex items-center gap-2 mt-3 text-red-600 text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              Total weightage exceeds 100%. Please adjust before submitting.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals list */}
      {goals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-primary/50" />
            </div>
            <p className="font-semibold text-lg">No goals yet</p>
            <p className="text-muted-foreground text-sm mt-1">Click "Add Goal" to set your first performance goal for this cycle.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <div
                className="p-4 cursor-pointer hover:bg-accent/30 transition-colors"
                onClick={() => setExpanded(expanded === goal.id ? null : goal.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 border border-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <p className="font-semibold text-sm">{goal.title}</p>
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[sheetStatus] || statusStyles.draft}`}>
                        {sheetStatus}
                      </span>
                      {goal.is_shared && (
                        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border badge-purple">
                          Shared
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2.5">
                      {goal.thrust_area && <span className="font-medium">{(goal.thrust_area as ThrustArea).name}</span>}
                      <span>Weight: <strong className="text-foreground">{goal.weightage}%</strong></span>
                      <span>{UOM_LABELS[goal.uom_type]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={0} className="h-1.5 flex-1" />
                      <span className="text-xs font-bold text-muted-foreground shrink-0">—</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-muted-foreground mt-1">
                    {expanded === goal.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>

              {expanded === goal.id && (
                <div className="border-t bg-accent/20 p-4 space-y-4">
                  {goal.description && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Description</p>
                      <p className="text-sm">{goal.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Measurement Type</p>
                      <p className="font-medium">{UOM_LABELS[goal.uom_type]}</p>
                    </div>
                    {goal.target_value != null && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Target Value</p>
                        <p className="font-medium">{goal.target_value}</p>
                      </div>
                    )}
                    {goal.target_date && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Target Date</p>
                        <p className="font-medium">{new Date(goal.target_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                    )}
                  </div>
                  {sheetStatus === "draft" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2 rounded-xl" onClick={() => { setEditGoal(goal); setShowModal(true); }}>
                        <Edit2 className="h-3 w-3" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2 rounded-xl text-red-600 hover:text-red-700 hover:border-red-300" onClick={() => handleDelete(goal.id)}>
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  )}
                  {sheetStatus === "approved" && (
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Clock className="h-4 w-4" />
                      <span>Goal approved — check-ins available after cycle starts</span>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Submit button */}
      {sheetStatus === "draft" && goals.length > 0 && totalWeightage === 100 && (
        <Card className="border-primary/20 bg-primary/3">
          <CardContent className="p-5 text-center">
            <Button size="lg" className="rounded-xl gap-2 px-8 shadow-sm glow-primary" onClick={handleSubmitSheet} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Submit Goal Sheet for Approval
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Goals will be sent to your manager for review</p>
          </CardContent>
        </Card>
      )}

      <GoalFormModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditGoal(null); }}
        onSave={loadData}
        goalSheet={goalSheet}
        thrustAreas={thrustAreas}
        editGoal={editGoal}
      />
    </div>
  );
}
