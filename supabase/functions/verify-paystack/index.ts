import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!paystackSecret) {
      return new Response(JSON.stringify({ error: "PAYSTACK_SECRET_KEY not set on function" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();
    if (userErr || !user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as { reference?: string };
    const reference = body.reference;
    if (!reference || typeof reference !== "string") {
      return new Response(JSON.stringify({ error: "reference required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${paystackSecret}` } }
    );
    const paystackJson = (await paystackRes.json()) as {
      status?: boolean;
      data?: {
        status?: string;
        amount?: number;
        currency?: string;
        customer?: { email?: string };
        metadata?: { plan_id?: string };
      };
    };

    if (!paystackJson.status || paystackJson.data?.status !== "success") {
      return new Response(JSON.stringify({ error: "Payment not verified" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const custEmail = String(paystackJson.data?.customer?.email ?? "").toLowerCase();
    if (custEmail !== user.email.toLowerCase()) {
      return new Response(JSON.stringify({ error: "Payment email does not match account" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currency = String(paystackJson.data?.currency ?? "").toUpperCase();
    if (currency !== "GHS") {
      return new Response(JSON.stringify({ error: "Invalid currency" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amount = Number(paystackJson.data?.amount);
    if (amount !== 1000 && amount !== 5000) {
      return new Response(JSON.stringify({ error: "Unexpected amount (expected ₵10 or ₵50 in pesewas)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const msDay = 24 * 60 * 60 * 1000;
    const extendMs = amount === 1000 ? msDay : 30 * msDay;

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: prof } = await admin.from("profiles").select("vip_expires_at").eq("id", user.id).maybeSingle();

    const row = prof as { vip_expires_at?: string | null } | null;
    const base =
      row?.vip_expires_at && new Date(row.vip_expires_at) > new Date()
        ? new Date(row.vip_expires_at).getTime()
        : Date.now();
    const vipExpiresAt = new Date(base + extendMs).toISOString();

    const { error: upErr } = await admin
      .from("profiles")
      .update({ is_vip: true, vip_expires_at: vipExpiresAt })
      .eq("id", user.id);

    if (upErr) {
      return new Response(JSON.stringify({ error: upErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, vip_expires_at: vipExpiresAt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
