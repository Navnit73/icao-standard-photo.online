"use client";

import { useEffect, useState } from "react";
import { AlertIcon, CheckIcon, DownloadIcon, MailIcon } from "@/components/ui/icons";
import { formatMoney } from "@/lib/currency";

type Status = {
  status: "pending" | "authorized" | "paid" | "failed" | "refunded" | "cancelled";
  fulfillmentStatus: "pending" | "processing" | "completed" | "failed";
  emailStatus: "pending" | "sending" | "sent" | "failed";
  amount: number;
  currency: string;
  planType: "standard" | "expert_edit";
  downloadToken?: string;
  invoiceNumber?: string;
};

const POLL_MS = 2500;
const MAX_POLLS = 24; // ~1 minute; the webhook keeps working after that

export function PaymentStatus({ paymentId, email }: { paymentId: string; email: string }) {
  const [data, setData] = useState<Status | null>(null);

  // Poll until fulfillment settles (verify usually finishes it before we get here)
  useEffect(() => {
    let polls = 0;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/payments/status/${paymentId}`, { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        if (json.success) setData(json);
        // "failed" fulfillment is retried by the status endpoint, so keep polling until it completes
        if (json.fulfillmentStatus !== "completed" && ++polls < MAX_POLLS) timer = setTimeout(load, POLL_MS);
      } catch {
        if (!cancelled && ++polls < MAX_POLLS) timer = setTimeout(load, POLL_MS);
      }
    }
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [paymentId]);

  const paid = data?.status === "paid";
  const emailSent = data?.emailStatus === "sent";
  // Failed for good only once fulfillment has given up retrying
  const emailFailed = data?.emailStatus === "failed" && data.fulfillmentStatus === "completed";

  return (
    <>
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-lime-600/10 px-2.5 py-1 text-xs font-semibold text-lime-700">
          <CheckIcon className="size-3.5" />
          {paid ? `Payment received · ${formatMoney(data.amount, data.currency, { trimWholeNumbers: true })}` : "Confirming payment…"}
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-black sm:text-3xl">Thank you! Your photo is ready</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
          Download it now. We&apos;re also emailing the photo and your invoice to {email}.
        </p>
        {data?.planType === "expert_edit" && paid && (
          <p className="mt-3 rounded-lg border border-lime-600/30 bg-lime-600/5 p-3 text-sm leading-6 text-gray-700">
            <span className="font-semibold text-black">Expert edit included.</span> A photo specialist is reviewing and
            retouching your photo by hand. We&apos;ll email you the final version.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-border bg-white p-5 shadow-sm sm:p-6">
        {data?.downloadToken ? (
          <a
            href={`/api/download/${data.downloadToken}`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-lime-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-lime-700"
          >
            <DownloadIcon className="size-4" />
            Download photo
          </a>
        ) : (
          <div className="flex h-12 items-center justify-center gap-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-600">
            <span className="size-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            Preparing your download…
          </div>
        )}

        <dl className="mt-5 divide-y divide-border text-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="flex items-center gap-2.5 text-gray-600">
              <MailIcon className="size-4" />
              Email
            </dt>
            <dd className={emailFailed ? "text-red-700" : "text-black"}>
              {emailSent ? "Sent" : emailFailed ? "Couldn't send — please download above" : "Sending…"}
            </dd>
          </div>
          {data?.invoiceNumber && (
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-gray-600">Invoice</dt>
              <dd className="flex gap-3">
                <a href={`/api/invoices/${paymentId}`} target="_blank" className="font-medium text-lime-700 hover:underline">
                  {data.invoiceNumber}
                </a>
                <a href={`/api/invoices/${paymentId}?format=pdf`} className="text-gray-600 hover:underline">
                  PDF
                </a>
              </dd>
            </div>
          )}
        </dl>

        {data?.status === "failed" && (
          <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-red-700">
            <AlertIcon className="mt-0.5 size-4" />
            This payment didn&apos;t go through. Please go back and try again.
          </p>
        )}
      </div>
    </>
  );
}
