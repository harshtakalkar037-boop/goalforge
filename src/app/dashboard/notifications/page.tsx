"use client";
import { useState, useEffect, useCallback } from "react";
import { Bell, CheckCircle, Clock, AlertTriangle, Info, Sparkles, Check, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

const iconMap: Record<string, React.ElementType> = { success: CheckCircle, warning: Clock, ai: Sparkles, info: Info, alert: AlertTriangle };
const colorMap: Record<string, string> = {
  success: "text-green-600 bg-green-50 border-green-200",
  warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
  ai: "text-purple-600 bg-purple-50 border-purple-200",
  info: "text-blue-600 bg-blue-50 border-blue-200",
  alert: "text-red-600 bg-red-50 border-red-200",
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function NotificationsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setNotifications(data as Notification[] || []);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const deleteNotif = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = filter === "unread" ? notifications.filter(n => !n.is_read) : notifications;
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 page-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Notifications
            {unreadCount > 0 && <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{unreadCount} new</span>}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Stay updated on approvals, deadlines, and alerts</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={markAllRead}>
            <Check className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {["all", "unread"].map(f => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} className="rounded-xl capitalize" onClick={() => setFilter(f)}>{f}</Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="font-semibold">All caught up!</p>
            <p className="text-muted-foreground text-sm mt-1">{filter === "unread" ? "No unread notifications." : "No notifications yet."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const Icon = iconMap[n.type] || Info;
            const style = colorMap[n.type] || colorMap.info;
            return (
              <Card key={n.id} className={`transition-all ${n.is_read ? "opacity-60" : "shadow-sm border-primary/10"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${style}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className={`text-sm font-semibold ${n.is_read ? "text-muted-foreground" : ""}`}>{n.title}</p>
                            {!n.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <span className="text-[10px] text-muted-foreground">{timeAgo(n.created_at)}</span>
                          <button onClick={() => deleteNotif(n.id)} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      {!n.is_read && (
                        <button onClick={() => markRead(n.id)} className="text-xs text-primary hover:underline mt-1.5 font-medium">
                          Mark as read
                        </button>
                      )}
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
