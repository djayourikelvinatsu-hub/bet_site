import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url?.trim() && anonKey?.trim());

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url!.trim(), anonKey!.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }
  return client;
}

export async function verifyPaystackAndUnlockVip(reference: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const { data, error } = await supabase.functions.invoke<{ ok?: boolean; error?: string }>(
    "verify-paystack",
    { body: { reference } }
  );
  if (error) {
    return { ok: false, error: error.message };
  }
  if (data && typeof data === "object" && "ok" in data && data.ok) {
    return { ok: true };
  }
  const msg = data && typeof data === "object" && "error" in data ? String(data.error) : "Verification failed.";
  return { ok: false, error: msg };
}
