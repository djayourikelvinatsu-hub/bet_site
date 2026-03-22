import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";
import "./auth-pages.css";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setMessage("Supabase is not configured.");
      return;
    }
    const supabase = getSupabase()!;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setMessage("Email verified. Redirecting…");
        window.setTimeout(() => navigate("/", { replace: true }), 600);
      } else {
        setMessage("Session not found. Open the link from your email again, or sign in.");
        window.setTimeout(() => navigate("/login", { replace: true }), 2500);
      }
    });
  }, [navigate]);

  return (
    <div className="auth-page">
      <h1>Email confirmation</h1>
      <p className="auth-page__lead">{message}</p>
    </div>
  );
}
