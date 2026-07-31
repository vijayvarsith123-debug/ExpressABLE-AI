import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

/** Global Alt-key shortcut handler. */
export function KeyboardShortcuts() {
  const navigate = useNavigate();
  const { panelOpen, setPanelOpen, setShortcutsOpen, announce } = useAccessibility();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;
      const key = event.key.toLowerCase();
      if (key === "a") {
        event.preventDefault();
        setPanelOpen(!panelOpen);
      } else if (key === "h") {
        event.preventDefault();
        void navigate({ to: "/" });
        announce("Navigated to home");
      } else if (key === "d") {
        event.preventDefault();
        void navigate({ to: "/dashboard" });
        announce("Navigated to dashboard");
      } else if (key === "k") {
        event.preventDefault();
        setShortcutsOpen(true);
      } else if (key === "m") {
        event.preventDefault();
        document.getElementById("main-content")?.focus();
        announce("Focus moved to main content");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, panelOpen, setPanelOpen, setShortcutsOpen, announce]);

  return null;
}
