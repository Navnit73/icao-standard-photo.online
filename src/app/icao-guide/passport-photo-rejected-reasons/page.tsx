import Link from "next/link";
import { FaqSection, GuideCta, NumberedSteps, QuickAnswer, guideHeading, type Faq } from "@/components/guide";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { ButtonLink } from "@/components/ui/button-link";
import { AlertIcon, ArrowRightIcon, CheckIcon, ShieldIcon, XIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/icao-guide/passport-photo-rejected-reasons",
  title: "Passport Photo Rejected? Common Reasons and What to Do Next",
  description:
    "Find out why your passport photo was rejected, which faults you can fix without a retake and what happens to your application next, with a checklist to avoid a second rejection.",
};

export const metadata = pageMetadata(page);

const { pricing, refund } = siteConfig;

const stages = [
  {
    title: "Rejected at upload",
    body: "An online portal checks your photo with software the moment you upload it and blocks it straight away. Nothing is lost: fix the photo and upload it again.",
  },
  {
    title: "Rejected after review",
    body: "An officer reviews the photo after you apply and sends you a letter or email. Your application is paused until you send a new photo.",
  },
];

const reasons = [
  { reason: "Background is the wrong colour or has a pattern", spot: "Grey, blue or textured wall behind you", fixable: true },
  { reason: "Shadow on the background", spot: "Dark outline behind your head or shoulders", fixable: true },
  { reason: "Head too large or too small", spot: "Chin or hair cut off, or a lot of space around the head", fixable: true },
  { reason: "Wrong size, file or paper", spot: "Wrong pixel size or file size, or printed on plain paper", fixable: true },
  { reason: "Shadows on the face", spot: "One cheek darker than the other, or dark eye sockets", fixable: false },
  { reason: "Head tilted or turned", spot: "Eyes not level, or one ear more visible than the other", fixable: false },
  { reason: "Smile or open mouth", spot: "Visible teeth or raised eyebrows", fixable: false },
  { reason: "Eyes closed, hidden or red", spot: "Half-closed eyes, hair over the eyes or red-eye", fixable: false },
  { reason: "Glasses or glare", spot: "Glasses on, or white reflections on the lenses", fixable: false },
  { reason: "Blurry or low quality", spot: "Soft edges around the eyes, grain or pixelation", fixable: false },
  { reason: "Edited or filtered", spot: "Smoothed skin, reshaped features or portrait-mode blur", fixable: false },
  { reason: "Photo is too old", spot: "Taken more than 6 months ago, or your appearance has changed", fixable: false },
];

const nextSteps = [
  {
    title: "Read the reason in full",
    body: "Rejection letters and portal messages usually name the problem. Note every issue mentioned, not just the first one.",
  },
  {
    title: "Check the photo against every rule",
    body: "Officers often list only one fault, but a second can be hiding behind it. Go through the table above and find them all.",
  },
  {
    title: "Decide whether to edit or retake",
    body: "Use the table to see whether you can fix the same photo. If anything in the “Retake” column applies, take a new photo.",
  },
  {
    title: "Run a check before you send it",
    body: "Measure the head size, zoom in to check sharpness and confirm the file details, or use an ICAO photo checker to do it for you.",
  },
  {
    title: "Reply before the deadline",
    body: "Send the new photo in the way the letter asks and before the date it gives. Late replies can lead to a refused application.",
  },
];

const faqs: Faq[] = [
  {
    q: "Why was my passport photo rejected?",
    a: "The most common reasons are a shadow on the face or background, the wrong head size, a tilted head, glasses, a smile or an edited photo. Your rejection letter or portal message usually names the main problem.",
  },
  {
    q: "Do I have to pay the application fee again?",
    a: "Usually not. Most passport offices pause the application and ask only for a new photo. You pay again only if the application is refused and you have to start over.",
  },
  {
    q: "How long do I have to send a new photo?",
    a: "It depends on the country, so check your letter. The US State Department, for example, usually gives you 90 days to reply before it may deny the application.",
  },
  {
    q: "Can I send the same photo again?",
    a: "No. The same photo fails for the same reason. Fix it or take a new one, and check it against every rule before you send it.",
  },
  {
    q: "Why was a photo from a studio or pharmacy rejected?",
    a: "Studio and pharmacy photos are not checked by the passport office before you submit them. Shadows, the wrong crop or a background that isn't plain enough can still slip through.",
  },
  {
    q: "Why was my photo rejected for editing when I didn't edit it?",
    a: "Many phones smooth skin, blur the background or sharpen faces automatically. Turn off beauty, portrait and face retouch modes, and take the photo in the standard photo mode.",
  },
  {
    q: "Can my clothes get my photo rejected?",
    a: "Yes. A white top can blend into a white background, and some countries, including the United States, reject photos with uniforms or camouflage clothing. Wear a plain, darker top.",
  },
  {
    q: "What if my child's or baby's photo was rejected?",
    a: "Babies' photos usually fail because of a visible hand, shadows from a car seat or a dummy in the mouth. Lay the baby on a white sheet and take the photo from directly above in daylight.",
  },
];

