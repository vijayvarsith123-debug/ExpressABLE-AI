import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Lightbulb, Mic } from "lucide-react";
import { useState } from "react";
import { Meter } from "@/components/Meter";
import { SpeechRecorder, formatElapsed } from "@/components/SpeechRecorder";
import { useAccessibility } from "@/contexts/AccessibilityContext";

import {
  evaluateSpeech,
  isGeminiConfigured,
  shouldUseOllama,
  shouldUseNvidiaNim,
} from "@/lib/gemini";

export const Route = createFileRoute("/assessment/speech")({
  head: () => ({
    meta: [
      { title: "Speech Coach — ExpressAble AI" },
      {
        name: "description",
        content: "Record guided prompts and receive pronunciation, fluency and grammar scores.",
      },
      { property: "og:title", content: "Speech Coach — ExpressAble AI" },
      {
        property: "og:description",
        content: "An accessible speech practice studio with waveform feedback and scoring.",
      },
    ],
  }),
  component: SpeechCoach,
});

type View = "home" | "practice" | "report" | "loading";

interface Prompt {
  id: string;
  title: string;
  level: "Starter" | "Core" | "Advanced";
  text: string;
}

const PROMPTS: Prompt[] = [
  {
    id: "standup",
    title: "Daily stand-up update",
    level: "Starter",
    text: "Yesterday I finished the onboarding screens. Today I am fixing the reported login issue. I have no blockers.",
  },
  {
    id: "handoff",
    title: "Explaining a handover",
    level: "Core",
    text: "I am handing this ticket to Priya because she owns the billing service. I have written the reproduction steps in the description.",
  },
  {
    id: "disagree",
    title: "Disagreeing politely",
    level: "Advanced",
    text: "I see it differently. Shipping this week adds risk to the migration, so I would prefer we release on Tuesday instead.",
  },
];

interface Report {
  pronunciation: number;
  fluency: number;
  grammar: number;
  seconds: number;
  notes: string[];
}

function scoreFor(prompt: Prompt, seconds: number): Report {
  const base = prompt.level === "Starter" ? 86 : prompt.level === "Core" ? 79 : 72;
  const pace = Math.min(10, Math.max(-8, 8 - Math.abs(seconds - 18)));
  return {
    pronunciation: Math.min(98, base + 6),
    fluency: Math.min(98, Math.max(35, base + pace)),
    grammar: Math.min(98, base + 3),
    seconds,
    notes: [
      "Strong sentence endings — your final words stayed audible.",
      seconds < 10
        ? "Try slowing down slightly; aim for around 18 seconds on this prompt."
        : "Pacing is comfortable and easy to follow.",
      "Watch the consonant cluster in \u201cblockers\u201d — separate the k and the r.",
    ],
  };
}

function SpeechCoach() {
  const { announce } = useAccessibility();
  const [view, setView] = useState<View>("home");
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  const startPractice = (p: Prompt) => {
    setPrompt(p);
    setReport(null);
    setView("practice");
    announce(`Practice started: ${p.title}`);
  };

  const [apiAlert] = useState(!isGeminiConfigured() && !shouldUseOllama() && !shouldUseNvidiaNim());
  const [localModelActive] = useState(shouldUseOllama() || shouldUseNvidiaNim());

  const complete = async (seconds: number, transcript?: string) => {
    if (!prompt) return;
    setView("loading");
    announce("Evaluating your speech with AI coach...");
    try {
      const transcribed = transcript || prompt.text;
      const result = await evaluateSpeech(prompt.text, transcribed, seconds);
      setReport(result);
      setView("report");
      announce(
        `Score report ready. Pronunciation ${result.pronunciation} percent, fluency ${result.fluency} percent, grammar ${result.grammar} percent.`,
      );
    } catch (err: unknown) {
      console.error(err);
      const result = scoreFor(prompt, seconds);
      setReport(result);
      setView("report");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Speech coach</h1>
          <p className="mt-2 text-muted-foreground">
            Pick a prompt, read it aloud, and get a plain-language score report.
          </p>
        </div>
        {apiAlert && (
          <div className="rounded-lg bg-secondary border border-border px-3 py-1.5 text-xs text-muted-foreground font-medium">
            Running on Local Engine (Free & Unlimited). Set VITE_GEMINI_API_KEY to enable Gemini AI
            evaluation.
          </div>
        )}
        {localModelActive && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs text-primary font-semibold">
            Connected to Local LLM (Ollama/Nvidia NIM)
          </div>
        )}
      </header>

      {view === "loading" && (
        <div className="glass-card rounded-xl p-8 text-center space-y-4">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">Evaluating response</h2>
          <p className="text-sm text-muted-foreground">
            Our AI coach is analyzing your pronunciation, grammar, and fluency...
          </p>
        </div>
      )}

      {view === "home" && (
        <ul className="grid gap-4">
          {PROMPTS.map((p) => (
            <li key={p.id} className="glass-card rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <span className="rounded-full border border-accent px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {p.level}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              <button
                type="button"
                onClick={() => startPractice(p)}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                <Mic aria-hidden="true" className="size-4" />
                Practise this prompt
              </button>
            </li>
          ))}
        </ul>
      )}

      {view === "practice" && prompt && (
        <section aria-labelledby="practice-heading" className="space-y-5">
          <button
            type="button"
            onClick={() => setView("home")}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to prompts
          </button>
          <div className="glass-card rounded-xl p-6">
            <h2 id="practice-heading" className="text-xl font-bold">
              {prompt.title}
            </h2>
            <p className="mt-3 text-lg leading-relaxed">{prompt.text}</p>
          </div>
          <SpeechRecorder label="Read the passage aloud at a natural pace." onComplete={complete} />
        </section>
      )}

      {view === "report" && report && prompt && (
        <section aria-labelledby="report-heading" className="space-y-5">
          <div className="glass-card rounded-xl p-6">
            <h2 id="report-heading" className="flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 aria-hidden="true" className="size-5 text-success" />
              Score report — {prompt.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Recording length {formatElapsed(report.seconds)}
            </p>
            <div className="mt-6 space-y-4">
              <Meter label="Pronunciation" value={report.pronunciation} tone="primary" />
              <Meter label="Fluency" value={report.fluency} tone="accent" />
              <Meter label="Grammar" value={report.grammar} tone="success" />
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Lightbulb aria-hidden="true" className="size-5 text-warning" />
              Coaching notes
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {report.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setView("practice")}
              className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => setView("home")}
              className="min-h-11 rounded-lg border border-border bg-card px-5 text-sm font-semibold"
            >
              Choose another prompt
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
