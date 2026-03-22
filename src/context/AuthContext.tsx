import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";
import type { Profile } from "../types/profile";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  emailConfirmed: boolean;
  isAdmin: boolean;
  hasVipAccess: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const supabase = getSupabase();
    const u = supabase ? (await supabase.auth.getUser()).data.user : null;
    if (!u) {
      setProfile(null);
      return;
    }
    setProfile(await fetchProfile(u.id));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    const supabase = getSupabase()!;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        void fetchProfile(s.user.id).then(setProfile);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        void fetchProfile(s.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Supabase is not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Supabase is not configured." };
    const redirect = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirect,
        data: { full_name: fullName.trim() },
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, []);

  const resendConfirmation = useCallback(async (email: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: "Supabase is not configured." };
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error: error?.message ?? null };
  }, []);

  const user = session?.user ?? null;
  const emailConfirmed = Boolean(user?.email_confirmed_at);
  const isAdmin = profile?.role === "admin";
  const hasVipAccess = Boolean(
    profile?.is_vip &&
      (!profile.vip_expires_at || new Date(profile.vip_expires_at).getTime() > Date.now())
  );

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      emailConfirmed,
      isAdmin,
      hasVipAccess,
      refreshProfile,
      signIn,
      signUp,
      signOut,
      resendConfirmation,
    }),
    [
      session,
      user,
      profile,
      loading,
      emailConfirmed,
      isAdmin,
      hasVipAccess,
      refreshProfile,
      signIn,
      signUp,
      signOut,
      resendConfirmation,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
