import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import "./auth-pages.css";

export function SignupPage() {
  const { signUp, resendConfirmation } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendOk, setResendOk] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendError(null);
    setResendOk(false);
    setBusy(true);
    const { error: err } = await signUp(email, password, fullName);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setDone(true);
  };

  const resend = async () => {
    setResendError(null);
    setResendOk(false);
    const { error: err } = await resendConfirmation(email);
    if (err) {
      setResendError(err);
      return;
    }
    setResendOk(true);
  };

  return (
    <div className="auth-page">
      <h1>Create your account</h1>
      <p className="auth-page__lead">
        Register with a real email — you must verify it before free booking codes are unlocked. VIP odds
        require an active subscription.
      </p>
      {!isSupabaseConfigured ? (
        <p className="auth-form__error" role="alert">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your{" "}
          <code>.env</code> file.
        </p>
      ) : null}

      {done ? (
        <>
          <p className="auth-form__success">
            Check <strong>{email}</strong> for a confirmation link. After you verify, sign in to see free
            odds.
          </p>
          <button type="button" className="btn btn--ghost" onClick={() => void resend()}>
            Resend confirmation email
          </button>
          {resendError ? (
            <p className="auth-form__error" role="alert">
              {resendError}
            </p>
          ) : null}
          {resendOk ? <p className="auth-form__success">Check your inbox for a new link.</p> : null}
          <p className="auth-page__foot">
            <Link to="/login">Back to sign in</Link>
          </p>
        </>
      ) : (
        <>
          <form className="auth-form" onSubmit={(e) => void handle(e)}>
            <div>
              <label htmlFor="signup-name">Display name</label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error ? (
              <p className="auth-form__error" role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" className="btn btn--primary" disabled={busy || !isSupabaseConfigured}>
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p className="auth-page__foot">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </>
      )}
    </div>
  );
}
