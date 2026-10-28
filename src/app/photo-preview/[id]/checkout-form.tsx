"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { AlertIcon, CheckIcon, DownloadIcon, LockIcon, MailIcon, ShieldIcon, SparkIcon, XIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { getPlanPricing, type PlanType } from "@/lib/config/pricing";
import { getTimezoneCurrency, isSupportedCurrency, type CurrencyCode } from "@/lib/currency";

const browserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Short line under each plan title, always visible (features collapse on mobile)
const PLAN_TAGLINES: Record<PlanType, string> = {
  standard: "Instant download, checked against ICAO 9303",
  expert_edit: "A photo specialist reviews and retouches it by hand",
};

// The timezone never changes while the page is open
const noSubscribe = () => () => {};

type RazorpayResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, cb: (resp: unknown) => void) => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

/** Load Razorpay's checkout script once */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

class ApiError extends Error {
  constructor(public data: { error?: string; code?: string; currency?: string; paidPaymentId?: string }) {
    super(data.error || "Something went wrong. Please try again.");
  }
}

const postJson = async (url: string, body: unknown) => {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new ApiError(data);
  return data;
};

export function CheckoutForm({
  id,
  initialCurrency,
  geoDetected,
  description,
}: {
  id: string;
  /** Currency resolved on the server from the country header */
  initialCurrency: CurrencyCode;
  /** False when the request had no country header: fall back to the browser's timezone */
  geoDetected: boolean;
  description: string;
}) {
  const router = useRouter();
  // Set when create-order reports a different regional price
  const [serverCurrency, setServerCurrency] = useState<CurrencyCode | null>(null);
  // No country header (e.g. local dev): guess from the browser's timezone. The server applies
  // the same rule from the timeZone sent with the order. Server render uses initialCurrency.
  const tzCurrency = useSyncExternalStore(
    noSubscribe,
    () => (geoDetected ? null : getTimezoneCurrency(browserTimeZone())),
    () => null
  );
  const currency = serverCurrency ?? tzCurrency ?? initialCurrency;
  const [plan, setPlan] = useState<PlanType>("standard");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogEmailRef = useRef<HTMLInputElement>(null);

  const plans = { standard: getPlanPricing("standard", currency), expert_edit: getPlanPricing("expert_edit", currency) };

  const isExpert = plan === "expert_edit";
  const selected = plans[plan];
  const emailValid = EMAIL_RE.test(email.trim());

  function openEmailDialog() {
    setError("");
    dialogRef.current?.showModal();
    dialogEmailRef.current?.focus();
  }

  // Desktop button: pay straight away when the inline email is filled in, else ask for it
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    if (emailValid) void pay();
    else openEmailDialog();
  }

  function handleDialogSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    dialogRef.current?.close();
    void pay();
  }

  async function pay() {
    setError("");
    setPending(true);
    const targetEmail = email.trim().toLowerCase();

    try {
      // 1. Load Razorpay checkout script
      if (!(await loadRazorpayScript())) {
        throw new Error("Unable to load the payment gateway. Please check your connection.");
      }

      // 2. Create order on server (amount is set server-side)
      // expectedCurrency/expectedAmount let the server refuse to charge a price we didn't show
      const order = await postJson("/api/payments/create-order", {
        email: targetEmail,
        resultId: id,
        planType: plan,
        timeZone: browserTimeZone(),
        expectedCurrency: selected.currency,
        expectedAmount: selected.amountInSubunits,
      });
      const { paymentId, razorpayOrderId, amount, currency, keyId } = order;

      // 3. Open Razorpay Checkout
      const Razorpay = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
      const rzp = new Razorpay({
        key: keyId,
        amount,
        currency,
        name: siteConfig.name,
        description: isExpert ? `${description} + Expert edit` : description,
        image: siteConfig.logo,
        order_id: razorpayOrderId,
        prefill: { email: targetEmail },
        notes: { paymentId, resultId: id, planType: plan },
        theme: { color: "#65a30d" },
        modal: { ondismiss: () => setPending(false) },
        handler: async (response: RazorpayResponse) => {
          try {
            // 4. Verify payment on server, then show the thank-you page
            await postJson("/api/payments/verify", {
              paymentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            router.push(`/photo-preview/${id}/thank-you?paymentId=${paymentId}`);
          } catch (verifyErr) {
            setPending(false);
            setError(
              verifyErr instanceof Error
                ? `${verifyErr.message} If you were charged, your photo will still be emailed to you.`
                : "Payment was received but verification had an issue. Please contact support."
            );
          }
        },
      });

      // Razorpay keeps its modal open so the customer can retry; pending is cleared on dismiss,
      // otherwise the Pay button could open a second checkout on top
      rzp.on("payment.failed", (resp) => {
        const desc = (resp as { error?: { description?: string } })?.error?.description;
        setError(desc || "Payment was not completed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      // Already bought (e.g. a stale tab): show the existing order instead of charging again
      if (err instanceof ApiError && err.data.paidPaymentId) {
        router.push(`/photo-preview/${id}/thank-you?paymentId=${err.data.paidPaymentId}`);
        return;
      }
      // Regional price differs from what this page shows: switch to the server's currency
      if (err instanceof ApiError && err.data.code === "PRICE_CHANGED" && isSupportedCurrency(err.data.currency)) {
        setServerCurrency(err.data.currency);
      }
      setPending(false);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  }


  // Expert edit switches to a dark, premium look so the upgrade feels like one
  const payButtonClass = `inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 disabled:opacity-70 ${
    isExpert ? "bg-gray-900 hover:bg-black" : "bg-lime-600 hover:bg-lime-700"
  }`;
  const payIcon = pending ? (
    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  ) : isExpert ? (
    <SparkIcon className="size-4 text-lime-600" />
  ) : (
    <LockIcon className="size-4" />
  );
  const errorMessage = error && (
    <p role="alert" className="flex items-start gap-2 text-sm text-red-700">
      <AlertIcon className="mt-0.5 size-4 shrink-0" />
      {error}
    </p>
  );

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend className="sr-only">Choose your option</legend>
          <div className="grid gap-3">
            {(["standard", "expert_edit"] as const).map((key) => {
              const p = plans[key];
              const active = plan === key;
              const dark = active && key === "expert_edit";
              return (
                <label
                  key={key}
                  className={`block cursor-pointer rounded-lg border p-4 transition-colors duration-200 sm:p-5 ${
                    dark
                      ? "border-gray-900 bg-gray-900 shadow-sm ring-1 ring-gray-900"
                      : active
                        ? "border-lime-600 bg-lime-600/5 ring-1 ring-lime-600"
                        : "border-border bg-white shadow-sm hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={key}
                    checked={active}
                    onChange={() => setPlan(key)}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex min-w-0 items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          active ? "border-lime-600 bg-lime-600 text-white" : "border-gray-300 bg-white"
                        }`}
                      >
                        {active && <CheckIcon className="size-2.5" />}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className={`text-sm font-semibold ${dark ? "text-white" : "text-black"}`}>{p.title}</span>
                          {key === "expert_edit" && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${
                                dark ? "bg-lime-600 text-white" : "bg-lime-600/10 text-lime-700"
                              }`}
                            >
                              <SparkIcon className="size-3" />
                              {dark ? "Best quality" : "Human review"}
                            </span>
                          )}
                        </span>
                        <span className={`mt-0.5 block text-xs leading-5 ${dark ? "text-gray-300" : "text-gray-500"}`}>
                          {PLAN_TAGLINES[key]}
                        </span>
                      </span>
                    </span>
                    <span className={`shrink-0 text-xl font-semibold tracking-tight ${dark ? "text-white" : "text-black"}`}>
                      {p.amountFormatted}
                    </span>
                  </span>
                  {/* Mobile shows only the selected plan's features to keep the page short */}
                  <ul className={`mt-3 space-y-1.5 pl-6.5 ${active ? "" : "hidden lg:block"}`}>
                    {p.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-sm leading-6 ${dark ? "text-gray-200" : "text-gray-600"}`}>
                        <CheckIcon className="mt-1 size-3.5 shrink-0 text-lime-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Desktop: inline email and pay button. Mobile uses the sticky bar and the email sheet. */}
        <div className="mt-3 hidden rounded-lg border border-border bg-white p-5 shadow-sm lg:block">
          <label htmlFor="email" className="block text-sm font-medium text-black">
            Email for delivery
          </label>
          <div className="relative mt-2">
            <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-lg border border-gray-300 bg-white pr-3.5 pl-10 text-sm outline-none transition-colors placeholder:text-gray-400 hover:border-gray-400 focus:border-lime-600 focus:ring-2 focus:ring-lime-600/15"
            />
          </div>
          <button type="submit" disabled={pending} className={`mt-3 w-full ${payButtonClass}`}>
            {payIcon}
            {pending ? "Processing…" : `${isExpert ? "Get expert edit" : "Download now"} — ${selected.amountFormatted}`}
          </button>
          {error && <div className="mt-2.5">{errorMessage}</div>}
        </div>

        <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-600">
          <li className="flex items-center gap-1.5">
            <LockIcon className="size-3.5 text-lime-700" />
            Secure checkout
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldIcon className="size-3.5 text-lime-700" />
            Refund if rejected
          </li>
          <li className="flex items-center gap-1.5">
            <DownloadIcon className="size-3.5 text-lime-700" />
            Instant download
          </li>
        </ul>
        <p className="mt-3 text-center text-xs text-gray-500">
          Payments processed securely by <span className="font-semibold text-gray-700">Razorpay</span>
        </p>
      </form>

      {/* Mobile: sticky pay bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-sm backdrop-blur lg:hidden">
        {error && !pending && <div className="mb-2">{errorMessage}</div>}
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 truncate text-xs font-medium text-gray-500">
              {isExpert && <SparkIcon className="size-3 text-lime-700" />}
              {selected.title}
            </p>
            <p className="text-lg leading-tight font-semibold tracking-tight text-black">{selected.amountFormatted}</p>
          </div>
          <button type="button" onClick={openEmailDialog} disabled={pending} className={`flex-1 ${payButtonClass}`}>
            {payIcon}
            {pending ? "Processing…" : isExpert ? "Get expert edit" : "Download now"}
          </button>
        </div>
      </div>

      {/* Email sheet: bottom sheet on mobile, centred dialog on desktop */}
      <dialog
        ref={dialogRef}
        aria-labelledby="email-dialog-title"
        onClick={(e) => {
          // Click on the backdrop closes it
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-0 mt-auto w-full max-w-none rounded-t-lg bg-white text-gray-900 shadow-sm backdrop:bg-black/50 sm:m-auto sm:max-w-md sm:rounded-lg"
      >
        <form onSubmit={handleDialogSubmit} noValidate className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="email-dialog-title" className="text-lg font-semibold tracking-tight text-black">
                Where should we send your photo?
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {isExpert
                  ? "Your expert-edited photo and invoice will be emailed here."
                  : "You'll download it right away, and we'll email a copy with your invoice."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              className="-mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          <div
            className={`mt-4 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors ${
              isExpert ? "border-gray-900 bg-gray-900 text-white" : "border-lime-600/30 bg-lime-600/5 text-black"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              {isExpert ? <SparkIcon className="size-4 text-lime-600" /> : <CheckIcon className="size-4 text-lime-600" />}
              {selected.title}
            </span>
            <span className="text-base font-semibold tracking-tight">{selected.amountFormatted}</span>
          </div>

          <label htmlFor="dialog-email" className="mt-5 block text-sm font-medium text-black">
            Email address
          </label>
          <div className="relative mt-2">
            <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={dialogEmailRef}
              id="dialog-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              enterKeyHint="go"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="you@example.com"
              aria-invalid={!!error}
              className="h-12 w-full rounded-lg border border-gray-300 bg-white pr-3.5 pl-10 text-base outline-none transition-colors placeholder:text-gray-400 hover:border-gray-400 focus:border-lime-600 focus:ring-2 focus:ring-lime-600/15 sm:text-sm"
            />
          </div>
          {error && <div className="mt-2.5">{errorMessage}</div>}

          <button type="submit" disabled={pending} className={`mt-4 w-full ${payButtonClass}`}>
            {payIcon}
            {`Continue to payment — ${selected.amountFormatted}`}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <LockIcon className="size-3.5 text-lime-700" />
            Secure checkout by Razorpay · Refund if rejected
          </p>
        </form>
      </dialog>
    </>
  );
}
