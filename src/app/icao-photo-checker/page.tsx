import Link from "next/link";
import { FaqSection, GuideCta, NumberedSteps, guideHeading, type Faq } from "@/components/guide";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { AlertIcon, CheckIcon, LockIcon, ShieldIcon } from "@/components/ui/icons";
import { countries } from "@/config/countries";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { PhotoTool } from "../icao-photo-tool/photo-tool";
import { SelfCheck } from "./self-check";

const page = {
  path: "/icao-photo-checker",
  title: "ICAO Photo Checker: Check Your Passport Photo Online",
  description:
    "Check your passport photo against ICAO rules online. See your head height, eye position, background and file results before you pay, and fix what fails.",
};

export const metadata = pageMetadata(page);

const { pricing, refund, privacy } = siteConfig;

const checks = [
  {
    name: "Face found",
    looksFor: "One clear, front-facing face in the photo",
    why: "Portals reject photos where software can't find or measure a face.",
  },
  {
    name: "Head height",
    looksFor: "How much of the photo height your head fills, from chin to crown",
    why: "A head that is too small or too large is one of the most common rejection reasons.",
  },
  {
    name: "Eye position",
    looksFor: "How far your eyes sit from the top of the photo",
    why: "Face-matching software expects the eyes in a set band of the image.",
  },
  {
    name: "Top margin",
    looksFor: "The gap between the top of your head and the edge of the photo",
    why: "A cut-off crown or too much space above the head both fail.",
  },
  {
    name: "Background",
    looksFor: "Whether the background is plain and even, and whether we corrected it",
    why: "Shadows, patterns and colour casts are rejected by every passport office.",
  },
  {
    name: "File",
    looksFor: "Format, pixel dimensions and file size for your country",
    why: "A perfect photo still fails if the file breaks the portal's limits.",
  },
];

const readSteps = [
  {
    title: "Choose your country and upload",
    body: "Pick the country of your passport and upload a recent photo. We remove the background and crop it to the official size.",
  },
  {
    title: "Read your results",
    body: "The preview shows the measured head height, eye position, top margin, background status and file details next to your photo.",
  },
  {
    title: "Fix or download",
    body: "If something needs work, retake the photo and check it again for free. If everything looks right, pay and download.",
  },
];

const faqs: Faq[] = [
  {
    q: "Is this ICAO photo checker free?",
    a: `Yes. Uploading a photo and seeing the check results costs nothing. You pay $${pricing.price} only if you want to download the finished photo and print sheet.`,
  },
  {
    q: "What does the ICAO photo checker check?",
    a: "It finds your face, measures your head height, eye position and top margin, checks the background and confirms the file format, dimensions and size for your country.",
  },
  {
    q: "Why doesn't the passport portal tell me what's wrong?",
    a: "Most portals return one general message, such as “photo is not valid as per ICAO standards”, without naming the failed check. Our checker shows each measurement, so you can see what to change.",
  },
  {
    q: "Which countries does the checker support?",
    a: `It supports passport photo sizes for ${countries.length} countries, including India, the United States, the United Kingdom, the Schengen area, Canada and Australia.`,
  },
  {
    q: "Does a good result guarantee my photo will be accepted?",
    a: `No online tool can guarantee acceptance, because an officer makes the final decision. That's why we back every photo you buy: if a government agency rejects it, send us the notice within ${refund.claimDays} days of purchase for a full refund.`,
  },
  {
    q: "Can the checker fix my photo too?",
    a: "Yes, for some problems. It replaces the background with plain white and crops and resizes the photo to your country's size. It can't fix shadows on your face, a tilted head, glasses, closed eyes or blur, so retake the photo for those.",
  },
  {
    q: "What file types can I upload?",
    a: "You can upload JPG, PNG, WebP or HEIC photos up to 10 MB, including photos straight from an iPhone or Android phone.",
  },
  {
    q: "What happens to my photo after the check?",
    a: `We use your photo only to process and check it, and we delete it automatically within ${privacy.deleteAfterHours} hours.`,
  },
  {
    q: "Why does the checker say it couldn't process my photo?",
    a: "This usually means it couldn't find a clear face. Make sure only one person is in the photo, your face is well lit and facing the camera, and the photo isn't blurred.",
  },
];

export default function IcaoPhotoCheckerPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "ICAO photo checker", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="Free ICAO photo check"
        breadcrumb="ICAO photo checker"
        title="ICAO photo checker: see what passes and what to fix"
        description="Passport portals reject photos without saying why. Upload yours here and see your head height, eye position, background and file results before you pay anything."
        actions={
          <ul className="space-y-2.5 text-sm text-gray-700">
            <li className="flex items-center gap-2.5">
              <CheckIcon className="size-4 text-lime-600" />
              Free check, no sign-up
            </li>
            <li className="flex items-center gap-2.5">
              <LockIcon className="size-4 text-lime-600" />
              Photos deleted within {privacy.deleteAfterHours} hours
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldIcon className="size-4 text-lime-600" />
              Refund if an agency rejects a photo you buy
            </li>
          </ul>
        }
        aside={<PhotoTool />}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* What it checks */}
        <section>
          <h2 className={guideHeading}>What the ICAO photo checker measures</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Each check matches a rule from ICAO Doc 9303 and your country&apos;s own photo specification.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Check</th>
                  <th scope="col" className="px-5 py-3 font-medium">What it looks for</th>
                  <th scope="col" className="px-5 py-3 font-medium">Why it matters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {checks.map((c) => (
                  <tr key={c.name}>
                    <th scope="row" className="px-5 py-3 font-semibold text-black">{c.name}</th>
                    <td className="px-5 py-3 text-gray-700">{c.looksFor}</td>
                    <td className="px-5 py-3 text-gray-600">{c.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Self check */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className={guideHeading}>Check these by eye</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Software measures the frame and the file, but you know best whether your eyes were open or your face was
              relaxed. Tick each item that is true for your photo.
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Need to retake it? Follow our guide to{" "}
              <Link href="/icao-guide/take-icao-photo-at-home" className="font-semibold text-lime-700 underline-offset-4 hover:underline">
                taking an ICAO photo at home
              </Link>
              .
            </p>
          </div>
          <SelfCheck />
        </section>

        {/* How to read */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>How the check works</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              The whole check takes about a minute, and you can repeat it as often as you need with a new photo.
            </p>
          </div>
          <NumberedSteps steps={readSteps} />
        </section>

        {/* Portal error */}
        <section className="mt-16 flex gap-4 rounded-lg border border-border bg-white p-5 sm:p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
            <AlertIcon className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold text-black">Already rejected by a portal?</h2>
            <p className="mt-1 text-sm leading-6 text-gray-700">
              Find the cause first, then run the check on your new photo. Start with{" "}
              <Link
                href="/icao-guide/passport-photo-rejected-reasons"
                className="font-semibold text-lime-700 underline-offset-4 hover:underline"
              >
                why passport photos get rejected
              </Link>{" "}
              or, for Passport Seva,{" "}
              <Link
                href="/icao-guide/passport-seva-photo-upload-error"
                className="font-semibold text-lime-700 underline-offset-4 hover:underline"
              >
                the upload error guide
              </Link>
              .
            </p>
          </div>
        </section>

        <FaqSection faqs={faqs} title="ICAO photo checker FAQ" />

        <GuideCta
          title="Check your photo now"
          body={`It's free to upload and check. Pay $${pricing.price} only when you download.`}
          label="Check my photo"
        />

        <RelatedLinks
          paths={["/icao-compliant-passport-photo", "/icao-guide/take-icao-photo-at-home", "/icao-guide/passport-photo-rejected-reasons"]}
        />
      </div>
    </>
  );
}
