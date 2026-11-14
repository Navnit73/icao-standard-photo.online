import Link from "next/link";
import {
  FaqSection,
  GuideCta,
  IndiaPricing,
  NumberedSteps,
  QuickAnswer,
  SpecList,
  guideHeading,
  indiaPlans,
  type Faq,
} from "@/components/guide";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon, CropIcon, XIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { SpecChecker } from "./spec-checker";

const page = {
  path: "/icao-guide/convert-photo-to-icao-standard",
  title: "How to Convert Any Photo to ICAO Standard (630×810 & 35×45 mm)",
  description:
    "Convert any phone photo or selfie into an ICAO standard passport photo. See exact 630 × 810 px, 35 × 45 mm and 2 × 2 in conversions, plus a free file spec checker.",
};

export const metadata = pageMetadata(page);

const [standard] = indiaPlans;
const { pricing } = siteConfig;

const quickSpecs = [
  { label: "India Passport Seva", value: "630 × 810 px (7:9)" },
  { label: "EU / UK / Schengen", value: "35 × 45 mm (413 × 531 px)" },
  { label: "USA / Indian OCI", value: "2 × 2 in (600 × 600 px)" },
  { label: "File format", value: "JPEG (.jpg)" },
  { label: "India max file size", value: "10–250 KB" },
  { label: "Head coverage", value: "70–85% of frame" },
];

const conversionMatrix = [
  {
    document: "Indian Passport (Passport Seva 2.0)",
    pixels: "630 × 810 px",
    metric: "35 × 45 mm (3.5 × 4.5 cm)",
    ratio: "7:9 portrait",
    fileLimit: "JPEG, 10–250 KB",
  },
  {
    document: "Schengen, UK & EU Visas / Passports",
    pixels: "413 × 531 px (300 DPI) / 600 × 750 px (UK digital)",
    metric: "35 × 45 mm (3.5 × 4.5 cm)",
    ratio: "7:9 portrait",
    fileLimit: "JPEG, typically ≤ 500 KB",
  },
  {
    document: "US Passport, US Visa & Indian OCI / VFS Print",
    pixels: "600 × 600 px to 1200 × 1200 px",
    metric: "51 × 51 mm (2 × 2 in)",
    ratio: "1:1 square",
    fileLimit: "JPEG, ≤ 240 KB (US online)",
  },
  {
    document: "Canada Passport (Print)",
    pixels: "1200 × 1800 px (tool output)",
    metric: "50 × 70 mm (5 × 7 cm)",
    ratio: "5:7 portrait",
    fileLimit: "Print on matte/glossy photo paper",
  },
  {
    document: "Australia Passport",
    pixels: "413 × 531 px (300 DPI)",
    metric: "35–40 × 45–50 mm",
    ratio: "7:9 portrait",
    fileLimit: "JPEG, 70–3500 KB",
  },
];

const steps = [
  {
    title: "Start with an unfiltered, original camera photo",
    body: "Use the original file from your phone's rear camera taken 1.2–1.5 m away. Photos saved from WhatsApp or screenshots are compressed and fail ICAO continuous-tone and sharpness checks.",
  },
  {
    title: "Convert the background to uniform pure white",
    body: "Off-white walls, shadows behind your ears, or grey tints trigger automated rejections. Replace the background cleanly without leaving fuzzy edges around hair.",
  },
  {
    title: "Crop to the target aspect ratio BEFORE resizing",
    body: "Never force a 4:3 or 16:9 phone photo straight into 630 × 810 px — that stretches or squashes your face and fails posture checks. Crop to a 7:9 frame (for 630 × 810 px) or 1:1 (for 2 × 2 in) while keeping your head 70–85% of the height.",
  },
  {
    title: "Resize to exact pixel dimensions",
    body: "Scale the cropped frame to exactly 630 × 810 px for Passport Seva, or the exact pixel requirement of your destination portal. Even 1 pixel off causes an instant upload error.",
  },
  {
    title: "Export as baseline JPEG within the KB limit",
    body: "Convert HEIC, PNG or WebP files to standard JPEG (.jpg) at 85–90% quality so the file sits cleanly between 10 KB and 250 KB without blocky compression artifacts.",
  },
];

