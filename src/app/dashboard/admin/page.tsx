"use client";
import { useState, useEffect, useCallback } from "react";
import { Users, Target, CheckCircle2, Clock, TrendingUp, BarChart3, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useUser();
  const supabase = createClient();
  const [stats, setStats] = useState({ employees: 0, submitted: 0, approved: 0, pending: 0, checkins: 0 });
  const [loading, setLoading] = useState(true);
  const [cycle, setCycle] = useState<Record<string,unknown>|null>(null);
  const [deptData, setDeptData] = useState<{dept:string;submitted:number;total:number}[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: cyc } = await supabase.from("performance_cycles").select("*").eq("status","active").maybeSingle();
    setCycle(cyc);
    const { count: empCount } = await supabase.from("profiles").select("*",{count:"exact",head:true}).eq("role","employee").eq("is_active",true);
    if (cyc) {
      const { data: sheets } = await supabase.from("goal_sheets").select("status, employee:profiles!goal_sheets_employee_id_fkey(department)").eq("cycle_id", cyc.id);
      const submitted = (sheets||[]).filter((s:Record<string,unknown>) => s.status==="submitted").length;
      const approved = (sheets||[]).filter((s:Record<string,unknown>) => s.status==="approved").length;
      const { count: ciCount } = await supabase.from("checkins").select("*",{count:"exact",head:true}).eq("cycle_id", cyc.id);
      setStats({ employees: empCount||0, submitted, approved, pending: submitted, checkins: ciCount||0 });
      // dept breakdown
      const deptMap: Record<string, {submitted:number;total:number}> = {};
      (sheets||[]).forEach((s:Record<string,unknown>) => {
        const dept = ((s.employee as Record<string,unknown>)?.department as string) || "Unknown";
        if (!deptMap[dept]) deptMap[dept] = {submitted:0,total:0};
        deptMap[dept].total++;
        if (s.status==="submitted"||s.status==="approved") deptMap[dept].submitted++;
      });
      setDeptData(Object.entries(deptMap).map(([dept,v])=>({dept,...v})));
    }
    setLoading(false);
  }, [supabase]);

  useEffect(()=>{load();},[load]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;

  const completion = stats.employees > 0 ? Math.round(((stats.submitted+stats.approved)/stats.employees)*100) : 0;

  return (
    <div className="space-y-6 page-fade">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{cycle ? `${cycle.name as string} · ${cycle.financial_year as string}` : "No active cycle"} · Organization overview</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:"Total Employees",value:stats.employees,icon:Users,color:"text-primary",bg:"bg-primary/10"},
          {label:"Sheets Submitted",value:stats.submitted,icon:Clock,color:"text-blue-600",bg:"bg-blue-100"},
          {label:"Sheets Approved",value:stats.approved,icon:CheckCircle2,color:"text-green-600",bg:"bg-green-100"},
          {label:"Check-ins Logged",value:stats.checkins,icon:BarChart3,color:"text-violet-600",bg:"bg-violet-100"},
        ].map(s=>(
          <Card key={s.label} className="gradient-card border-primary/8">
            <CardContent className="p-5">
              <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`h-5 w-5 ${s.color}`}/></div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="gradient-card border-primary/10">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4"/>Goal Sheet Completion</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <p className="text-4xl font-bold text-primary">{completion}%</p>
            <div className="flex-1"><Progress value={completion} className="h-3"/><p className="text-xs text-muted-foreground mt-1">{stats.submitted+stats.approved} of {stats.employees} employees submitted</p></div>
          </div>
          {stats.pending > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0"/>{stats.pending} sheet{stats.pending!==1?"s":""} pending manager approval
            </div>
          )}
        </CardContent>
      </Card>
      {deptData.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Completion by Department</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {deptData.map(d=>(
              <div key={d.dept}>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium">{d.dept}</span><span className="text-muted-foreground">{d.submitted}/{d.total}</span></div>
                <Progress value={d.total>0?Math.round((d.submitted/d.total)*100):0} className="h-2"/>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {href:"/dashboard/admin/cycles",label:"Manage Cycles",desc:"Configure performance cycle windows"},
          {href:"/dashboard/admin/shared-goals",label:"Shared Goals",desc:"Push KPIs to multiple employees"},
          {href:"/dashboard/admin/audit",label:"Audit Log",desc:"Track all changes with full trail"},
        ].map(l=>(
          <Link key={l.href} href={l.href}>
            <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full">
              <CardContent className="p-4"><p className="font-semibold">{l.label}</p><p className="text-xs text-muted-foreground mt-1">{l.desc}</p></CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