export default function PassportPhotoRejectedPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "Passport photo rejected", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="ICAO guide"
        breadcrumb="Passport photo rejected"
        title="Passport photo rejected? Why it happens and what to do next"
        description="A rejected photo delays your passport, but it rarely ends your application. Find the reason, see whether you can fix the same photo and send a replacement that passes."
        actions={
          <>
            <ButtonLink href="#reasons" size="lg" className="w-full sm:w-auto">
              See the reasons
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="/icao-photo-checker" variant="secondary" size="lg" className="w-full sm:w-auto">
              Check my new photo
            </ButtonLink>
          </>
        }
        aside={
          <div className="grid gap-3">
            {stages.map((s) => (
              <div key={s.title} className="rounded-lg border border-border bg-white p-5">
                <h2 className="font-semibold text-black">{s.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <QuickAnswer title="The short answer" icon={<AlertIcon className="size-5" />}>
          Your photo broke at least one rule on background, lighting, head size, pose, expression, glasses, image
          quality or file format. You can fix background, crop and file problems from the same photo. Everything else
          needs a new photo.
        </QuickAnswer>

        {/* Reasons */}
        <section id="reasons" className="mt-16 scroll-mt-24">
          <h2 className={guideHeading}>12 reasons passport photos get rejected</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Find your problem in the table. The last column tells you whether you can save the photo or need to take a
            new one.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Reason</th>
                  <th scope="col" className="px-5 py-3 font-medium">How to spot it</th>
                  <th scope="col" className="px-5 py-3 font-medium">What to do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reasons.map((r) => (
                  <tr key={r.reason}>
                    <th scope="row" className="px-5 py-3 font-semibold text-black">{r.reason}</th>
                    <td className="px-5 py-3 text-gray-600">{r.spot}</td>
                    <td className="px-5 py-3">
                      {r.fixable ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-lime-700">
                          <CheckIcon className="size-4" />
                          Edit the photo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-medium text-red-700">
                          <XIcon className="size-4" />
                          Retake
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Got the message “photo is not valid as per ICAO standards” on Passport Seva?{" "}
            <Link
              href="/icao-guide/photo-is-not-valid-as-per-icao-standard"
              className="font-semibold text-lime-700 underline-offset-4 hover:underline"
            >
              Read our guide to that error
            </Link>
            .
          </p>
        </section>

        {/* What happens next */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className={guideHeading}>What happens to your application now?</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              In most countries, a rejected photo pauses your application instead of cancelling it. The office keeps
              your documents and fee and waits for a new photo.
            </p>
          </div>
          <ul className="space-y-4 text-base leading-7 text-gray-700">
            <li>
              <span className="font-semibold text-black">Online applications:</span> the portal blocks the upload, so
              you fix the photo and upload it again before you submit.
            </li>
            <li>
              <span className="font-semibold text-black">Paper or in-person applications:</span> the office sends you
              a letter or email that names the problem and tells you how and when to send a new photo.
            </li>
            <li>
              <span className="font-semibold text-black">If you miss the deadline:</span> the office may refuse the
              application, and you may need to apply and pay again.
            </li>
          </ul>
        </section>

        {/* Steps */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>How to avoid a second rejection</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              A second rejection costs you more time than the first. Follow these steps before you send anything.
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Need to retake it? Follow our guide to{" "}
              <Link href="/icao-guide/take-icao-photo-at-home" className="font-semibold text-lime-700 underline-offset-4 hover:underline">
                taking an ICAO photo at home
              </Link>
              .
            </p>
          </div>
          <NumberedSteps steps={nextSteps} />
        </section>

        {/* Guarantee */}
        <section className="mt-16 flex gap-4 rounded-lg border border-border bg-white p-5 sm:p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
            <ShieldIcon className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold text-black">Covered if it happens again</h2>
            <p className="mt-1 text-sm leading-6 text-gray-700">
              Every photo you buy from us is checked against ICAO rules before you download it. If a government agency
              still rejects it, send us the notice within {refund.claimDays} days of purchase and we refund you in
              full.{" "}
              <Link href="/refund-policy" className="font-semibold text-lime-700 underline-offset-4 hover:underline">
                Read the refund policy
              </Link>
            </p>
          </div>
        </section>

        <FaqSection faqs={faqs} title="Rejected passport photo FAQ" />

        <GuideCta
          title="Replace your rejected photo today"
          body={`Upload a new photo, see the check results for free and pay $${pricing.price} only when you download.`}
          label="Make a new photo"
        />

        <RelatedLinks
          paths={["/icao-photo-checker", "/icao-guide/take-icao-photo-at-home", "/icao-compliant-passport-photo"]}
        />
      </div>
    </>
  );
}
