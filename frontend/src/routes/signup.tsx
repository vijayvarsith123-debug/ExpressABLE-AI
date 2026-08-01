import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowRight, User as UserIcon, UserCheck, AlertTriangle, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — ExpressAble AI" },
      { name: "description", content: "Create an ExpressAble AI account." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const { announce } = useAccessibility();
  const { signInAsGuest } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"learner" | "trainer" | "institution">("learner");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRateLimit, setIsRateLimit] = useState(false);

  const handleGoogleSignup = async () => {
    setErrorMsg(null);
    setIsRateLimit(false);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(msg);
      announce(`Google registration failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectLoginAttempt = async () => {
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        announce("Signed in successfully, redirecting to dashboard");
        void navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Direct login failed.";
      setErrorMsg(`Direct login attempt failed: ${msg}`);
      announce(`Direct login failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    signInAsGuest(role, firstName || "Demo", lastName || "User");
    announce("Signed in in Guest Demo mode. Redirecting to dashboard.");
    void navigate({ to: "/dashboard" });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsRateLimit(false);
    setLoading(true);

    try {
      // 1. Auth Sign Up
      let authUser = null;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        const errStr = authError.message || String(authError);
        const checkRateLimit =
          errStr.toLowerCase().includes("rate limit") ||
          (authError as unknown as { status?: number }).status === 429 ||
          (authError as unknown as { code?: string }).code === "over_email_send_rate_limit" ||
          (authError as unknown as { code?: string }).code === "email_rate_limit_exceeded";

        if (checkRateLimit) {
          // Attempt automatic fallback sign-in in case account was created
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!loginError && loginData?.user) {
            authUser = loginData.user;
          } else {
            setIsRateLimit(true);
            setErrorMsg(
              "Supabase Email Sending Limit Exceeded: Supabase limits email confirmations on default project settings."
            );
            announce("Email rate limit exceeded. Direct login or Guest mode available.");
            return;
          }
        } else {
          throw authError;
        }
      } else {
        authUser = authData?.user ?? null;
      }

      if (authUser) {
        const userId = authUser.id;

        // 2. Insert or upsert into public.users
        try {
          await supabase.from("users").upsert([{ id: userId, email }], { onConflict: "id" });
        } catch {
          // Non-blocking if table exists or RLS handles it
        }

        // 3. Insert or upsert into public.profiles
        try {
          await supabase.from("profiles").upsert(
            [
              {
                user_id: userId,
                role,
                first_name: firstName,
                last_name: lastName,
              },
            ],
            { onConflict: "user_id" }
          );
        } catch {
          // Non-blocking
        }

        announce("Registration successful, redirecting to dashboard");
        void navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(msg);
      announce(`Registration failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-12 px-4">
      <div className="glass-card rounded-2xl border border-border p-8 shadow-xl bg-card">
        <h1 className="text-3xl font-bold text-center text-foreground">Create Account</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Join ExpressAble AI to start your personalized training.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          {errorMsg && (
            <div
              className={`p-4 rounded-lg border text-sm font-medium ${
                isRateLimit
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              }`}
              role="alert"
            >
              <div className="flex items-start gap-2">
                {isRateLimit && <AlertTriangle className="size-5 shrink-0 text-amber-500 mt-0.5" />}
                <div>
                  <p>{errorMsg}</p>

                  {isRateLimit && (
                    <div className="mt-3 flex flex-col gap-2">
                      <p className="text-xs font-normal">Choose an option below to proceed instantly:</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleDirectLoginAttempt}
                          disabled={loading}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <UserCheck className="size-3" /> Try Direct Sign In
                        </button>
                        <button
                          type="button"
                          onClick={handleGuestLogin}
                          className="px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Sparkles className="size-3" /> Continue as Guest (Demo)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-semibold text-foreground">
                First Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <UserIcon className="size-4" />
                </span>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block min-h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Amara"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-semibold text-foreground">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Chen"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground">
              Email Address
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
            <label htmlFor="password" className="block text-sm font-semibold text-foreground">
              Password
            </label>
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
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-semibold text-foreground">
              I want to practise as a
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "learner" | "trainer" | "institution")}
              className="block min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="learner">Learner (Practise communication skills)</option>
              <option value="trainer">Trainer / Coach (Review and guide learners)</option>
              <option value="institution">Institution / Organization (Monitor departments)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignup}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-secondary transition-all disabled:opacity-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-primary/10 transition-all"
          >
            <Sparkles className="size-4" />
            Quick Demo / Guest Mode
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg className="size-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

