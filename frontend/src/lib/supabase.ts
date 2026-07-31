import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  import.meta.env?.VITE_SUPABASE_URL ||
  "https://gzjfoewswtdsvhidooeg.supabase.co";

const supabaseAnonKey =
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6amZvZXdzd3Rkc3ZoaWRvb2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MDYxMzAsImV4cCI6MjEwMTA4MjEzMH0.C0ZLmn7uih7XbnAOmf0fiWEYsgHbqx_LqMbMV40Zifs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
