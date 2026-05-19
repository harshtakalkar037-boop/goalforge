"use client";
import { useState, useEffect, useCallback } from "react";
import { FileText, Loader2, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changed_by: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  description: string | null;
  created_at: string;
  changed_by_profile?: { full_name: string } | null;
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  approve: "bg-emerald-100 text-emerald-700",
  reject: "bg-orange-100 text-orange-700",
  submit: "bg-indigo-100 text-indigo-700",
  unlock: "bg-yellow-100 text-yellow-700",
  push_shared: "bg-purple-100 text-purple-700",
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AuditPage() {
  const supabase = createClient();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 30;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("audit_logs")
      .select("*, changed_by_profile:profiles!audit_logs_changed_by_fkey(full_name)")
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    if (filter !== "all") query = query.eq("action", filter);
    const { data } = await query;
    setLogs(data as AuditLog[] || []);
    setLoading(false);
  }, [supabase, filter, page]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const downloadCSV = () => {
    const headers = ["Time", "Action", "Entity", "Changed By", "Description"];
    const csv = [headers.join(","), ...logs.map(l => [
      `"${new Date(l.created_at).toLocaleString("en-IN")}"`,
      l.action,
      l.entity_type,
      `"${(l.changed_by_profile as { full_name: string } | null)?.full_name || l.changed_by}"`,
      `"${l.description || ""}"`,
    ].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `audit_log_${new Date().toISOString().split("T")[0]}.csv`; a.click();
  };

  const ACTIONS = ["all", "create", "update", "delete", "approve", "reject", "submit", "unlock"];

  return (
    <div className="space-y-6 page-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Full trail of all changes — who changed what and when</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl" onClick={downloadCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {ACTIONS.map(a => (
          <button key={a} onClick={() => { setFilter(a); setPage(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${filter === a ? "bg-primary text-white" : "border hover:bg-accent"}`}>
            {a}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : logs.length === 0 ? (
        <Card className="border-dashed"><CardContent className="p-12 text-center"><FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" /><p className="font-semibold">No audit logs yet</p></CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {logs.map(log => (
                <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-accent/20 transition-colors">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg capitalize shrink-0 mt-0.5 ${ACTION_COLORS[log.action] || "bg-gray-100 text-gray-600"}`}>
                    {log.action}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{log.description || `${log.action} on ${log.entity_type}`}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>by <strong>{(log.changed_by_profile as { full_name: string } | null)?.full_name || "System"}</strong></span>
                      <span>·</span>
                      <span className="capitalize">{log.entity_type}</span>
                      {log.new_values && Object.keys(log.new_values).length > 0 && (
                        <span>· Changed: {Object.keys(log.new_values).join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{timeAgo(log.created_at)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <Button variant="outline" size="sm" className="rounded-xl" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="text-xs text-muted-foreground">Page {page + 1}</span>
              <Button variant="outline" size="sm" className="rounded-xl" disabled={logs.length < PAGE_SIZE} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
