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
import { ArrowRightIcon, CheckIcon, XIcon } from "@/components/ui/icons";
import { breadcrumbSchema, faqSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/icao-guide/indian-passport-photo-requirements",
  title: "Indian Passport Photo Requirements 2026: Size, KB and Rules",
  description:
    "Indian passport photo requirements for 2026: 630 × 810 px, JPEG up to 250 KB, white background and a face that fills 80–85%. See every rule and how to meet it.",
};

export const metadata = pageMetadata(page);

const [standard, expert] = indiaPlans;

const specs = [
  { label: "Dimensions", value: "630 × 810 px" },
  { label: "File format", value: "JPEG (.jpg)" },
  { label: "Maximum file size", value: "250 KB" },
  { label: "Background", value: "Plain white" },
  { label: "Face in frame", value: "80–85% of the photo" },
  { label: "Colour", value: "Full colour" },
  { label: "Glasses", value: "Remove them" },
  { label: "Age of photo", value: "Last 6 months" },
];

const applicants = [
  {
    title: "Applying from abroad",
    tag: "Upload required",
    body: "Indian embassies and consulates moved to Global Passport Seva 2.0 on 28 October 2025. You now upload an ICAO compliant photo with every passport application, and most missions have enforced the rule since 1 December 2025.",
  },
  {
    title: "Applying in India",
    tag: "Taken at your appointment",
    body: "An officer captures your photo live at the Passport Seva Kendra or Post Office Passport Seva Kendra. You don't need to upload or bring a photo for the passport itself, but the same rules apply to how you look on the day.",
  },
];

const rules = [
  {
    title: "Face and pose",
    items: [
      "Look straight at the camera with your head level.",
      "Centre your face and keep your shoulders square.",
      "Show your full face from the chin to the top of the head.",
    ],
  },
  {
    title: "Expression and eyes",
    items: [
      "Keep a natural expression with your mouth closed.",
      "Open both eyes fully, with no hair across them.",
      "Make sure the photo has no red-eye.",
    ],
  },
  {
    title: "Light and background",
    items: [
      "Use even light with no shadows on your face or behind you.",
      "Avoid flash reflections on your skin.",
      "Use a plain white background with no texture or objects.",
    ],
  },
  {
    title: "Glasses, turbans and head coverings",
    items: [
      "Remove your glasses to avoid glare.",
      "Wear a head covering only for religious reasons.",
      "Keep your forehead and face fully visible under a turban, hijab or dupatta.",
    ],
  },
  {
    title: "Clothing and accessories",
    items: [
      "Wear a dark or coloured top so it doesn't blend into the white background.",
      "Remove large earrings, nose rings and anything shiny near the face, if you can.",
      "Keep make-up natural so your face matches your appearance in person.",
    ],
  },
  {
    title: "Image quality",
    items: [
      "Submit a sharp photo with no blur or grain.",
      "Don't use filters, beauty modes or apps that reshape your face.",
      "Never scan or photograph an older printed photo.",
    ],
  },
];

const resizeSteps = [
  {
    title: "Crop to a 7:9 ratio first",
    body: "630 × 810 px is a 7:9 rectangle. Crop your original to that shape before resizing, so the portal doesn't receive a stretched or squashed face.",
  },
  {
    title: "Resize to exactly 630 × 810 px",
    body: "Set the width to 630 and the height to 810. A file that is even one pixel off can fail the portal's dimension check.",
  },
  {
    title: "Export as JPEG and check the size",
    body: "Save at about 85% quality, then check the file size. If it is over 250 KB, lower the quality a step at a time instead of shrinking the image.",
  },
  {
    title: "Give the file a simple name",
    body: "Use letters, numbers and an underscore, such as rahul_sharma.jpg. Spaces and symbols in the file name can break some uploads.",
  },
];

