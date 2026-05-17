"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Target, CheckSquare, Users, ClipboardCheck, MessageSquare,
  Calendar, Share2, FileText, BarChart3, LogOut, Bell, Settings, Trophy,
  Briefcase, BookOpen, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Target, CheckSquare, Users, ClipboardCheck, MessageSquare,
  Calendar, Share2, FileText, BarChart3, Bell, Settings, Trophy, Briefcase, BookOpen, Sparkles,
};

const navItems: Record<UserRole, { href: string; label: string; icon: string; badge?: string }[]> = {
  employee: [
    { href: "/dashboard/employee", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/dashboard/employee/goals", label: "My Goals", icon: "Target" },
    { href: "/dashboard/employee/checkins", label: "Check-ins", icon: "CheckSquare" },
    { href: "/dashboard/objectives", label: "Objectives", icon: "BookOpen" },
    { href: "/dashboard/projects", label: "Projects", icon: "Briefcase" },
    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "Trophy" },
    { href: "/dashboard/notifications", label: "Notifications", icon: "Bell", badge: "4" },
    { href: "/dashboard/reports", label: "Reports", icon: "FileText" },
    { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
  ],
  manager: [
    { href: "/dashboard/manager", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/dashboard/manager/team", label: "Team Overview", icon: "Users" },
    { href: "/dashboard/manager/approvals", label: "Approvals", icon: "ClipboardCheck", badge: "3" },
    { href: "/dashboard/manager/checkins", label: "Team Check-ins", icon: "MessageSquare" },
    { href: "/dashboard/objectives", label: "Objectives", icon: "BookOpen" },
    { href: "/dashboard/projects", label: "Projects", icon: "Briefcase" },
    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "Trophy" },
    { href: "/dashboard/notifications", label: "Notifications", icon: "Bell", badge: "2" },
    { href: "/dashboard/reports", label: "Reports", icon: "FileText" },
    { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/dashboard/admin/cycles", label: "Cycles", icon: "Calendar" },
    { href: "/dashboard/admin/shared-goals", label: "Shared Goals", icon: "Share2" },
    { href: "/dashboard/admin/users", label: "Users", icon: "Users" },
    { href: "/dashboard/admin/audit", label: "Audit Log", icon: "FileText" },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: "BarChart3" },
    { href: "/dashboard/objectives", label: "Objectives", icon: "BookOpen" },
    { href: "/dashboard/projects", label: "Projects", icon: "Briefcase" },
    { href: "/dashboard/notifications", label: "Notifications", icon: "Bell" },
    { href: "/dashboard/reports", label: "Reports", icon: "FileText" },
    { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
  ],
};

export function Sidebar({ role, onSignOut }: { role: UserRole; onSignOut: () => void }) {
  const pathname = usePathname();
  const items = navItems[role] || [];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold leading-none">GoalForge</span>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">Enterprise</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {items.map(item => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge className={cn("text-xs h-5 min-w-5 flex items-center justify-center px-1.5", isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-700")}>
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-3">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={onSignOut}>
          <LogOut className="h-4 w-4" />Sign Out
        </Button>
      </div>
    </div>
  );
}
