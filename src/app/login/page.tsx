"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Loader2, Target } from "lucide-react";
const DEMO_USERS = [
  { email:"admin@goalforge.com", password:"Admin@123456", role:"Admin", name:"Priya Sharma (HR Director)" },
  { email:"manager@goalforge.com", password:"Manager@123456", role:"Manager", name:"Rajesh Kumar (Eng Manager)" },
  { email:"employee1@goalforge.com", password:"Employee@123456", role:"Employee", name:"Ananya Patel (Sr Developer)" },
];
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try { const { error: signInError } = await supabase.auth.signInWithPassword({ email, password }); if (signInError) throw signInError; router.push("/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Login failed"); }
    finally { setLoading(false); }
  };
  const loginAs = async (demoEmail: string, demoPass: string) => {
    setLoading(true); setError(null);
    try { const { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPass }); if (error) throw error; router.push("/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Login failed"); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary"><Target className="h-6 w-6 text-primary-foreground" /></div></div>
          <h1 className="text-3xl font-bold">GoalForge</h1>
          <p className="text-muted-foreground">Enterprise Goal Setting Portal</p>
        </div>
        {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
        <Card>
          <CardHeader><CardTitle>Quick Demo Access</CardTitle><CardDescription>Click any user to login instantly</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {DEMO_USERS.map(u=>(
              <button key={u.email} onClick={()=>loginAs(u.email,u.password)} disabled={loading}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors flex justify-between items-center">
                <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{u.role}</span>
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign in with email</span></div></div>
        <Card><CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign In</Button>
          </form>
        </CardContent></Card>
      </div>
    </div>
  );
}