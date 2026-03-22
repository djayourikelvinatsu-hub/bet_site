import { useLiveClock } from "../hooks/useLiveClock";
import "./Header.css";

export function Header() {
  const { weekday, date, time } = useLiveClock();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#" className="site-header__brand">
          <span className="site-header__logo" aria-hidden>
            ⚽
          </span>
          <span>WinLine</span>
        </a>
        <div className="site-header__clock" aria-live="polite">
          <span className="site-header__clock-day">{weekday}</span>
          <span className="site-header__clock-date">{date}</span>
          <span className="site-header__clock-time">{time}</span>
        </div>
        <nav className="site-header__nav" aria-label="Primary">
          <a href="#tips">Today&apos;s tips</a>
          <a href="#pricing">Pricing</a>
          <a className="site-header__cta" href="#signup">
            Get started
          </a>
        </nav>
      </div>
    </header>
  );
}
