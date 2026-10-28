import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import { ArrowRightIcon, CheckIcon, MailIcon, ShieldIcon, SparkIcon } from "@/components/ui/icons";
import { flagEmoji, getCountry } from "@/config/countries";
import { siteConfig } from "@/config/site";
import { resolveCurrencyFromHeaders } from "@/lib/currency";
import { getPaidPaymentByResultId } from "@/lib/payments/payment-service";
import { photos } from "@/lib/server/db";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Your passport photo",
  robots: { index: false, follow: false },
};

export default function PhotoPreviewPage({ params }: PageProps<"/photo-preview/[id]">) {
  return (
    <div className="bg-gray-50">
      {/* Extra bottom padding on mobile clears the sticky pay bar */}
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-32 sm:px-6 sm:pt-12 lg:pb-12">
        <Suspense fallback={<PreviewSkeleton />}>
          {params.then(({ id }) => (
            <PhotoPreview id={id} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}

async function PhotoPreview({ id }: { id: string }) {
  // The MongoDB driver reads the clock, so opt out of prerendering before querying
  await connection();
  const [photo, paid] = await Promise.all([(await photos()).findOne({ _id: id }), getPaidPaymentByResultId(id)]);
  if (!photo) notFound();

  // Price in the visitor's currency from the country header (create-order re-checks it)
  const { country: geoCountry, currency } = resolveCurrencyFromHeaders(await headers());

  const country = getCountry(photo.countryCode);
  const countryName = country?.name ?? photo.countryCode;
  const [width, height] = photo.dimensions.split("x").map(Number);
  const { metrics } = photo;

  const checks = [
    { label: "Head height", value: `${metrics.head_height_pct}% of photo` },
    { label: "Eye position", value: `${metrics.eye_position_pct}% from top` },
    { label: "Top margin", value: `${metrics.top_margin_pct}%` },
    {
      label: "Background",
      value: metrics.background_corrected ? "Corrected to plain" : metrics.background_valid ? "Plain and even" : "Needs review",
      ok: metrics.background_valid || metrics.background_corrected,
    },
    { label: "File", value: `${photo.format} · ${photo.sizeKb} KB` },
  ];

  return (
    <>
      {/* Headline */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-4xl">
          Your <span className="text-lime-700">passport photo</span> is ready
        </h1>
        <p className="mt-1.5 flex items-center gap-2 text-base font-medium text-gray-600 sm:text-xl">
          {country && <span className="leading-none">{flagEmoji(country)}</span>}
          {countryName} passport · {width} × {height} px
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm sm:mt-4">
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="hidden max-w-full items-center gap-2 rounded-lg border border-lime-600/30 bg-white px-3 py-1.5 text-gray-700 transition-colors hover:border-lime-600 sm:inline-flex"
          >
            <MailIcon className="size-4 text-lime-700" />
            <span className="shrink-0">Email support:</span>
            <span className="truncate font-medium text-black underline underline-offset-2">{siteConfig.supportEmail}</span>
          </a>
          <span className="inline-flex items-center gap-2 text-gray-600">
            <ShieldIcon className="size-4 text-lime-700" />
            Money-back guarantee if your photo is rejected
          </span>
        </div>
      </div>

      {/* Mobile order: photo → order summary → checks. On lg the summary spans the right column. */}
      <div className="mt-5 grid items-start gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8 [&>*]:min-w-0">
          <div className="rounded-lg border border-border bg-white p-4 shadow-sm sm:p-6 lg:col-start-1 lg:row-start-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-black">
                {country && <span className="text-lg leading-none">{flagEmoji(country)}</span>}
                {countryName} passport
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-lime-600/10 px-2.5 py-1 text-xs font-semibold text-lime-700">
                <CheckIcon className="size-3.5" />
                Processed to ICAO standards
              </span>
            </div>
            <div className="mt-3 flex items-center justify-center rounded-lg bg-gray-50 p-3 sm:mt-4 sm:p-6">
              <Image
                src={photo.previewUrl}
                alt={`Your ${countryName} passport photo`}
                width={width}
                height={height}
                preload
                draggable={false}
                sizes="(min-width: 1024px) 400px, 80vw"
                className="pointer-events-none h-auto max-h-[300px] w-auto rounded-sm shadow-sm ring-1 ring-black/10 select-none sm:max-h-[520px]"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-5 shadow-sm sm:p-6 lg:col-start-1 lg:row-start-2">
            <h2 className="flex items-center gap-3 text-base font-semibold text-black">
              <span className="flex size-9 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
                <CheckIcon className="size-4" />
              </span>
              Your photo meets the requirements
            </h2>
            <dl className="mt-3 divide-y divide-border sm:mt-4">
              {checks.map((c) => (
                <div key={c.label} className="flex items-center justify-between gap-4 py-2.5 text-sm sm:py-3">
                  <dt className="flex items-center gap-2.5 text-gray-700">
                    <CheckIcon className={`size-4 ${c.ok === false ? "text-gray-300" : "text-lime-600"}`} />
                    {c.label}
                  </dt>
                  <dd className="font-mono text-xs text-black">{c.value}</dd>
                </div>
              ))}
            </dl>
            {metrics.background_corrected && (
              <p className="mt-4 flex items-center gap-2 rounded-lg border border-lime-600/30 bg-lime-600/5 px-4 py-3 text-sm text-lime-700">
                <SparkIcon className="size-4" />
                Background corrected to meet official requirements
              </p>
            )}
          </div>

        {/* Order summary */}
        <div className="row-start-2 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div>
            <p className="mb-3 flex items-start gap-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              <ShieldIcon className="size-4 text-lime-700" />
              Order summary · for passport and visa applications
            </p>
            {paid ? (
              <div className="rounded-lg border border-lime-600/30 bg-lime-600/5 p-5 shadow-sm" role="status">
                <p className="flex items-center gap-2 text-sm font-semibold text-black">
                  <CheckIcon className="size-4 text-lime-600" />
                  You&apos;ve already purchased this photo
                </p>
                <p className="mt-1.5 text-sm leading-6 text-gray-600">We emailed it to {paid.email}.</p>
                <Link
                  href={`/photo-preview/${id}/thank-you?paymentId=${paid.paymentId}`}
                  className="mt-3 inline-flex h-10 items-center rounded-lg bg-lime-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-lime-700"
                >
                  Go to download
                </Link>
              </div>
            ) : (
              <CheckoutForm
                id={photo._id}
                initialCurrency={currency}
                geoDetected={!!geoCountry}
                description={`${countryName} passport photo (${photo.dimensions} px)`}
              />
            )}
          </div>

          <Link
            href="/icao-photo-tool"
            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lime-700 underline-offset-4 hover:underline"
          >
            Create another photo
            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

function PreviewSkeleton() {
  return (
    <div className="animate-pulse" aria-busy>
      <div className="h-10 w-80 max-w-full rounded-md bg-gray-200" />
      <div className="mt-3 h-6 w-56 rounded-md bg-gray-200" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
        <div className="space-y-6">
          <div className="h-[520px] rounded-lg border border-border bg-white" />
          <div className="h-72 rounded-lg border border-border bg-white" />
        </div>
        <div className="h-[640px] rounded-lg border border-border bg-white" />
      </div>
    </div>
  );
}
