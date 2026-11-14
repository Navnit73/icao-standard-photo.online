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
import { AlertIcon, ArrowRightIcon, CheckIcon, ShieldIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/icao-guide/passport-seva-icao-check-errors",
  title: "Passport Seva ICAO Errors: Posture Check, Mobile & Exception",
  description:
    "Fix exact Passport Seva 2.0 errors: “Posture check failed. Image quality is completely okay”, “IsMobileDeviceDetected failed”, continuous-tone tilt errors, and medical Proceed with Exception.",
};

export const metadata = pageMetadata(page);

const [standard] = indiaPlans;
const { pricing } = siteConfig;

const portalSpecs = [
  { label: "Dimensions", value: "630 × 810 px (exact)" },
  { label: "Format & size", value: "JPEG, 10–250 KB" },
  { label: "Face coverage", value: "80–85% of frame" },
  { label: "Recommended browser", value: "Desktop Chrome / Edge" },
  { label: "Medical exemption", value: "Proceed with Exception + certificate" },
];

const specificErrors = [
  {
    code: "Posture check failed",
    exactMessage: "Posture check failed. Please upload another photo. Image quality is completely okay.",
    whyItHappens:
      "Your resolution, sharpness, and lighting passed, so the portal says “image quality is completely okay” — but its facial-landmark script detected a slight head tilt (roll), turned chin (yaw), upward/downward pitch, or asymmetrical crop.",
    fixes: [
      "Check eye alignment with grid lines: both pupils must sit on the exact same horizontal line.",
      "Do not crop off-centre or lean towards the camera; keep shoulders square and camera at eye level 1.2–1.5 m away.",
      "Make sure your face fills 80–85% of the 630 × 810 px frame rather than leaving extra room on one side.",
    ],
  },
  {
    code: "IsMobileDeviceDetected failed",
    exactMessage: "IsMobileDeviceDetected failed. Please upload another photo. Image quality is completely okay.",
    whyItHappens:
      "This is a browser/device script block on Passport Seva, not a flaw in your photograph. The portal blocks uploads coming from mobile Safari/Chrome user-agents, tablets, or desktop browsers running privacy extensions or VPNs that alter device headers.",
    fixes: [
      "Log in on a Windows or Mac laptop/desktop using standard Google Chrome or Microsoft Edge.",
      "Do NOT just switch to “Desktop site” on iPhone/Android if it keeps failing — use an actual computer.",
      "Turn off VPNs, ad blockers, and strict tracker blockers for the Passport Seva session, then re-upload.",
    ],
  },
  {
    code: "ICAO compliance issue(s): face tilted / continuous-tone",
    exactMessage:
      "ICAO compliance issue(s): Make sure that the face is not tilted. The photo should be clear and with a continuous-tone quality.",
    whyItHappens:
      "Two checks failed together: slight head tilt/uneven eye level, plus non-continuous-tone quality caused by heavy JPEG re-compression, WhatsApp forwarding, screenshot artefacts, or harsh skin-smoothing filters.",
    fixes: [
      "Start from the original camera file — never a screenshot or an image sent over WhatsApp/Telegram.",
      "Export a fresh JPEG at 85–90% quality (under 250 KB) with zero beauty filters or sharpening sliders.",
      "Retake with your head completely straight and level if your chin or ear height differs left-to-right.",
    ],
  },
  {
    code: "ICAO test result / flight / update errors",
    exactMessage: "Photo is not valid as per ICAO standards / ICAO test result failed / Error photo update",
    whyItHappens:
      "On Global Passport Seva 2.0, the upload dialog runs an instant ICAO test result panel checking background uniformity, lighting symmetry, glasses glare, expression, and 630 × 810 px geometry.",
    fixes: [
      "Switch from a phone selfie to a rear-camera photo taken against a plain white background.",
      "Remove glasses completely and keep your mouth closed with neutral eyebrows.",
      "Rename the file simply (e.g. ananya_verma.jpg) and log back in if your portal session timed out.",
    ],
  },
];

const exceptionPoints = [
  "Available for applicants with documented facial deformities, neurological disorders, facial palsy, or medical conditions that prevent maintaining a straight head posture, open eyes, or a neutral expression.",
  "Requires a valid certificate issued by a registered medical practitioner before you submit.",
  "On the Global Passport Seva 2.0 upload screen, click “Proceed with Exception” at the bottom of the upload page and attach the medical practitioner certificate where prompted.",
  "Do not click “Proceed with Exception” just to bypass a normal posture, tilt, or mobile-browser error — non-medical exceptions can be rejected at mission verification.",
];

const steps = [
  {
    title: "Identify whether the error is device-related or photo-related",
    body: "If the message starts with IsMobileDeviceDetected failed, switch to desktop Chrome with VPN off before changing your photo. If it says Posture check failed or face tilted, fix the photo itself.",
  },
  {
    title: "Run an independent ICAO measurement check",
    body: "Upload your photo to our free ICAO Photo Checker to see your exact head height, eye position, and background score so you aren't guessing what Passport Seva disliked.",
  },
  {
    title: "Re-crop or retake straight and level",
    body: "Use our ICAO Photo Tool to align your eyes horizontally, whiten the background, and export an uncompressed-looking 630 × 810 px JPEG under 250 KB.",
  },
  {
    title: "Upload cleanly in a single desktop session",
    body: "Open one browser tab, log in fresh to Passport Seva, upload the new 630 × 810 px file, and save immediately.",
  },
];

