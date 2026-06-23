import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — CIS" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("auditor@acme.com");
  const [password, setPassword] = useState("audit2026");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, isLoading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email);
      toast.success("Signed in successfully");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error("Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      <div className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold">CIS</p>
            <p className="text-xs text-sidebar-foreground/60">We Make IT Possible</p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold leading-tight ">
            Continuous assurance over your ERP controls.
          </h2>
          <p className="max-w-md text-sm text-sidebar-foreground/70">
            Automated detection of segregation-of-duties conflicts, vendor master anomalies, payment
            exceptions, and unauthorized journal activity — all in one audit cockpit.
          </p>
          <div className="grid max-w-md grid-cols-3 gap-4 pt-6">
            {[
              { k: "SoD Rules", v: "240+" },
              { k: "ERP Connectors", v: "12" },
              { k: "Controls Library", v: "500+" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3"
              >
                <p className="text-xl font-semibold">{s.v}</p>
                <p className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">
                  {s.k}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-sidebar-foreground/50">SOC 2 Type II · ISO 27001 · GDPR Ready</p>
      </div>

      <div className="flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md border-border/60">
          <CardContent className="p-8">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">Access your ERP audit workspace.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/login" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={remember} onCheckedChange={(c) => setRemember(!!c)} />
                Remember me on this device
              </label>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs">
              <p className="font-medium text-foreground">Demo credentials</p>
              <p className="mt-1 text-muted-foreground">auditor@acme.com / audit2026</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
