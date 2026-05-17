"use client";

import { Bell, CheckCircle, Clock, AlertTriangle, Info, Sparkles, Target, Users, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const allNotifications = [
  { id: "1", type: "success", category: "Approval", title: "Goal sheet approved", body: "Your goal sheet for FY 2025-26 was approved by Sunita Patel.", time: "2h ago", read: false },
  { id: "2", type: "warning", category: "Deadline", title: "Q2 check-in due in 5 days", body: "Submit your Q2 check-in values before October 15, 2025.", time: "5h ago", read: false },
  { id: "3", type: "ai", category: "AI Alert", title: "Goal at risk", body: "Your 'AWS Certification' goal has had no update for 3 weeks. Consider scheduling study time.", time: "1d ago", read: false },
  { id: "4", type: "info", category: "Cycle Update", title: "New performance cycle active", body: "FY 2025-26 Q2 check-in window is now open. Update your progress.", time: "2d ago", read: true },
  { id: "5", type: "success", category: "Badge", title: "Badge earned: Goal Crusher", body: "You've achieved 90%+ on 3 goals this cycle. Badge unlocked!", time: "3d ago", read: true },
  { id: "6", type: "info", category: "Team", title: "Shared goal assigned", body: "Admin assigned you the 'ISO 27001 Compliance' shared goal. Check your goals page.", time: "4d ago", read: true },
  { id: "7", type: "warning", category: "Reminder", title: "Manager review pending", body: "Your Q1 check-in is still awaiting manager review. You may follow up.", time: "5d ago", read: true },
  { id: "8", type: "success", category: "Check-in", title: "Manager reviewed your Q1 check-in", body: "Sunita Patel reviewed and commented on your Q1 check-in. Score: 88%.", time: "1w ago", read: true },
];

const iconMap: Record<string, React.ElementType> = { success: CheckCircle, warning: Clock, ai: Sparkles, info: Info, alert: AlertTriangle };
const colorMap: Record<string, string> = {
  success: "text-green-600 bg-green-50 border-green-200",
  warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
  ai: "text-purple-600 bg-purple-50 border-purple-200",
  info: "text-blue-600 bg-blue-50 border-blue-200",
  alert: "text-red-600 bg-red-50 border-red-200",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState("all");

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = filter === "unread" ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Notifications
            {unreadCount > 0 && <Badge className="bg-red-100 text-red-700">{unreadCount} new</Badge>}
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated on approvals, deadlines, and AI alerts</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
            <Check className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {["all", "unread"].map(f => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize">{f}</Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card><CardContent className="p-10 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No notifications here.</p>
          </CardContent></Card>
        )}
        {filtered.map(n => {
          const Icon = iconMap[n.type] || Info;
          const style = colorMap[n.type] || colorMap.info;
          return (
            <Card key={n.id} className={`transition-all ${n.read ? "opacity-70" : "shadow-sm"}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`h-9 w-9 rounded-full border flex items-center justify-center shrink-0 ${style}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`text-sm font-semibold ${n.read ? "text-muted-foreground" : ""}`}>{n.title}</p>
                          {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{n.body}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="outline" className="text-xs mb-1">{n.category}</Badge>
                        <p className="text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="text-xs text-primary hover:underline mt-2">Mark as read</button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
