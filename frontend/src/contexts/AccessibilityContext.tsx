import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ThemeName = "light" | "dark" | "high-contrast";
export type FontSize = "sm" | "md" | "lg" | "xl";

export interface AccessibilitySettings {
  theme: ThemeName;
  fontSize: FontSize;
  dyslexicFont: boolean;
  reducedMotion: boolean;
}

export interface AccessibilityContextValue extends AccessibilitySettings {
  hydrated: boolean;
  setTheme: (theme: ThemeName) => void;
  setFontSize: (size: FontSize) => void;
  toggleDyslexicFont: () => void;
  toggleReducedMotion: () => void;
  announce: (message: string) => void;
  announcement: string;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
}

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  theme: "light",
  fontSize: "md",
  dyslexicFont: false,
  reducedMotion: false,
};

const STORAGE_KEY = "expressable.accessibility";

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function readStored(): AccessibilitySettings | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return null;
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydration-safe: read persisted prefs only after mount.
  useEffect(() => {
    const stored = readStored();
    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSettings(stored ?? { ...DEFAULT_SETTINGS, reducedMotion: prefersReduced });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", settings.theme === "dark");
    root.classList.toggle("high-contrast", settings.theme === "high-contrast");
    root.classList.toggle("font-dyslexic", settings.dyslexicFont);
    root.classList.toggle("reduce-motion", settings.reducedMotion);
    root.dataset["fontSize"] = settings.fontSize;
  }, [settings]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAnnouncement(""), 4000);
  }, []);

  const setTheme = useCallback(
    (theme: ThemeName) => {
      setSettings((s) => ({ ...s, theme }));
      announce(`Theme changed to ${theme.replace("-", " ")}`);
    },
    [announce],
  );

  const setFontSize = useCallback(
    (fontSize: FontSize) => {
      setSettings((s) => ({ ...s, fontSize }));
      announce(`Font size set to ${fontSize}`);
    },
    [announce],
  );

  const toggleDyslexicFont = useCallback(() => {
    setSettings((s) => {
      announce(`Dyslexia friendly font ${s.dyslexicFont ? "disabled" : "enabled"}`);
      return { ...s, dyslexicFont: !s.dyslexicFont };
    });
  }, [announce]);

  const toggleReducedMotion = useCallback(() => {
    setSettings((s) => {
      announce(`Reduced motion ${s.reducedMotion ? "disabled" : "enabled"}`);
      return { ...s, reducedMotion: !s.reducedMotion };
    });
  }, [announce]);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      ...settings,
      hydrated,
      setTheme,
      setFontSize,
      toggleDyslexicFont,
      toggleReducedMotion,
      announce,
      announcement,
      panelOpen,
      setPanelOpen,
      shortcutsOpen,
      setShortcutsOpen,
    }),
    [
      settings,
      hydrated,
      setTheme,
      setFontSize,
      toggleDyslexicFont,
      toggleReducedMotion,
      announce,
      announcement,
      panelOpen,
      shortcutsOpen,
    ],
  );

  return <AccessibilityContext value={value}>{children}</AccessibilityContext>;
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used inside AccessibilityProvider");
  return ctx;
}
