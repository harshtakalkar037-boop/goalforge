"use client";
import { useState, useEffect, useCallback } from "react";
import { CheckSquare, TrendingUp, MessageSquare, Save, Loader2, AlertCircle, Target, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import type { Goal, GoalSheet, PerformanceCycle, Checkin } from "@/lib/types";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;
type Quarter = typeof QUARTERS[number];

const UOM_FORMULA: Record<string, (actual: number, target: number, date?: string, deadline?: string) => number> = {
  min_numeric: (a, t) => t > 0 ? Math.min(100, Math.round((a / t) * 100)) : 0,
  max_numeric: (a, t) => a > 0 ? Math.min(100, Math.round((t / a) * 100)) : 0,
  min_percent: (a, t) => t > 0 ? Math.min(100, Math.round((a / t) * 100)) : 0,
  max_percent: (a, t) => a > 0 ? Math.min(100, Math.round((t / a) * 100)) : 0,
  timeline: (_, __, date, deadline) => {
    if (!date || !deadline) return 0;
    return new Date(date) <= new Date(deadline) ? 100 : 0;
  },
  zero: (a) => a === 0 ? 100 : 0,
};

function calcScore(uom: string, actual: number | null, target: number | null, date?: string | null, deadline?: string | null): number {
  if (actual === null) return 0;
  const fn = UOM_FORMULA[uom];
  if (!fn) return 0;
  return fn(actual, target || 0, date || undefined, deadline || undefined);
}

const UOM_LABELS: Record<string, string> = { min_numeric: "Numeric (↑ higher is better)", max_numeric: "Numeric (↓ lower is better)", min_percent: "% (↑ higher)", max_percent: "% (↓ lower)", timeline: "Timeline / Milestone", zero: "Zero = Success" };

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started", color: "bg-gray-100 text-gray-600 border-gray-200" },
  { value: "on_track", label: "On Track", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-700 border-green-200" },
];

interface GoalWithCheckin extends Goal {
  checkin?: Checkin;
}

export default function EmployeeCheckinsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [activeQ, setActiveQ] = useState<Quarter>("Q1");
  const [goals, setGoals] = useState<GoalWithCheckin[]>([]);
  const [sheet, setSheet] = useState<GoalSheet | null>(null);
  const [cycle, setCycle] = useState<PerformanceCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [localData, setLocalData] = useState<Record<string, { actual: string; date: string; status: string; comments: string }>>({});

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: cycleData } = await supabase.from("performance_cycles").select("*").eq("status", "active").order("created_at", { ascending: true }).limit(1).then(r => ({ data: r.data?.[0] ?? null }));
      setCycle(cycleData);
      if (!cycleData) { setLoading(false); return; }

      const { data: sheetData } = await supabase.from("goal_sheets").select("*").eq("employee_id", user.id).eq("cycle_id", cycleData.id).order("created_at", { ascending: false }).limit(1).then(r => ({ data: r.data?.[0] ?? null }));
      setSheet(sheetData);
      if (!sheetData || sheetData.status === "draft") { setLoading(false); return; }

      const { data: goalsData } = await supabase.from("goals").select("*, thrust_area:thrust_areas(name)").eq("goal_sheet_id", sheetData.id).order("sort_order");
      const { data: checkinsData } = await supabase.from("checkins").select("*").eq("goal_sheet_id", sheetData.id);

      const checkinMap: Record<string, Record<string, Checkin>> = {};
      (checkinsData || []).forEach((c: Checkin) => {
        if (!checkinMap[c.goal_id]) checkinMap[c.goal_id] = {};
        checkinMap[c.goal_id][c.quarter] = c;
      });

      const enriched = (goalsData || []).map((g: Goal) => ({ ...g, checkin: checkinMap[g.id]?.[activeQ] }));
      setGoals(enriched as GoalWithCheckin[]);

      // Init local state from existing checkins
      const init: typeof localData = {};
      enriched.forEach(g => {
        const c = g.checkin;
        init[g.id] = {
          actual: c?.actual_value?.toString() || "",
          date: c?.actual_date || "",
          status: c?.status || "not_started",
          comments: c?.employee_comments || "",
        };
      });
      setLocalData(init);
    } finally { setLoading(false); }
  }, [user, supabase, activeQ]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveCheckin = async (goal: GoalWithCheckin) => {
    if (!user || !cycle || !sheet) return;
    setSaving(goal.id);
    try {
      const ld = localData[goal.id] || { actual: "", date: "", status: "not_started", comments: "" };
      const actualVal = ld.actual !== "" ? parseFloat(ld.actual) : null;
      const score = calcScore(goal.uom_type, actualVal, goal.target_value, ld.date, goal.target_date);

      const payload = {
        goal_id: goal.id,
        goal_sheet_id: sheet.id,
        quarter: activeQ,
        cycle_id: cycle.id,
        actual_value: actualVal,
        actual_date: ld.date || null,
        status: ld.status,
        progress_score: score,
        employee_comments: ld.comments || null,
        planned_value: goal.target_value,
      };

      if (goal.checkin?.id) {
        await supabase.from("checkins").update(payload).eq("id", goal.checkin.id);
      } else {
        await supabase.from("checkins").insert(payload);
      }
      await loadData();
    } finally { setSaving(null); }
  };

  const currentCheckinWindow = () => {
    if (!cycle) return null;
    const now = new Date();
    const windows = [
      { q: "Q1", start: cycle.q1_start, end: cycle.q1_end },
      { q: "Q2", start: cycle.q2_start, end: cycle.q2_end },
      { q: "Q3", start: cycle.q3_start, end: cycle.q3_end },
      { q: "Q4", start: cycle.q4_start, end: cycle.q4_end },
    ];
    for (const w of windows) {
      if (w.start && w.end) {
        if (now >= new Date(w.start) && now <= new Date(w.end)) return w.q;
      }
    }
    return null;
  };

  const activeWindow = currentCheckinWindow();
  const isWindowOpen = activeWindow === activeQ;
  const sheetApproved = sheet?.status === "approved";

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (!cycle) return (
    <div className="space-y-4 page-fade">
      <h1 className="text-2xl font-bold">My Check-ins</h1>
      <Card><CardContent className="p-8 text-center text-muted-foreground">No active performance cycle found.</CardContent></Card>
    </div>
  );

  if (!sheet || sheet.status === "draft") return (
    <div className="space-y-4 page-fade">
      <h1 className="text-2xl font-bold">My Check-ins</h1>
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">Goal sheet not yet approved</p>
            <p className="text-sm text-amber-700 mt-1">Check-ins are available once your manager approves your goal sheet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Quarter summary
  const qStats = QUARTERS.map(q => {
    const qGoals = goals.filter(g => g.checkin?.quarter === q);
    const avg = qGoals.length ? Math.round(qGoals.reduce((a, g) => a + (g.checkin?.progress_score || 0), 0) / qGoals.length) : 0;
    return { q, avg, done: qGoals.filter(g => g.checkin?.status !== "not_started").length, total: goals.length };
  });

  return (
    <div className="space-y-6 page-fade">
      <div>
        <h1 className="text-2xl font-bold">My Check-ins</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{cycle.name} · Log quarterly achievements against your goals</p>
      </div>

      {/* Quarter selector */}
      <div className="grid grid-cols-4 gap-3">
        {qStats.map(({ q, avg, done, total }) => {
          const isActive = activeQ === q;
          const isCurrent = activeWindow === q;
          return (
            <button key={q} onClick={() => setActiveQ(q as Quarter)}
              className={`p-4 rounded-2xl border text-left transition-all ${isActive ? "border-primary bg-primary/8 shadow-sm" : "hover:bg-accent border-border"}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-lg">{q}</p>
                {isCurrent && <span className="text-[9px] font-bold uppercase tracking-wider text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">Open</span>}
              </div>
              <p className={`text-2xl font-bold ${avg >= 80 ? "text-green-600" : avg >= 50 ? "text-yellow-600" : avg > 0 ? "text-red-500" : "text-muted-foreground"}`}>{avg > 0 ? `${avg}%` : "—"}</p>
              <p className="text-xs text-muted-foreground mt-1">{done}/{total} updated</p>
            </button>
          );
        })}
      </div>

      {!isWindowOpen && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              {activeWindow ? `${activeQ} check-in window is not currently open. Current window: ${activeWindow}.` : `${activeQ} check-in window is not open yet. Updates are still saved for reference.`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Goal checkins */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground"><Target className="h-10 w-10 mx-auto mb-3 opacity-30" /><p>No goals found.</p></CardContent></Card>
        ) : goals.map(goal => {
          const ld = localData[goal.id] || { actual: "", date: "", status: "not_started", comments: "" };
          const score = calcScore(goal.uom_type, ld.actual !== "" ? parseFloat(ld.actual) : null, goal.target_value, ld.date, goal.target_date);
          const isSaving = saving === goal.id;

          return (
            <Card key={goal.id} className={`overflow-hidden ${goal.checkin?.manager_reviewed ? "border-green-200" : ""}`}>
              <div className="p-5 border-b bg-accent/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold">{goal.title}</p>
                      {goal.checkin?.manager_reviewed && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border badge-success">Manager Reviewed</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{UOM_LABELS[goal.uom_type]}</span>
                      {goal.target_value != null && <span>Target: <strong>{goal.target_value}</strong></span>}
                      {goal.target_date && <span>By: {new Date(goal.target_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                      <span>Weight: <strong>{goal.weightage}%</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-2xl font-bold ${score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : score > 0 ? "text-red-500" : "text-muted-foreground"}`}>{score > 0 ? `${score}%` : "—"}</p>
                    <p className="text-xs text-muted-foreground">score</p>
                  </div>
                </div>
                <Progress value={score} className="h-1.5 mt-3" />
              </div>

              <div className="p-5 space-y-4">
                {goal.checkin?.manager_comments && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1.5"><MessageSquare className="h-3 w-3" />Manager Feedback</p>
                    <p className="text-sm">{goal.checkin.manager_comments}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goal.uom_type === "timeline" ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completion Date</label>
                      <input type="date"
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        value={ld.date}
                        onChange={e => setLocalData(p => ({ ...p, [goal.id]: { ...p[goal.id], date: e.target.value } }))} />
                    </div>
                  ) : goal.uom_type === "zero" ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Incidents Count</label>
                      <input type="number" min="0"
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        placeholder="0 = success"
                        value={ld.actual}
                        onChange={e => setLocalData(p => ({ ...p, [goal.id]: { ...p[goal.id], actual: e.target.value } }))} />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actual Achievement</label>
                      <input type="number"
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        placeholder={goal.target_value?.toString() || "Enter actual"}
                        value={ld.actual}
                        onChange={e => setLocalData(p => ({ ...p, [goal.id]: { ...p[goal.id], actual: e.target.value } }))} />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
                    <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      value={ld.status}
                      onChange={e => setLocalData(p => ({ ...p, [goal.id]: { ...p[goal.id], status: e.target.value } }))}>
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your Comments</label>
                  <textarea className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all min-h-[70px] resize-none"
                    placeholder="Describe your achievement, challenges, and next steps…"
                    value={ld.comments}
                    onChange={e => setLocalData(p => ({ ...p, [goal.id]: { ...p[goal.id], comments: e.target.value } }))} />
                </div>

                <Button size="sm" className="gap-2 rounded-xl" onClick={() => saveCheckin(goal)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Check-in
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
