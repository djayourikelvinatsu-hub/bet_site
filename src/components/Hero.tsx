import { Link } from "react-router-dom";
import "./Hero.css";

export function Hero() {
  return (
    <section className="hero" id="signup">
      <div className="hero__backdrop" aria-hidden>
        <span className="hero__orb hero__orb--gold" />
        <span className="hero__orb hero__orb--green" />
        <span className="hero__grid" />
      </div>
      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot" aria-hidden />
          Join 10,000+ happy punters
        </div>
        <h1 className="hero__title">
          Ready to start <em>winning</em> big?
        </h1>
        <p className="hero__lead">
          Expert football predictions straight to your phone. Create a free account, verify your email for
          free codes, or subscribe for VIP odds.
        </p>
        <div className="hero__actions">
          <Link to="/signup" className="btn btn--primary">
            Create free account
          </Link>
          <Link to="/#tips" className="btn btn--ghost">
            See today&apos;s tips
          </Link>
        </div>
      </div>
    </section>
  );
}
