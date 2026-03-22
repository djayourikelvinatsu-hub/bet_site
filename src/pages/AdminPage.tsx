import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";
import type { BookingSlipRow } from "../types/profile";
import "./admin-page.css";

type SlipWithCode = BookingSlipRow & { booking_codes: { code: string } | null };

const emptyForm = {
  league: "",
  fixture: "",
  market: "",
  bookmaker: "",
  kickoff: "",
  code: "",
  tier: "free" as "free" | "vip",
  sort_order: 0,
};

export function AdminPage() {
  const { user, loading: authLoading, isAdmin, emailConfirmed } = useAuth();
  const [slips, setSlips] = useState<SlipWithCode[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setLoadError(null);
    const { data, error } = await supabase
      .from("booking_slips")
      .select("*, booking_codes(code)")
      .order("sort_order", { ascending: true });
    if (error) {
      setLoadError(error.message);
      return;
    }
    setSlips((data ?? []) as SlipWithCode[]);
  }, []);

  useEffect(() => {
    if (!authLoading && user && isAdmin && emailConfirmed) {
      void load();
    }
  }, [authLoading, user, isAdmin, emailConfirmed, load]);

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-page">
        <p className="admin-page__error">Configure Supabase in <code>.env</code> first.</p>
        <Link to="/">Home</Link>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="admin-page">
        <p className="admin-page__muted">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  if (!emailConfirmed) {
    return (
      <div className="admin-page">
        <p className="admin-page__error">Verify your email before using the admin panel.</p>
        <Link to="/">Home</Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <p className="admin-page__error">You do not have administrator access.</p>
        <Link to="/">Home</Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    setFormError(null);
    setSaving(true);
    const { data: slip, error: slipErr } = await supabase
      .from("booking_slips")
      .insert({
        league: form.league.trim(),
        fixture: form.fixture.trim(),
        market: form.market.trim(),
        bookmaker: form.bookmaker.trim(),
        kickoff: form.kickoff.trim(),
        tier: form.tier,
        sort_order: form.sort_order,
        created_by: user!.id,
      })
      .select("id")
      .single();
    if (slipErr || !slip) {
      setSaving(false);
      setFormError(slipErr?.message ?? "Could not create slip.");
      return;
    }
    const { error: codeErr } = await supabase.from("booking_codes").insert({
      slip_id: slip.id,
      code: form.code.trim(),
    });
    setSaving(false);
    if (codeErr) {
      setFormError(codeErr.message);
      await supabase.from("booking_slips").delete().eq("id", slip.id);
      return;
    }
    setForm(emptyForm);
    await load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this slip and its booking code?")) return;
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.from("booking_slips").delete().eq("id", id);
    await load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <h1 className="admin-page__title">Admin — slips &amp; codes</h1>
        <Link to="/" className="admin-page__home">
          ← Back to site
        </Link>
      </div>
      <p className="admin-page__intro">
        Add booking slips here. <strong>Free</strong> tier codes are visible to users with a verified email.{" "}
        <strong>VIP</strong> codes unlock only for paying subscribers (Paystack + edge function, or manual VIP
        on <code>profiles</code>).
      </p>

      <section className="admin-page__section">
        <h2>Add slip</h2>
        <form className="admin-form" onSubmit={(e) => void submit(e)}>
          <div className="admin-form__grid">
            <label>
              League
              <input
                value={form.league}
                onChange={(e) => setForm((f) => ({ ...f, league: e.target.value }))}
                required
              />
            </label>
            <label>
              Fixture
              <input
                value={form.fixture}
                onChange={(e) => setForm((f) => ({ ...f, fixture: e.target.value }))}
                required
              />
            </label>
            <label>
              Market
              <input
                value={form.market}
                onChange={(e) => setForm((f) => ({ ...f, market: e.target.value }))}
                required
              />
            </label>
            <label>
              Bookmaker
              <input
                value={form.bookmaker}
                onChange={(e) => setForm((f) => ({ ...f, bookmaker: e.target.value }))}
                required
              />
            </label>
            <label>
              Kickoff
              <input
                value={form.kickoff}
                onChange={(e) => setForm((f) => ({ ...f, kickoff: e.target.value }))}
                placeholder="Today · 17:30 GMT"
                required
              />
            </label>
            <label>
              Tier
              <select
                value={form.tier}
                onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value as "free" | "vip" }))}
              >
                <option value="free">Free (verified users)</option>
                <option value="vip">VIP (paying)</option>
              </select>
            </label>
            <label>
              Sort order
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
              />
            </label>
            <label className="admin-form__full">
              Booking code
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                required
              />
            </label>
          </div>
          {formError ? (
            <p className="admin-page__error" role="alert">
              {formError}
            </p>
          ) : null}
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Saving…" : "Add slip"}
          </button>
        </form>
      </section>

      <section className="admin-page__section">
        <h2>Current slips</h2>
        {loadError ? (
          <p className="admin-page__error" role="alert">
            {loadError}
          </p>
        ) : null}
        {slips.length === 0 && !loadError ? (
          <p className="admin-page__muted">No slips yet. Add one above.</p>
        ) : (
          <ul className="admin-list">
            {slips.map((s) => (
              <li key={s.id} className="admin-list__item">
                <div className="admin-list__main">
                  <span className={`admin-list__tier admin-list__tier--${s.tier}`}>{s.tier}</span>
                  <strong>{s.fixture}</strong>
                  <span className="admin-page__muted">
                    {s.league} · {s.market}
                  </span>
                  <code className="admin-list__code">{s.booking_codes?.code ?? "—"}</code>
                </div>
                <button type="button" className="btn btn--ghost admin-list__del" onClick={() => void remove(s.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-page__section admin-page__note">
        <h3>Make yourself admin</h3>
        <p>In Supabase SQL editor, after you sign up once:</p>
        <code>
          {`update public.profiles set role = 'admin' where email = 'you@example.com';`}
        </code>
      </section>
    </div>
  );
}
