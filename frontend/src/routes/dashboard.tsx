import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Check, Clock, Flame, Mic, Quote, RefreshCw, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { AccessibilityControls } from "@/components/a11y/AccessibilityControls";
import { Meter } from "@/components/Meter";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ExpressAble AI" },
      {
        name: "description",
        content:
          "Track words learned, practice minutes and your stage pathway in one accessible view.",
      },
      { property: "og:title", content: "Dashboard — ExpressAble AI" },
      {
        property: "og:description",
        content: "Progress statistics, stage pathway and inline accessibility controls.",
      },
    ],
  }),
  component: Dashboard,
});

interface Profile {
  name: string;
  role: string;
}

const STATS = [
  { icon: BookOpen, label: "Words learned", value: "428", hint: "+24 this week" },
  { icon: Clock, label: "Practice minutes", value: "312", hint: "+38 this week" },
  { icon: Flame, label: "Day streak", value: "12", hint: "Personal best: 19" },
  { icon: Trophy, label: "Sessions passed", value: "27", hint: "3 awaiting review" },
] as const;

const STAGES = [
  { name: "Foundations", state: "done" },
  { name: "Clear speech", state: "done" },
  { name: "Confident writing", state: "current" },
  { name: "Workplace talk", state: "todo" },
  { name: "Interview ready", state: "todo" },
] as const;

const QUOTES = [
  "Progress is a series of small, repeated attempts.",
  "Clarity beats speed — say it plainly and say it once.",
  "Your accent is information, not an error.",
  "Practise the conversation you are avoiding.",
];

function Dashboard() {
  const { reducedMotion, announce } = useAccessibility();
  const { user, profile: dbProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("expressable.profile");
      if (raw) setProfile(JSON.parse(raw) as Profile);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setQuoteIndex((i) => (i + 1) % QUOTES.length), 8000);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const name =
    dbProfile?.first_name || profile?.name?.trim() || (user ? user.email?.split("@")[0] : "friend");
  const activeRole = dbProfile?.role || profile?.role || "";

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Welcome back, {name}</h1>
        <p className="mt-2 text-muted-foreground">
          {activeRole ? `${activeRole} track · ` : ""}Here is where your practice stands today.
        </p>
      </header>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Progress statistics
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <li key={stat.label} className="glass-card rounded-xl p-5">
                <Icon aria-hidden="true" className="size-5 text-primary" />
                <p className="mt-3 text-3xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section
          aria-labelledby="pathway-heading"
          className="glass-card rounded-xl p-6 lg:col-span-2"
        >
          <h2 id="pathway-heading" className="text-xl font-bold">
            Stage pathway
          </h2>
          <ol className="mt-5 space-y-3">
            {STAGES.map((stage, i) => (
              <li key={stage.name} className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                    stage.state === "done" && "border-success bg-success text-success-foreground",
                    stage.state === "current" &&
                      "border-primary bg-primary text-primary-foreground",
                    stage.state === "todo" && "border-border bg-secondary text-muted-foreground",
                  )}
                >
                  {stage.state === "done" ? <Check aria-hidden="true" className="size-4" /> : i + 1}
                </span>
                <span className="flex-1 font-medium">{stage.name}</span>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    stage.state === "current"
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {stage.state === "done"
                    ? "Complete"
                    : stage.state === "current"
                      ? "In progress"
                      : "Locked"}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-6 space-y-4 border-t border-border pt-5">
            <Meter label="Pronunciation" value={78} tone="primary" />
            <Meter label="Fluency" value={64} tone="accent" />
            <Meter label="Written clarity" value={86} tone="success" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/assessment/speech"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              <Mic aria-hidden="true" className="size-4" />
              Continue speech practice
            </Link>
            <Link
              to="/vocabulary"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold"
            >
              <BookOpen aria-hidden="true" className="size-4" />
              Review vocabulary
            </Link>
          </div>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="quote-heading" className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h2
                id="quote-heading"
                className="text-sm font-bold uppercase tracking-wide text-muted-foreground"
              >
                Daily motivation
              </h2>
              <button
                type="button"
                aria-label="Show another motivation quote"
                onClick={() => {
                  const next = (quoteIndex + 1) % QUOTES.length;
                  setQuoteIndex(next);
                  announce(QUOTES[next]!);
                }}
                className="inline-flex size-11 items-center justify-center rounded-lg border border-border"
              >
                <RefreshCw aria-hidden="true" className="size-4" />
              </button>
            </div>
            <Quote aria-hidden="true" className="mt-4 size-6 text-accent" />
            <p className="mt-2 text-lg font-medium" aria-live="polite">
              {QUOTES[quoteIndex]}
            </p>
            {reducedMotion && (
              <p className="mt-3 text-xs text-muted-foreground">
                Auto-rotation is paused because reduced motion is on.
              </p>
            )}
          </section>

          <section aria-labelledby="achievements-heading" className="glass-card rounded-xl p-6">
            <h2 id="achievements-heading" className="text-xl font-bold flex items-center gap-2">
              <Trophy className="size-5 text-warning" />
              Achievements
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Earn badges as you practice communication skills.
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">First Word Spoken</h3>
                  <p className="text-xs text-muted-foreground">
                    Completed a speech coach practice.
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Clear Writer</h3>
                  <p className="text-xs text-muted-foreground">
                    Scanned first draft in writing coach.
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border opacity-70">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground border border-dashed border-border font-bold text-xs">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Interview Ready</h3>
                  <p className="text-xs text-muted-foreground">
                    Rehearse a full mock interview session.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section aria-labelledby="a11y-widget-heading" className="glass-card rounded-xl p-6">
            <h2 id="a11y-widget-heading" className="text-xl font-bold">
              Accessibility controls
            </h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              Adjust the interface without leaving your dashboard.
            </p>
            <AccessibilityControls />
          </section>
        </div>
      </div>
    </div>
  );
}
