export type PaystackResponse = {
  reference: string;
};

type PaystackHandler = {
  openIframe: () => void;
};

type PaystackSetupOptions = {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref: string;
  channels?: string[];
  metadata?: Record<string, unknown>;
  callback?: (response: PaystackResponse) => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => PaystackHandler;
    };
  }
}

const PAYSTACK_SRC = "https://js.paystack.co/v1/inline.js";

let loadPromise: Promise<void> | null = null;

export function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack requires a browser"));
  }
  if (window.PaystackPop) {
    return Promise.resolve();
  }
  if (loadPromise) {
    return loadPromise;
  }
  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PAYSTACK_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Paystack")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = PAYSTACK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Paystack"));
    };
    document.body.appendChild(script);
  });
  return loadPromise;
}

export function openPaystackCheckout(opts: {
  publicKey: string;
  email: string;
  amountPesewas: number;
  reference: string;
  planId: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}): void {
  const PaystackPop = window.PaystackPop;
  if (!PaystackPop) {
    throw new Error("Paystack is not loaded");
  }
  const handler = PaystackPop.setup({
    key: opts.publicKey,
    email: opts.email.trim(),
    amount: opts.amountPesewas,
    currency: "GHS",
    ref: opts.reference,
    channels: ["mobile_money", "card", "bank"],
    metadata: { plan_id: opts.planId },
    callback: (response) => {
      opts.onSuccess(response.reference);
    },
    onClose: opts.onClose,
  });
  handler.openIframe();
}

export function createPaymentReference(planId: string): string {
  const part =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : String(Math.floor(Math.random() * 1e12));
  return `wl_${planId}_${part}`;
}
