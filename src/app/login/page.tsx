"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Loader2, Target, Sparkles, ArrowRight, Shield, TrendingUp, Users } from "lucide-react";

const DEMO_USERS = [
  { email: "admin@goalforge.com", password: "Admin@123456", role: "Admin", name: "Priya Sharma", title: "HR Director", color: "from-violet-500 to-purple-600" },
  { email: "manager@goalforge.com", password: "Manager@123456", role: "Manager", name: "Rajesh Kumar", title: "Engineering Manager", color: "from-indigo-500 to-blue-600" },
  { email: "employee1@goalforge.com", password: "Employee@123456", role: "Employee", name: "Ananya Patel", title: "Sr Developer", color: "from-sky-500 to-cyan-600" },
];

const roleIcons = { Admin: Shield, Manager: Users, Employee: TrendingUp };

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  };

  const loginAs = async (demoEmail: string, demoPass: string, userName: string) => {
    setActiveDemo(userName); setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPass });
      if (error) throw error;
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setActiveDemo(null); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 sidebar-gradient flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/3 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/15 ring-1 ring-white/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">GoalForge</span>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Enterprise</p>
            </div>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Align goals.<br />Drive performance.<br />
              <span className="text-white/50">Together.</span>
            </h1>
            <p className="text-white/55 mt-4 text-base leading-relaxed">
              The complete OKR and performance management platform for modern enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: TrendingUp, label: "Track Goals", desc: "Set, manage, and monitor performance goals in real-time" },
              { icon: Users, label: "Team Alignment", desc: "Cascade objectives from company to individual goals" },
              { icon: Sparkles, label: "Smart Insights", desc: "AI-powered analytics and performance recommendations" },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-white/80" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs text-white/45">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-white/25">
          © 2025–26 GoalForge Enterprise · All rights reserved
        </div>
      </div>

      {/* Right panel - login */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">GoalForge</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your workspace</p>
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Demo users */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quick Demo Access</p>
            <div className="space-y-2">
              {DEMO_USERS.map(u => {
                const Icon = roleIcons[u.role as keyof typeof roleIcons];
                const isActive = activeDemo === u.name;
                return (
                  <button
                    key={u.email}
                    onClick={() => loginAs(u.email, u.password, u.name)}
                    disabled={loading || isActive}
                    className="w-full group flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/3 transition-all duration-150 text-left disabled:opacity-60"
                  >
                    <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${u.color} flex items-center justify-center text-white shrink-0`}>
                      {isActive ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.title} · {u.role}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-2">or sign in manually</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Manual login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-sm font-semibold py-2.5 hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
