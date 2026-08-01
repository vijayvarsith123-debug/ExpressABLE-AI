import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

const BAR_HEIGHTS = [40, 68, 92, 56, 100, 72, 44, 84, 60, 96, 52, 76];

export function formatElapsed(totalSeconds: number): string {
  const mm = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
}

export interface SpeechRecorderProps {
  label: string;
  onComplete: (elapsedSeconds: number, transcript?: string) => void;
  busyLabel?: string;
}

export function SpeechRecorder({ label, onComplete, busyLabel }: SpeechRecorderProps) {
  const { reducedMotion, announce } = useAccessibility();
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    return () => {
      if (interval.current) clearInterval(interval.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const [error, setError] = useState<string | null>(null);

  const start = () => {
    setElapsed(0);
    setError(null);
    transcriptRef.current = "";

    // Initialize Web Speech Recognition
    const SpeechRecognition =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please try Google Chrome or MS Edge.",
      );
      announce("Speech recognition not supported.");
      return;
    }

    setRecording(true);
    announce("Recording started");
    interval.current = setInterval(() => setElapsed((e) => e + 1), 1000);

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        const current = Array.from(event.results)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result: any) => result[0].transcript)
          .join(" ");
        transcriptRef.current = current;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        if (e.error === "not-allowed") {
          setError(
            "Microphone permission denied. Please allow microphone access in your browser address bar/settings.",
          );
          announce("Microphone permission denied.");
        } else if (e.error === "no-speech") {
          setError("No speech was detected. Try speaking closer to the microphone.");
          announce("No speech detected.");
        } else if (e.error === "audio-capture") {
          setError("No microphone found. Please connect a working recording device.");
          announce("No microphone found.");
        } else {
          setError(`Recording issue: ${e.error || "Unknown error"}`);
        }
        stop(true);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Failed to start speech recognition", err);
      setError("Failed to access your microphone. Please check system permissions.");
      setRecording(false);
    }
  };

  const stop = (hadError = false) => {
    if (interval.current) clearInterval(interval.current);
    interval.current = null;
    setRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    if (!hadError) {
      announce(`Recording stopped after ${formatElapsed(elapsed)}`);
      // Pass the elapsed seconds and final transcript back
      setTimeout(() => {
        onComplete(elapsed, transcriptRef.current || undefined);
      }, 300);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold animate-fade-in max-w-md mx-auto">
          {error}
        </div>
      )}

      <div className="mt-5 flex h-24 items-center justify-center gap-1.5" aria-hidden="true">
        {BAR_HEIGHTS.map((h, i) => (
          <span
            key={i}
            className={cn(
              "w-2 rounded-full bg-primary",
              recording && !reducedMotion ? "wave-bar" : "opacity-40",
            )}
            style={{
              height: `${recording ? h : 18}%`,
              animationDelay: `${i * 70}ms`,
            }}
          />
        ))}
      </div>

      <p className="mt-3 text-3xl font-bold tabular-nums" aria-live="off">
        {formatElapsed(elapsed)}
      </p>
      <p className="sr-only" aria-live="polite">
        {recording ? "Recording in progress" : "Recorder idle"}
      </p>

      <button
        type="button"
        onClick={recording ? stop : start}
        className={cn(
          "mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors",
          recording
            ? "bg-destructive text-destructive-foreground hover:opacity-90"
            : "bg-primary text-primary-foreground hover:opacity-90",
        )}
      >
        {recording ? (
          <Square aria-hidden="true" className="size-4" />
        ) : (
          <Mic aria-hidden="true" className="size-4" />
        )}
        {recording ? "Stop recording" : (busyLabel ?? "Start recording")}
      </button>
    </div>
  );
}
