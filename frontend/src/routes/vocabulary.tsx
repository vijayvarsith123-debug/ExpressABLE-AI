import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw, Volume2, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";
import { VOCABULARY_DECK, Word } from "@/lib/vocabulary-data";

export const Route = createFileRoute("/vocabulary")({
  head: () => ({
    meta: [
      { title: "Vocabulary Deck — ExpressAble AI" },
      {
        name: "description",
        content:
          "Explore over 1,000 professional workplace words with speech pronunciation and dynamic quizzes.",
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

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

interface QuizQuestion {
  word: Word;
  options: string[];
}

// Function to generate 5 random quiz questions from the vocabulary deck
function generateQuiz(deck: Word[]): QuizQuestion[] {
  const quiz: QuizQuestion[] = [];
  const shuffled = [...deck].sort(() => 0.5 - Math.random());

  // Take 5 random words
  const selectedWords = shuffled.slice(0, 5);

  selectedWords.forEach((word) => {
    // Get 2 other random distractors
    const distractors = deck
      .filter((w) => w.id !== word.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((w) => w.meaning);

    const options = [word.meaning, ...distractors].sort(() => 0.5 - Math.random());
    quiz.push({ word, options });
  });

  return quiz;
}

const CARDS_PER_PAGE = 8;

function Vocabulary() {
  const { announce } = useAccessibility();
  const [flipped, setFlipped] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Generate the quiz once, reset on request
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() =>
    generateQuiz(VOCABULARY_DECK),
  );

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

  // Filter deck based on search query
  const filteredDeck = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return VOCABULARY_DECK;
    return VOCABULARY_DECK.filter(
      (w) => w.term.toLowerCase().includes(query) || w.meaning.toLowerCase().includes(query),
    );
  }, [search]);

  // Paginated deck slice
  const paginatedDeck = useMemo(() => {
    const start = (page - 1) * CARDS_PER_PAGE;
    return filteredDeck.slice(start, start + CARDS_PER_PAGE);
  }, [filteredDeck, page]);

  const totalPages = Math.max(1, Math.ceil(filteredDeck.length / CARDS_PER_PAGE));

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1); // Reset to first page of search results
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuizQuestions(generateQuiz(VOCABULARY_DECK));
    announce("Quiz reset with new words.");
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = quizQuestions.filter((q, i) => answers[i] === q.word.meaning).length;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Vocabulary deck</h1>
        <p className="mt-2 text-muted-foreground">
          Over 1,000 workplace communication words. Search terms, flip to reveal meaning, or hear
          pronunciation.
        </p>
      </header>

      {/* Search and Pagination Control */}
      <section aria-labelledby="search-heading" className="space-y-6">
        <h2 id="search-heading" className="sr-only">
          Search Vocabulary
        </h2>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search 1,000+ words..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Showing {filteredDeck.length} words (Page {page} of {totalPages})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card disabled:opacity-50"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Flashcards Rendering */}
        <ul className="grid gap-4 sm:grid-cols-2">
          {paginatedDeck.map((word) => {
            const isFlipped = flipped.includes(word.id);
            return (
              <li
                key={word.id}
                className="glass-card rounded-xl p-5 flex flex-col justify-between min-h-[220px]"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{word.term}</h3>
                      <p className="text-sm text-muted-foreground">{word.phonetic}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Hear ${word.term} pronounced`}
                      onClick={() => pronounce(word)}
                      className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-secondary text-primary hover:bg-secondary/80"
                    >
                      <Volume2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>

                  <div
                    id={`card-${word.id}`}
                    hidden={!isFlipped}
                    className="rounded-lg border border-border bg-secondary/50 p-4 text-sm animate-fade-in"
                  >
                    <p className="font-medium">{word.meaning}</p>
                    <p className="mt-2 text-muted-foreground italic">
                      &ldquo;{word.example}&rdquo;
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-expanded={isFlipped}
                  aria-controls={`card-${word.id}`}
                  onClick={() => toggleFlip(word)}
                  className="mt-4 min-h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {isFlipped ? "Hide meaning" : "Flip card"}
                </button>
              </li>
            );
          })}
        </ul>

        {filteredDeck.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground">No matching vocabulary words found.</p>
          </div>
        )}
      </section>

      {/* Dynamic Interactive Quiz */}
      <section aria-labelledby="quiz-heading" className="glass-card rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="quiz-heading" className="text-xl font-bold">
              Dynamic Quiz
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Test your knowledge on 5 random words from the deck.
            </p>
          </div>
          <p
            className="text-sm font-semibold text-primary bg-secondary px-3 py-1 rounded-full tabular-nums"
            aria-live="polite"
          >
            {correctCount} correct of {answeredCount} answered ({quizQuestions.length} total)
          </p>
        </div>

        <ol className="mt-6 space-y-6">
          {quizQuestions.map((question, index) => {
            const chosen = answers[index];
            return (
              <li key={question.word.id}>
                <fieldset>
                  <legend className="font-semibold text-base">
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
                            "flex w-full items-center gap-2 rounded-lg border p-3.5 text-left text-sm disabled:opacity-100 transition-all",
                            !chosen && "border-border bg-card hover:bg-secondary/70",
                            chosen &&
                              isRight &&
                              "border-success bg-success/10 text-success font-semibold",
                            chosen &&
                              isChosen &&
                              !isRight &&
                              "border-destructive bg-destructive/10 text-destructive",
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
          onClick={resetQuiz}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:bg-secondary/50"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Reset & load new questions
        </button>
      </section>
    </div>
  );
}
