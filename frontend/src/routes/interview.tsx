import { createFileRoute } from "@tanstack/react-router";
import { Bot, Keyboard, Mic, Send, User, Trophy, Award, MessageSquare } from "lucide-react";
import { useId, useState } from "react";
import { SpeechRecorder, formatElapsed } from "@/components/SpeechRecorder";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  getInterviewReply,
  isGeminiConfigured,
  shouldUseOllama,
  shouldUseNvidiaNim,
  evaluateInterview,
  type InterviewEvaluationResult,
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
  const { dbProfile } = useAuth();
  const answerId = useId();
  const [mode, setMode] = useState<Mode>("text");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [jobContext, setJobContext] = useState("Customer Support Specialist");
  const [thinking, setThinking] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluationResult | null>(null);
  const [apiAlert] = useState(!isGeminiConfigured() && !shouldUseOllama() && !shouldUseNvidiaNim());
  const [localModelActive] = useState(shouldUseOllama() || shouldUseNvidiaNim());
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([
    { id: 0, speaker: "interviewer", text: QUESTIONS[0]! },
  ]);

  const finished = questionIndex >= QUESTIONS.length;

  const runEvaluation = async () => {
    setEvaluating(true);
    announce("Evaluating interview. Please wait.");

    const historyPairs: { q: string; a: string }[] = [];
    for (let i = 0; i < transcript.length; i++) {
      const entry = transcript[i];
      if (entry.speaker === "interviewer") {
        const nextEntry = transcript[i + 1];
        if (nextEntry && nextEntry.speaker === "you") {
          historyPairs.push({ q: entry.text, a: nextEntry.text });
        }
      }
    }

    try {
      const res = await evaluateInterview(jobContext, historyPairs);
      setEvaluation(res);

      if (dbProfile?.id) {
        const score = Math.round((res.communicationScore + res.professionalismScore) / 2);
        await supabase.from("mock_interviews").insert([
          {
            profile_id: dbProfile.id,
            job_role_context: jobContext,
            overall_score: score,
          },
        ]);
      }
      announce("Evaluation complete.");
    } catch (err) {
      console.error(err);
      announce("Failed to evaluate interview.");
    } finally {
      setEvaluating(false);
    }
  };

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
      if (isGeminiConfigured() || shouldUseOllama() || shouldUseNvidiaNim()) {
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
    setEvaluation(null);
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
            <div className="mt-5 space-y-6">
              <p className="text-lg font-medium">That&apos;s the full set — nice work!</p>

              {evaluation ? (
                <div className="space-y-6 rounded-xl border border-border bg-secondary/30 p-6 animate-fade-in">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Trophy className="size-5 text-warning" />
                    AI Interview Performance Report
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Communication Score
                      </p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-primary">
                          {evaluation.communicationScore}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Professionalism Score
                      </p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-success">
                          {evaluation.professionalismScore}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                      <Award className="size-4 text-primary" />
                      Key Improvement Tips
                    </h4>
                    <ul className="space-y-2">
                      {evaluation.suggestions.map((tip, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2 text-sm text-foreground bg-card p-3 rounded-lg border border-border"
                        >
                          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-secondary/10 p-6 text-center">
                  <Bot className="size-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Awaiting AI Evaluation</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Analyze your interview answers to generate scorecards and performance feedback.
                  </p>
                  <button
                    type="button"
                    disabled={evaluating}
                    onClick={runEvaluation}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    {evaluating ? (
                      <>
                        <span className="animate-spin rounded-full border-2 border-primary-foreground border-t-transparent size-4"></span>
                        Evaluating answers...
                      </>
                    ) : (
                      <>
                        <Trophy className="size-4" />
                        Generate AI Performance Report
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={restart}
                  className="min-h-11 rounded-lg border border-border bg-card px-5 text-sm font-semibold hover:bg-secondary/40"
                >
                  Restart interview
                </button>
              </div>
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
