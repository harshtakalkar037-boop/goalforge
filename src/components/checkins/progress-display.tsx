import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getProgressColor, getProgressBgColor } from "@/lib/calculations";
export function ProgressDisplay({ score, showLabel=true, size="md", className }: { score:number; showLabel?:boolean; size?:"sm"|"md"|"lg"; className?:string }) {
  const heights = { sm:"h-1.5", md:"h-2", lg:"h-3" };
  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className={getProgressColor(score)}>{score.toFixed(1)}%</span></div>}
      <Progress value={Math.min(score,100)} className={heights[size]} indicatorClassName={getProgressBgColor(score)} />
    </div>
  );
}