import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowRight, User as UserIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAccessibility } from "@/contexts/AccessibilityContext";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"learner" | "trainer" | "institution">("learner");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Auth Sign Up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        const userId = authData.user.id;

        // 2. Insert into public.users (in case database RLS requires it, mirroring schema users)
        const { error: userError } = await supabase
          .from("users")
          .insert([{ id: userId, email }])
          .select();

        // 3. Insert into public.profiles
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: userId,
              role,
              first_name: firstName,
              last_name: lastName,
            },
          ])
          .select();

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
              className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
              role="alert"
            >
              {errorMsg}
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
