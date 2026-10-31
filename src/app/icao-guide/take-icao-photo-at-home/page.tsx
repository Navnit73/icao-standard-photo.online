import Image from "next/image";
import { FaqSection, GuideCta, NumberedSteps, QuickAnswer, SpecList, guideHeading, type Faq } from "@/components/guide";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon, ClockIcon, XIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/icao-guide/take-icao-photo-at-home",
  title: "How to Take an ICAO Passport Photo at Home With Your Phone",
  description:
    "Take an ICAO passport photo at home with just your phone. Get the exact distances, the right camera settings, a method for doing it alone and tips for babies.",
};

export const metadata = pageMetadata(page);

const { pricing } = siteConfig;

const sampleImage =
  "https://res.cloudinary.com/dipzpwbbk/image/upload/v1793075602/south-africa-visa-photo-girl-example_pkg7my.webp";

const kit = [
  "A phone with a rear camera",
  "A plain white or light grey wall, or a white sheet",
  "A window with daylight",
  "A helper, or a tripod or stack of books",
  "A plain, darker top",
];

const setup = [
  { label: "You to the wall", value: "About 50 cm" },
  { label: "Camera to your face", value: "1.2–1.5 m" },
  { label: "Camera height", value: "Level with your eyes" },
  { label: "Light", value: "Window in front of you" },
  { label: "Lens", value: "1× main rear camera" },
  { label: "Camera mode", value: "Standard photo mode" },
];

const helperSteps = [
  {
    title: "Get ready",
    body: "Wear a plain, darker top, tie back loose hair and take off your glasses, hat and any large jewellery.",
  },
  {
    title: "Stand in position",
    body: "Stand about 50 cm in front of the wall, facing the window. Standing away from the wall stops your shadow from landing on it.",
  },
  {
    title: "Frame the shot",
    body: "Your helper holds the phone at your eye level, 1.2–1.5 m away, and frames your head and the top of your shoulders. Leave plenty of space around you, because you crop later.",
  },
  {
    title: "Pose",
    body: "Square your shoulders, keep your head level, close your mouth and look straight into the lens. Relax your face rather than smiling.",
  },
  {
    title: "Take several shots",
    body: "Take five or six photos without zooming. Then zoom in on each one and keep the sharpest photo with no shadows on your face.",
  },
];

const soloSteps = [
  {
    title: "Prop the phone at eye level",
    body: "Use a tripod, or stack books on a table until the rear camera is level with your eyes. Lean the phone against something stable so it doesn't tilt.",
  },
  {
    title: "Take a test shot",
    body: "Set a 10-second timer, step into place and take a test photo. Check that your head is centred and that the top of your shoulders is in the frame, then adjust the phone.",
  },
  {
    title: "Use the timer or burst",
    body: "Set the 10-second timer again. Many phones take a short burst with the timer, which gives you several photos to choose from.",
  },
  {
    title: "Review on the big screen",
    body: "Look at each photo at full size and keep the sharpest one with even light and level eyes.",
  },
];

const phoneSettings = [
  {
    title: "iPhone",
    items: [
      "Use Photo mode, not Portrait mode.",
      "Stay on the 1× lens and don't pinch to zoom.",
      "Turn on Grid in Settings, Camera to line up your eyes.",
      "Choose Settings, Camera, Formats, Most Compatible if you need a JPEG.",
    ],
  },
  {
    title: "Android",
    items: [
      "Use the standard Photo mode, not Portrait or Live focus.",
      "Turn off beauty, face retouch or skin smoothing. The name varies by brand.",
      "Stay on the 1× lens and don't use digital zoom.",
      "Turn on grid lines in the camera settings.",
    ],
  },
];

const mistakes = [
  { title: "Selfie at arm's length", body: "A close lens makes your nose look bigger. Stand back and use the rear camera." },
  { title: "Overhead ceiling light", body: "It casts shadows under your eyes and nose. Turn it off and use daylight." },
  { title: "Standing against the wall", body: "Your shadow lands right behind your head. Step 50 cm forward." },
  { title: "White top on a white wall", body: "Your shoulders disappear into the background. Wear a darker top." },
  { title: "Portrait mode or filters", body: "Background blur and smoothing count as editing. Use the standard photo mode." },
  { title: "Direct sunlight", body: "It creates harsh shadows and makes you squint. Choose indirect daylight." },
];

