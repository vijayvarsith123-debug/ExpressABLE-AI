import { createClient } from "@supabase/supabase-js";

const sanitize = (str: unknown): string => {
  if (typeof str !== "string") return "";
  let clean = str.trim();
  // Strip single/double quotes around variables
  clean = clean.replace(/^['"]|['"]$/g, "").trim();
  // Strip zero-width spaces, BOMs, and other invisible Unicode characters
  clean = clean.replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, "");
  // Strip any non-printable or non-ASCII control characters
  clean = clean.replace(/[^\x20-\x7E]/g, "");
  return clean.trim();
};

const getSupabaseUrl = () => {
  const envUrl =
    (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
    (typeof process !== "undefined" && process.env?.SUPABASE_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    import.meta.env?.VITE_SUPABASE_URL;

  const clean = sanitize(envUrl);
  if (clean && (clean.startsWith("http://") || clean.startsWith("https://"))) {
    return clean;
  }
  return "https://gzjfoewswtdsvhidooeg.supabase.co";
};

const getSupabaseAnonKey = () => {
  const envKey =
    (typeof process !== "undefined" && process.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== "undefined" && process.env?.SUPABASE_ANON_KEY) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    import.meta.env?.VITE_SUPABASE_ANON_KEY;

  const clean = sanitize(envKey);
  if (clean && clean.length > 20 && clean !== "undefined" && clean !== "null") {
    return clean;
  }
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6amZvZXdzd3Rkc3ZoaWRvb2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MDYxMzAsImV4cCI6MjEwMTA4MjEzMH0.C0ZLmn7uih7XbnAOmf0fiWEYsgHbqx_LqMbMV40Zifs";
};

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
