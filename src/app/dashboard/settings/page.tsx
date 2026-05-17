"use client";

import { useState } from "react";
import { User, Bell, Moon, Sun, Shield, Building2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifs, setNotifs] = useState({ approvals: true, deadlines: true, checkins: true, ai: true, badges: false });
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" />Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">PS</div>
            <div>
              <p className="font-semibold">Priya Sharma</p>
              <p className="text-sm text-muted-foreground">priya@company.com</p>
              <Badge variant="outline" className="mt-1 text-xs">Employee</Badge>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label className="text-xs">Full Name</Label><Input defaultValue="Priya Sharma" className="mt-1" /></div>
            <div><Label className="text-xs">Designation</Label><Input defaultValue="Senior Engineer" className="mt-1" /></div>
            <div><Label className="text-xs">Department</Label><Input defaultValue="Engineering" className="mt-1" /></div>
            <div><Label className="text-xs">Email</Label><Input defaultValue="priya@company.com" className="mt-1" disabled /></div>
          </div>
          <Button size="sm" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />{saved ? "Saved!" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base">{theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}Appearance</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${theme === "light" ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <Sun className="h-5 w-5 text-yellow-500" />
              <div className="text-left"><p className="font-medium text-sm">Light</p><p className="text-xs text-muted-foreground">Default theme</p></div>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${theme === "dark" ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <Moon className="h-5 w-5 text-blue-500" />
              <div className="text-left"><p className="font-medium text-sm">Dark</p><p className="text-xs text-muted-foreground">Easy on eyes</p></div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4" />Notification Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "approvals", label: "Goal Approvals", desc: "When your goal sheet is approved or rejected" },
            { key: "deadlines", label: "Deadline Reminders", desc: "Check-in and goal submission deadlines" },
            { key: "checkins", label: "Check-in Reminders", desc: "Quarterly check-in window notifications" },
            { key: "ai", label: "AI Insights", desc: "AI-generated performance tips and risk alerts" },
            { key: "badges", label: "Achievement Badges", desc: "When you earn a new badge" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`relative w-10 h-6 rounded-full transition-colors ${notifs[item.key as keyof typeof notifs] ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow ${notifs[item.key as keyof typeof notifs] ? "left-5" : "left-1"}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4" />Security</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div><p className="text-sm font-medium">Password</p><p className="text-xs text-muted-foreground">Last changed 3 months ago</p></div>
            <Button size="sm" variant="outline">Change</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div><p className="text-sm font-medium">Two-Factor Auth</p><p className="text-xs text-muted-foreground">Add extra security</p></div>
            <Badge variant="outline" className="bg-gray-100 text-gray-600">Disabled</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
