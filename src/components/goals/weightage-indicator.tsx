import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
export function WeightageIndicator({ current, required, goalCount, maxGoals }: { current:number; required:number; goalCount:number; maxGoals:number }) {
  const percentage = Math.min((current/required)*100, 100);
  const isValid = current === required;
  const isOver = current > required;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span>Total Weightage: <span className={cn("font-semibold", isValid?"text-green-600":isOver?"text-red-600":"text-yellow-600")}>{current}%</span><span className="text-muted-foreground"> / {required}%</span></span>
        <span className="text-muted-foreground">Goals: {goalCount} / {maxGoals}</span>
      </div>
      <Progress value={percentage} className="h-2" indicatorClassName={cn(isValid?"bg-green-500":isOver?"bg-red-500":"bg-yellow-500")} />
    </div>
  );
}