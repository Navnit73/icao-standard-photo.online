import Link from "next/link";
import {
  FaqSection,
  GuideCta,
  IndiaPricing,
  NumberedSteps,
  QuickAnswer,
  guideHeading,
  indiaPlans,
  type Faq,
} from "@/components/guide";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { ButtonLink } from "@/components/ui/button-link";
import { AlertIcon, ArrowRightIcon, CheckIcon, XIcon } from "@/components/ui/icons";
import { breadcrumbSchema, faqSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/icao-guide/passport-seva-photo-upload-error",
  title: "Passport Seva Photo Upload Error: Causes and Quick Fixes",
  description:
    "Passport Seva won't accept your photo? Match your upload error to its cause and fix it fast, from file size and 630 × 810 px dimensions to ICAO and browser errors.",
};

export const metadata = pageMetadata(page);

const [standard] = indiaPlans;

const icaoGuide = "/icao-guide/photo-is-not-valid-as-per-icao-standard";

type ErrorRow = { message: string; cause: string; fix: string; href?: string };

const errorGroups: { id: string; title: string; summary: string; intro: string; rows: ErrorRow[] }[] = [
  {
    id: "file-errors",
    title: "1. File errors",
    summary: "Size, dimensions, format or file name",
    intro: "The portal rejects the file before it looks at your face. You can fix these without retaking the photo.",
    rows: [
      {
        message: "File size exceeds the limit",
        cause: "The file is larger than 250 KB.",
        fix: "Export the JPEG again at a lower quality setting. Don't shrink the pixel dimensions.",
      },
      {
        message: "Image size is not correct",
        cause: "The photo isn't exactly 630 × 810 px.",
        fix: "Crop to a 7:9 ratio, then resize to 630 × 810 px.",
      },
      {
        message: "File type isn't allowed",
        cause: "The file is a PNG, HEIC, WebP or a renamed file that isn't a real JPEG.",
        fix: "Open the photo in an editor and export it as a new .jpg file.",
      },
      {
        message: "Nothing found to be uploaded",
        cause: "The browser couldn't read the file, often because of spaces or symbols in the file name.",
        fix: "Rename the file to something simple, such as priya_singh.jpg, and try again.",
      },
    ],
  },
  {
    id: "photo-errors",
    title: "2. Photo quality (ICAO) errors",
    summary: "Lighting, background, pose or blur",
    intro: "The file is fine, but the portal's software found a problem with the photo itself. Most of these need a new photo.",
    rows: [
      {
        message: "Photo is not valid as per ICAO standards",
        cause: "The photo failed one or more ICAO checks.",
        fix: "See our full guide to this error.",
        href: icaoGuide,
      },
      {
        message: "Uneven lighting",
        cause: "One side of your face is brighter than the other.",
        fix: "Retake the photo facing a window so light falls evenly on both sides.",
      },
      {
        message: "Background not uniform",
        cause: "Shadows, gradients or objects appear behind you.",
        fix: "Replace the background with plain white, or retake the photo 50 cm from a plain wall.",
      },
      {
        message: "Standing too close / distortion",
        cause: "The camera was too close, usually a selfie at arm's length.",
        fix: "Retake the photo from about 1.5 m away with the rear camera.",
      },
      {
        message: "Posture or head position",
        cause: "Your head is tilted, turned or off-centre.",
        fix: "Retake the photo with your head level and your shoulders square to the camera.",
      },
      {
        message: "Image quality is poor",
        cause: "The photo is blurry, grainy or heavily compressed.",
        fix: "Start again from the original photo, not a screenshot or a forwarded WhatsApp image.",
      },
    ],
  },
  {
    id: "browser-errors",
    title: "3. Browser and session errors",
    summary: "Device, timeout or server problems",
    intro: "Nothing is wrong with your photo. The portal or your browser failed to complete the upload.",
    rows: [
      {
        message: "Mobile device detected",
        cause: "The upload page doesn't support your phone's browser.",
        fix: "Switch to a laptop or desktop, or turn on “Desktop site” in your phone's browser.",
      },
      {
        message: "Session expired",
        cause: "You stayed on the page too long, or you opened the portal in several tabs.",
        fix: "Log in again in a single tab and have the finished file ready before you open the upload page.",
      },
      {
        message: "Upload hangs or shows a server error",
        cause: "The portal is busy, or an extension or VPN blocks the request.",
        fix: "Turn off your VPN and ad blocker, clear the site's cookies or try another browser. Retry early in the morning or late in the evening, Indian time.",
      },
    ],
  },
];

