"use client";
import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Save, Loader2, Users, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;
type Quarter = typeof QUARTERS[number];

interface TeamCheckin {
  employee_id: string;
  employee_name: string;
  department: string | null;
  goals: {
    goal_id: string;
    goal_title: string;
    checkin_id: string | null;
    actual: number | null;
    target: number | null;
    score: number;
    status: string;
    employee_comments: string | null;
    manager_comments: string | null;
    manager_reviewed: boolean;
  }[];
  avg_score: number;
}

export default function ManagerCheckinsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [activeQ, setActiveQ] = useState<Quarter>("Q1");
  const [data, setData] = useState<TeamCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: team } = await supabase.from("profiles").select("id, full_name, department").eq("manager_id", user.id);
      if (!team?.length) { setData([]); setLoading(false); return; }

      const { data: cycle } = await supabase.from("performance_cycles").select("id").eq("status", "active").maybeSingle();
      if (!cycle) { setData([]); setLoading(false); return; }

      const teamIds = team.map((p: { id: string }) => p.id);
      const { data: sheets } = await supabase.from("goal_sheets").select("id, employee_id, status").in("employee_id", teamIds).eq("cycle_id", cycle.id);

      const result: TeamCheckin[] = [];
      for (const member of team as { id: string; full_name: string; department: string | null }[]) {
        const sheet = (sheets || []).find((s: { employee_id: string }) => s.employee_id === member.id);
        if (!sheet || sheet.status === "draft") continue;

        const { data: goals } = await supabase.from("goals").select("id, title, target_value").eq("goal_sheet_id", sheet.id);
        const { data: checkins } = await supabase.from("checkins").select("*").eq("goal_sheet_id", sheet.id).eq("quarter", activeQ);

        const goalRows = (goals || []).map((g: { id: string; title: string; target_value: number | null }) => {
          const c = (checkins || []).find((ch: { goal_id: string }) => ch.goal_id === g.id);
          return { goal_id: g.id, goal_title: g.title, checkin_id: c?.id || null, actual: c?.actual_value ?? null, target: g.target_value, score: c?.progress_score || 0, status: c?.status || "not_started", employee_comments: c?.employee_comments || null, manager_comments: c?.manager_comments || null, manager_reviewed: c?.manager_reviewed || false };
        });

        const avg = goalRows.length ? Math.round(goalRows.reduce((a, g) => a + g.score, 0) / goalRows.length) : 0;
        result.push({ employee_id: member.id, employee_name: member.full_name, department: member.department, goals: goalRows, avg_score: avg });
      }
      setData(result);
    } finally { setLoading(false); }
  }, [user, supabase, activeQ]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveComment = async (checkinId: string, employeeId: string) => {
    if (!user) return;
    setSaving(checkinId);
    await supabase.from("checkins").update({
      manager_comments: comments[checkinId] || null,
      manager_reviewed: true,
      manager_reviewed_at: new Date().toISOString(),
      manager_reviewed_by: user.id,
    }).eq("id", checkinId);
    await supabase.from("notifications").insert({
      user_id: employeeId,
      title: `Manager reviewed your ${activeQ} check-in`,
      message: comments[checkinId] ? `Your manager left feedback: "${comments[checkinId].substring(0, 100)}..."` : `Your ${activeQ} check-in has been reviewed.`,
      type: "success",
      is_read: false,
    });
    await loadData();
    setSaving(null);
  };

  return (
    <div className="space-y-6 page-fade">
      <div>
        <h1 className="text-2xl font-bold">Team Check-ins</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Review quarterly achievements and add structured feedback</p>
      </div>

      <div className="flex gap-2">
        {QUARTERS.map(q => (
          <button key={q} onClick={() => setActiveQ(q)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeQ === q ? "bg-primary text-white shadow-sm" : "border hover:bg-accent"}`}>
            {q}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : data.length === 0 ? (
        <Card className="border-dashed"><CardContent className="p-12 text-center"><Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" /><p className="font-semibold">No team check-ins yet</p><p className="text-muted-foreground text-sm mt-1">Check-ins appear once your team members submit them.</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {data.map(member => (
            <Card key={member.employee_id} className="overflow-hidden">
              <div className="p-5 cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => setExpanded(expanded === member.employee_id ? null : member.employee_id)}>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                    {member.employee_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{member.employee_name}</p>
                    <p className="text-xs text-muted-foreground">{member.department || "—"} · {member.goals.filter(g => g.checkin_id).length}/{member.goals.length} goals updated · Avg: {member.avg_score > 0 ? `${member.avg_score}%` : "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <Progress value={member.avg_score} className="h-1.5" />
                    </div>
                    <span className={`text-sm font-bold ${member.avg_score >= 80 ? "text-green-600" : member.avg_score >= 60 ? "text-yellow-600" : member.avg_score > 0 ? "text-red-500" : "text-muted-foreground"}`}>
                      {member.avg_score > 0 ? `${member.avg_score}%` : "—"}
                    </span>
                    {expanded === member.employee_id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
              </div>

              {expanded === member.employee_id && (
                <div className="border-t p-5 space-y-4">
                  {member.goals.map(goal => (
                    <div key={goal.goal_id} className={`p-4 rounded-xl border ${goal.manager_reviewed ? "border-green-200 bg-green-50/30" : "bg-card"}`}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-medium text-sm">{goal.goal_title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>Target: {goal.target ?? "—"}</span>
                            <span>Actual: {goal.actual ?? "—"}</span>
                            <span className="capitalize">{goal.status.replace("_", " ")}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xl font-bold ${goal.score >= 80 ? "text-green-600" : goal.score >= 60 ? "text-yellow-600" : goal.score > 0 ? "text-red-500" : "text-muted-foreground"}`}>{goal.score > 0 ? `${goal.score}%` : "—"}</p>
                          {goal.manager_reviewed && <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Reviewed</span>}
                        </div>
                      </div>

                      {goal.employee_comments && (
                        <div className="p-3 rounded-xl bg-accent/40 mb-3">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Employee Comments</p>
                          <p className="text-xs">{goal.employee_comments}</p>
                        </div>
                      )}

                      {goal.checkin_id && (
                        <div className="space-y-2">
                          <textarea className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[60px] resize-none"
                            placeholder="Add structured check-in comment…"
                            value={comments[goal.checkin_id] ?? (goal.manager_comments || "")}
                            onChange={e => setComments(p => ({ ...p, [goal.checkin_id!]: e.target.value }))} />
                          <Button size="sm" className="gap-2 rounded-xl" onClick={() => saveComment(goal.checkin_id!, member.employee_id)} disabled={saving === goal.checkin_id}>
                            {saving === goal.checkin_id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            {goal.manager_reviewed ? "Update Comment" : "Save & Mark Reviewed"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
