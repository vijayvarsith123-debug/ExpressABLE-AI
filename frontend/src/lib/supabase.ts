import { createClient } from "@supabase/supabase-js";

const isValidUrl = (url: unknown): url is string => {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  return trimmed.length > 0 && (trimmed.startsWith("http://") || trimmed.startsWith("https://"));
};

const isValidKey = (key: unknown): key is string => {
  if (typeof key !== "string") return false;
  const trimmed = key.trim();
  return trimmed.length > 20 && trimmed !== "undefined" && trimmed !== "null";
};

const getSupabaseUrl = () => {
  const url =
    (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
    (typeof process !== "undefined" && process.env?.SUPABASE_URL) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    import.meta.env?.VITE_SUPABASE_URL;

  return isValidUrl(url) ? url.trim() : "https://gzjfoewswtdsvhidooeg.supabase.co";
};

const getSupabaseAnonKey = () => {
  const key =
    (typeof process !== "undefined" && process.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== "undefined" && process.env?.SUPABASE_ANON_KEY) ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    import.meta.env?.VITE_SUPABASE_ANON_KEY;

  return isValidKey(key)
    ? key.trim()
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6amZvZXdzd3Rkc3ZoaWRvb2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MDYxMzAsImV4cCI6MjEwMTA4MjEzMH0.C0ZLmn7uih7XbnAOmf0fiWEYsgHbqx_LqMbMV40Zifs";
};

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
