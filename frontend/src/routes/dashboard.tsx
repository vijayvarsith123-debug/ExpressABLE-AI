import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Check, Clock, Flame, Mic, Quote, RefreshCw, Trophy } from "lucide-react";
import { useEffect, useState, type ElementType } from "react";
import { AccessibilityControls } from "@/components/a11y/AccessibilityControls";
import { Meter } from "@/components/Meter";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

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

  const [stats, setStats] = useState<
    Array<{ icon: ElementType; label: string; value: string; hint: string }>
  >([
    { icon: BookOpen, label: "Words learned", value: "428", hint: "+24 this week" },
    { icon: Clock, label: "Practice minutes", value: "312", hint: "+38 this week" },
    { icon: Flame, label: "Day streak", value: "12", hint: "Personal best: 19" },
    { icon: Trophy, label: "Sessions passed", value: "27", hint: "3 awaiting review" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!dbProfile?.id) return;

      try {
        const { count: speechCount } = await supabase
          .from("speech_assessments")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", dbProfile.id);

        const { count: writingCount } = await supabase
          .from("writing_assessments")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", dbProfile.id);

        const { count: interviewCount } = await supabase
          .from("mock_interviews")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", dbProfile.id);

        const sCount = speechCount || 0;
        const wCount = writingCount || 0;
        const iCount = interviewCount || 0;
        const totalSessions = sCount + wCount + iCount;

        // Calculate estimated stats based on real activities
        const practiceMinutes = Math.round(sCount * 1.5 + wCount * 2.5 + iCount * 5.0);
        const wordsLearned = sCount * 3 + wCount * 5 + 15; // baseline start plus practice

        setStats([
          {
            icon: BookOpen,
            label: "Words learned",
            value: String(wordsLearned),
            hint: `Based on your exercises`,
          },
          {
            icon: Clock,
            label: "Practice minutes",
            value: String(practiceMinutes),
            hint: `${totalSessions} active sessions`,
          },
          {
            icon: Flame,
            label: "Day streak",
            value: totalSessions > 0 ? "2" : "0",
            hint: totalSessions > 0 ? "Daily streak active" : "Start practicing to build streak",
          },
          {
            icon: Trophy,
            label: "Sessions passed",
            value: String(totalSessions),
            hint: `${sCount} speech, ${wCount} writing, ${iCount} interview`,
          },
        ]);
      } catch (err) {
        console.error("Error fetching user stats:", err);
      }
    };

    void fetchStats();
  }, [dbProfile]);

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

  // 1. Trainer Dashboard View
  if (activeRole === "trainer") {
    return (
      <div className="space-y-10 animate-fade-in">
        <header>
          <h1 className="text-3xl font-bold">Trainer Console: {name}</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor student communication progress, review speech reports, and author coach
            feedback.
          </p>
        </header>

        <section aria-label="Trainer Stats">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li className="glass-card rounded-xl p-5">
              <User className="size-5 text-primary" />
              <p className="mt-3 text-3xl font-bold">14</p>
              <p className="text-sm font-medium">Assigned Learners</p>
              <p className="text-xs text-muted-foreground">3 active today</p>
            </li>
            <li className="glass-card rounded-xl p-5">
              <Trophy className="size-5 text-warning" />
              <p className="mt-3 text-3xl font-bold">78%</p>
              <p className="text-sm font-medium">Avg Readiness Score</p>
              <p className="text-xs text-muted-foreground">+2% from last week</p>
            </li>
            <li className="glass-card rounded-xl p-5">
              <Clock className="size-5 text-success" />
              <p className="mt-3 text-3xl font-bold">3.5h</p>
              <p className="text-sm font-medium">Total Speech Audited</p>
              <p className="text-xs text-muted-foreground">12 recordings reviewed</p>
            </li>
            <li className="glass-card rounded-xl p-5">
              <Check className="size-5 text-accent" />
              <p className="mt-3 text-3xl font-bold">3</p>
              <p className="text-sm font-medium">Awaiting Feedback</p>
              <p className="text-xs text-destructive font-semibold">Requires attention</p>
            </li>
          </ul>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="glass-card rounded-xl p-6 lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Student Progress Directory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                    <th className="py-3 font-semibold">Student Name</th>
                    <th className="py-3 font-semibold">Track</th>
                    <th className="py-3 font-semibold">Last Active</th>
                    <th className="py-3 font-semibold">Readiness</th>
                    <th className="py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  <tr>
                    <td className="py-3 font-medium text-foreground">Vijay Varshith</td>
                    <td className="py-3">Software Dev</td>
                    <td className="py-3">2 hrs ago</td>
                    <td className="py-3 text-success font-semibold">88%</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-xs text-success font-semibold">
                        A-Grade
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-foreground">Pranathee H</td>
                    <td className="py-3">HR Manager</td>
                    <td className="py-3">Yesterday</td>
                    <td className="py-3 text-success font-semibold">91%</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-xs text-success font-semibold">
                        A-Grade
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-foreground">Raghunandhan PK</td>
                    <td className="py-3">Customer Support</td>
                    <td className="py-3">3 days ago</td>
                    <td className="py-3 text-warning font-semibold">74%</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-xs text-warning font-semibold">
                        Needs Audit
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="glass-card rounded-xl p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold">Trainer Actions</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Quickly review recordings or publish notes for your learners.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button className="w-full min-h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                Review Speech Recordings
              </button>
              <button className="w-full min-h-11 rounded-lg border border-border bg-card text-foreground font-semibold text-sm">
                Publish Training Report
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // 2. Institution Dashboard View
  if (activeRole === "institution") {
    return (
      <div className="space-y-10 animate-fade-in">
        <header>
          <h1 className="text-3xl font-bold">Institution Dashboard: {name}</h1>
          <p className="mt-2 text-muted-foreground">
            Institutional overview of communication training across departments and classes.
          </p>
        </header>

        <section aria-label="Institution Stats">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li className="glass-card rounded-xl p-5">
              <BookOpen className="size-5 text-primary" />
              <p className="mt-3 text-3xl font-bold">182</p>
              <p className="text-sm font-medium">Enrolled Students</p>
              <p className="text-xs text-muted-foreground">Across 3 departments</p>
            </li>
            <li className="glass-card rounded-xl p-5">
              <User className="size-5 text-warning" />
              <p className="mt-3 text-3xl font-bold">8</p>
              <p className="text-sm font-medium">Active Instructors</p>
              <p className="text-xs text-muted-foreground">2 on-call today</p>
            </li>
            <li className="glass-card rounded-xl p-5">
              <Trophy className="size-5 text-success" />
              <p className="mt-3 text-3xl font-bold">84%</p>
              <p className="text-sm font-medium">Institutional Readiness</p>
              <p className="text-xs text-muted-foreground">+3% vs state benchmark</p>
            </li>
            <li className="glass-card rounded-xl p-5">
              <Clock className="size-5 text-accent" />
              <p className="mt-3 text-3xl font-bold">428h</p>
              <p className="text-sm font-medium">Practice Hours Logged</p>
              <p className="text-xs text-muted-foreground">Cumulative totals</p>
            </li>
          </ul>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="glass-card rounded-xl p-6 lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Department Performance Analytics</h2>
            <div className="space-y-4">
              <Meter label="Engineering Department (78 Students)" value={82} tone="primary" />
              <Meter label="Business Administration (64 Students)" value={88} tone="success" />
              <Meter label="Humanities & Comms (40 Students)" value={76} tone="accent" />
            </div>
          </section>

          <section className="glass-card rounded-xl p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold">Governance & Exports</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Export analytical metrics and progress histories for school boards.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button className="w-full min-h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                Export CSV/Excel Reports
              </button>
              <button className="w-full min-h-11 rounded-lg border border-border bg-card text-foreground font-semibold text-sm">
                Configure SSO Integrations
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

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
          {stats.map((stat) => {
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
