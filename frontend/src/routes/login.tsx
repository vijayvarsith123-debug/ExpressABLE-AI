import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — ExpressAble AI" },
      { name: "description", content: "Log in to your ExpressAble AI account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { announce } = useAccessibility();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        announce(`Login failed: ${error.message}`);
      } else {
        announce("Login successful, redirecting to dashboard");
        void navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(msg);
      announce(`Login failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-12 px-4">
      <div className="glass-card rounded-2xl border border-border p-8 shadow-xl bg-card">
        <h1 className="text-3xl font-bold text-center text-foreground">Welcome Back</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to access your communication workspace.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {errorMsg && (
            <div
              className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
              role="alert"
            >
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground">
              Email address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Mail className="size-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block min-h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="size-4" />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block min-h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
            <ArrowRight className="size-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