const fixSteps = [
  {
    title: "Start from the original photo",
    body: "Use the file straight from your camera. Screenshots and images forwarded through chat apps lose quality.",
  },
  {
    title: "Crop to 7:9 and resize to 630 × 810 px",
    body: "Crop first and resize second, so your face keeps its natural shape.",
  },
  {
    title: "Export a JPEG under 250 KB",
    body: "Save at about 85% quality. If the file is still too large, lower the quality a little at a time.",
  },
  {
    title: "Rename and upload from a desktop browser",
    body: "Use a short file name with no spaces, close other portal tabs and upload from an up-to-date browser.",
  },
];

const checklist = [
  "Exactly 630 × 810 px",
  "JPEG file, 250 KB or smaller",
  "Plain white background with no shadows",
  "Face fills 80–85% of the photo",
  "Head straight, eyes open, mouth closed",
  "No glasses, filters or beauty effects",
  "Taken in the last 6 months",
  "Simple file name with no spaces",
];

const editable = [
  "Wrong file size or format",
  "Wrong pixel dimensions",
  "Off-white or uneven background",
  "Face too small in the frame",
];

const retake = [
  "Shadows on your face",
  "Tilted or turned head",
  "Selfie distortion from standing too close",
  "Blur, glare or closed eyes",
];

const faqs: Faq[] = [
  {
    q: "Why does Passport Seva keep rejecting my photo?",
    a: "Repeated rejections usually mean you are fixing one problem while another remains. Check the file size, dimensions and format first, then the background, lighting, head position and expression. Re-uploading the same file always gives the same result.",
  },
  {
    q: "Why does my 630 × 810 px photo still fail?",
    a: "The dimensions are only one check. The portal also checks the file size, background, lighting, face size and pose. A photo with the right dimensions can still fail if, for example, your face is too small or one side of it is in shadow.",
  },
  {
    q: "How many times can I upload my photo?",
    a: "The portal doesn't publish a limit, and some applicants report being blocked after many failed attempts. Fix and check the photo before each upload instead of trying the same file again.",
  },
  {
    q: "Can I upload my photo from a phone?",
    a: "Some phone browsers trigger a device error. A laptop or desktop browser is more reliable. If you only have a phone, turn on “Desktop site” in the browser menu.",
  },
  {
    q: "How do I reduce my photo to under 250 KB without losing quality?",
    a: "Keep the dimensions at 630 × 810 px and lower the JPEG quality instead. A 630 × 810 px photo usually stays sharp at 150–240 KB.",
  },
  {
    q: "Can I change my photo after I submit the application?",
    a: "Contact your embassy, consulate or its passport service centre. Some missions let you share a corrected photo, while others ask you to upload it during your appointment.",
  },
  {
    q: "Is the upload error my fault or the portal's?",
    a: "If the message mentions file size, dimensions, format or the photo itself, the problem is in your file. If the page freezes, times out or shows a server error, the problem is usually on the portal's side, so wait and try again later.",
  },
  {
    q: "Who can I contact if nothing works?",
    a: "Applicants abroad should contact their Indian embassy or consulate, or its outsourced passport service centre. Applicants in India can call the Passport Seva helpline on 1800-258-1800.",
  },
];

export default function PassportSevaUploadErrorPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "Passport Seva photo upload error", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="ICAO guide · India"
        breadcrumb="Passport Seva photo upload error"
        title="Passport Seva photo upload error? Find your fix"
        description="Stuck on the photo step of your passport application? Match the message you see to one of three error types below, apply the fix and finish your application today."
        actions={
          <>
            <ButtonLink href="#find-your-error" size="lg" className="w-full sm:w-auto">
              Find my error
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="/icao-photo-tool" variant="secondary" size="lg" className="w-full sm:w-auto">
              Make a photo that passes
            </ButtonLink>
          </>
        }
        aside={
          <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
            <p className="text-sm font-semibold text-black">Jump to your error type</p>
            <ul className="mt-4 space-y-2">
              {errorGroups.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="group flex items-start justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:border-lime-600/50"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-black">{g.title}</span>
                      <span className="mt-0.5 block text-sm text-gray-600">{g.summary}</span>
                    </span>
                    <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-gray-400 group-hover:text-lime-700" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <QuickAnswer title="The short answer" icon={<AlertIcon className="size-5" />}>
          Almost every Passport Seva photo error has one of three causes: the file breaks a limit (630 × 810 px,
          JPEG, 250 KB), the photo fails an ICAO quality check, or the browser or session fails. Find your message
          below to see which one applies.
        </QuickAnswer>

        {/* Errors */}
        <section id="find-your-error" className="mt-16 scroll-mt-24">
          <h2 className={guideHeading}>Find your error message</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            The exact wording changes between portal versions, so match your message by meaning rather than word for
            word.
          </p>

          <div className="mt-8 space-y-10">
            {errorGroups.map((group) => (
              <div key={group.id} id={group.id} className="scroll-mt-24">
                <h3 className="text-lg font-semibold text-black">{group.title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">{group.intro}</p>
                <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-white">
                  {group.rows.map((row) => (
                    <li key={row.message} className="grid gap-2 p-5 md:grid-cols-[1fr_1fr_1.2fr] md:gap-6">
                      <p className="font-semibold text-black">“{row.message}”</p>
                      <p className="text-sm leading-6 text-gray-600">
                        <span className="font-medium text-gray-700 md:hidden">Cause: </span>
                        {row.cause}
                      </p>
                      <p className="flex items-start gap-2 text-sm leading-6 text-gray-700">
                        <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                        <span>
                          {row.fix}
                          {row.href && (
                            <>
                              {" "}
                              <Link href={row.href} className="font-semibold text-lime-700 underline-offset-4 hover:underline">
                                Read the guide
                              </Link>
                            </>
                          )}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Edit or retake */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className={guideHeading}>Should you edit the photo or retake it?</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Editing can fix the file and the frame, but it can&apos;t fix how the light fell on your face. Decide before you
            spend time on edits.
          </p>
          <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
              <h3 className="font-semibold text-black">Edit the same photo when you have</h3>
              <ul className="mt-4 space-y-3">
                {editable.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
              <h3 className="font-semibold text-black">Take a new photo when you have</h3>
              <ul className="mt-4 space-y-3">
                {retake.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                    <XIcon className="mt-1 size-4 shrink-0 text-red-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Fix steps */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>How to fix a file error in 4 steps</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              These steps clear every error in group 1. They take about five minutes in any photo editor.
            </p>
          </div>
          <NumberedSteps steps={fixSteps} />
        </section>

        {/* Checklist */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className={guideHeading}>Check these 8 things before you upload</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Run through this list every time. It takes a minute and saves you from another failed attempt. For the
              full rules, read our{" "}
              <Link
                href="/icao-guide/indian-passport-photo-requirements"
                className="font-semibold text-lime-700 underline-offset-4 hover:underline"
              >
                Indian passport photo requirements
              </Link>
              .
            </p>
          </div>
          <ul className="grid gap-2 rounded-lg border border-border bg-white p-5 sm:grid-cols-2 sm:p-6">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-gray-700">
                <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <IndiaPricing />

        <FaqSection faqs={faqs} title="Passport Seva photo upload FAQ" />

        <GuideCta
          title="Skip the trial and error"
          body={`We crop, resize and check your photo for the Passport Seva portal. See the results for free and pay ${standard.amountFormatted} only when you download.`}
          label="Fix my photo"
        />

        <RelatedLinks paths={["/icao-guide/indian-passport-photo-requirements", icaoGuide, "/icao-photo-checker"]} />
      </div>
    </>
  );
}
