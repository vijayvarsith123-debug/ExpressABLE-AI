import { Link, useRouterState } from "@tanstack/react-router";
import { Accessibility, AudioLines, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/assessment/speech", label: "Speech" },
  { to: "/assessment/writing", label: "Writing" },
  { to: "/interview", label: "Interview" },
  { to: "/simulation", label: "Simulations" },
  { to: "/vocabulary", label: "Vocabulary" },
] as const;

import { useAuth } from "@/contexts/AuthContext";

export function AppShell({ children }: { children: ReactNode }) {
  const { setPanelOpen } = useAccessibility();
  const { user, profile, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <AudioLines aria-hidden="true" className="size-5" />
            </span>
            <span>
              ExpressAble <span className="text-primary">AI</span>
            </span>
          </Link>

          <nav aria-label="Main" className="order-3 w-full md:order-2 md:w-auto md:flex-1">
            <ul className="flex flex-wrap gap-1">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="order-2 ml-auto flex items-center gap-2 md:order-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold hidden sm:inline">
                  Hello, {profile?.first_name || user.email?.split("@")[0]}
                </span>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="inline-flex min-h-11 items-center rounded-lg border border-border bg-card px-3 text-sm font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex min-h-11 items-center rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold"
              aria-label="Accessibility settings"
            >
              <Accessibility aria-hidden="true" className="size-4 text-primary" />
              <span className="hidden lg:inline">Accessibility</span>
              <kbd className="hidden rounded border border-border px-1.5 text-xs text-muted-foreground sm:inline">
                Alt+A
              </kbd>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p className="inline-flex items-center gap-2">
          <Sparkles aria-hidden="true" className="size-4" />
          ExpressAble AI — inclusive communication training. WCAG 2.1 AA by design.
        </p>
      </footer>
    </div>
  );
}
