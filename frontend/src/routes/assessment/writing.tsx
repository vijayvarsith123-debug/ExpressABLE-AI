import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, SpellCheck, Sparkles, TriangleAlert } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessment/writing")({
  head: () => ({
    meta: [
      { title: "Writing Coach — ExpressAble AI" },
      {
        name: "description",
        content: "Draft on the left, apply grammar, spelling and tone suggestions on the right.",
      },
      { property: "og:title", content: "Writing Coach — ExpressAble AI" },
      {
        property: "og:description",
        content: "One-click grammar, spelling and tone fixes with screen-reader announcements.",
      },
    ],
  }),
  component: WritingCoach,
});

import {
  checkWriting,
  isGeminiConfigured,
  shouldUseOllama,
  shouldUseNvidiaNim,
} from "@/lib/gemini";

type SuggestionKind = "grammar" | "spelling" | "tone";

interface Suggestion {
  id: string;
  kind: SuggestionKind;
  find: string;
  replace: string;
  reason: string;
}

const STARTER_SUGGESTIONS: Suggestion[] = [
  {
    id: "s1",
    kind: "grammar",
    find: "i have wrote",
    replace: "I have written",
    reason:
      "Past participle of \u201cwrite\u201d is \u201cwritten\u201d, and \u201cI\u201d is capitalised.",
  },
  {
    id: "s2",
    kind: "spelling",
    find: "recieve",
    replace: "receive",
    reason: "Common misspelling — i before e except after c.",
  },
  {
    id: "s3",
    kind: "tone",
    find: "ASAP",
    replace: "by Thursday",
    reason: "A concrete deadline reads as clearer and less demanding than ASAP.",
  },
  {
    id: "s4",
    kind: "grammar",
    find: "dont",
    replace: "don't",
    reason: "Contractions need an apostrophe.",
  },
];

const KIND_STYLE: Record<
  SuggestionKind,
  { badge: string; icon: typeof SpellCheck; label: string }
> = {
  grammar: {
    badge: "border-destructive text-destructive",
    icon: TriangleAlert,
    label: "Grammar",
  },
  spelling: { badge: "border-warning text-warning", icon: SpellCheck, label: "Spelling" },
  tone: { badge: "border-info text-info", icon: Sparkles, label: "Tone" },
};

const STARTER_TEXT =
  "Hi team,\n\ni have wrote the summary of the outage. Please recieve it and review before the sync. If you dont have time today, send notes ASAP.\n\nThanks,\nAmara";

const MAX_CHARS = 900;

function WritingCoach() {
  const { announce } = useAccessibility();
  const [text, setText] = useState(STARTER_TEXT);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(STARTER_SUGGESTIONS);
  const [applied, setApplied] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiAlert] = useState(!isGeminiConfigured() && !shouldUseOllama() && !shouldUseNvidiaNim());
  const [localModelActive] = useState(shouldUseOllama() || shouldUseNvidiaNim());
  const textareaId = useId();
  const countId = useId();

  const active = useMemo(
    () =>
      suggestions.filter(
        (s) => !applied.includes(s.id) && text.toLowerCase().includes(s.find.toLowerCase()),
      ),
    [text, applied, suggestions],
  );

  const apply = (suggestion: Suggestion) => {
    const index = text.toLowerCase().indexOf(suggestion.find.toLowerCase());
    if (index === -1) return;
    const next =
      text.slice(0, index) + suggestion.replace + text.slice(index + suggestion.find.length);
    setText(next);
    setApplied((a) => [...a, suggestion.id]);
    announce(`Replaced ${suggestion.find} with ${suggestion.replace}`);
  };

  const handleCheckText = async () => {
    setLoading(true);
    announce("Scanning text with AI communication coach...");
    try {
      const results = await checkWriting(text);
      const mapped: Suggestion[] = results.map((s) => ({
        id: s.id,
        kind: s.type,
        find: s.targetText,
        replace: s.replacementText,
        reason: s.explanation,
      }));
      setSuggestions(mapped);
      setApplied([]);
      announce(`AI check complete. Found ${mapped.length} recommendations.`);
    } catch (err: unknown) {
      console.error(err);
      announce("Failed to run AI check. Using local rule check instead.");
    } finally {
      setLoading(false);
    }
  };

  const tooLong = text.length > MAX_CHARS;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Writing coach</h1>
        <p className="mt-2 text-muted-foreground">
          Edit your draft, scan with AI, and apply suggestions one at a time. Every change is
          announced.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="editor-heading" className="glass-card rounded-xl p-5">
          <h2 id="editor-heading" className="text-lg font-semibold">
            Your draft
          </h2>
          <label htmlFor={textareaId} className="sr-only">
            Draft text
          </label>
          <textarea
            id={textareaId}
            value={text}
            aria-describedby={countId}
            aria-invalid={tooLong}
            onChange={(e) => setText(e.target.value)}
            rows={16}
            className="mt-3 w-full resize-y rounded-lg border border-input bg-background p-3 font-mono text-sm leading-relaxed"
          />
          <p
            id={countId}
            className={cn(
              "mt-2 text-xs",
              tooLong ? "font-semibold text-destructive" : "text-muted-foreground",
            )}
          >
            {text.length} / {MAX_CHARS} characters
            {tooLong ? " — over the recommended length, try trimming a paragraph." : ""}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
            <button
              type="button"
              disabled={loading || tooLong}
              onClick={handleCheckText}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              {loading ? "Checking..." : "Scan with AI Coach"}
            </button>

            {apiAlert && (
              <span className="text-xs text-muted-foreground font-medium">
                Running on Local Engine (Free & Unlimited). Set VITE_GEMINI_API_KEY for Gemini AI
                suggestions.
              </span>
            )}

            {localModelActive && (
              <span className="text-xs text-primary font-semibold">
                Connected to Local LLM (Ollama/Nvidia NIM)
              </span>
            )}
          </div>
        </section>

        <section aria-labelledby="analysis-heading" className="space-y-4">
          <h2 id="analysis-heading" className="text-lg font-semibold">
            Analysis ({active.length} open{active.length === 1 ? " suggestion" : " suggestions"})
          </h2>

          {active.length === 0 ? (
            <div className="glass-card flex items-center gap-3 rounded-xl p-5">
              <CheckCircle2 aria-hidden="true" className="size-6 text-success" />
              <p className="text-sm font-medium">
                No open suggestions. This draft reads clearly and politely.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {active.map((s) => {
                const style = KIND_STYLE[s.kind];
                const Icon = style.icon;
                return (
                  <li key={s.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <Icon aria-hidden="true" className="size-4" />
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-semibold",
                          style.badge,
                        )}
                      >
                        {style.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">
                      <span className="line-through text-muted-foreground">{s.find}</span>{" "}
                      <span aria-hidden="true">→</span>{" "}
                      <span className="font-semibold">{s.replace}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.reason}</p>
                    <button
                      type="button"
                      onClick={() => apply(s)}
                      className="mt-3 min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
                    >
                      Apply suggestion
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
