import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulation")({
  head: () => ({
    meta: [
      { title: "Workplace Simulations — ExpressAble AI" },
      {
        name: "description",
        content: "Branching workplace scenarios that rate your replies and coach better wording.",
      },
      { property: "og:title", content: "Workplace Simulations — ExpressAble AI" },
      {
        property: "og:description",
        content: "Practise real workplace conversations with rated, branching choices.",
      },
    ],
  }),
  component: Simulations,
});

type Rating = "Needs Work" | "Good" | "Excellent";

interface Choice {
  id: string;
  text: string;
  rating: Rating;
  reply: string;
  coaching: string;
}

interface Scenario {
  id: string;
  title: string;
  setting: string;
  prompt: string;
  choices: Choice[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "api-downtime",
    title: "Handling an API downtime sync delay",
    setting: "Your payments API has been down for 20 minutes and the daily sync is late.",
    prompt:
      "Your manager asks in the team channel: \u201cAny update on the sync? Finance is waiting.\u201d",
    choices: [
      {
        id: "a",
        text: "Still broken, I'll let you know when it's fixed.",
        rating: "Needs Work",
        reply: "Okay… but what should I tell Finance right now?",
        coaching: "Give a status, a cause and a time. Vague updates push the work back to others.",
      },
      {
        id: "b",
        text: "The payments API is down, so the sync is queued. I'll update you in 15 minutes.",
        rating: "Good",
        reply: "Thanks, that helps. I'll hold Finance until then.",
        coaching: "Clear and time-boxed. Add the impact so Finance can plan.",
      },
      {
        id: "c",
        text: "Payments API is down since 09:40, sync is queued and will run automatically on recovery. Finance sees yesterday's figures until then. Next update at 10:15.",
        rating: "Excellent",
        reply: "Perfect — I'll forward that to Finance verbatim.",
        coaching: "Status, cause, impact, next update. This is the pattern to reuse.",
      },
    ],
  },
  {
    id: "feedback",
    title: "Receiving critical feedback",
    setting: "In a one-to-one, your lead says your written updates are hard to follow.",
    prompt: "\u201cYour updates bury the important part. Can we work on that?\u201d",
    choices: [
      {
        id: "a",
        text: "I think they're fine, people just don't read them.",
        rating: "Needs Work",
        reply: "Let's park this and revisit next week.",
        coaching: "Defensiveness ends the conversation. Ask for a concrete example instead.",
      },
      {
        id: "b",
        text: "Understood. Could you show me one update that was hard to follow?",
        rating: "Good",
        reply: "Sure — Tuesday's release note is a good example.",
        coaching: "Asking for evidence is strong. Also propose what you'll change.",
      },
      {
        id: "c",
        text: "Thanks for saying it directly. Can we look at Tuesday's note together? I'll lead with the outcome and move detail below a summary line.",
        rating: "Excellent",
        reply: "That's exactly what I was hoping for. Let's review it now.",
        coaching: "Accepts, seeks evidence, and commits to a specific change.",
      },
    ],
  },
];

const RATING_STYLE: Record<Rating, string> = {
  "Needs Work": "border-destructive text-destructive",
  Good: "border-warning text-warning",
  Excellent: "border-success text-success",
};

function Simulations() {
  const { announce } = useAccessibility();
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]!);
  const [selected, setSelected] = useState<Choice | null>(null);

  const choose = (choice: Choice) => {
    setSelected(choice);
    announce(`Rated ${choice.rating}. ${choice.coaching}`);
  };

  const switchScenario = (next: Scenario) => {
    setScenario(next);
    setSelected(null);
    announce(`Scenario loaded: ${next.title}`);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Workplace simulations</h1>
        <p className="mt-2 text-muted-foreground">
          Choose how you would reply. Each branch is rated and coached.
        </p>
      </header>

      <nav aria-label="Scenarios">
        <ul className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                aria-current={s.id === scenario.id ? "true" : undefined}
                onClick={() => switchScenario(s)}
                className={cn(
                  "min-h-11 rounded-lg border px-4 text-sm font-semibold",
                  s.id === scenario.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card",
                )}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="scenario-heading" className="glass-card rounded-xl p-6">
        <h2 id="scenario-heading" className="text-xl font-bold">
          {scenario.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{scenario.setting}</p>
        <p className="mt-4 flex gap-2 rounded-lg border border-border bg-secondary p-4 text-lg font-medium">
          <MessageSquare aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
          {scenario.prompt}
        </p>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Choose your reply
        </h3>
        <ul className="mt-3 space-y-3">
          {scenario.choices.map((choice) => {
            const active = selected?.id === choice.id;
            return (
              <li key={choice.id}>
                <button
                  type="button"
                  onClick={() => choose(choice)}
                  aria-pressed={active}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left text-sm",
                    active
                      ? "border-primary bg-secondary"
                      : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  {choice.text}
                  {active && (
                    <span
                      className={cn(
                        "mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold",
                        RATING_STYLE[choice.rating],
                      )}
                    >
                      {choice.rating}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {selected && (
          <div className="mt-6 space-y-3 border-t border-border pt-5">
            <p className="text-sm">
              <span className="font-semibold">They reply:</span> {selected.reply}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Coaching:</span> {selected.coaching}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                announce("Scenario reset. Choose another reply.");
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Try a different reply
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