const faqs: Faq[] = [
  {
    q: "Why does Passport Seva say “Posture check failed” when “image quality is completely okay”?",
    a: "It means your file size, sharpness, lighting, and JPEG format are fine, but the biometric landmark detector flagged a slight head tilt, turned face, off-centre crop, or chin tilted up/down. Level your eyes horizontally, keep your shoulders square, and re-crop to 630 × 810 px.",
  },
  {
    q: "How do I fix “IsMobileDeviceDetected failed. Please upload another photo”?",
    a: "That error is triggered by uploading from a phone, tablet, or privacy-masked browser rather than an issue with your image. Log into Passport Seva on a desktop or laptop computer using Google Chrome with VPNs and ad blockers turned off, and upload the 630 × 810 px JPEG there.",
  },
  {
    q: "What does “continuous-tone quality” mean in Passport Seva's ICAO compliance message?",
    a: "Continuous-tone quality means smooth, natural colour transitions on skin and background with no pixelation, JPEG banding, scanner lines, or harsh AI sharpening/beauty filters. Always export straight from your original camera photo rather than a WhatsApp download or screenshot.",
  },
  {
    q: "Who can use “Proceed with Exception” for ICAO-compliant photo upload?",
    a: "Global Passport Seva 2.0 provides the “Proceed with Exception” option strictly for applicants with facial deformities or neurological disorders who cannot meet standard posture or expression rules, accompanied by a valid certificate from a registered medical practitioner.",
  },
  {
    q: "What should I check if my ICAO test result keeps failing on every retry?",
    a: "Re-uploading the same cropped file rarely passes. Check your photo in our ICAO Photo Checker to inspect head height, eye level, and background uniformity, and retake a rear-camera photo from 1.5 m away if your head is tilted or wide-angle distorted.",
  },
];

export default function PassportSevaIcaoCheckErrorsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "Passport Seva ICAO check errors", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="ICAO guide · Passport Seva 2.0"
        breadcrumb="Passport Seva ICAO check errors"
        title="Posture check failed, IsMobileDeviceDetected & ICAO exceptions"
        description="Decode exact Global Passport Seva 2.0 validation banners — including why “image quality is completely okay” still fails posture or mobile checks, continuous-tone warnings, and the medical Proceed with Exception rule."
        actions={
          <>
            <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
              Fix my photo now
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#errors" variant="secondary" size="lg" className="w-full sm:w-auto">
              Find your exact error
            </ButtonLink>
          </>
        }
        aside={
          <div>
            <p className="mb-3 text-sm font-semibold text-black">Passport Seva 2.0 upload baseline</p>
            <SpecList items={portalSpecs} />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <QuickAnswer title="The short answer" icon={<AlertIcon className="size-5" />}>
          <strong>“IsMobileDeviceDetected failed”</strong> is a device/browser block — switch to desktop Chrome with
          VPN off. <strong>“Posture check failed”</strong> or <strong>“face is not tilted / continuous-tone”</strong>{" "}
          means your file quality passed, but your eyes aren&apos;t level, your face is slightly turned, or WhatsApp/filter
          compression damaged skin tones.
        </QuickAnswer>

        {/* Verbatim error breakdowns */}
        <section id="errors" className="mt-16 scroll-mt-24">
          <h2 className={guideHeading}>Exact Passport Seva ICAO error messages &amp; how to fix them</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Find the exact message shown in your Passport Seva dialog box below.
          </p>

          <div className="mt-8 space-y-6">
            {specificErrors.map((err) => (
              <article key={err.code} className="rounded-lg border border-border bg-white p-5 sm:p-6">
                <p className="inline-block rounded-md bg-amber-50 px-2.5 py-1 font-mono text-xs font-semibold text-amber-900">
                  {err.exactMessage}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-black">{err.code}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{err.whyItHappens}</p>
                <ul className="mt-4 space-y-2 border-t border-border pt-4">
                  {err.fixes.map((fix) => (
                    <li key={fix} className="flex items-start gap-2.5 text-sm leading-6 text-gray-700">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Medical Exception */}
        <section id="exception" className="mt-16 scroll-mt-24 border-t border-border pt-16">
          <div className="rounded-lg border border-border bg-gray-50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
                <ShieldIcon className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-black">
                  “Proceed with Exception” for facial deformities or neurological disorders
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Global Passport Seva 2.0 shows this notice at the bottom of the ICAO upload screen:
                  <em>
                    {" "}
                    “Exception for ICAO-compliant photo upload is available for applicants with facial deformities or
                    neurological disorders. A valid certificate from a registered medical practitioner is required to
                    upload. Kindly click ‘Proceed with Exception’ at the bottom of this page to avail the exception.”
                  </em>
                </p>
                <ul className="mt-4 space-y-2.5">
                  {exceptionPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm leading-6 text-gray-700">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>Fastest workflow to pass the ICAO test result</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Instead of guessing and getting locked out by session timeouts, check your photo before logging into
              Passport Seva.
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Seeing file size or session errors instead? See our{" "}
              <Link href="/icao-guide/passport-seva-photo-upload-error" className="font-medium text-lime-700 hover:underline">
                general Passport Seva upload error table
              </Link>
              .
            </p>
          </div>
          <NumberedSteps steps={steps} />
        </section>

        <IndiaPricing />

        <FaqSection faqs={faqs} title="Passport Seva ICAO check errors FAQ" />

        <GuideCta
          title="Pass the Passport Seva ICAO check on the next upload"
          body={`Check head alignment, eye level and 630 × 810 px size for free. Pay ${standard.amountFormatted} (India) or $${pricing.price} only when you download.`}
          label="Check & fix my photo"
        />

        <RelatedLinks
          paths={[
            "/icao-guide/photo-is-not-valid-as-per-icao-standard",
            "/icao-guide/passport-seva-photo-upload-error",
            "/icao-photo-checker",
          ]}
        />
      </div>
    </>
  );
}

