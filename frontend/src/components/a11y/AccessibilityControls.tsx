import { Contrast, Minus, Moon, Plus, Sun, Type, Zap } from "lucide-react";
import { useAccessibility, type FontSize, type ThemeName } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

const THEMES: { id: ThemeName; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "high-contrast", label: "High contrast", icon: Contrast },
];

const SIZES: FontSize[] = ["sm", "md", "lg", "xl"];

export function AccessibilityControls({ className }: { className?: string }) {
  const {
    theme,
    fontSize,
    dyslexicFont,
    reducedMotion,
    setTheme,
    setFontSize,
    toggleDyslexicFont,
    toggleReducedMotion,
    setShortcutsOpen,
  } = useAccessibility();

  const sizeIndex = SIZES.indexOf(fontSize);

  return (
    <div className={cn("space-y-6", className)}>
      <fieldset>
        <legend className="text-sm font-semibold">Theme</legend>
        <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex min-h-11 flex-col items-center gap-1 rounded-lg border px-2 py-3 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <p className="text-sm font-semibold" id="fontsize-label">
          Text size
        </p>
        <div className="mt-2 flex items-center gap-3" aria-labelledby="fontsize-label">
          <button
            type="button"
            aria-label="Decrease text size"
            disabled={sizeIndex === 0}
            onClick={() => setFontSize(SIZES[Math.max(0, sizeIndex - 1)]!)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-secondary text-secondary-foreground disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="size-4" />
          </button>
          <span className="min-w-20 text-center text-sm font-semibold uppercase">{fontSize}</span>
          <button
            type="button"
            aria-label="Increase text size"
            disabled={sizeIndex === SIZES.length - 1}
            onClick={() => setFontSize(SIZES[Math.min(SIZES.length - 1, sizeIndex + 1)]!)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-secondary text-secondary-foreground disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <ToggleRow
        icon={Type}
        label="Dyslexia friendly font"
        description="Wider spacing and a highly legible typeface."
        checked={dyslexicFont}
        onChange={toggleDyslexicFont}
      />
      <ToggleRow
        icon={Zap}
        label="Reduced motion"
        description="Stops animation, auto-rotation and transitions."
        checked={reducedMotion}
        onChange={toggleReducedMotion}
      />

      <button
        type="button"
        onClick={() => setShortcutsOpen(true)}
        className="min-h-11 w-full rounded-lg border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
      >
        View keyboard shortcuts (Alt + K)
      </button>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Type;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex w-full items-start gap-3 rounded-lg border border-border bg-card p-3 text-left hover:bg-secondary"
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 text-primary" />
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 flex h-6 w-11 shrink-0 items-center rounded-full border border-border p-0.5 transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "size-4 rounded-full bg-background transition-transform",
            checked && "translate-x-5",
          )}
        />
      </span>
    </button>
  );
}
