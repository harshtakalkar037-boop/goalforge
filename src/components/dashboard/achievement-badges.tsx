import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, Zap, Target, TrendingUp, Shield } from "lucide-react";

const badges = [
  { icon: Star, label: "Top Performer", desc: "Top 15% this quarter", color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-200", earned: true },
  { icon: Zap, label: "Fast Starter", desc: "Goals set in first week", color: "text-blue-500", bg: "bg-blue-50 border-blue-200", earned: true },
  { icon: Target, label: "Goal Crusher", desc: "3 goals at 90%+", color: "text-green-500", bg: "bg-green-50 border-green-200", earned: true },
  { icon: TrendingUp, label: "Consistent", desc: "4 check-ins on time", color: "text-purple-500", bg: "bg-purple-50 border-purple-200", earned: false },
  { icon: Shield, label: "Reliable", desc: "Zero overdue check-ins", color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-200", earned: false },
  { icon: Award, label: "Overachiever", desc: "Score 100%+ on a goal", color: "text-orange-500", bg: "bg-orange-50 border-orange-200", earned: false },
];

export function AchievementBadges() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="h-4 w-4 text-yellow-500" /> Achievement Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b, i) => (
            <div key={i} className={`p-3 rounded-lg border text-center transition-all ${b.earned ? b.bg : "bg-muted/30 border-muted opacity-50 grayscale"}`}>
              <b.icon className={`h-6 w-6 mx-auto mb-1 ${b.earned ? b.color : "text-muted-foreground"}`} />
              <p className="text-xs font-semibold leading-tight">{b.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{b.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">3 of 6 badges earned this cycle</p>
      </CardContent>
    </Card>
  );
}
