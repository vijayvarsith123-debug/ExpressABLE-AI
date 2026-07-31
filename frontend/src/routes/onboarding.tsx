import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { AccessibilityControls } from "@/components/a11y/AccessibilityControls";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — ExpressAble AI" },
      {
        name: "description",
        content: "Set your learning goal, accessibility preferences and profile in three steps.",
      },
      { property: "og:title", content: "Onboarding — ExpressAble AI" },
      {
        property: "og:description",
        content: "A three step, fully keyboard accessible onboarding wizard.",
      },
    ],
  }),
  component: Onboarding,
});

const STORAGE_KEY = "expressable.onboarding";

const GOALS = [
  { id: "confidence", label: "Speak with more confidence" },
  { id: "interview", label: "Prepare for job interviews" },
  { id: "writing", label: "Write clearer emails and docs" },
  { id: "vocabulary", label: "Grow professional vocabulary" },
] as const;

type GoalId = (typeof GOALS)[number]["id"];

interface OnboardingState {
  step: number;
  goal: GoalId | null;
  name: string;
  role: string;
}

const INITIAL: OnboardingState = { step: 0, goal: null, name: "", role: "" };

const STEP_TITLES = ["Learning goal", "Accessibility setup", "Your profile"];

function Onboarding() {
  const navigate = useNavigate();
  const { announce } = useAccessibility();
  const [state, setState] = useState<OnboardingState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const nameId = useId();
  const roleId = useId();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...INITIAL, ...(JSON.parse(raw) as Partial<OnboardingState>) });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const canContinue =
    state.step === 0 ? state.goal !== null : state.step === 2 ? state.name.trim().length > 1 : true;

  const goTo = (next: number) => {
    setState((s) => ({ ...s, step: next }));
    announce(`Step ${next + 1} of 3: ${STEP_TITLES[next]}`);
  };

  const finish = async () => {
    window.localStorage.setItem(
      "expressable.profile",
      JSON.stringify({ name: state.name.trim(), role: state.role.trim(), goal: state.goal }),
    );
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const roleValue = state.role.trim() || "learner";
        const cleanRole = ["learner", "trainer", "institution", "admin"].includes(roleValue)
          ? (roleValue as "learner" | "trainer" | "institution" | "admin")
          : "learner";

        await supabase
          .from("profiles")
          .update({
            first_name: state.name.trim(),
            role: cleanRole,
          })
          .eq("user_id", session.user.id);
      }
    } catch (e) {
      console.error("Failed to sync onboarding to database:", e);
    }
    announce("Onboarding complete. Opening your dashboard.");
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">Let&apos;s set you up</h1>
      <p className="mt-2 text-muted-foreground">
        Three quick steps. Your answers are saved on this device as you go.
      </p>

      <ol className="mt-8 flex gap-2" aria-label="Onboarding progress">
        {STEP_TITLES.map((title, i) => (
          <li key={title} className="flex-1">
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-semibold",
                i < state.step && "border-success bg-success text-success-foreground",
                i === state.step && "border-primary bg-primary text-primary-foreground",
                i > state.step && "border-border bg-secondary text-muted-foreground",
              )}
              aria-current={i === state.step ? "step" : undefined}
            >
              <span className="flex items-center gap-1.5">
                {i < state.step && <Check aria-hidden="true" className="size-3.5" />}
                {i + 1}. {title}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <section aria-labelledby="step-heading" className="glass-card mt-6 rounded-xl p-6">
        <h2 id="step-heading" className="text-xl font-semibold">
          {STEP_TITLES[state.step]}
        </h2>

        {state.step === 0 && (
          <fieldset className="mt-5">
            <legend className="sr-only">Choose your main learning goal</legend>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Learning goal">
              {GOALS.map((goal) => {
                const active = state.goal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setState((s) => ({ ...s, goal: goal.id }))}
                    className={cn(
                      "min-h-11 rounded-lg border px-4 py-3 text-left text-sm font-medium",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-secondary",
                    )}
                  >
                    {goal.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {state.step === 1 && (
          <div className="mt-5">
            <p className="mb-4 text-sm text-muted-foreground">
              Tune the interface now — you can change any of this later with Alt + A.
            </p>
            <AccessibilityControls />
          </div>
        )}

        {state.step === 2 && (
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor={nameId} className="block text-sm font-semibold">
                Preferred name
              </label>
              <input
                id={nameId}
                value={state.name}
                required
                onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground"
                placeholder="e.g. Amara"
              />
            </div>
            <div>
              <label htmlFor={roleId} className="block text-sm font-semibold">
                Role or field (optional)
              </label>
              <input
                id={roleId}
                value={state.role}
                onChange={(e) => setState((s) => ({ ...s, role: e.target.value }))}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground"
                placeholder="e.g. Support specialist"
              />
            </div>
          </div>
        )}
      </section>

      <div className="mt-6 flex justify-between gap-3">
        <button
          type="button"
          disabled={state.step === 0}
          onClick={() => goTo(state.step - 1)}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-border bg-card px-4 text-sm font-semibold disabled:opacity-40"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => (state.step === 2 ? finish() : goTo(state.step + 1))}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          {state.step === 2 ? "Finish and open dashboard" : "Continue"}
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
