"use client";
import { useState, useEffect, useCallback } from "react";
import { Calendar, Plus, Save, Loader2, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

interface Cycle { id:string; name:string; financial_year:string; status:string; start_date:string; end_date:string; goal_setting_start:string|null; goal_setting_end:string|null; q1_start:string|null; q1_end:string|null; q2_start:string|null; q2_end:string|null; q3_start:string|null; q3_end:string|null; q4_start:string|null; q4_end:string|null; }

const STATUS_COLORS:Record<string,string> = { active:"badge-success", upcoming:"badge-info", completed:"bg-gray-100 text-gray-600 border-gray-200", archived:"bg-gray-100 text-gray-500 border-gray-200" };

function CycleModal({ open, onClose, onSave }: { open:boolean; onClose:()=>void; onSave:()=>void }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [form, setForm] = useState({ name:"FY 2026-27", financial_year:"2026-27", status:"upcoming", start_date:"2026-04-01", end_date:"2027-03-31", goal_setting_start:"2026-05-01", goal_setting_end:"2026-05-31", q1_start:"2026-07-01", q1_end:"2026-07-31", q2_start:"2026-10-01", q2_end:"2026-10-31", q3_start:"2027-01-01", q3_end:"2027-01-31", q4_start:"2027-03-01", q4_end:"2027-04-30" });
  if (!open) return null;
  const f = (k:string, v:string) => setForm(p=>({...p,[k]:v}));
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const { error: err } = await supabase.from("performance_cycles").insert(form);
      if (err) throw err;
      onSave(); onClose();
    } catch(err){ setError(err instanceof Error?err.message:"Failed"); } finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg border">
        <div className="flex items-center justify-between p-5 border-b"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-primary"/></div><h2 className="font-bold">New Performance Cycle</h2></div><button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-accent"><X className="h-4 w-4"/></button></div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error&&<div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"><AlertCircle className="h-4 w-4 shrink-0"/>{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cycle Name</label><input className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.name} onChange={e=>f("name",e.target.value)} required/></div>
            <div className="space-y-1.5"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Financial Year</label><input className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.financial_year} onChange={e=>f("financial_year",e.target.value)} required/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Start Date</label><input type="date" className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.start_date} onChange={e=>f("start_date",e.target.value)}/></div>
            <div className="space-y-1.5"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">End Date</label><input type="date" className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.end_date} onChange={e=>f("end_date",e.target.value)}/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Goal Setting Start</label><input type="date" className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.goal_setting_start} onChange={e=>f("goal_setting_start",e.target.value)}/></div>
            <div className="space-y-1.5"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Goal Setting End</label><input type="date" className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.goal_setting_end} onChange={e=>f("goal_setting_end",e.target.value)}/></div>
          </div>
          {["q1","q2","q3","q4"].map(q=>(
            <div key={q} className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{q.toUpperCase()} Start</label><input type="date" className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={(form as Record<string,string>)[`${q}_start`]} onChange={e=>f(`${q}_start`,e.target.value)}/></div>
              <div className="space-y-1.5"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{q.toUpperCase()} End</label><input type="date" className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={(form as Record<string,string>)[`${q}_end`]} onChange={e=>f(`${q}_end`,e.target.value)}/></div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 rounded-xl gap-2" disabled={loading}>{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<Save className="h-4 w-4"/>}Create Cycle</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CyclesPage() {
  const supabase = createClient();
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toggling, setToggling] = useState<string|null>(null);

  const load = useCallback(async()=>{
    setLoading(true);
    const { data } = await supabase.from("performance_cycles").select("*").order("created_at",{ascending:false});
    setCycles(data as Cycle[]||[]);
    setLoading(false);
  },[supabase]);

  useEffect(()=>{load();},[load]);

  const setActive = async(id:string)=>{
    setToggling(id);
    await supabase.from("performance_cycles").update({status:"archived"}).neq("id",id);
    await supabase.from("performance_cycles").update({status:"active"}).eq("id",id);
    await load(); setToggling(null);
  };

  return (
    <div className="space-y-6 page-fade">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Performance Cycles</h1><p className="text-muted-foreground text-sm mt-0.5">Configure annual performance cycle windows</p></div>
        <Button className="gap-2 rounded-xl shadow-sm" onClick={()=>setShowModal(true)}><Plus className="h-4 w-4"/>New Cycle</Button>
      </div>
      {loading?<div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>:(
        <div className="space-y-4">
          {cycles.map(c=>(
            <Card key={c.id} className={c.status==="active"?"border-primary/30 shadow-sm":""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1"><p className="font-bold text-lg">{c.name}</p><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status]||""}`}>{c.status}</span></div>
                    <p className="text-sm text-muted-foreground">{c.financial_year} · {c.start_date} → {c.end_date}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                      {c.goal_setting_start&&<div><p className="text-muted-foreground font-semibold">Goal Setting</p><p>{c.goal_setting_start} → {c.goal_setting_end}</p></div>}
                      {c.q1_start&&<div><p className="text-muted-foreground font-semibold">Q1 Check-in</p><p>{c.q1_start}</p></div>}
                      {c.q2_start&&<div><p className="text-muted-foreground font-semibold">Q2 Check-in</p><p>{c.q2_start}</p></div>}
                      {c.q3_start&&<div><p className="text-muted-foreground font-semibold">Q3 Check-in</p><p>{c.q3_start}</p></div>}
                    </div>
                  </div>
                  {c.status!=="active"&&(
                    <Button size="sm" variant="outline" className="rounded-xl gap-2 shrink-0" onClick={()=>setActive(c.id)} disabled={toggling===c.id}>
                      {toggling===c.id?<Loader2 className="h-3.5 w-3.5 animate-spin"/>:<CheckCircle2 className="h-3.5 w-3.5"/>}Set Active
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <CycleModal open={showModal} onClose={()=>setShowModal(false)} onSave={load}/>
    </div>
  );
}
