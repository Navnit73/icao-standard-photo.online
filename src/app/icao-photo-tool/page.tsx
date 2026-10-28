import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { CheckIcon, LockIcon, ShieldIcon, XIcon } from "@/components/ui/icons";
import { Eyebrow } from "@/components/ui/section-heading";
import { countries } from "@/config/countries";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { PhotoTool } from "./photo-tool";

const page = {
  path: "/icao-photo-tool",
  title: "ICAO Photo Tool — Create Your Passport Photo",
  description: `Upload a selfie and get a passport photo sized for ${countries.length} countries. We remove the background, crop to the official size and run ICAO checks in minutes.`,
};

export const metadata = pageMetadata(page);

const dos = [
  "Face the camera, head straight",
  "Plain, light-coloured wall behind you",
  "Soft, even light from a window",
  "Neutral expression, mouth closed",
];

const donts = ["Glasses with glare or tinted lenses", "Hats, filters or beauty effects", "Shadows on your face"];

export default function PhotoToolPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "ICAO photo tool", path: page.path }]),
        )}
      />

      <section className="border-b border-border bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="transition-colors hover:text-black">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-gray-700">
                ICAO photo tool
              </li>
            </ol>
          </nav>
          <div className="mt-6">
            <Eyebrow>ICAO photo tool</Eyebrow>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-black sm:text-4xl">
              Create your passport photo
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Pick your country, upload a photo and we handle the background, size and ICAO checks. It takes
              about a minute.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <PhotoTool />

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-black">Tips for a photo that passes</h2>
            <ul className="mt-4 space-y-2.5">
              {dos.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckIcon className="mt-0.5 size-4 text-lime-600" />
                  {t}
                </li>
              ))}
            </ul>
            <ul className="mt-4 space-y-2.5 border-t border-border pt-4">
              {donts.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-gray-500">
                  <XIcon className="mt-0.5 size-4 text-gray-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex gap-3 rounded-lg border border-border bg-white p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
                <ShieldIcon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-black">Money-back guarantee</p>
                <p className="mt-0.5 text-xs leading-5 text-gray-500">Full refund if an agency rejects your photo.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-border bg-white p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
                <LockIcon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-black">Private by default</p>
                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  Deleted automatically within {siteConfig.privacy.deleteAfterHours} hours.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
