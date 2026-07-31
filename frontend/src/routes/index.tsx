import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Accessibility,
  ArrowRight,
  BookOpen,
  Briefcase,
  Mic,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExpressAble AI — Accessible AI Communication Coach" },
      {
        name: "description",
        content:
          "Practise speech, writing, interviews and vocabulary with an AI coach designed for accessibility from the ground up.",
      },
      { property: "og:title", content: "ExpressAble AI — Accessible AI Communication Coach" },
      {
        property: "og:description",
        content: "Speech evaluation, writing feedback and workplace simulations for every learner.",
      },
    ],
  }),
  component: Landing,
});

const VALUE_PROPS = [
  {
    icon: Mic,
    title: "Speech Evaluation",
    body: "Record a prompt and get pronunciation, fluency and grammar scores with plain-language coaching notes.",
    to: "/assessment/speech",
  },
  {
    icon: PenLine,
    title: "Writing Feedback",
    body: "Live grammar, spelling and tone suggestions you can apply with a single click or keystroke.",
    to: "/assessment/writing",
  },
  {
    icon: Briefcase,
    title: "Workplace Simulations",
    body: "Branching scenarios and mock interviews that rehearse the conversations that actually matter.",
    to: "/simulation",
  },
] as const;

function Landing() {
  const { reducedMotion } = useAccessibility();
  const anim = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-16">
      <section className="hero-surface -mx-4 rounded-2xl px-6 py-16 text-center sm:px-10">
        <motion.p
          {...anim}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold"
        >
          <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
          WCAG 2.1 AA · Screen-reader first
        </motion.p>
        <motion.h1
          {...anim}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl"
        >
          Communication training that adapts to how <span className="text-primary">you</span> learn
        </motion.h1>
        <motion.p
          {...anim}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground"
        >
          ExpressAble AI (CommuniAble) coaches speech, writing and workplace conversations with
          high-contrast themes, dyslexia-friendly typography, reduced motion and full keyboard
          control built in — not bolted on.
        </motion.p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/onboarding"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Enter App
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold"
          >
            <Accessibility aria-hidden="true" className="size-4 text-primary" />
            Explore the dashboard
          </Link>
        </div>
      </section>

      <section aria-labelledby="value-heading">
        <h2 id="value-heading" className="text-2xl font-bold">
          What you can practise
        </h2>
        <ul className="mt-6 grid gap-5 md:grid-cols-3">
          {VALUE_PROPS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <Link
                  to={item.to}
                  className="glass-card flex h-full flex-col rounded-xl p-6 transition-transform hover:-translate-y-1"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Start practising
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="vocab-heading"
        className="glass-card flex flex-wrap items-center gap-6 rounded-xl p-8"
      >
        <BookOpen aria-hidden="true" className="size-10 text-accent" />
        <div className="flex-1">
          <h2 id="vocab-heading" className="text-xl font-bold">
            Vocabulary decks that speak back
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Flip cards, hear native pronunciation through your browser&apos;s speech engine, and
            quiz yourself with results announced to assistive technology.
          </p>
        </div>
        <Link
          to="/vocabulary"
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Open decks
        </Link>
      </section>
    </div>
  );
}
