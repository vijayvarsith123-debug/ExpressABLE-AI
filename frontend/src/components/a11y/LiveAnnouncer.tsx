import { useAccessibility } from "@/contexts/AccessibilityContext";

/** Global polite live region — anything can push text through announce(). */
export function LiveAnnouncer() {
  const { announcement } = useAccessibility();
  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true" role="status">
      {announcement}
    </div>
  );
}
