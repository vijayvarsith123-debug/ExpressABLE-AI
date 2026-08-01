import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, RotateCcw, Sparkles, Building2 } from "lucide-react";
import { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import { FirstDayAtOfficeScenario } from "@/components/simulations/FirstDayAtOfficeScenario";

export const Route = createFileRoute("/simulation")({
  head: () => ({
    meta: [
      { title: "Workplace Simulations — ExpressAble AI" },
      {
        name: "description",
        content: "Visual workplace learning scenarios and interactive communication coaching.",
      },
      { property: "og:title", content: "Workplace Simulations — ExpressAble AI" },
      {
        property: "og:description",
        content: "Practice workplace communication visually with animated stories and live speech feedback.",
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

interface BranchScenario {
  id: string;
  type: "branching";
  title: string;
  setting: string;
  prompt: string;
  choices: Choice[];
}

interface VisualScenario {
  id: "first-day-office";
  type: "visual";
  title: string;
  badge: string;
  description: string;
}

type SimulationScenario = VisualScenario | BranchScenario;

const SCENARIOS: SimulationScenario[] = [
  {
    id: "first-day-office",
    type: "visual",
    title: "First Day at Office",
    badge: "PREMIUM VISUAL STORY",
    description: "Learn how to professionally enter a workplace, greet colleagues, introduce yourself, and communicate confidently.",
  },
  {
    id: "api-downtime",
    type: "branching",
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
    type: "branching",
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
  const [activeScenarioId, setActiveScenarioId] = useState<string>("first-day-office");
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0]!;

  const chooseChoice = (choice: Choice) => {
    setSelectedChoice(choice);
    announce(`Rated ${choice.rating}. ${choice.coaching}`);
  };

  const switchScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setSelectedChoice(null);
    const target = SCENARIOS.find((s) => s.id === scenarioId);
    if (target) {
      announce(`Loaded scenario: ${target.title}`);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Sparkles className="size-4" /> Workplace Simulations
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1">
          Workplace Learning Scenarios
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Visual learning stories and branching conversation scenarios designed to build workplace communication confidence.
        </p>
      </header>

      {/* Scenario Selector Navigation Tabs */}
      <nav aria-label="Workplace Scenarios">
        <ul className="flex flex-wrap gap-2.5">
          {SCENARIOS.map((s) => {
            const isActive = s.id === activeScenarioId;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => switchScenario(s.id)}
                  className={cn(
                    "min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold transition-all flex items-center gap-2",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow"
                      : "border-border bg-card hover:bg-secondary text-foreground",
                  )}
                >
                  {s.id === "first-day-office" && <Building2 className="size-4 text-warning" />}
                  {s.title}
                  {s.id === "first-day-office" && (
                    <span className="rounded-full bg-warning/20 text-warning text-[10px] font-extrabold px-2 py-0.5 ml-1">
                      NEW
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Render Selected Scenario */}
      {activeScenario.type === "visual" ? (
        <FirstDayAtOfficeScenario onBackToSimulations={() => switchScenario("api-downtime")} />
      ) : (
        <section aria-labelledby="scenario-heading" className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 id="scenario-heading" className="text-xl sm:text-2xl font-bold">
            {activeScenario.title}
          </h2>
          <p className="text-sm text-muted-foreground">{activeScenario.setting}</p>
          
          <p className="flex gap-3 rounded-xl border border-border bg-secondary p-4 text-base sm:text-lg font-medium">
            <MessageSquare aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
            {activeScenario.prompt}
          </p>

          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Choose your reply
          </h3>
          <ul className="space-y-3">
            {activeScenario.choices.map((choice) => {
              const active = selectedChoice?.id === choice.id;
              return (
                <li key={choice.id}>
                  <button
                    type="button"
                    onClick={() => chooseChoice(choice)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left text-sm transition-all",
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

          {selectedChoice && (
            <div className="space-y-3 border-t border-border pt-5">
              <p className="text-sm">
                <span className="font-semibold">They reply:</span> {selectedChoice.reply}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Coaching:</span> {selectedChoice.coaching}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedChoice(null);
                  announce("Scenario reset. Choose another reply.");
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Try a different reply
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
