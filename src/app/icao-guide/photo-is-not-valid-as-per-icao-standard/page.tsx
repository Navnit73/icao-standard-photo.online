import Image from "next/image";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { ButtonLink } from "@/components/ui/button-link";
import { AlertIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { getPlanPricing } from "@/lib/config/pricing";
import { absoluteUrl, breadcrumbSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/icao-guide/photo-is-not-valid-as-per-icao-standard",
  title: "Photo Is Not Valid as per ICAO Standard: Causes and Fixes",
  description:
    "Seeing “photo is not valid as per ICAO standard” on a passport or visa portal? Learn the common reasons your photo was rejected and how to fix each one.",
};

export const metadata = pageMetadata(page);

const { pricing, refund } = siteConfig;

const images = {
  // Pixelated region hides the applicant's email address in the portal header
  desktop:
    "https://res.cloudinary.com/dipzpwbbk/image/upload/e_pixelate_region:24,x_2420,y_100,w_520,h_95/v1793245071/icao-rejection_zx7yce.webp",
  mobile:
    "https://res.cloudinary.com/dipzpwbbk/image/upload/v1793245072/photo-is-not-valid-as-per-icao-standard_oamc9c.webp",
  sample:
    "https://res.cloudinary.com/dipzpwbbk/image/upload/v1793075602/south-africa-visa-photo-girl-example_pkg7my.webp",
};

const portalSpecs = [
  { label: "File type", value: "JPG / JPEG" },
  { label: "Maximum size", value: "250 KB" },
  { label: "Dimensions", value: "630 × 810 px" },
];

const accepted = [
  "35 × 45 mm with the head 32–36 mm from chin to crown",
  "Plain white background with no shadows",
  "Face centred, eyes level and looking at the camera",
  "Neutral expression, mouth closed, eyes open",
  "Sharp, evenly lit and free of filters",
];

const reasons = [
  {
    title: "Background is not plain or light",
    cause: "Patterned walls, visible objects, colour casts or a grey-blue tint behind you.",
    fix: "Stand in front of a plain white or light grey wall, or use a tool that replaces the background with pure white.",
  },
  {
    title: "Shadows on the face or background",
    cause: "Overhead lights or a single side lamp create shadows under the eyes, nose or behind the head.",
    fix: "Face a window for soft, even daylight and stand about 50 cm away from the wall.",
  },
  {
    title: "Head size or position is wrong",
    cause: "The face is too small, too large, off-centre or cropped at the chin or crown.",
    fix: "On a 35×45 mm photo the head should be 32–36 mm tall from chin to crown, centred, with a little space above the hair.",
  },
  {
    title: "Head tilted or not facing the camera",
    cause: "A slight tilt, turned shoulders or looking off to one side.",
    fix: "Look straight into the lens with your head level and shoulders square. Keep the camera at eye level.",
  },
  {
    title: "Expression or eyes",
    cause: "Smiling with teeth, raised eyebrows, mouth open, eyes half-closed or hidden by hair.",
    fix: "Keep a neutral expression with your mouth closed and both eyes fully open and visible.",
  },
  {
    title: "Glasses, glare or head coverings",
    cause: "Reflections on lenses, tinted glasses, thick frames over the eyes or hats.",
    fix: "Remove glasses if you can. Head coverings are only allowed for religious or medical reasons, and must not cover the face.",
  },
  {
    title: "Blurry, edited or low quality",
    cause: "Motion blur, heavy compression, beauty filters, red-eye or a photo of a printed photo.",
    fix: "Use a sharp, unfiltered photo from a phone's main camera. Never apply beauty effects or edit your features.",
  },
  {
    title: "Wrong file size, format or dimensions",
    cause: "The upload is too large, too small, not a JPEG or has the wrong pixel size or aspect ratio for that portal.",
    fix: "Check the portal's stated limits and export the photo to match them exactly before uploading.",
  },
];

const steps = [
  "Read the rejection message carefully. Some portals name the exact check that failed.",
  "Compare your photo against the list above and find every issue, not just the first one.",
  "Retake the photo if lighting, expression or pose is the problem. Editing rarely fixes these.",
  "Crop and resize to the size required by your document, then export as a JPEG within the portal's file size limit.",
  "Upload again. If the portal still rejects it, try a different photo rather than re-uploading the same file.",
];

const faqs = [
  {
    q: "What does “photo is not valid as per ICAO standard” mean?",
    a: "It means the passport or visa portal ran an automated check and found that your photo doesn't meet ICAO Doc 9303, the international standard for travel document photos. Common causes are a non-white background, shadows, the wrong head size or a tilted head.",
  },
  {
    q: "Can I upload the same photo again?",
    a: "Re-uploading the same file almost always gives the same result. Fix the issue first, then upload the corrected photo.",
  },
  {
    q: "Is a photo from a studio always ICAO compliant?",
    a: "Not always. Studio photos can still fail because of cropping, file size or a background that isn't plain enough. Check the final digital file before you upload it.",
  },
  {
    q: "Can I fix a rejected photo without retaking it?",
    a: "Background, crop, size and file format issues can usually be fixed from the same photo. Problems with pose, expression, lighting, glare or blur need a new photo.",
  },
  {
    q: "How can I make sure my photo passes next time?",
    a: `Use a tool that checks your photo against ICAO rules before you download it. Our service costs ${getPlanPricing("standard", "INR").amountFormatted} in India ($${pricing.price} elsewhere), checks head size, background, lighting and pose, and refunds you if a government agency rejects the photo within ${refund.claimDays} days of purchase.`,
  },
];

export default function PhotoNotValidPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "Photo not valid as per ICAO", path: page.path }]),
          {
            "@type": "FAQPage",
            "@id": `${absoluteUrl(page.path)}#faq`,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        )}
      />
      <PageHeader
        eyebrow="ICAO guide"
        breadcrumb="Photo not valid as per ICAO"
        title="Photo is not valid as per ICAO standard? Here's how to fix it"
        description="This error appears when a passport or visa portal's automated check finds that your photo breaks one of the ICAO 9303 rules. Here are the most common reasons and how to fix each one."
        actions={
          <>
            <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
              Fix my photo now
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#reasons" variant="secondary" size="lg" className="w-full sm:w-auto">
              See common reasons
            </ButtonLink>
          </>
        }
        aside={
          <figure>
            <Image
              src={images.mobile}
              alt="“Photo is not valid as per ICAO standards” dialog over the Passport Seva Upload Recent Photograph form"
              width={1672}
              height={1244}
              sizes="(min-width: 1024px) 520px, 100vw"
              preload
              className="w-full rounded-lg border border-border bg-white shadow-sm"
            />
            <figcaption className="mt-3 text-sm text-gray-500">The error as it appears on the Passport Seva portal.</figcaption>
          </figure>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Quick answer */}
        <section className="flex gap-4 rounded-lg border border-border bg-white p-5 sm:p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
            <AlertIcon className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold text-black">The short answer</h2>
            <p className="mt-1 text-sm leading-6 text-gray-700">
              Your photo failed at least one check for background, lighting, head size, pose, expression, image quality
              or file format. Find the issue below, fix it (usually by retaking or re-cropping the photo) and upload a
              new file.
            </p>
          </div>
        </section>

        {/* Error screenshots */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">What the error looks like</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            On the Passport Seva portal the message appears as a pop-up right after you upload your photograph. The
            upload is not saved, so you need to fix the photo and upload it again.
          </p>
          <figure className="mt-8">
            <Image
              src={images.desktop}
              alt="Passport Seva upload page showing the pop-up “Photo is not valid as per ICAO standards”"
              width={3020}
              height={1118}
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="w-full rounded-lg border border-border"
            />
            <figcaption className="mt-3 text-sm text-gray-500">The error on the Passport Seva website (desktop).</figcaption>
          </figure>

          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <h3 className="font-semibold text-black">Photo requirements listed on the upload page</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                A photo that meets these file limits can still be rejected if the face, background or lighting
                breaks an ICAO rule.
              </p>
            </div>
            <dl className="divide-y divide-border rounded-lg border border-border bg-white">
              {portalSpecs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-4 px-5 py-3 text-sm">
                  <dt className="text-gray-600">{spec.label}</dt>
                  <dd className="font-semibold text-black">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Reasons */}
        <section id="reasons" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            Common reasons your photo is rejected
          </h2>
          <ul className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {reasons.map((r) => (
              <li key={r.title} className="rounded-lg border border-border bg-white p-5">
                <h3 className="font-semibold text-black">{r.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{r.cause}</p>
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-gray-700">
                  <CheckIcon className="mt-1 size-4 text-lime-600" />
                  {r.fix}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Compliant example */}
        <section className="mt-16 grid items-center gap-8 border-t border-border pt-16 md:grid-cols-2 lg:gap-16">
          <figure className="mx-auto w-full max-w-md">
            <Image
              src={images.sample}
              alt="ICAO compliant photo example: 35 × 45 mm with a 32–36 mm head height on a plain white background"
              width={1254}
              height={1254}
              sizes="(min-width: 768px) 448px, 100vw"
              className="w-full rounded-lg border border-border"
            />
          </figure>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              What an ICAO compliant photo looks like
            </h2>
            <ul className="mt-6 space-y-3.5">
              {accepted.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-gray-700">
                  <CheckIcon className="mt-1 size-4 text-lime-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Steps */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">How to fix a rejected photo</h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-lime-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-base leading-7 text-gray-700">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">Frequently asked questions</h2>
          <dl className="mt-8 divide-y divide-border rounded-lg border border-border bg-white">
            {faqs.map((f) => (
              <div key={f.q} className="p-5 sm:p-6">
                <dt className="font-semibold text-black">{f.q}</dt>
                <dd className="mt-2 text-sm leading-6 text-gray-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-gray-50 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-semibold text-black">Get a photo that passes the first time</h2>
            <p className="mt-1 text-sm text-gray-600">
              Upload a selfie and we check it against ICAO rules before you download.
            </p>
          </div>
          <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
            Fix my photo
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        </section>

        <RelatedLinks paths={["/icao-compliant-passport-photo", "/refund-policy", "/contact"]} />
      </div>
    </>
  );
}
