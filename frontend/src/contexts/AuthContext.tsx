import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  user_id: string;
  role: "learner" | "trainer" | "institution" | "admin";
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: (
    role?: "learner" | "trainer" | "institution" | "admin",
    firstName?: string,
    lastName?: string
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DEMO_SESSION_KEY = "expressable_demo_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from public.profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.error("Exception fetching profile:", err);
      return null;
    }
  };

  const signInAsGuest = (
    role: "learner" | "trainer" | "institution" | "admin" = "learner",
    firstName = "Demo",
    lastName = "User"
  ) => {
    const demoUser = {
      id: "demo-guest-id",
      app_metadata: {},
      user_metadata: { first_name: firstName, last_name: lastName },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: "demo@expressable.ai",
    } as unknown as User;

    const demoProfile: Profile = {
      id: "demo-profile-id",
      user_id: "demo-guest-id",
      role,
      first_name: firstName,
      last_name: lastName,
      organization_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(demoUser);
    setProfile(demoProfile);
    try {
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ user: demoUser, profile: demoProfile }));
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    // Check active session on mount
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } else {
          // Check saved demo session if no active Supabase session
          try {
            const saved = localStorage.getItem(DEMO_SESSION_KEY);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed?.user && parsed?.profile) {
                setUser(parsed.user);
                setProfile(parsed.profile);
              }
            }
          } catch {
            // Ignore error
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          localStorage.removeItem(DEMO_SESSION_KEY);
        } catch {}
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        // If logged out from Supabase, check if demo session exists
        try {
          const saved = localStorage.getItem(DEMO_SESSION_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.user && parsed?.profile) {
              setUser(parsed.user);
              setProfile(parsed.profile);
              setLoading(false);
              return;
            }
          }
        } catch {}
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(DEMO_SESSION_KEY);
    } catch {}
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

