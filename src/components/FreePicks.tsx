import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";
import { mockFreeCodes } from "../data/mockCodes";
import type { BookingSlipRow } from "../types/profile";
import "./FreePicks.css";

type SlipRow = BookingSlipRow & { code?: string };

export function FreePicks() {
  const { user, emailConfirmed, hasVipAccess, loading: authLoading, resendConfirmation } = useAuth();
  const [rows, setRows] = useState<SlipRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  const loadRemote = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !user || !emailConfirmed) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: slips, error: slipsErr } = await supabase
      .from("booking_slips")
      .select("*")
      .order("sort_order", { ascending: true });
    if (slipsErr) {
      setRows([]);
      setLoading(false);
      return;
    }
    const { data: codes } = await supabase.from("booking_codes").select("slip_id, code");
    const codeMap = new Map((codes ?? []).map((c) => [c.slip_id as string, c.code as string]));
    const merged = (slips as BookingSlipRow[]).map((s) => ({
      ...s,
      code: codeMap.get(s.id),
    }));
    setRows(merged);
    setLoading(false);
  }, [user, emailConfirmed, hasVipAccess]);

  useEffect(() => {
    if (authLoading) return;
    if (!isSupabaseConfigured || !user || !emailConfirmed) {
      setLoading(false);
      setRows([]);
      return;
    }
    void loadRemote();
  }, [authLoading, user, emailConfirmed, loadRemote]);

  const resend = async () => {
    if (!user?.email) return;
    setResendMsg(null);
    const { error } = await resendConfirmation(user.email);
    setResendMsg(error ?? "Check your inbox.");
  };

  const showDemo = !isSupabaseConfigured;
  const showGuest = isSupabaseConfigured && !user;
  const showUnverified = isSupabaseConfigured && user && !emailConfirmed;
  const showBoard = isSupabaseConfigured && user && emailConfirmed;

  const displayRows: SlipRow[] = showDemo
    ? mockFreeCodes.map((m) => ({
        id: m.id,
        league: m.league,
        fixture: m.fixture,
        market: m.market,
        bookmaker: m.bookmaker,
        kickoff: m.kickoff,
        tier: m.isPremium ? "vip" : "free",
        sort_order: 0,
        created_at: "",
        updated_at: "",
        code: m.isPremium ? undefined : m.code,
      }))
    : rows;

  return (
    <section className="picks" id="tips">
      <div className="picks__shell">
        <div className="picks__inner">
          <div className="picks__head">
            <span className="picks__eyebrow">Odds board</span>
            <h2 className="picks__title">Free &amp; VIP booking codes</h2>
            <p className="picks__sub">
              Free codes unlock after you <strong>register and verify your email</strong>. VIP codes unlock
              after a successful subscription payment. Games are not arranged by this platform.
            </p>
          </div>

          {showDemo ? (
            <p className="picks__banner picks__banner--warn" role="status">
              <strong>Demo data.</strong> Add Supabase (<code>VITE_SUPABASE_URL</code>,{" "}
              <code>VITE_SUPABASE_ANON_KEY</code>) and run the SQL migration to use real accounts and slips.
            </p>
          ) : null}

          {showGuest ? (
            <div className="picks__gate">
              <p>Sign in to see today&apos;s free odds. Create an account to verify your email and unlock codes.</p>
              <div className="picks__gate-actions">
                <Link to="/signup" className="btn btn--primary">
                  Create account
                </Link>
                <Link to="/login" className="btn btn--ghost">
                  Sign in
                </Link>
              </div>
            </div>
          ) : null}

          {showUnverified ? (
            <div className="picks__gate">
              <p>
                We sent a confirmation link to <strong>{user.email}</strong>. Verify your email to unlock{" "}
                <strong>free</strong> odds. VIP odds stay locked until you subscribe.
              </p>
              <button type="button" className="btn btn--ghost" onClick={() => void resend()}>
                Resend confirmation email
              </button>
              {resendMsg ? <p className="picks__resend-msg">{resendMsg}</p> : null}
            </div>
          ) : null}

          {showBoard && loading ? (
            <div className="picks__loading" role="status" aria-live="polite">
              <span className="picks__spinner" aria-hidden />
              Loading slips…
            </div>
          ) : null}

          {(showDemo || (showBoard && !loading)) && displayRows.length > 0 ? (
            <ul className="picks__list">
              {displayRows.map((row) => {
                const isVip = row.tier === "vip";
                const vipLocked = isVip && (showDemo || !hasVipAccess);
                const showCode = Boolean(row.code && !vipLocked);

                return (
                  <li
                    key={row.id}
                    className={`pick-card${isVip ? " pick-card--vip" : ""}${vipLocked ? " pick-card--locked" : ""}`}
                  >
                    <div className="pick-card__top">
                      <span className="pick-card__league">{row.league}</span>
                      <span className={`pick-card__tag pick-card__tag--${row.tier}`}>{row.tier}</span>
                      <span className="pick-card__kickoff">{row.kickoff}</span>
                    </div>
                    <h3 className="pick-card__fixture">{row.fixture}</h3>
                    <p className="pick-card__market">{row.market}</p>
                    <div className="pick-card__code-row">
                      <span className="pick-card__book">{row.bookmaker}</span>
                      {vipLocked ? (
                        <span className="pick-card__code pick-card__code--blur">VIP</span>
                      ) : showCode ? (
                        <code className="pick-card__code">{row.code}</code>
                      ) : (
                        <span className="pick-card__code pick-card__code--muted">—</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {showBoard && !loading && displayRows.length === 0 ? (
            <p className="picks__empty">No slips published yet. Check back soon.</p>
          ) : null}

          <div className="picks__upsell">
            <p>
              <strong>Unlock VIP codes</strong> with a daily or monthly plan —{" "}
              <span className="picks__price">₵10</span> / day or <span className="picks__price">₵50</span> / month.
            </p>
            <a href="#pricing" className="btn btn--primary picks__subscribe">
              View plans &amp; pay
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
