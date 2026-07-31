import { createFileRoute } from "@tanstack/react-router";
import { Bot, Keyboard, Mic, Send, User } from "lucide-react";
import { useId, useState } from "react";
import { SpeechRecorder, formatElapsed } from "@/components/SpeechRecorder";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import {
  getInterviewReply,
  isGeminiConfigured,
  shouldUseOllama,
  shouldUseNvidiaNim,
} from "@/lib/gemini";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "Mock Interview Hub — ExpressAble AI" },
      {
        name: "description",
        content: "Rehearse HR interview questions by text or voice with a running transcript.",
      },
      { property: "og:title", content: "Mock Interview Hub — ExpressAble AI" },
      {
        property: "og:description",
        content: "An accessible mock interviewer with transcript logging and voice input.",
      },
    ],
  }),
  component: InterviewHub,
});

const QUESTIONS = [
  "Tell me about yourself and what drew you to this role.",
  "Describe a time you disagreed with a teammate. How did you handle it?",
  "How do you keep stakeholders informed when a deadline slips?",
  "What accommodation or working style helps you do your best work?",
  "Where do you want your communication skills to be in a year?",
];

interface TranscriptEntry {
  id: number;
  speaker: "interviewer" | "you";
  text: string;
}

type Mode = "text" | "speech";

