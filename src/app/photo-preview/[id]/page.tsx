import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ArrowRightIcon, CheckIcon, PrinterIcon } from "@/components/ui/icons";
import { flagEmoji, getCountry } from "@/config/countries";
import { photos } from "@/lib/server/db";
import { EmailForm } from "./email-form";

export const metadata: Metadata = {
  title: "Your passport photo",
  robots: { index: false, follow: false },
};

export default function PhotoPreviewPage({ params }: PageProps<"/photo-preview/[id]">) {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
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
  const photo = await (await photos()).findOne({ _id: id });
  if (!photo) notFound();

  const country = getCountry(photo.countryCode);
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
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
      {/* Photo */}
      <div className="rounded-lg border border-border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-black">
            {country && <span className="text-lg leading-none">{flagEmoji(country)}</span>}
            {country?.name ?? photo.countryCode} passport
          </p>
          <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600">
            {width} × {height} px
          </span>
        </div>
        <div className="bg-grid mt-4 flex items-center justify-center rounded-lg border border-border bg-gray-50 p-6 sm:p-10">
          <Image
            src={photo.previewUrl}
            alt={`Processed ${country?.name ?? ""} passport photo preview`}
            width={width}
            height={height}
            preload
            sizes="(min-width: 1024px) 400px, 80vw"
            className="h-auto max-h-[440px] w-auto rounded-sm shadow-sm ring-1 ring-black/5"
          />
        </div>
      </div>

      {/* Details + email */}
      <div className="space-y-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-lime-600/10 px-2.5 py-1 text-xs font-semibold text-lime-700">
            <CheckIcon className="size-3.5" />
            Processed to ICAO standards
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-black sm:text-3xl">Your photo is ready</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            Enter your email and we&apos;ll send you the full-resolution photo, ready to upload or print.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-white p-5 shadow-sm sm:p-6">
          <EmailForm id={photo._id} />
        </div>

        <div className="rounded-lg border border-border bg-white">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold text-black sm:px-6">Photo checks</h2>
          <dl className="divide-y divide-border">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center justify-between gap-4 px-5 py-3 text-sm sm:px-6">
                <dt className="flex items-center gap-2.5 text-gray-600">
                  <CheckIcon className={`size-4 ${c.ok === false ? "text-gray-300" : "text-lime-600"}`} />
                  {c.label}
                </dt>
                <dd className="font-mono text-xs text-black">{c.value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-5 py-3 text-sm sm:px-6">
              <dt className="flex items-center gap-2.5 text-gray-600">
                <CheckIcon className="size-4 text-lime-600" />
                File
              </dt>
              <dd className="font-mono text-xs text-black">
                {photo.format} · {photo.sizeKb} KB
              </dd>
            </div>
          </dl>
        </div>

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

function PreviewSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10" aria-busy>
      <div className="h-[520px] rounded-lg border border-border bg-white" />
      <div className="space-y-5">
        <div className="h-6 w-48 rounded-md bg-gray-200" />
        <div className="h-9 w-72 rounded-md bg-gray-200" />
        <div className="h-36 rounded-lg border border-border bg-white" />
        <div className="h-52 rounded-lg border border-border bg-white" />
      </div>
    </div>
  );
}
