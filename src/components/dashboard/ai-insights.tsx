import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Insight { type: "success" | "warning" | "tip" | "prediction"; title: string; body: string; }

const defaultInsights: Insight[] = [
  { type: "prediction", title: "Achievement Probability", body: "Based on your current velocity, you have an 87% chance of achieving all goals this cycle. Keep the momentum!" },
  { type: "tip", title: "Suggested Action", body: "Your 'AWS Certification' goal has had no progress in 3 weeks. Consider scheduling 2 hrs of study time this week." },
  { type: "warning", title: "Risk Detected", body: "Q2 check-in deadline is in 5 days. 2 of your goals still have no actual values submitted." },
  { type: "success", title: "Top Performer", body: "You're in the top 15% of your department this quarter. Your bug reduction goal is at 91% — exceptional work!" },
];

const iconMap = { success: TrendingUp, warning: AlertTriangle, tip: Lightbulb, prediction: Target };
const colorMap = {
  success: "border-green-200 bg-green-50/50",
  warning: "border-yellow-200 bg-yellow-50/50",
  tip: "border-blue-200 bg-blue-50/50",
  prediction: "border-purple-200 bg-purple-50/50",
};
const badgeMap = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  tip: "bg-blue-100 text-blue-700",
  prediction: "bg-purple-100 text-purple-700",
};
const iconColorMap = { success: "text-green-600", warning: "text-yellow-600", tip: "text-blue-600", prediction: "text-purple-600" };

export function AIInsights({ insights = defaultInsights }: { insights?: Insight[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-purple-500" /> AI Insights
          <Badge className="ml-auto bg-purple-100 text-purple-700 text-xs">Powered by AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((ins, i) => {
          const Icon = iconMap[ins.type];
          return (
            <div key={i} className={`p-3 rounded-lg border ${colorMap[ins.type]}`}>
              <div className="flex items-start gap-3">
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconColorMap[ins.type]}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold">{ins.title}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badgeMap[ins.type]}`}>{ins.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ins.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
