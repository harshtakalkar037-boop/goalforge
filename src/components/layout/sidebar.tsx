"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Target, CheckSquare, Users, ClipboardCheck, MessageSquare,
  Calendar, Share2, FileText, BarChart3, LogOut, Bell, Settings, Trophy,
  Briefcase, BookOpen, Sparkles, ChevronRight
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

const navItems: Record<UserRole, { href: string; label: string; icon: string; badge?: string; group?: string }[]> = {
  employee: [
    { href: "/dashboard/employee", label: "Dashboard", icon: "LayoutDashboard", group: "Overview" },
    { href: "/dashboard/employee/goals", label: "My Goals", icon: "Target", group: "Work" },
    { href: "/dashboard/employee/checkins", label: "Check-ins", icon: "CheckSquare", group: "Work" },
    { href: "/dashboard/objectives", label: "Objectives", icon: "BookOpen", group: "Work" },
    { href: "/dashboard/projects", label: "Projects", icon: "Briefcase", group: "Work" },
    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "Trophy", group: "Insights" },
    { href: "/dashboard/reports", label: "Reports", icon: "FileText", group: "Insights" },
    { href: "/dashboard/notifications", label: "Notifications", icon: "Bell", badge: "4", group: "System" },
    { href: "/dashboard/settings", label: "Settings", icon: "Settings", group: "System" },
  ],
  manager: [
    { href: "/dashboard/manager", label: "Dashboard", icon: "LayoutDashboard", group: "Overview" },
    { href: "/dashboard/manager/team", label: "Team Overview", icon: "Users", group: "Team" },
    { href: "/dashboard/manager/approvals", label: "Approvals", icon: "ClipboardCheck", badge: "3", group: "Team" },
    { href: "/dashboard/manager/checkins", label: "Team Check-ins", icon: "MessageSquare", group: "Team" },
    { href: "/dashboard/objectives", label: "Objectives", icon: "BookOpen", group: "Work" },
    { href: "/dashboard/projects", label: "Projects", icon: "Briefcase", group: "Work" },
    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "Trophy", group: "Insights" },
    { href: "/dashboard/reports", label: "Reports", icon: "FileText", group: "Insights" },
    { href: "/dashboard/notifications", label: "Notifications", icon: "Bell", badge: "2", group: "System" },
    { href: "/dashboard/settings", label: "Settings", icon: "System" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: "LayoutDashboard", group: "Overview" },
    { href: "/dashboard/admin/cycles", label: "Cycles", icon: "Calendar", group: "Admin" },
    { href: "/dashboard/admin/shared-goals", label: "Shared Goals", icon: "Share2", group: "Admin" },
    { href: "/dashboard/admin/users", label: "Users", icon: "Users", group: "Admin" },
    { href: "/dashboard/admin/audit", label: "Audit Log", icon: "FileText", group: "Admin" },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: "BarChart3", group: "Admin" },
    { href: "/dashboard/objectives", label: "Objectives", icon: "BookOpen", group: "Work" },
    { href: "/dashboard/projects", label: "Projects", icon: "Briefcase", group: "Work" },
    { href: "/dashboard/notifications", label: "Notifications", icon: "Bell", group: "System" },
    { href: "/dashboard/settings", label: "Settings", icon: "Settings", group: "System" },
  ],
};

export function Sidebar({ role, onSignOut, user }: { role: UserRole; onSignOut: () => void; user?: { full_name: string; email: string; role: string } }) {
  const pathname = usePathname();
  const items = navItems[role] || [];

  // Group items
  const groups: Record<string, typeof items> = {};
  items.forEach(item => {
    const g = item.group || "Other";
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });

  return (
    <div className="flex h-full w-64 flex-col sidebar-gradient">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white leading-none">GoalForge</span>
            <p className="text-[10px] text-white/50 leading-none mt-0.5 uppercase tracking-widest">Enterprise</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-5">
          {Object.entries(groups).map(([groupName, groupItems]) => (
            <div key={groupName}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/35">{groupName}</p>
              <div className="space-y-0.5">
                {groupItems.map(item => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                        isActive
                          ? "bg-white/15 text-white shadow-sm"
                          : "text-white/60 hover:bg-white/8 hover:text-white/90"
                      )}
                    >
                      <div className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-lg transition-all",
                        isActive ? "bg-white/20" : "group-hover:bg-white/10"
                      )}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          "text-[10px] font-bold h-5 min-w-5 flex items-center justify-center px-1.5 rounded-full",
                          isActive ? "bg-white/25 text-white" : "bg-red-500/80 text-white"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="h-3 w-3 text-white/40" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User footer */}
      <div className="border-t border-white/10 p-3">
        {user && (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.full_name}</p>
              <p className="text-[10px] text-white/45 capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:bg-white/8 hover:text-white/80 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
