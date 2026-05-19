"use client";
import { useState, useEffect, useCallback } from "react";
import { Trophy, Medal, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

interface LeaderEntry { id:string; name:string; dept:string|null; avgScore:number; goalsCount:number; checkinsCount:number; }

const MEDALS = ["🥇","🥈","🥉"];

export default function LeaderboardPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [quarter, setQuarter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const { data: cyc } = await supabase.from("performance_cycles").select("id").eq("status","active").maybeSingle();
    if (!cyc) { setLoading(false); return; }
    const { data: sheets } = await supabase.from("goal_sheets").select("id,employee_id,employee:profiles!goal_sheets_employee_id_fkey(full_name,department),goals(weightage,checkins(*))").eq("cycle_id",cyc.id).eq("status","approved");
    const result: LeaderEntry[] = [];
    (sheets||[]).forEach((sheet:Record<string,unknown>)=>{
      const emp = sheet.employee as {full_name:string;department:string|null}|null;
      const goals = sheet.goals as Record<string,unknown>[];
      let totalScore = 0, count = 0;
      let ciCount = 0;
      (goals||[]).forEach((g:Record<string,unknown>)=>{
        const checkins = (g.checkins as Record<string,unknown>[]) || [];
        const filtered = quarter==="all" ? checkins : checkins.filter((c:Record<string,unknown>)=>c.quarter===quarter);
        filtered.forEach((c:Record<string,unknown>)=>{
          totalScore += (c.progress_score as number)||0;
          count++;
          if ((c.status as string)!=="not_started") ciCount++;
        });
      });
      const avg = count > 0 ? Math.round(totalScore/count) : 0;
      result.push({ id:sheet.employee_id as string, name:emp?.full_name||"—", dept:emp?.department||null, avgScore:avg, goalsCount:(goals||[]).length, checkinsCount:ciCount });
    });
    result.sort((a,b)=>b.avgScore-a.avgScore);
    setEntries(result);
    setLoading(false);
  },[supabase,quarter]);

  useEffect(()=>{load();},[load]);

  const myRank = entries.findIndex(e=>e.id===user?.id)+1;

  return (
    <div className="space-y-6 page-fade">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3"><Trophy className="h-7 w-7 text-amber-500"/>Leaderboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Performance rankings based on goal achievement scores</p>
      </div>
      <div className="flex gap-2">
        {["all","Q1","Q2","Q3","Q4"].map(q=>(
          <button key={q} onClick={()=>setQuarter(q)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${quarter===q?"bg-primary text-white":"border hover:bg-accent"}`}>{q==="all"?"All Quarters":q}</button>
        ))}
      </div>
      {myRank > 0 && (
        <Card className="border-primary/20 bg-primary/4">
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="h-5 w-5 text-primary shrink-0"/>
            <p className="text-sm font-semibold">Your rank: <span className="text-primary">#{myRank}</span> of {entries.length} · Score: <span className="text-primary">{entries[myRank-1]?.avgScore||0}%</span></p>
          </CardContent>
        </Card>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
      ) : entries.length === 0 ? (
        <Card className="border-dashed"><CardContent className="p-12 text-center"><Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30"/><p className="font-semibold">No data yet</p><p className="text-muted-foreground text-sm mt-1">Leaderboard populates once check-ins are submitted.</p></CardContent></Card>
      ) : (
        <div className="space-y-2">
          {entries.map((e,i)=>{
            const isMe = e.id===user?.id;
            return (
              <Card key={e.id} className={`overflow-hidden transition-all ${isMe?"border-primary/30 bg-primary/4":"hover:shadow-sm"} ${i===0?"border-amber-300 bg-amber-50/50":i===1?"border-gray-300":i===2?"border-amber-700/30":""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 text-center shrink-0">
                      {i<3 ? <span className="text-2xl">{MEDALS[i]}</span> : <span className="text-sm font-bold text-muted-foreground">#{i+1}</span>}
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">{e.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{e.name}{isMe&&<span className="text-[10px] text-primary font-bold ml-1">(you)</span>}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{e.dept||"—"} · {e.goalsCount} goals · {e.checkinsCount} check-ins</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Progress value={e.avgScore} className="h-1.5 flex-1"/>
                        <span className={`text-xs font-bold shrink-0 ${e.avgScore>=80?"text-green-600":e.avgScore>=60?"text-yellow-600":e.avgScore>0?"text-red-500":"text-muted-foreground"}`}>{e.avgScore>0?`${e.avgScore}%`:"—"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