const faqs: Faq[] = [
  {
    q: "Is a passport photo taken at home accepted?",
    a: "Yes. Passport offices don't ask who took the photo, only whether it meets the rules. A home photo passes when it has the right size, a plain background, even lighting and a neutral expression.",
  },
  {
    q: "Can I use my phone's selfie camera?",
    a: "Avoid it if you can. The front camera has a wide lens, and holding it at arm's length distorts your face. If you must use it, prop the phone 1.2–1.5 m away and use the timer.",
  },
  {
    q: "What is the best time of day for a home passport photo?",
    a: "Take it during the day, when soft light comes through a window. An overcast day is ideal. Avoid direct sunlight and evening light from ceiling lamps.",
  },
  {
    q: "Do I need a white wall?",
    a: "A plain, light wall is best, but you can hang a white sheet or use any plain surface. Our tool replaces the background with plain white, as long as the light on your face is even.",
  },
  {
    q: "How far should the camera be from my face?",
    a: "Keep the camera 1.2–1.5 m from your face, at eye level. This distance keeps your features natural and leaves room to crop the photo to the correct size.",
  },
  {
    q: "Can I take my baby's passport photo at home?",
    a: "Yes, and it's often easier than at a studio. Lay your baby on a white sheet, take the photo from directly above in daylight and keep your hands out of the frame.",
  },
  {
    q: "Can I print my passport photo at home?",
    a: "You can, but a photo lab gives better results. Ordinary printer paper is too thin and can smudge, so print the 4 × 6 in sheet at a pharmacy or photo lab.",
  },
  {
    q: "How do I turn my photo into the right passport size?",
    a: `Crop it to your country's size so your head is the correct height, or upload it to our tool. We crop, whiten the background and check the photo, and you pay $${pricing.price} only when you download.`,
  },
];

export default function TakePhotoAtHomePage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "Take an ICAO photo at home", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="ICAO guide"
        breadcrumb="Take an ICAO photo at home"
        title="How to take an ICAO photo at home with your phone"
        description="You don't need a studio for a passport photo. With your phone, a plain wall and daylight, you can take an ICAO compliant photo in about ten minutes, with or without a helper."
        actions={
          <>
            <ButtonLink href="#setup" size="lg" className="w-full sm:w-auto">
              Start the setup
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="/icao-photo-tool" variant="secondary" size="lg" className="w-full sm:w-auto">
              I already have a photo
            </ButtonLink>
          </>
        }
        aside={
          <figure className="mx-auto w-full max-w-md">
            <Image
              src={sampleImage}
              alt="Passport photo taken at home with a phone: woman facing the camera on a plain white background"
              width={1254}
              height={1254}
              sizes="(min-width: 1024px) 448px, 100vw"
              preload
              className="w-full rounded-lg border border-border bg-white shadow-sm"
            />
            <figcaption className="mt-3 text-sm text-gray-500">A phone photo after cropping and background clean-up.</figcaption>
          </figure>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <QuickAnswer title="The short answer" icon={<ClockIcon className="size-5" />}>
          Stand 50 cm in front of a plain wall, facing a window. Have someone hold your phone at eye level 1.2–1.5 m
          away and take several photos with the rear camera in the standard photo mode. Then crop the best one to your
          country&apos;s size.
        </QuickAnswer>

        {/* Kit and setup */}
        <section id="setup" className="mt-16 grid scroll-mt-24 gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className={guideHeading}>What you need</h2>
            <ul className="mt-6 space-y-3">
              {kit.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-gray-700">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={guideHeading}>Your setup in numbers</h2>
            <div className="mt-6">
              <SpecList items={setup} />
            </div>
          </div>
        </section>

        {/* Phone settings */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className={guideHeading}>Set up your phone camera</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Phone cameras edit photos automatically. Passport offices treat that as editing, so turn these features
            off first.
          </p>
          <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {phoneSettings.map((p) => (
              <div key={p.title} className="rounded-lg border border-border bg-white p-5 sm:p-6">
                <h3 className="font-semibold text-black">{p.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6 text-gray-700">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* With a helper */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>Step by step with a helper</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              This is the easiest method and gives the most natural result. Your helper only needs to hold the phone
              steady and press the shutter.
            </p>
          </div>
          <NumberedSteps steps={helperSteps} />
        </section>

        {/* Solo */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>How to take it on your own</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              No one to help? Use the same setup, but let a tripod and the timer do the work. Never hold the phone at
              arm&apos;s length.
            </p>
          </div>
          <NumberedSteps steps={soloSteps} />
        </section>

        {/* Babies */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 md:grid-cols-2 md:gap-12">
          <h2 className={guideHeading}>Taking a baby&apos;s or child&apos;s photo at home</h2>
          <div className="space-y-4 text-base leading-7 text-gray-700">
            <p>
              Lay a white sheet on a bed near a window, place your baby on it face up and take the photo from directly
              above. This avoids the hands and shadows that make babies&apos; photos fail.
            </p>
            <p>
              For a toddler, cover a car seat or chair with a white sheet. Keep toys, dummies and your hands out of the
              frame, and take plenty of shots to catch a moment with the eyes open.
            </p>
          </div>
        </section>

        {/* Mistakes */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className={guideHeading}>6 home photo mistakes to avoid</h2>
          <ul className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mistakes.map((m) => (
              <li key={m.title} className="rounded-lg border border-border bg-white p-5">
                <h3 className="flex items-center gap-2 font-semibold text-black">
                  <XIcon className="size-4 shrink-0 text-red-600" />
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{m.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <FaqSection faqs={faqs} title="Home passport photo FAQ" />

        <GuideCta
          title="Turn your phone photo into a passport photo"
          body={`We crop it to your country's size, whiten the background and run ICAO checks. Pay $${pricing.price} only when you download.`}
          label="Upload my photo"
        />

        <RelatedLinks
          paths={["/icao-photo-checker", "/icao-compliant-passport-photo", "/icao-guide/passport-photo-rejected-reasons"]}
        />
      </div>
    </>
  );
}
