import { Link, NavLink } from "react-router-dom";
import { useLiveClock } from "../hooks/useLiveClock";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import "./Header.css";

export function Header() {
  const { weekday, date, time } = useLiveClock();
  const { user, loading, isAdmin, signOut } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">
          <span className="site-header__logo" aria-hidden>
            ⚽
          </span>
          <span>WinLine</span>
        </Link>
        <div className="site-header__clock" aria-live="polite">
          <span className="site-header__clock-day">{weekday}</span>
          <span className="site-header__clock-date">{date}</span>
          <span className="site-header__clock-time">{time}</span>
        </div>
        <nav className="site-header__nav" aria-label="Primary">
          <a href="/#tips">Odds</a>
          <a href="/#pricing">Pricing</a>
          {isSupabaseConfigured && !loading && user ? (
            <>
              {isAdmin ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? "site-header__nav-active" : undefined)}
                >
                  Admin
                </NavLink>
              ) : null}
              <span className="site-header__user" title={user.email ?? ""}>
                {user.email?.split("@")[0]}
              </span>
              <button type="button" className="site-header__link-btn" onClick={() => void signOut()}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link className="site-header__cta" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
