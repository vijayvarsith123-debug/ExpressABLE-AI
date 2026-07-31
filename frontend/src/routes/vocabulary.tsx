import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw, Volume2, X } from "lucide-react";
import { useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vocabulary")({
  head: () => ({
    meta: [
      { title: "Vocabulary Deck — ExpressAble AI" },
      {
        name: "description",
        content:
          "Flip accessible flashcards, hear pronunciation aloud and test yourself with a quiz.",
      },
      { property: "og:title", content: "Vocabulary Deck — ExpressAble AI" },
      {
        property: "og:description",
        content: "Spoken flashcards and quizzes with screen-reader friendly state changes.",
      },
    ],
  }),
  component: Vocabulary,
});

interface Word {
  id: string;
  term: string;
  phonetic: string;
  meaning: string;
  example: string;
}

const DECK: Word[] = [
  {
    id: "concise",
    term: "Concise",
    phonetic: "/kənˈsaɪs/",
    meaning: "Saying what is needed in few words.",
    example: "Keep the update concise: what changed, what's next.",
  },
  {
    id: "escalate",
    term: "Escalate",
    phonetic: "/ˈɛskəleɪt/",
    meaning: "To raise an issue to someone with more authority.",
    example: "If the outage lasts an hour, escalate it to the on-call lead.",
  },
  {
    id: "mitigate",
    term: "Mitigate",
    phonetic: "/ˈmɪtɪɡeɪt/",
    meaning: "To make something less severe or harmful.",
    example: "We added retries to mitigate the timeout errors.",
  },
  {
    id: "articulate",
    term: "Articulate",
    phonetic: "/ɑːˈtɪkjʊleɪt/",
    meaning: "To express an idea clearly and fluently.",
    example: "She articulated the trade-offs in two sentences.",
  },
];

interface QuizQuestion {
  word: Word;
  options: string[];
}

const QUIZ: QuizQuestion[] = [
  {
    word: DECK[0]!,
    options: ["Saying what is needed in few words.", "Speaking very loudly.", "Writing at length."],
  },
  {
    word: DECK[1]!,
    options: [
      "To cancel a meeting.",
      "To raise an issue to someone with more authority.",
      "To repeat a question.",
    ],
  },
  {
    word: DECK[2]!,
    options: [
      "To make something less severe or harmful.",
      "To measure progress.",
      "To delay a decision.",
    ],
  },
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

function Vocabulary() {
  const { announce } = useAccessibility();
  const [flipped, setFlipped] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const toggleFlip = (word: Word) => {
    const isFlipped = flipped.includes(word.id);
    setFlipped((f) => (isFlipped ? f.filter((id) => id !== word.id) : [...f, word.id]));
    announce(isFlipped ? `${word.term} card hidden.` : `${word.term}: ${word.meaning}`);
  };

  const pronounce = (word: Word) => {
    const ok = speak(word.term);
    announce(
      ok ? `Pronouncing ${word.term}` : "Speech synthesis is not available in this browser.",
    );
  };

  const answered = Object.keys(answers).length;
  const correct = QUIZ.filter((q, i) => answers[i] === q.word.meaning).length;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Vocabulary deck</h1>
        <p className="mt-2 text-muted-foreground">
          Workplace communication words. Flip a card to reveal the meaning, or hear it read aloud.
        </p>
      </header>

      <section aria-labelledby="deck-heading">
        <h2 id="deck-heading" className="text-xl font-bold">
          Flashcards
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {DECK.map((word) => {
            const isFlipped = flipped.includes(word.id);
            return (
              <li key={word.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{word.term}</h3>
                    <p className="text-sm text-muted-foreground">{word.phonetic}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Hear ${word.term} pronounced`}
                    onClick={() => pronounce(word)}
                    className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-secondary text-primary"
                  >
                    <Volume2 aria-hidden="true" className="size-4" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-expanded={isFlipped}
                  aria-controls={`card-${word.id}`}
                  onClick={() => toggleFlip(word)}
                  className="mt-4 min-h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
                >
                  {isFlipped ? "Hide meaning" : "Flip card"}
                </button>

                <div
                  id={`card-${word.id}`}
                  hidden={!isFlipped}
                  className="mt-4 rounded-lg border border-border bg-secondary p-4 text-sm animate-fade-in"
                >
                  <p className="font-medium">{word.meaning}</p>
                  <p className="mt-2 text-muted-foreground italic">&ldquo;{word.example}&rdquo;</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="quiz-heading" className="glass-card rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="quiz-heading" className="text-xl font-bold">
            Quick quiz
          </h2>
          <p className="text-sm font-semibold tabular-nums" aria-live="polite">
            {correct} correct of {answered} answered ({QUIZ.length} total)
          </p>
        </div>

        <ol className="mt-5 space-y-6">
          {QUIZ.map((question, index) => {
            const chosen = answers[index];
            return (
              <li key={question.word.id}>
                <fieldset>
                  <legend className="font-semibold">
                    {index + 1}. What does &ldquo;{question.word.term}&rdquo; mean?
                  </legend>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option) => {
                      const isChosen = chosen === option;
                      const isRight = option === question.word.meaning;
                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={Boolean(chosen)}
                          aria-pressed={isChosen}
                          onClick={() => {
                            setAnswers((a) => ({ ...a, [index]: option }));
                            announce(
                              isRight
                                ? `Correct. ${question.word.term} means ${question.word.meaning}`
                                : `Not quite. ${question.word.term} means ${question.word.meaning}`,
                            );
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg border p-3 text-left text-sm disabled:opacity-100",
                            !chosen && "border-border bg-card hover:bg-secondary",
                            chosen && isRight && "border-success bg-secondary font-semibold",
                            chosen && isChosen && !isRight && "border-destructive bg-secondary",
                            chosen && !isChosen && !isRight && "border-border bg-card opacity-60",
                          )}
                        >
                          {chosen && isRight && (
                            <Check aria-hidden="true" className="size-4 text-success" />
                          )}
                          {chosen && isChosen && !isRight && (
                            <X aria-hidden="true" className="size-4 text-destructive" />
                          )}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => {
            setAnswers({});
            announce("Quiz reset.");
          }}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Reset quiz
        </button>
      </section>
    </div>
  );
}
