import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { AccessibilityControls } from "./AccessibilityControls";

export function AccessibilityPanel() {
  const { panelOpen, setPanelOpen } = useAccessibility();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!panelOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen, setPanelOpen]);

  if (!panelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close accessibility settings"
        tabIndex={-1}
        onClick={() => setPanelOpen(false)}
        className="absolute inset-0 bg-foreground/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-panel-title"
        className="relative h-full w-full max-w-sm overflow-y-auto border-l border-border bg-card p-5 shadow-lg animate-slide-in-right"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="a11y-panel-title" className="text-lg font-bold">
            Accessibility settings
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close accessibility settings"
            onClick={() => setPanelOpen(false)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <AccessibilityControls />
      </div>
    </div>
  );
}