const faqs: Faq[] = [
  {
    q: "What is the photo size for an Indian passport?",
    a: "The online upload must be 630 × 810 pixels in JPEG format and no larger than 250 KB. If your mission also asks for printed photos, use 35 × 45 mm prints on photo paper.",
  },
  {
    q: "What background colour does an Indian passport photo need?",
    a: "Use a plain white background. Missions reject cream, grey, blue and patterned backgrounds, and they also reject white backgrounds with visible shadows.",
  },
  {
    q: "How much of the photo should my face cover?",
    a: "Your face should fill about 80–85% of the photo. Crop close to the head and the top of the shoulders, and leave only a small gap above your hair.",
  },
  {
    q: "Can I wear glasses in my Indian passport photo?",
    a: "No. Indian missions ask applicants to remove glasses to avoid reflections, so take them off before the photo.",
  },
  {
    q: "Can I wear a turban or hijab?",
    a: "Yes, if you wear it for religious reasons. Your forehead and face must stay fully visible, and the covering must not cast a shadow on your face.",
  },
  {
    q: "Can I smile in an Indian passport photo?",
    a: "Keep a natural expression with your mouth closed. A wide smile or visible teeth can cause the face-matching check to fail.",
  },
  {
    q: "Do I need to upload a photo if I apply in India?",
    a: "No. An officer takes your photo at the Passport Seva Kendra or Post Office Passport Seva Kendra during your appointment. Only applicants who apply through an Indian mission abroad upload a photo.",
  },
  {
    q: "Can I use a photo taken on my phone?",
    a: "Yes. Most applicants abroad take the photo on a phone and then crop and resize it. Use the rear camera, stand in front of a plain wall and ask someone to take the photo from 1–2 m away.",
  },
  {
    q: "My iPhone saves photos as HEIC. How do I get a JPEG?",
    a: "Go to Settings, Camera, Formats and choose Most Compatible before you take the photo. Our tool also accepts HEIC files and exports a 630 × 810 px photo for India.",
  },
  {
    q: "How much does an Indian passport photo cost online?",
    a: `With our tool, a checked digital photo costs ${standard.amountFormatted} in India. The ${expert.amountFormatted} Expert edit adds a manual review and hand retouching by a photo specialist. You upload and check your photo for free, and pay only when you download.`,
  },
  {
    q: "Can I reuse the photo from my old passport or visa?",
    a: "No. The photo must be recent, ideally taken in the last 6 months, and older photos rarely meet the new 630 × 810 px ICAO format.",
  },
  {
    q: "Why does the portal say my photo is not valid as per ICAO standards?",
    a: "The portal's automated check found a problem with the background, lighting, head size, pose or image quality. Our guide to that error explains each cause and how to fix it.",
  },
];