function InterviewHub() {
  const { announce } = useAccessibility();
  const answerId = useId();
  const [mode, setMode] = useState<Mode>("text");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [jobContext, setJobContext] = useState("Customer Support Specialist");
  const [thinking, setThinking] = useState(false);
  const [apiAlert] = useState(!isGeminiConfigured() && !shouldUseOllama() && !shouldUseNvidiaNim());
  const [localModelActive] = useState(shouldUseOllama() || shouldUseNvidiaNim());
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([
    { id: 0, speaker: "interviewer", text: QUESTIONS[0]! },
  ]);

  const finished = questionIndex >= QUESTIONS.length;

  const submitAnswer = async (answer: string) => {
    const trimmed = answer.trim();
    if (!trimmed) return;
    const nextIndex = questionIndex + 1;

    // Add User response
    const userEntry: TranscriptEntry = { id: transcript.length, speaker: "you", text: trimmed };
    const newTranscript = [...transcript, userEntry];
    setTranscript(newTranscript);
    setQuestionIndex(nextIndex);
    setDraft("");
    announce("Answer logged.");

    if (nextIndex >= QUESTIONS.length) {
      announce("Interview complete.");
      return;
    }

    setThinking(true);
    try {
      let nextQuestion = "";
      if (isGeminiConfigured()) {
        // Group transcript into { q, a } pairs
        const historyPairs: { q: string; a: string }[] = [];
        for (let i = 0; i < newTranscript.length; i++) {
          const entry = newTranscript[i];
          if (entry.speaker === "interviewer") {
            const nextEntry = newTranscript[i + 1];
            if (nextEntry && nextEntry.speaker === "you") {
              historyPairs.push({ q: entry.text, a: nextEntry.text });
            }
          }
        }
        nextQuestion = await getInterviewReply(jobContext, historyPairs);
      } else {
        nextQuestion = QUESTIONS[nextIndex]!;
      }

      setTranscript((t) => [...t, { id: t.length, speaker: "interviewer", text: nextQuestion }]);
      announce(`Next question: ${nextQuestion}`);
    } catch (err: unknown) {
      console.error(err);
      const fallback =
        QUESTIONS[nextIndex] || "Could you tell me more about your previous experience?";
      setTranscript((t) => [...t, { id: t.length, speaker: "interviewer", text: fallback }]);
    } finally {
      setThinking(false);
    }
  };

  const restart = () => {
    setTranscript([{ id: 0, speaker: "interviewer", text: QUESTIONS[0]! }]);
    setQuestionIndex(0);
    setDraft("");
    announce("Interview restarted.");
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mock interview hub</h1>
          <p className="mt-2 text-muted-foreground">
            Answer five HR questions by typing or speaking. Everything is logged to the transcript.
          </p>
        </div>
        {apiAlert && (
          <div className="rounded-lg bg-secondary border border-border px-3 py-1.5 text-xs text-muted-foreground font-medium">
            Running on Local Engine (Free & Unlimited). Set VITE_GEMINI_API_KEY for generative
            Gemini responses.
          </div>
        )}
        {localModelActive && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs text-primary font-semibold">
            Connected to Local LLM (Ollama/Nvidia NIM)
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="console-heading" className="glass-card rounded-xl p-6">
          <h2 id="console-heading" className="text-lg font-semibold">
            Interviewer console
          </h2>

          {finished ? (
            <div className="mt-5 space-y-4">
              <p className="text-lg font-medium">
                That&apos;s the full set — nice work. Review your transcript, then run it again to
                tighten your answers.
              </p>
              <button
                type="button"
                onClick={restart}
                className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground"
              >
                Restart interview
              </button>
            </div>
          ) : (
            <>
              <p className="mt-4 rounded-lg border border-border bg-secondary p-4 text-lg font-medium">
                <span className="sr-only">Question {questionIndex + 1}: </span>
                {transcript[transcript.length - 1]?.speaker === "interviewer"
                  ? transcript[transcript.length - 1].text
                  : QUESTIONS[questionIndex]}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Question {questionIndex + 1} of {QUESTIONS.length}
              </p>

              {questionIndex === 0 && (
                <div className="mt-4 space-y-1.5">
                  <label htmlFor="job-context" className="text-xs font-semibold text-foreground">
                    Target Job Role for Interview
                  </label>
                  <input
                    id="job-context"
                    type="text"
                    value={jobContext}
                    onChange={(e) => setJobContext(e.target.value)}
                    className="block min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground"
                    placeholder="e.g. React Frontend Engineer"
                  />
                </div>
              )}

              {thinking && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                  <Bot className="size-4 shrink-0 text-primary" />
                  <span>Interviewer is formulating the next question...</span>
                </div>
              )}

              <div className="mt-5 flex gap-2" role="radiogroup" aria-label="Answer input mode">
                {(["text", "speech"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={mode === m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-semibold",
                      mode === m
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card",
                    )}
                  >
                    {m === "text" ? (
                      <Keyboard aria-hidden="true" className="size-4" />
                    ) : (
                      <Mic aria-hidden="true" className="size-4" />
                    )}
                    {m === "text" ? "Type answer" : "Speak answer"}
                  </button>
                ))}
              </div>

              {mode === "text" ? (
                <form
                  className="mt-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!thinking) submitAnswer(draft);
                  }}
                >
                  <label htmlFor={answerId} className="block text-sm font-semibold">
                    Your answer
                  </label>
                  <textarea
                    id={answerId}
                    value={draft}
                    rows={5}
                    disabled={thinking}
                    onChange={(e) => setDraft(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background p-3 text-sm"
                    placeholder="Answer in two or three sentences."
                  />
                  <button
                    type="submit"
                    disabled={draft.trim().length === 0 || thinking}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    <Send aria-hidden="true" className="size-4" />
                    Submit answer
                  </button>
                </form>
              ) : (
                <div className="mt-5">
                  <SpeechRecorder
                    label="Speak your answer directly into the microphone."
                    busyLabel={thinking ? "Interviewer processing..." : "Start recording"}
                    onComplete={(seconds, transcriptText) => {
                      if (!thinking) {
                        submitAnswer(
                          transcriptText ||
                            `[Spoken answer · ${formatElapsed(seconds)}] (No speech text recognized)`,
                        );
                      }
                    }}
                  />
                </div>
              )}
            </>
          )}
        </section>

        <section aria-labelledby="transcript-heading" className="glass-card rounded-xl p-5">
          <h2 id="transcript-heading" className="text-lg font-semibold">
            Transcript
          </h2>
          <ol className="mt-4 space-y-3" aria-live="polite">
            {transcript.map((entry) => (
              <li key={`${entry.speaker}-${entry.id}`} className="flex gap-2">
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full",
                    entry.speaker === "interviewer"
                      ? "bg-secondary text-primary"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {entry.speaker === "interviewer" ? (
                    <Bot aria-hidden="true" className="size-4" />
                  ) : (
                    <User aria-hidden="true" className="size-4" />
                  )}
                </span>
                <p className="text-sm">
                  <span className="block text-xs font-semibold uppercase text-muted-foreground">
                    {entry.speaker === "interviewer" ? "Interviewer" : "You"}
                  </span>
                  {entry.text}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
