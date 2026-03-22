import { useEffect, useState } from "react";
import { mockFreeCodes } from "../data/mockCodes";
import "./FreePicks.css";

export function FreePicks() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="picks" id="tips">
      <div className="picks__shell">
        <div className="picks__inner">
          <div className="picks__head">
            <span className="picks__eyebrow">Free codes</span>
            <h2 className="picks__title">Today&apos;s free picks</h2>
            <p className="picks__sub">
              Verified booking codes from trusted sources. Games are not arranged by this platform — we only
              share codes for your convenience.
            </p>
            <a href="#tips" className="picks__link-all">
              View all codes →
            </a>
          </div>

          {loading ? (
            <div className="picks__loading" role="status" aria-live="polite">
              <span className="picks__spinner" aria-hidden />
              Loading betting codes…
            </div>
          ) : (
            <ul className="picks__list">
              {mockFreeCodes.map((row) => (
                <li key={row.id} className={`pick-card${row.isPremium ? " pick-card--locked" : ""}`}>
                  <div className="pick-card__top">
                    <span className="pick-card__league">{row.league}</span>
                    <span className="pick-card__kickoff">{row.kickoff}</span>
                  </div>
                  <h3 className="pick-card__fixture">{row.fixture}</h3>
                  <p className="pick-card__market">{row.market}</p>
                  <div className="pick-card__code-row">
                    <span className="pick-card__book">{row.bookmaker}</span>
                    {row.isPremium ? (
                      <span className="pick-card__code pick-card__code--blur">PREMIUM</span>
                    ) : (
                      <code className="pick-card__code">{row.code}</code>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="picks__upsell">
            <p>
              <strong>Unlock all premium codes</strong> for just <span className="picks__price">₵50</span>
              /month
            </p>
            <a href="#pricing" className="btn btn--primary picks__subscribe">
              Subscribe &amp; unlock
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
