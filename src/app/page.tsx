"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Target, ArrowRight, CheckCircle, BarChart3, Users, Shield, TrendingUp, Zap, Star, ChevronDown, Sparkles, Clock, Award, Globe, Lock, Bell, FileText } from "lucide-react";

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const STATS = [{ value: "10,000+", label: "Goals tracked" }, { value: "98%", label: "On-time completion" }, { value: "3×", label: "Faster reviews" }, { value: "40%", label: "Performance gain" }];
const FEATURES = [
  { icon: Target, title: "Goal Management", desc: "Create goals with thrust areas, UoM types, and weightage. System enforces 100% total weightage and max 8 goals per employee.", color: "from-violet-500 to-purple-600" },
  { icon: CheckCircle, title: "Approval Workflow", desc: "Managers review, edit inline, and approve or return goal sheets. Goals are locked post-approval with full audit trail.", color: "from-indigo-500 to-blue-600" },
  { icon: BarChart3, title: "Quarterly Check-ins", desc: "Log actual achievements each quarter. System auto-calculates progress scores using formula based on UoM type.", color: "from-sky-500 to-cyan-600" },
  { icon: Users, title: "Shared Goals", desc: "Push departmental KPIs to multiple employees at once. Recipients adjust weightage only — title and targets are locked.", color: "from-emerald-500 to-green-600" },
  { icon: FileText, title: "Reports & Exports", desc: "Download achievement reports as CSV or PDF. Real-time completion dashboards for managers and admins.", color: "from-orange-500 to-amber-500" },
  { icon: Bell, title: "Smart Notifications", desc: "Deadline reminders, approval updates, and check-in alerts. Never miss a step in the performance cycle.", color: "from-rose-500 to-pink-600" },
];
const ROLES = [
  { icon: Shield, role: "Admin / HR", color: "bg-violet-100 text-violet-700", tasks: ["Configure performance cycles", "Manage org hierarchy", "Unlock goals after approval", "View full audit logs", "Push shared goals org-wide"] },
  { icon: Users, role: "Manager (L1)", color: "bg-indigo-100 text-indigo-700", tasks: ["Review & approve goal sheets", "Edit targets inline during review", "Log quarterly check-in feedback", "Monitor team progress dashboard", "Export team achievement reports"] },
  { icon: TrendingUp, role: "Employee", color: "bg-emerald-100 text-emerald-700", tasks: ["Create and submit goal sheets", "Track quarterly achievements", "Log actual values vs targets", "View progress scores in real-time", "Download personal performance report"] },
];
const TIMELINE = [
  { period: "May", phase: "Phase 1 — Goal Setting", desc: "Create goals, submit for approval, get locked in", icon: Target, color: "bg-violet-500" },
  { period: "July", phase: "Q1 Check-in", desc: "Log actual achievements vs planned targets", icon: BarChart3, color: "bg-indigo-500" },
  { period: "October", phase: "Q2 Check-in", desc: "Mid-year progress update with manager review", icon: TrendingUp, color: "bg-sky-500" },
  { period: "January", phase: "Q3 Check-in", desc: "Three-quarter mark — performance insights surface", icon: Zap, color: "bg-emerald-500" },
  { period: "March/April", phase: "Q4 / Annual Review", desc: "Final achievement capture and performance scoring", icon: Award, color: "bg-amber-500" },
];

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) router.replace("/dashboard"); else setLoading(false); });
  }, [router, supabase]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center sidebar-gradient">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center animate-pulse"><Target className="h-7 w-7 text-white" /></div>
        <p className="text-white/60 text-sm">Loading GoalForge…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center"><Target className="h-4 w-4 text-white" /></div>
          <span className="font-bold text-base">GoalForge</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest hidden sm:block">Enterprise</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
          <Link href="/login" className="flex items-center gap-1.5 text-sm font-semibold bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">Get Started <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 sidebar-gradient" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-8">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" /> Enterprise Performance Management Platform
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight mb-6">
            Align Goals.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">Drive Growth.</span><br />
            Together.
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            The complete OKR and performance management platform. Set goals, track quarterly achievements, and surface insights — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-2xl hover:bg-white/90 transition-all shadow-xl shadow-black/20 text-sm">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
              See how it works <ChevronDown className="h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/10">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce"><ChevronDown className="h-6 w-6" /></div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 bg-primary/8 rounded-full">Features</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-4 mb-4">Everything you need to manage performance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From goal creation to quarterly check-ins and final appraisals — GoalForge handles the complete performance lifecycle.</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <AnimatedSection key={i} delay={i * 80}>
                <div className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg transition-all h-full">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 px-6 bg-accent/30">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 bg-primary/8 rounded-full">Performance Cycle</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-4 mb-4">One year, five milestones</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">The portal enforces quarterly check-in windows so every employee and manager stays accountable.</p>
          </AnimatedSection>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {TIMELINE.map((t, i) => (
                <AnimatedSection key={i} delay={i * 100}>
                  <div className="relative flex gap-6 pl-16">
                    <div className={`absolute left-0 h-12 w-12 rounded-2xl ${t.color} flex items-center justify-center shadow-sm`}><t.icon className="h-6 w-6 text-white" /></div>
                    <div className="flex-1 pb-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">{t.period}</span>
                      <h3 className="font-bold text-lg mt-2">{t.phase}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{t.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 bg-primary/8 rounded-full">User Roles</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-4 mb-4">Built for every level of your org</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three distinct roles with clearly differentiated access and capabilities.</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-3 gap-6">
            {ROLES.map((r, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="p-6 rounded-2xl border border-border bg-card h-full">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold mb-5 ${r.color}`}><r.icon className="h-4 w-4" />{r.role}</div>
                  <ul className="space-y-2.5">
                    {r.tasks.map((task, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm"><CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span className="text-muted-foreground">{task}</span></li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 sidebar-gradient opacity-95" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <Globe className="h-12 w-12 text-white/50 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-10">
              To make performance management transparent, fair, and effective — so every employee understands what success looks like and has the tools to achieve it.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              {[{ icon: Lock, title: "Transparency", desc: "Every goal, target, and achievement is visible to the right people — no black boxes." }, { icon: Star, title: "Fairness", desc: "System-enforced rules ensure consistent evaluation across all departments." }, { icon: Zap, title: "Efficiency", desc: "Automated workflows let managers focus on coaching, not admin." }].map((v, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/8 border border-white/10">
                  <v.icon className="h-6 w-6 text-violet-300 mb-3" />
                  <h3 className="font-bold text-white mb-1">{v.title}</h3>
                  <p className="text-white/55 text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6"><Target className="h-8 w-8 text-white" /></div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Ready to forge your goals?</h2>
            <p className="text-muted-foreground mb-8 text-lg">Join teams using GoalForge to align objectives, track performance, and drive results.</p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-10 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 text-base">
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center"><Target className="h-3.5 w-3.5 text-white" /></div>
            <span className="font-bold text-sm">GoalForge Enterprise</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025–26 GoalForge. All rights reserved.</p>
          <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
        </div>
      </footer>
    </div>
  );
}