export default function IndianPassportPhotoPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "Indian passport photo requirements", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="ICAO guide · India"
        breadcrumb="Indian passport photo requirements"
        title="Indian passport photo requirements (2026)"
        description="Indian missions abroad now accept only ICAO compliant photos with passport applications. Here are the exact size, the file limit and every rule, so your photo passes the Passport Seva check the first time."
        actions={
          <>
            <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
              Make my Indian passport photo
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#rules" variant="secondary" size="lg" className="w-full sm:w-auto">
              See all rules
            </ButtonLink>
          </>
        }
        aside={
          <div>
            <p className="mb-3 text-sm font-semibold text-black">Indian passport photo at a glance</p>
            <SpecList items={specs} />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <QuickAnswer title="The short answer">
          Upload a colour JPEG of exactly 630 × 810 px, no larger than 250 KB, with a plain white background. Your
          face should fill 80–85% of the photo, with your eyes open, mouth closed and no glasses.
        </QuickAnswer>

        {/* Who uploads */}
        <section className="mt-16">
          <h2 className={guideHeading}>Do you need to upload a photo?</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            It depends on where you apply. The rules for how the photo looks are the same in both cases.
          </p>
          <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {applicants.map((a) => (
              <div key={a.title} className="rounded-lg border border-border bg-white p-5 sm:p-6">
                <p className="inline-block rounded-md bg-lime-600/10 px-2 py-0.5 text-xs font-semibold text-lime-700">
                  {a.tag}
                </p>
                <h3 className="mt-3 font-semibold text-black">{a.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{a.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rules */}
        <section id="rules" className="mt-16 scroll-mt-24 border-t border-border pt-16">
          <h2 className={guideHeading}>Indian passport photo rules</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            The portal checks your photo with software before an officer ever sees it. Meet every rule below and the
            check has nothing to flag.
          </p>
          <ul className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rules.map((group) => (
              <li key={group.title} className="rounded-lg border border-border bg-white p-5">
                <h3 className="font-semibold text-black">{group.title}</h3>
                <ul className="mt-3 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6 text-gray-700">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Outdated spec warning */}
        <section className="mt-8 flex gap-4 rounded-lg border border-border bg-gray-50 p-5 sm:p-6">
          <XIcon className="mt-1 size-4 shrink-0 text-red-600" />
          <div>
            <h2 className="font-semibold text-black">Ignore old square photo specs</h2>
            <p className="mt-1 text-sm leading-6 text-gray-700">
              Some websites still list a square photo between 350 × 350 and 1,000 × 1,000 px. Mission notices issued
              since late 2025 ask for a 630 × 810 px rectangle, so a square photo is likely to fail.
            </p>
          </div>
        </section>

        {/* Children */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 md:grid-cols-2 md:gap-12">
          <h2 className={guideHeading}>Photos for children and babies</h2>
          <div className="space-y-4 text-base leading-7 text-gray-700">
            <p>
              Children follow the same size, file and background rules as adults. For a baby, lay a white sheet on a
              bed, place the baby on it and take the photo from directly above in daylight.
            </p>
            <p>
              Keep hands, toys and dummies out of the frame, and make sure no one else appears in the photo. If your
              baby can&apos;t keep their eyes open, ask your mission whether it accepts closed eyes for infants.
            </p>
          </div>
        </section>

        {/* Resize */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>How to resize a photo to 630 × 810 px and under 250 KB</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Any photo editor can do this. Follow the steps in order, because resizing before cropping distorts the
              face.
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Prefer not to do it by hand? Our tool crops, resizes, whitens the background and checks the photo for
              you.
            </p>
          </div>
          <NumberedSteps steps={resizeSteps} />
        </section>

        {/* Errors */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className={guideHeading}>Did the portal reject your photo?</h2>
          <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            <Link
              href="/icao-guide/photo-is-not-valid-as-per-icao-standard"
              className="group rounded-lg border border-border bg-white p-5 transition-colors hover:border-lime-600/50"
            >
              <h3 className="flex items-center justify-between gap-3 font-semibold text-black">
                “Photo is not valid as per ICAO standards”
                <ArrowRightIcon className="size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-lime-700" />
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                The portal&apos;s quality check failed. Learn what each cause looks like and how to fix it.
              </p>
            </Link>
            <Link
              href="/icao-guide/passport-seva-photo-upload-error"
              className="group rounded-lg border border-border bg-white p-5 transition-colors hover:border-lime-600/50"
            >
              <h3 className="flex items-center justify-between gap-3 font-semibold text-black">
                Other Passport Seva upload errors
                <ArrowRightIcon className="size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-lime-700" />
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                File size, dimensions, format, browser and session errors, with a fix for each one.
              </p>
            </Link>
          </div>
        </section>

        <IndiaPricing />

        <FaqSection faqs={faqs} title="Indian passport photo FAQ" />

        <GuideCta
          title="Get a 630 × 810 px photo that passes"
          body={`Upload a phone photo, see the check results for free and pay ${standard.amountFormatted} only when you download.`}
          label="Make my photo"
        />

        <RelatedLinks
          paths={["/icao-guide/passport-seva-photo-upload-error", "/icao-guide/take-icao-photo-at-home", "/icao-photo-checker"]}
        />
      </div>
    </>
  );
}
