import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
export function StatsCards({ stats }: { stats:{ label:string; value:string|number; icon:LucideIcon; change?:string; changeType?:"positive"|"negative"|"neutral" }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat,i)=>(
        <Card key={i}><CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              {stat.change && <p className={cn("text-xs mt-1", stat.changeType==="positive"&&"text-green-600", stat.changeType==="negative"&&"text-red-600", stat.changeType==="neutral"&&"text-muted-foreground")}>{stat.change}</p>}
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"><stat.icon className="h-6 w-6 text-primary" /></div>
          </div>
        </CardContent></Card>
      ))}
    </div>
  );
}