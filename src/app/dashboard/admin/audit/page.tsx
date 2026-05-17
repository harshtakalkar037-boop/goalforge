"use client";

import { FileText, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const auditLogs = [
  { id: "1", entity_type: "goal_sheet", action: "approve", description: "Goal sheet approved for Priya Sharma", changed_by: "Sunita Patel", created_at: "2025-10-14 14:32:00" },
  { id: "2", entity_type: "goal", action: "create", description: "New goal created: 'Achieve ISO 27001 compliance'", changed_by: "Aditya Verma", created_at: "2025-10-14 12:10:00" },
  { id: "3", entity_type: "goal_sheet", action: "submit", description: "Goal sheet submitted by Vikram Nair", changed_by: "Vikram Nair", created_at: "2025-10-14 10:05:00" },
  { id: "4", entity_type: "goal_sheet", action: "reject", description: "Goal sheet rejected for Suresh Kumar — incomplete weightage", changed_by: "Sunita Patel", created_at: "2025-10-13 16:45:00" },
  { id: "5", entity_type: "user", action: "create", description: "New user registered: Karan Shah", changed_by: "Aditya Verma", created_at: "2025-10-13 09:00:00" },
  { id: "6", entity_type: "cycle", action: "update", description: "Q2 check-in deadline extended to Oct 20", changed_by: "Aditya Verma", created_at: "2025-10-12 11:30:00" },
  { id: "7", entity_type: "goal", action: "push_shared", description: "Shared goal pushed to 42 Engineering employees", changed_by: "Aditya Verma", created_at: "2025-10-11 15:00:00" },
  { id: "8", entity_type: "checkin", action: "update", description: "Q1 check-in unlocked for Anita Desai", changed_by: "Sunita Patel", created_at: "2025-10-10 10:20:00" },
];

const actionColor: Record<string, string> = {
  approve: "bg-green-100 text-green-700",
  create: "bg-blue-100 text-blue-700",
  submit: "bg-indigo-100 text-indigo-700",
  reject: "bg-red-100 text-red-700",
  update: "bg-yellow-100 text-yellow-700",
  push_shared: "bg-purple-100 text-purple-700",
  unlock: "bg-orange-100 text-orange-700",
  delete: "bg-red-200 text-red-800",
};

export default function AdminAuditPage() {
  const [search, setSearch] = useState("");
  const filtered = auditLogs.filter(log =>
    log.description.toLowerCase().includes(search.toLowerCase()) ||
    log.changed_by.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Log</h1>
        <p className="text-muted-foreground mt-1">Complete history of all system actions and changes</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search audit logs..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map(log => (
              <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-accent/20 transition-colors">
                <div className="shrink-0 mt-0.5">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${actionColor[log.action] || "bg-gray-100 text-gray-600"}`}>
                    {log.action}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{log.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="font-medium">{log.changed_by}</span>
                    <span>·</span>
                    <span>{log.entity_type.replace(/_/g, " ")}</span>
                    <span>·</span>
                    <span>{log.created_at}</span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground">No logs matching your search.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
