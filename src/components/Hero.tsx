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
          Expert football predictions straight to your phone. No apps needed — winning tips via SMS when it
          matters.
        </p>
        <div className="hero__actions">
          <a href="#pricing" className="btn btn--primary">
            Get started free
          </a>
          <a href="#tips" className="btn btn--ghost">
            See today&apos;s tips
          </a>
        </div>
      </div>
    </section>
  );
}
