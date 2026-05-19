"use client";
import { useState, useEffect, useCallback } from "react";
import { Users, Target, ClipboardCheck, TrendingUp, Loader2, BarChart3, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";

export default function ManagerDashboard() {
  const { user } = useUser();
  const supabase = createClient();
  const [team, setTeam] = useState<Record<string,unknown>[]>([]);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cycle, setCycle] = useState<Record<string,unknown>|null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: cyc } = await supabase.from("performance_cycles").select("*").eq("status","active").maybeSingle();
    setCycle(cyc);
    const { data: members } = await supabase.from("profiles").select("id,full_name,designation,department").eq("manager_id", user.id).eq("is_active",true);
    if (members && cyc) {
      const ids = members.map((m:Record<string,unknown>)=>m.id as string);
      const { data: sheets } = await supabase.from("goal_sheets").select("employee_id,status").in("employee_id",ids).eq("cycle_id",cyc.id);
      const sheetsMap:Record<string,string> = {};
      (sheets||[]).forEach((s:Record<string,unknown>)=>{ sheetsMap[s.employee_id as string]=s.status as string; });
      const enriched = members.map((m:Record<string,unknown>)=>({...m, sheetStatus: sheetsMap[m.id as string]||"none"}));
      setTeam(enriched);
      setPending((sheets||[]).filter((s:Record<string,unknown>)=>s.status==="submitted").length);
    } else { setTeam(members||[]); }
    setLoading(false);
  },[user,supabase]);

  useEffect(()=>{load();},[load]);

  const approved = team.filter(m=>m.sheetStatus==="approved").length;
  const submitted = team.filter(m=>m.sheetStatus==="submitted").length;
  const none = team.filter(m=>m.sheetStatus==="none"||m.sheetStatus===undefined).length;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;

  return (
    <div className="space-y-6 page-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{cycle?`${cycle.name as string} · `:""}Team of {team.length}</p>
        </div>
        {pending > 0 && (
          <Link href="/dashboard/manager/approvals">
            <Button className="gap-2 rounded-xl shadow-sm animate-pulse">
              <ClipboardCheck className="h-4 w-4"/> {pending} Pending Approval{pending!==1?"s":""}
            </Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:"Team Members",value:team.length,icon:Users,color:"text-primary",bg:"bg-primary/10"},
          {label:"Pending Approval",value:submitted,icon:ClipboardCheck,color:"text-amber-600",bg:"bg-amber-100"},
          {label:"Approved",value:approved,icon:CheckCircle2,color:"text-green-600",bg:"bg-green-100"},
          {label:"Not Started",value:none,icon:Target,color:"text-red-500",bg:"bg-red-100"},
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
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4"/>Team Overview</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {team.length===0 ? <p className="text-muted-foreground text-sm text-center py-6">No team members assigned yet.</p> : team.map(m=>{
            const st = m.sheetStatus as string;
            const statusColor = st==="approved"?"text-green-600 bg-green-100":st==="submitted"?"text-blue-600 bg-blue-100":st==="draft"?"text-gray-600 bg-gray-100":"text-red-500 bg-red-100";
            const statusLabel = st==="none"||!st?"Not Started":st.charAt(0).toUpperCase()+st.slice(1);
            return (
              <div key={m.id as string} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-accent/30 transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{(m.full_name as string)?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{m.full_name as string}</p>
                  <p className="text-xs text-muted-foreground">{(m.designation as string)||""}{m.department?` · ${m.department as string}`:""}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>{statusLabel}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {href:"/dashboard/manager/approvals",label:"Review Approvals",desc:`${submitted} goal sheet${submitted!==1?"s":""} waiting for your review`},
          {href:"/dashboard/manager/checkins",label:"Team Check-ins",desc:"Review quarterly achievements and add feedback"},
        ].map(l=>(
          <Link key={l.href} href={l.href}>
            <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full">
              <CardContent className="p-5"><p className="font-semibold">{l.label}</p><p className="text-xs text-muted-foreground mt-1">{l.desc}</p></CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
