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
      </div>
    </footer>
  );
}