const manualVsTool = [
  {
    issue: "Stretching the face during resize",
    whyFails: "Changing width and height without locking aspect ratio distorts inter-eye distance and triggers ICAO rejection.",
    howSolved: "Locks the 7:9 (or country-specific) ratio and centres eye position automatically.",
  },
  {
    issue: "Wrong head-to-frame percentage",
    whyFails: "Generic resizers crop the whole image to 630 × 810 px even when your head only covers 40% of the height.",
    howSolved: "Detects chin-to-crown height and scales the crop so your face fills 70–85% of the frame.",
  },
  {
    issue: "Hidden background shadows or colour cast",
    whyFails: "A cream or cool-grey wall looks white to the eye, but portals detect uneven RGB luminance.",
    howSolved: "Replaces the background with uniform #FFFFFF white while preserving natural facial skin tones.",
  },
  {
    issue: "HEIC, PNG or over-compressed JPEG",
    whyFails: "iPhones save HEIC; Windows/Mac screenshots save PNG. Renaming .png to .jpg still fails portal validation.",
    howSolved: "Re-encodes a genuine JPEG within 10–250 KB while checking sharpness.",
  },
];

const faqs: Faq[] = [
  {
    q: "How do I convert my photo to ICAO standard online?",
    a: `Upload your original photo to our ICAO Photo Tool, choose your country (such as India for 630 × 810 px or Schengen for 35 × 45 mm), and the tool automatically removes the background, centres your eyes, crops to the exact head ratio, and runs ICAO compliance checks before you pay (${standard.amountFormatted} in India, $${pricing.price} elsewhere).`,
  },
  {
    q: "What is 630 × 810 pixels in cm, mm and inches?",
    a: "At 300 DPI print resolution, 630 × 810 px matches a 7:9 portrait ratio equivalent to 35 × 45 mm (3.5 × 4.5 cm, or roughly 1.38 × 1.77 inches). For digital Passport Seva 2.0 uploads, only the exact pixel count (630 × 810 px) and file size (under 250 KB) matter.",
  },
  {
    q: "Can I convert a regular selfie into an ICAO passport photo?",
    a: "Often yes, if your head is straight, eyes open, mouth closed, no glasses, and lighting is even on both sides of your face. However, arm's-length selfies with wide-angle distortion (large nose, small ears) or tilted heads may fail posture checks — in that case, retake from 1.2–1.5 m away using the rear camera.",
  },
  {
    q: "Why did my 630 × 810 px photo still fail Passport Seva?",
    a: "Meeting 630 × 810 px and under 250 KB only passes the file check. Passport Seva also runs biometric checks for head tilt, face coverage (80–85%), background shadows, uneven lighting, and continuous-tone quality.",
  },
  {
    q: "Is there a free way to check if my converted photo meets ICAO specs?",
    a: "Yes. You can inspect your file's pixel dimensions, aspect ratio, format, and KB size right on this page for free, or upload your photo to our ICAO Photo Checker to see automated head height, eye position, and background results before you pay.",
  },
  {
    q: "How do I convert an iPhone HEIC photo to an ICAO JPEG?",
    a: "Do not just rename the file extension. Either open it in Photos/Preview and export as JPEG, change iPhone Settings → Camera → Formats → Most Compatible for future shots, or upload the HEIC directly to our ICAO Photo Tool, which converts and resizes it automatically.",
  },
];

export default function ConvertPhotoToIcaoPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "Convert photo to ICAO standard", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="ICAO guide · Converter"
        breadcrumb="Convert photo to ICAO standard"
        title="How to convert any photo to ICAO standard (630 × 810 px & 35 × 45 mm)"
        description="Turn a normal portrait or phone photo into an ICAO 9303 compliant file without stretching your face or triggering portal errors. Check your file dimensions below or convert automatically in one minute."
        actions={
          <>
            <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
              Convert my photo now
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#spec-checker" variant="secondary" size="lg" className="w-full sm:w-auto">
              Check my file specs free
            </ButtonLink>
          </>
        }
        aside={
          <div>
            <p className="mb-3 text-sm font-semibold text-black">Common ICAO conversion targets</p>
            <SpecList items={quickSpecs} />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <QuickAnswer title="The short answer" icon={<CropIcon className="size-5" />}>
          To convert a photo to ICAO standard, you must preserve your natural face proportions: first set a pure white
          background, then crop to the exact aspect ratio (7:9 for 630 × 810 px or 35 × 45 mm; 1:1 for 2 × 2 in) with
          your head filling 70–85% of the frame, and finally resize and export as a genuine JPEG under the portal&apos;s
          KB limit.
        </QuickAnswer>

        {/* Interactive local file spec checker */}
        <section id="spec-checker" className="mt-16 scroll-mt-24">
          <h2 className={guideHeading}>Check your photo&apos;s dimensions, ratio and KB size</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Already resized a photo and want to verify the file before uploading to Passport Seva or a visa portal?
            Select your target document and inspect your JPEG here instantly.
          </p>
          <div className="mt-8">
            <SpecChecker />
          </div>
        </section>

        {/* Conversion table */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className={guideHeading}>ICAO photo size conversion chart (px, mm, cm &amp; inches)</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Different portals ask for the same ICAO framing in different units. Match your exact country and submission
            channel before converting.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-border bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Document / Portal</th>
                  <th className="px-5 py-3.5 font-semibold">Digital Pixels</th>
                  <th className="px-5 py-3.5 font-semibold">Print Size (mm / in)</th>
                  <th className="px-5 py-3.5 font-semibold">Aspect Ratio</th>
                  <th className="px-5 py-3.5 font-semibold">File Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {conversionMatrix.map((row) => (
                  <tr key={row.document}>
                    <td className="px-5 py-4 font-semibold text-black">{row.document}</td>
                    <td className="px-5 py-4 text-gray-700">{row.pixels}</td>
                    <td className="px-5 py-4 text-gray-700">{row.metric}</td>
                    <td className="px-5 py-4 text-gray-700">{row.ratio}</td>
                    <td className="px-5 py-4 text-gray-600">{row.fileLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Step-by-step */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>5 steps to convert a photo to ICAO standard</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Follow these steps in exact order if converting manually in Photoshop, Preview or Paint, or let our tool run
              all five steps automatically.
            </p>
            <div className="mt-6">
              <ButtonLink href="/icao-photo-tool" size="md">
                Auto-convert with ICAO checks
                <ArrowRightIcon className="size-4" />
              </ButtonLink>
            </div>
          </div>
          <NumberedSteps steps={steps} />
        </section>

        {/* Why generic resizers fail */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className={guideHeading}>Why basic free resizers still get rejected</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Resizing an image to 630 × 810 px in a generic resizer fixes the file dimensions, but often breaks the
            biometric rules that Passport Seva and e-gates actually check.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {manualVsTool.map((item) => (
              <li key={item.issue} className="rounded-lg border border-border bg-white p-5">
                <h3 className="font-semibold text-black">{item.issue}</h3>
                <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-gray-600">
                  <XIcon className="mt-1 size-4 shrink-0 text-red-600" />
                  <span>{item.whyFails}</span>
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-gray-700">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                  <span>{item.howSolved}</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray-600">
            Already converted a photo and received a portal rejection? See{" "}
            <Link href="/icao-guide/passport-seva-icao-check-errors" className="font-medium text-lime-700 hover:underline">
              how to fix Posture check failed &amp; ICAO test errors
            </Link>
            .
          </p>
        </section>

        <IndiaPricing />

        <FaqSection faqs={faqs} title="Converting photos to ICAO standard FAQ" />

        <GuideCta
          title="Convert your photo to 630 × 810 px or 35 × 45 mm in 60 seconds"
          body={`Check head height, eye position and background for free. Pay ${standard.amountFormatted} (India) or $${pricing.price} only when you download.`}
          label="Convert my photo"
        />

        <RelatedLinks
          paths={[
            "/icao-photo-checker",
            "/icao-guide/indian-passport-photo-requirements",
            "/icao-guide/icao-standard-photo-examples",
          ]}
        />
      </div>
    </>
  );
}

