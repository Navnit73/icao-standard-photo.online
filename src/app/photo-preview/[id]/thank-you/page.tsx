import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ArrowRightIcon, PrinterIcon } from "@/components/ui/icons";
import { flagEmoji, getCountry } from "@/config/countries";
import { getPaymentById } from "@/lib/payments/payment-service";
import { PaymentStatus } from "./payment-status";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default function ThankYouPage({ params, searchParams }: PageProps<"/photo-preview/[id]/thank-you">) {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Suspense fallback={<div className="h-[520px] animate-pulse rounded-lg border border-border bg-white" aria-busy />}>
          {Promise.all([params, searchParams]).then(([{ id }, { paymentId }]) => (
            <ThankYou id={id} paymentId={typeof paymentId === "string" ? paymentId : ""} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}

async function ThankYou({ id, paymentId }: { id: string; paymentId: string }) {
  await connection();
  const payment = paymentId ? await getPaymentById(paymentId) : null;
  if (!payment || payment.image.resultId !== id) notFound();

  const country = getCountry(payment.metadata.countryCode ?? "");
  const [width, height] = (payment.image.dimensions ?? "600x600").split("x").map(Number);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
      <div className="rounded-lg border border-border bg-white p-4 shadow-sm sm:p-6">
        <p className="flex items-center gap-2 text-sm font-medium text-black">
          {country && <span className="text-lg leading-none">{flagEmoji(country)}</span>}
          {payment.metadata.countryName} passport
        </p>
        <div className="bg-grid mt-4 flex items-center justify-center rounded-lg border border-border bg-gray-50 p-6 sm:p-10">
          {payment.image.previewUrl && (
            <Image
              src={payment.image.previewUrl}
              alt={`${payment.metadata.countryName ?? ""} passport photo`}
              width={width}
              height={height}
              sizes="(min-width: 1024px) 400px, 80vw"
              className="h-auto max-h-[440px] w-auto rounded-sm shadow-sm ring-1 ring-black/5"
            />
          )}
        </div>
      </div>

      <div className="space-y-5">
        <PaymentStatus paymentId={payment.paymentId} email={payment.email} />

        <div className="flex gap-3 rounded-lg border border-border bg-white p-4 sm:p-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
            <PrinterIcon className="size-4" />
          </span>
          <p className="text-sm leading-6 text-gray-600">
            <span className="font-semibold text-black">Printing?</span> Print on 4×6 in photo paper at any pharmacy or
            photo lab, then cut along the edges.
          </p>
        </div>

        <Link
          href="/icao-photo-tool"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-lime-700 underline-offset-4 hover:underline"
        >
          Create another photo
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
