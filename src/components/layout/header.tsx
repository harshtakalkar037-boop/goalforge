"use client";
import { useEffect, useState, useCallback } from "react";
import { Bell, Search, Sun, Moon, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Profile } from "@/lib/types";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

const greetings = ["Good morning", "Good afternoon", "Good evening"];
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? greetings[0] : h < 17 ? greetings[1] : greetings[2];
}

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700",
  manager: "bg-indigo-100 text-indigo-700",
  employee: "bg-emerald-100 text-emerald-700",
};

export function Header({ user, onSignOut }: { user: Profile; onSignOut: () => void }) {
  const supabase = createClient();
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const [dark, setDark] = useState(false);

  const loadUnread = useCallback(async () => {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    setUnread(count || 0);
  }, [supabase, user.id]);

  useEffect(() => { loadUnread(); }, [loadUnread]);

  // Theme toggle
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") { document.documentElement.classList.add("dark"); setDark(true); }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const roleLabel = { admin: "Administrator", manager: "Manager", employee: "Employee" }[user.role] || user.role;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 gap-4 shrink-0">
      {/* Left: greeting */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold leading-none">
              {greeting()}, <span className="text-primary">{user.full_name?.split(" ")[0] || "there"}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user.designation ? `${user.designation}${user.department ? ` · ${user.department}` : ""}` : roleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Dark mode */}
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={toggleDark}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <Link href="/dashboard/notifications">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl relative">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Button>
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2.5 rounded-xl hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {getInitials(user.full_name || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none">{user.full_name?.split(" ")[0]}</p>
                <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{user.role}</p>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-xl" align="end" sideOffset={6}>
            <DropdownMenuLabel>
              <div className="flex items-center gap-3 py-1">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {getInitials(user.full_name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${ROLE_BADGE[user.role] || ""}`}>
                    {roleLabel}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
