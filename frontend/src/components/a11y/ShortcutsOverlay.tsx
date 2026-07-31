import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "Alt + A", action: "Open or close the accessibility panel" },
  { keys: "Alt + H", action: "Jump to the home page" },
  { keys: "Alt + D", action: "Jump to the dashboard" },
  { keys: "Alt + K", action: "Show this shortcut list" },
  { keys: "Alt + M", action: "Move focus to main content" },
  { keys: "Tab / Shift + Tab", action: "Move between interactive elements" },
  { keys: "Escape", action: "Close any open panel or dialog" },
];

export function ShortcutsOverlay() {
  const { shortcutsOpen, setShortcutsOpen } = useAccessibility();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!shortcutsOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShortcutsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcutsOpen, setShortcutsOpen]);

  if (!shortcutsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close keyboard shortcuts"
        tabIndex={-1}
        onClick={() => setShortcutsOpen(false)}
        className="absolute inset-0 bg-foreground/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg animate-scale-in"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="shortcuts-title" className="text-lg font-bold">
            Keyboard shortcuts
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close keyboard shortcuts"
            onClick={() => setShortcutsOpen(false)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <ul className="divide-y divide-border">
          {SHORTCUTS.map((s) => (
            <li key={s.keys} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-sm text-muted-foreground">{s.action}</span>
              <kbd className="rounded-md border border-border bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                {s.keys}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
