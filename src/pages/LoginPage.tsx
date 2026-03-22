import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/supabase";
import "./auth-pages.css";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <div className="auth-page">
      <h1>Welcome back</h1>
      <p className="auth-page__lead">Sign in to view verified free odds and manage VIP access.</p>
      {!isSupabaseConfigured ? (
        <p className="auth-form__error" role="alert">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your{" "}
          <code>.env</code> file.
        </p>
      ) : null}
      <form className="auth-form" onSubmit={(e) => void handle(e)}>
        <div>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
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
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="auth-page__foot">
        No account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
}
