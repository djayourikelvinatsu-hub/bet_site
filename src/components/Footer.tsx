import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__brand">WinLine</p>
        <p className="site-footer__legal">
          For adults 18+ only. Betting involves risk. We do not guarantee outcomes. Please gamble responsibly.
        </p>
        <p className="site-footer__copy">© {new Date().getFullYear()} WinLine. Demo landing page.</p>
        <p className="site-footer__credit">
          Designed and developed by{" "}
          <a
            href="https://kaddev.vercel.app/"
            className="site-footer__credit-name"
            target="_blank"
            rel="noopener noreferrer"
          >
            dev_kad
          </a>
          <span className="site-footer__credit-hint"> — portfolio and contact</span>
        </p>
      </div>
    </footer>
  );
}
