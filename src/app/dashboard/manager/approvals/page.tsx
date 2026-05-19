"use client";
import { useState, useEffect, useCallback } from "react";
import { ClipboardCheck, CheckCircle2, XCircle, RotateCcw, ChevronDown, ChevronUp, Loader2, Edit2, Save, X, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import type { GoalSheet, Goal, Profile } from "@/lib/types";

interface SheetWithDetails extends GoalSheet {
  employee: Profile;
  goals: Goal[];
}

const UOM_LABELS: Record<string, string> = { min_numeric: "Numeric ↑", max_numeric: "Numeric ↓", min_percent: "% ↑", max_percent: "% ↓", timeline: "Timeline", zero: "Zero" };

export default function ApprovalsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [sheets, setSheets] = useState<SheetWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [showReject, setShowReject] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [goalEdits, setGoalEdits] = useState<Record<string, { target_value: string; weightage: string }>>({});

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get team member IDs
      const { data: team } = await supabase.from("profiles").select("id").eq("manager_id", user.id);
      const teamIds = (team || []).map((p: { id: string }) => p.id);

      if (teamIds.length === 0) { setSheets([]); setLoading(false); return; }

      const { data } = await supabase
        .from("goal_sheets")
        .select("*, employee:profiles!goal_sheets_employee_id_fkey(*), goals(*, thrust_area:thrust_areas(name))")
        .in("employee_id", teamIds)
        .eq("status", "submitted")
        .order("submitted_at", { ascending: true });

      setSheets(data as SheetWithDetails[] || []);
    } finally { setLoading(false); }
  }, [user, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const approve = async (sheetId: string) => {
    if (!user) return;
    setProcessing(sheetId);
    await supabase.from("goal_sheets").update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
      is_locked: true,
    }).eq("id", sheetId);

    // Send notification to employee
    const sheet = sheets.find(s => s.id === sheetId);
    if (sheet) {
      await supabase.from("notifications").insert({
        user_id: sheet.employee_id,
        title: "Goal sheet approved! 🎉",
        message: `Your goal sheet for this cycle has been approved by your manager. Check-ins are now available.`,
        type: "success",
        is_read: false,
      });
    }
    await loadData();
    setProcessing(null);
  };

  const reject = async (sheetId: string) => {
    if (!user) return;
    const reason = rejectReason[sheetId];
    if (!reason?.trim()) return;
    setProcessing(sheetId);
    await supabase.from("goal_sheets").update({
      status: "rejected",
      rejection_reason: reason,
    }).eq("id", sheetId);

    const sheet = sheets.find(s => s.id === sheetId);
    if (sheet) {
      await supabase.from("notifications").insert({
        user_id: sheet.employee_id,
        title: "Goal sheet returned for rework",
        message: `Your manager returned your goal sheet: "${reason}". Please revise and resubmit.`,
        type: "warning",
        is_read: false,
      });
    }
    await loadData();
    setProcessing(null);
    setShowReject(null);
  };

  const saveGoalEdit = async (goalId: string) => {
    const edits = goalEdits[goalId];
    if (!edits) return;
    await supabase.from("goals").update({
      target_value: edits.target_value ? parseFloat(edits.target_value) : null,
      weightage: parseInt(edits.weightage),
    }).eq("id", goalId);
    setEditingGoal(null);
    await loadData();
  };

  return (
    <div className="space-y-6 page-fade">
      <div>
        <h1 className="text-2xl font-bold">Goal Sheet Approvals</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Review and approve submitted goal sheets from your team</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : sheets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="font-semibold text-lg">All caught up!</p>
            <p className="text-muted-foreground text-sm mt-1">No goal sheets pending approval.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sheets.map(sheet => {
            const totalW = sheet.goals.reduce((a, g) => a + g.weightage, 0);
            const isExpanded = expanded === sheet.id;
            const isProcessing = processing === sheet.id;

            return (
              <Card key={sheet.id} className="overflow-hidden">
                <div className="p-5 cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => setExpanded(isExpanded ? null : sheet.id)}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0 font-bold text-primary text-sm">
                        {sheet.employee.full_name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold">{sheet.employee.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {sheet.employee.designation || sheet.employee.role} · {sheet.employee.department || "—"} · {sheet.goals.length} goals · {totalW}% total weight
                          {sheet.submitted_at && ` · Submitted ${new Date(sheet.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {totalW !== 100 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border badge-danger">Weight: {totalW}%</span>
                      )}
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t">
                    {/* Goals list with inline editing */}
                    <div className="p-5 space-y-3">
                      {sheet.goals.map(goal => {
                        const isEditing = editingGoal === goal.id;
                        const edits = goalEdits[goal.id] || { target_value: goal.target_value?.toString() || "", weightage: goal.weightage.toString() };

                        return (
                          <div key={goal.id} className="p-4 rounded-xl border bg-card">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{goal.title}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  {goal.thrust_area && <span>{(goal.thrust_area as { name: string }).name}</span>}
                                  <span>{UOM_LABELS[goal.uom_type]}</span>
                                </div>
                              </div>
                              {!isEditing && (
                                <div className="flex items-center gap-3 shrink-0 text-sm">
                                  <div className="text-right">
                                    <p className="font-semibold">Target: {goal.target_value ?? "—"}</p>
                                    <p className="text-xs text-muted-foreground">Weight: {goal.weightage}%</p>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); setEditingGoal(goal.id); setGoalEdits(p => ({ ...p, [goal.id]: edits })); }}
                                    className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                              {isEditing && (
                                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <label className="text-[10px] text-muted-foreground block mb-0.5">Target</label>
                                      <input type="number" className="w-20 rounded-lg border px-2 py-1 text-xs"
                                        value={goalEdits[goal.id]?.target_value || ""}
                                        onChange={e => setGoalEdits(p => ({ ...p, [goal.id]: { ...p[goal.id], target_value: e.target.value } }))} />
                                    </div>
                                    <div>
                                      <label className="text-[10px] text-muted-foreground block mb-0.5">Weight%</label>
                                      <input type="number" min="10" max="100" className="w-16 rounded-lg border px-2 py-1 text-xs"
                                        value={goalEdits[goal.id]?.weightage || ""}
                                        onChange={e => setGoalEdits(p => ({ ...p, [goal.id]: { ...p[goal.id], weightage: e.target.value } }))} />
                                    </div>
                                  </div>
                                  <button onClick={() => saveGoalEdit(goal.id)} className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary/90">
                                    <Save className="h-3.5 w-3.5" />
                                  </button>
                                  <button onClick={() => setEditingGoal(null)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reject reason input */}
                    {showReject === sheet.id && (
                      <div className="px-5 pb-3" onClick={e => e.stopPropagation()}>
                        <div className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3">
                          <p className="text-sm font-semibold text-red-800">Reason for returning:</p>
                          <textarea className="w-full rounded-xl border border-red-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 min-h-[72px] resize-none"
                            placeholder="Explain what needs to be changed…"
                            value={rejectReason[sheet.id] || ""}
                            onChange={e => setRejectReason(p => ({ ...p, [sheet.id]: e.target.value }))} />
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setShowReject(null)}>Cancel</Button>
                            <Button size="sm" className="rounded-xl gap-2 bg-red-600 hover:bg-red-700 text-white" onClick={() => reject(sheet.id)} disabled={isProcessing || !rejectReason[sheet.id]?.trim()}>
                              {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} Return for Rework
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="px-5 pb-5 flex gap-3" onClick={e => e.stopPropagation()}>
                      <Button className="gap-2 rounded-xl" onClick={() => approve(sheet.id)} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Approve Goal Sheet
                      </Button>
                      {showReject !== sheet.id && (
                        <Button variant="outline" className="gap-2 rounded-xl text-red-600 hover:text-red-700 hover:border-red-300" onClick={() => setShowReject(sheet.id)} disabled={isProcessing}>
                          <RotateCcw className="h-4 w-4" /> Return for Rework
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
