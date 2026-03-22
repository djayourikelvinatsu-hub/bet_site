import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  createPaymentReference,
  loadPaystackScript,
  openPaystackCheckout,
} from "../lib/paystack";
import { isSupabaseConfigured, verifyPaystackAndUnlockVip } from "../lib/supabase";
import "./CheckoutModal.css";

export type CheckoutPlan = {
  id: "daily" | "monthly";
  title: string;
  amountGhs: number;
  amountPesewas: number;
};

type CheckoutModalProps = {
  plan: CheckoutPlan | null;
  publicKey: string | undefined;
  onClose: () => void;
  defaultEmail?: string;
  onVipUnlocked?: () => void | Promise<void>;
};

export function CheckoutModal({
  plan,
  publicKey,
  onClose,
  defaultEmail = "",
  onVipUnlocked,
}: CheckoutModalProps) {
  const titleId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [verifyPhase, setVerifyPhase] = useState<"idle" | "pending" | "ok" | "err">("idle");
  const [verifyDetail, setVerifyDetail] = useState<string | null>(null);

  useEffect(() => {
    if (!plan) {
      setEmail("");
      setError(null);
      setBusy(false);
      setSuccessRef(null);
      setVerifyPhase("idle");
      setVerifyDetail(null);
      return;
    }
    setEmail(defaultEmail);
    const t = window.setTimeout(() => emailRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [plan, defaultEmail]);

  const handleBackdrop = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !busy && verifyPhase !== "pending") {
        onClose();
      }
    },
    [busy, verifyPhase, onClose]
  );

  useEffect(() => {
    if (!plan) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy && verifyPhase !== "pending") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [plan, busy, verifyPhase, onClose]);

  const pay = async () => {
    setError(null);
    if (!plan) return;
    if (!publicKey?.trim()) {
      setError(
        "Payments are not configured. Add VITE_PAYSTACK_PUBLIC_KEY to a .env file in the project root and restart the dev server."
      );
      return;
    }
    const trimmed = (defaultEmail || email).trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address (required by the payment provider).");
      emailRef.current?.focus();
      return;
    }
    setBusy(true);
    try {
      await loadPaystackScript();
      const ref = createPaymentReference(plan.id);
      openPaystackCheckout({
        publicKey: publicKey.trim(),
        email: trimmed,
        amountPesewas: plan.amountPesewas,
        reference: ref,
        planId: plan.id,
        onSuccess: (reference) => {
          setBusy(false);
          setSuccessRef(reference);
          if (!isSupabaseConfigured) {
            setVerifyPhase("err");
            setVerifyDetail(
              "Supabase is not configured — VIP cannot unlock automatically. Add keys and deploy the verify-paystack edge function (see SUPABASE_SETUP.md)."
            );
            return;
          }
          setVerifyPhase("pending");
          void (async () => {
            const result = await verifyPaystackAndUnlockVip(reference);
            if (result.ok) {
              setVerifyPhase("ok");
              setVerifyDetail(null);
              await onVipUnlocked?.();
            } else {
              setVerifyPhase("err");
              setVerifyDetail(
                result.error ??
                  "Could not unlock VIP. Save your reference and contact support, or ask an admin to enable VIP on your profile."
              );
            }
          })();
        },
        onClose: () => {
          setBusy(false);
        },
      });
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Could not start checkout.");
    }
  };

  if (!plan) {
    return null;
  }

  return (
    <div
      className="checkout-modal__backdrop"
      role="presentation"
      onMouseDown={handleBackdrop}
    >
      <div
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {successRef ? (
          <>
            <h2 id={titleId} className="checkout-modal__title">
              Payment submitted
            </h2>
            <p className="checkout-modal__text">
              Reference: <code className="checkout-modal__ref">{successRef}</code>
            </p>
            {verifyPhase === "pending" ? (
              <p className="checkout-modal__hint">Unlocking VIP access…</p>
            ) : null}
            {verifyPhase === "ok" ? (
              <p className="checkout-modal__verify-ok">VIP access is active. Refresh the odds board if needed.</p>
            ) : null}
            {verifyPhase === "err" && verifyDetail ? (
              <p className="checkout-modal__error" role="alert">
                {verifyDetail}
              </p>
            ) : null}
            <button
              type="button"
              className="btn btn--primary checkout-modal__btn"
              onClick={onClose}
              disabled={verifyPhase === "pending"}
            >
              {verifyPhase === "pending" ? "Please wait…" : "Done"}
            </button>
          </>
        ) : (
          <>
            <h2 id={titleId} className="checkout-modal__title">
              Pay — {plan.title}
            </h2>
            <p className="checkout-modal__amount">
              <span className="checkout-modal__currency">₵</span>
              {plan.amountGhs}{" "}
              <span className="checkout-modal__period">
                {plan.id === "daily" ? "one day" : "per month"}
              </span>
            </p>
            <p className="checkout-modal__methods">
              You can pay with <strong>MTN MoMo</strong>, <strong>Vodafone Cash</strong>,{" "}
              <strong>AirtelTigo Money</strong>, card, or bank in the secure Paystack window.
            </p>
            <label className="checkout-modal__label" htmlFor="checkout-email">
              Email
            </label>
            <input
              ref={emailRef}
              id="checkout-email"
              className="checkout-modal__input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy || Boolean(defaultEmail)}
            />
            {defaultEmail ? (
              <p className="checkout-modal__hint">Using your account email so VIP unlock matches your login.</p>
            ) : null}
            {error ? (
              <p className="checkout-modal__error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="checkout-modal__actions">
              <button
                type="button"
                className="btn btn--ghost checkout-modal__cancel"
                onClick={onClose}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => void pay()}
                disabled={busy}
              >
                {busy ? "Opening…" : "Continue to pay"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
