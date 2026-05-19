"use client";
import { useState, useEffect, useCallback } from "react";
import { FileText, Download, TrendingUp, Users, Target, Loader2, BarChart3, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

interface ReportRow {
  employee: string;
  department: string;
  goalTitle: string;
  weight: number;
  uom: string;
  target: number | null;
  actual: number | null;
  score: number;
  status: string;
  quarter: string;
}

function downloadCSV(rows: ReportRow[], filename: string) {
  const headers = ["Employee", "Department", "Goal", "Weight%", "UoM", "Target", "Actual", "Score%", "Status", "Quarter"];
  const csv = [headers.join(","), ...rows.map(r => [
    `"${r.employee}"`, `"${r.department}"`, `"${r.goalTitle}"`,
    r.weight, `"${r.uom}"`, r.target ?? "", r.actual ?? "", r.score, `"${r.status}"`, r.quarter
  ].join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

async function downloadPDF(rows: ReportRow[], filename: string, title: string) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();
  doc.setFontSize(16); doc.text(title, 14, 16);
  doc.setFontSize(10); doc.setTextColor(100); doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 24);
  autoTable(doc, {
    startY: 30,
    head: [["Employee", "Goal", "Wt%", "Target", "Actual", "Score%", "Status", "Q"]],
    body: rows.map(r => [r.employee, r.goalTitle.substring(0, 35), r.weight, r.target ?? "—", r.actual ?? "—", `${r.score}%`, r.status, r.quarter]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [100, 80, 220] },
    alternateRowStyles: { fillColor: [248, 247, 255] },
  });
  doc.save(filename);
}

export default function ReportsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [myRows, setMyRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const [completionStats, setCompletionStats] = useState({ total: 0, submitted: 0, approved: 0, checkinsDone: 0 });

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Get active cycle
      const { data: cycle } = await supabase.from("performance_cycles").select("*").eq("status", "active").order("created_at", { ascending: true }).limit(1).then(r => ({ data: r.data?.[0] ?? null }));
      if (!cycle) { setLoading(false); return; }

      // Get all goal sheets with goals and checkins (admins/managers see all, employees see own)
      let sheetsQuery = supabase.from("goal_sheets")
        .select("*, employee:profiles!goal_sheets_employee_id_fkey(full_name, department), goals(*, checkins(*))")
        .eq("cycle_id", cycle.id);

      if (user.role === "employee") {
        sheetsQuery = sheetsQuery.eq("employee_id", user.id);
      } else if (user.role === "manager") {
        const { data: team } = await supabase.from("profiles").select("id").eq("manager_id", user.id);
        const teamIds = (team || []).map((p: { id: string }) => p.id);
        teamIds.push(user.id);
        sheetsQuery = sheetsQuery.in("employee_id", teamIds);
      }

      const { data: sheets } = await sheetsQuery;

      const allRows: ReportRow[] = [];
      let totalSheets = 0, submittedSheets = 0, approvedSheets = 0, checkinsTotal = 0;

      (sheets || []).forEach((sheet: Record<string, unknown>) => {
        totalSheets++;
        const emp = sheet.employee as { full_name: string; department: string } | null;
        const status = sheet.status as string;
        if (status === "submitted" || status === "approved") submittedSheets++;
        if (status === "approved") approvedSheets++;

        const goals = sheet.goals as Record<string, unknown>[];
        (goals || []).forEach((goal: Record<string, unknown>) => {
          const checkins = goal.checkins as Record<string, unknown>[];
          if (!checkins || checkins.length === 0) {
            allRows.push({ employee: emp?.full_name || "—", department: emp?.department || "—", goalTitle: goal.title as string, weight: goal.weightage as number, uom: goal.uom_type as string, target: goal.target_value as number | null, actual: null, score: 0, status: "Not Started", quarter: "—" });
          } else {
            checkins.forEach((c: Record<string, unknown>) => {
              if (c.status !== "not_started") checkinsTotal++;
              allRows.push({ employee: emp?.full_name || "—", department: emp?.department || "—", goalTitle: goal.title as string, weight: goal.weightage as number, uom: goal.uom_type as string, target: goal.target_value as number | null, actual: c.actual_value as number | null, score: c.progress_score as number || 0, status: c.status as string || "not_started", quarter: c.quarter as string || "—" });
            });
          }
        });
      });

      setRows(allRows);
      setMyRows(allRows.filter(r => r.employee === user.full_name));
      setCompletionStats({ total: totalSheets, submitted: submittedSheets, approved: approvedSheets, checkinsDone: checkinsTotal });
    } finally { setLoading(false); }
  }, [user, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleExport = async (type: "csv" | "pdf", scope: "my" | "all") => {
    const data = scope === "my" ? myRows : rows;
    const name = scope === "my" ? "My Performance Report" : "Team Achievement Report";
    setExporting(`${type}-${scope}`);
    try {
      if (type === "csv") downloadCSV(data, `${name.replace(/ /g, "_")}_${new Date().toISOString().split("T")[0]}.csv`);
      else await downloadPDF(data, `${name.replace(/ /g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`, name);
    } finally { setExporting(null); }
  };

  const myAvgScore = myRows.length ? Math.round(myRows.reduce((a, r) => a + r.score, 0) / myRows.length) : 0;

  return (
    <div className="space-y-6 page-fade">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Achievement reports and performance exports</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Completion dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Employees", value: completionStats.total, icon: Users, color: "text-primary" },
              { label: "Submitted Sheets", value: completionStats.submitted, icon: FileText, color: "text-blue-600" },
              { label: "Approved Sheets", value: completionStats.approved, icon: CheckCircle2, color: "text-green-600" },
              { label: "Check-ins Done", value: completionStats.checkinsDone, icon: BarChart3, color: "text-violet-600" },
            ].map(s => (
              <Card key={s.label} className="gradient-card border-primary/8">
                <CardContent className="p-5">
                  <s.icon className={`h-5 w-5 mb-2 ${s.color}`} />
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* My performance summary */}
          {myRows.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4" />My Performance Summary</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-xs" onClick={() => handleExport("csv", "my")} disabled={!!exporting}>
                      {exporting === "csv-my" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />} CSV
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-xs" onClick={() => handleExport("pdf", "my")} disabled={!!exporting}>
                      {exporting === "pdf-my" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />} PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 mb-5 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="text-center">
                    <p className={`text-4xl font-bold ${myAvgScore >= 80 ? "text-green-600" : myAvgScore >= 60 ? "text-yellow-600" : "text-red-500"}`}>{myAvgScore}%</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                  <Progress value={myAvgScore} className="flex-1 h-3" />
                </div>
                <div className="space-y-3">
                  {myRows.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.goalTitle}</p>
                        <p className="text-xs text-muted-foreground">{r.weight}% weight · {r.quarter} · Target: {r.target ?? "—"} · Actual: {r.actual ?? "—"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${r.score >= 80 ? "text-green-600" : r.score >= 60 ? "text-yellow-600" : r.score > 0 ? "text-red-500" : "text-muted-foreground"}`}>{r.score > 0 ? `${r.score}%` : "—"}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{r.status.replace("_", " ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team report — managers/admins */}
          {(user?.role === "manager" || user?.role === "admin") && rows.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />Team Achievement Report</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-xs" onClick={() => handleExport("csv", "all")} disabled={!!exporting}>
                      {exporting === "csv-all" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />} CSV
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-xl text-xs" onClick={() => handleExport("pdf", "all")} disabled={!!exporting}>
                      {exporting === "pdf-all" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />} PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                      <th className="text-left py-2 pr-4 font-semibold">Employee</th>
                      <th className="text-left py-2 pr-4 font-semibold">Goal</th>
                      <th className="text-right py-2 pr-4 font-semibold">Wt%</th>
                      <th className="text-right py-2 pr-4 font-semibold">Target</th>
                      <th className="text-right py-2 pr-4 font-semibold">Actual</th>
                      <th className="text-right py-2 pr-4 font-semibold">Score</th>
                      <th className="text-center py-2 font-semibold">Q</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.slice(0, 50).map((r, i) => (
                      <tr key={i} className="hover:bg-accent/30 transition-colors">
                        <td className="py-2.5 pr-4"><p className="font-medium">{r.employee}</p><p className="text-xs text-muted-foreground">{r.department}</p></td>
                        <td className="py-2.5 pr-4 max-w-48"><p className="truncate text-sm">{r.goalTitle}</p></td>
                        <td className="py-2.5 pr-4 text-right text-xs">{r.weight}%</td>
                        <td className="py-2.5 pr-4 text-right text-xs">{r.target ?? "—"}</td>
                        <td className="py-2.5 pr-4 text-right text-xs">{r.actual ?? "—"}</td>
                        <td className="py-2.5 pr-4 text-right"><span className={`font-bold text-sm ${r.score >= 80 ? "text-green-600" : r.score >= 60 ? "text-yellow-600" : r.score > 0 ? "text-red-500" : "text-muted-foreground"}`}>{r.score > 0 ? `${r.score}%` : "—"}</span></td>
                        <td className="py-2.5 text-center text-xs text-muted-foreground">{r.quarter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 50 && <p className="text-xs text-muted-foreground mt-3">Showing 50 of {rows.length} rows. Export for full data.</p>}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
