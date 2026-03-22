import { useCallback, useMemo, useState } from "react";
import { CheckoutModal, type CheckoutPlan } from "./CheckoutModal";
import "./Pricing.css";

const PLANS: Record<CheckoutPlan["id"], CheckoutPlan> = {
  daily: {
    id: "daily",
    title: "Daily pass",
    amountGhs: 10,
    amountPesewas: 10 * 100,
  },
  monthly: {
    id: "monthly",
    title: "Monthly subscription",
    amountGhs: 50,
    amountPesewas: 50 * 100,
  },
};

export function Pricing() {
  const [activePlan, setActivePlan] = useState<CheckoutPlan | null>(null);
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;

  const openPlan = useCallback((id: CheckoutPlan["id"]) => {
    setActivePlan(PLANS[id]);
  }, []);

  const closeModal = useCallback(() => setActivePlan(null), []);

  const configured = useMemo(() => Boolean(publicKey?.trim()), [publicKey]);

  return (
    <section className="pricing" id="pricing">
      <CheckoutModal plan={activePlan} publicKey={publicKey} onClose={closeModal} />

      <div className="pricing__inner">
        <span className="pricing__eyebrow">Simple pricing</span>
        <h2 className="pricing__title">Choose your plan</h2>
        <p className="pricing__sub">No hidden fees. Cancel anytime. Pay with Mobile Money.</p>
        {!configured ? (
          <p className="pricing__config-hint" role="status">
            Add your Paystack public key as <code>VITE_PAYSTACK_PUBLIC_KEY</code> in <code>.env</code> to
            accept live payments.
          </p>
        ) : null}

        <div className="pricing__grid">
          <article className="price-card">
            <span className="price-card__badge">Quick access</span>
            <h3 className="price-card__name">Daily pass</h3>
            <p className="price-card__amount">
              <span className="price-card__currency">₵</span>10
              <span className="price-card__period">/day</span>
            </p>
            <p className="price-card__note">24-hour access · Auto-expires</p>
            <ul className="price-card__features">
              <li>Today&apos;s premium codes</li>
              <li>All match predictions</li>
              <li>24-hour access</li>
              <li>Perfect for testing</li>
            </ul>
            <button type="button" className="btn btn--ghost price-card__btn" onClick={() => openPlan("daily")}>
              Get daily pass
            </button>
          </article>

          <article className="price-card price-card--featured">
            <span className="price-card__badge price-card__badge--hot">Best value</span>
            <h3 className="price-card__name">Monthly subscription</h3>
            <p className="price-card__amount">
              <span className="price-card__currency">₵</span>50
              <span className="price-card__period">/month</span>
            </p>
            <p className="price-card__note">30-day access · Notifications included</p>
            <ul className="price-card__features">
              <li>Daily match predictions</li>
              <li>Premium betting codes</li>
              <li>Expert analysis &amp; insights</li>
              <li>Access to past results</li>
              <li>Support via WhatsApp</li>
              <li>30-day access guarantee</li>
            </ul>
            <button
              type="button"
              className="btn btn--primary price-card__btn"
              onClick={() => openPlan("monthly")}
            >
              Subscribe now
            </button>
          </article>
        </div>

        <p className="pricing__payments-label">Pay with Mobile Money or card</p>
        <p className="pricing__payments-help">Choose a plan above, then pick your network in the Paystack window.</p>
        <div className="pricing__payments" role="list">
          <button
            type="button"
            className="pricing__payment-chip"
            role="listitem"
            onClick={() => openPlan("monthly")}
          >
            MTN MoMo
          </button>
          <button
            type="button"
            className="pricing__payment-chip"
            role="listitem"
            onClick={() => openPlan("monthly")}
          >
            Vodafone Cash
          </button>
          <button
            type="button"
            className="pricing__payment-chip"
            role="listitem"
            onClick={() => openPlan("monthly")}
          >
            AirtelTigo Money
          </button>
        </div>
      </div>
    </section>
  );
}
