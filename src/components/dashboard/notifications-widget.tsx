import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, Clock, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";

const notifications = [
  { type: "success", msg: "Your goal sheet was approved by Sunita Patel", time: "2h ago" },
  { type: "warning", msg: "Q2 check-in deadline in 5 days", time: "5h ago" },
  { type: "info", msg: "New performance cycle FY 2025-26 is now active", time: "1d ago" },
  { type: "alert", msg: "AWS Certification goal has no update for 3 weeks", time: "2d ago" },
];

const iconMap = { success: CheckCircle, warning: Clock, info: Info, alert: AlertTriangle };
const colorMap = { success: "text-green-600", warning: "text-yellow-600", info: "text-blue-600", alert: "text-red-600" };

export function NotificationsWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4" /> Notifications
          <Badge className="ml-auto bg-red-100 text-red-700 text-xs">4 new</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.type as keyof typeof iconMap];
          return (
            <div key={i} className="flex items-start gap-3">
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorMap[n.type as keyof typeof colorMap]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed">{n.msg}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
            </div>
          );
        })}
        <Link href="/dashboard/notifications" className="block text-xs text-primary font-medium hover:underline mt-2">View all notifications →</Link>
      </CardContent>
    </Card>
  );
}
