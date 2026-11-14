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
import { AlertIcon, ArrowRightIcon, CheckIcon, XIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/icao-guide/infant-and-baby-passport-photo",
  title: "Baby & Infant Passport Photo: Acceptable vs Rejected ICAO Guide",
  description:
    "See acceptable vs rejected infant passport photo examples, minor passport photo size in India (630 × 810 px & 2 × 2 in), and how to take a newborn photo on a white sheet.",
};

export const metadata = pageMetadata(page);

const [standard] = indiaPlans;
const { pricing } = siteConfig;

const minorSpecs = [
  { label: "India Passport Seva (online)", value: "630 × 810 px (≤ 250 KB)" },
  { label: "India VFS / BLS print", value: "2 × 2 in (51 × 51 mm)" },
  { label: "EU / UK / Schengen", value: "35 × 45 mm" },
  { label: "USA (newborn & minor)", value: "2 × 2 in (600 × 600 px)" },
  { label: "Background", value: "Plain white, no sheet creases" },
  { label: "Other people / hands", value: "Strictly none visible" },
];

const acceptableVsRejected = [
  {
    topic: "Hands, arms & parents",
    accepted: "Only the baby appears in the frame — no parent hands, fingers, shoulders or sleeves visible anywhere.",
    rejected: "Holding the baby's chin, supporting the neck with a visible finger, or taking a photo with the baby in your lap.",
  },
  {
    topic: "Background & surface",
    accepted: "Baby laid flat on a smooth, ironed plain white sheet or off-white cloth in bright daytime window light.",
    rejected: "Car seat straps, stroller headrests, printed blankets, textured sofas or deep shadows in wrinkled bedsheets.",
  },
  {
    topic: "Pacifiers, toys & bottles",
    accepted: "Nothing in the baby's mouth or near the face; neutral outfit in a solid colour that contrasts with white.",
    rejected: "Dummy/pacifier in mouth, teething rings, bottle edges or stuffed toys peeking into the corner of the crop.",
  },
  {
    topic: "Eyes & expression",
    accepted: "Newborns (under 1 year) are given leniency on slightly open mouths or closed eyes when sleeping, though open eyes are always best.",
    rejected: "Crying hard with a distorted face, squinting into a camera flash, or toddlers looking sideways away from the lens.",
  },
  {
    topic: "Head position & framing",
    accepted: "Head centred vertically and horizontally, both ears/cheeks evenly lit, facing straight up at the overhead camera.",
    rejected: "Head slumped sideways onto the shoulder, chin tucked into chest, or cropped too tight cutting off hair.",
  },
  {
    topic: "Lighting & red-eye",
    accepted: "Soft indirect window light coming from above/front so both cheeks have matching brightness.",
    rejected: "Direct phone flash (creates harsh sheet shadows and red-eye) or yellow overhead room bulbs.",
  },
];

const ageAllowances = [
  {
    age: "Newborns & babies (0–6 months)",
    rule: "Most lenient ICAO rules",
    details:
      "Babies cannot sit upright or maintain a neutral expression on command. Most authorities (US, UK, Schengen, Indian missions) allow minor mouth opening or closed eyes if the baby is asleep, provided the full face is centred, evenly lit, and completely free of hands or pacifiers.",
  },
  {
    age: "Older infants (6–12 months)",
    rule: "Open eyes strongly preferred",
    details:
      "Aim to capture the baby awake looking at a toy held just above the camera lens. Keep the mouth relaxed rather than crying or laughing wide. Still use the white sheet overhead method if they cannot sit steadily alone.",
  },
  {
    age: "Toddlers & minors (1–17 years)",
    rule: "Standard adult ICAO rules apply",
    details:
      "Once a child can sit or stand, full adult ICAO criteria apply: eyes wide open, mouth closed, neutral expression, straight head, and exact 630 × 810 px (or country size) framing. For minors in India, the digital upload size is identical to adults: 630 × 810 px JPEG under 250 KB.",
  },
];

const sheetSteps = [
  {
    title: "Spread a smooth white sheet near a bright window",
    body: "Wait until your baby is calm and fed. Lay a clean, crease-free white cotton bedsheet or white poster board on the floor beside a daylight window, with ceiling lights switched off.",
  },
  {
    title: "Dress the baby in a plain, darker top",
    body: "Avoid white onesies that blend into the white sheet, and avoid hoods or collars that push up around the chin.",
  },
  {
    title: "Shoot straight down from 1–1.2 metres above",
    body: "Stand over the baby with your phone's rear 1× camera (flash OFF) held parallel to the floor so your own shadow does not fall across the baby's face.",
  },
  {
    title: "Attract their gaze right above the lens",
    body: "Hold a rattle or quietly click your fingers just above the phone lens so the baby looks straight up, and take a burst of 6–10 shots.",
  },
  {
    title: "Crop, clean the background and verify ICAO sizing",
    body: "Upload the sharpest shot to our ICAO Photo Tool to replace any faint sheet creases with pure white and export the exact 630 × 810 px, 35 × 45 mm or 2 × 2 in size.",
  },
];

const faqs: Faq[] = [
  {
    q: "Why was my infant's passport photo rejected?",
    a: "The top causes for rejected infant passport photos are visible parent hands or fingers, car seat or stroller straps in the background, wrinkled bedsheet shadows, a pacifier in the mouth, or harsh flash red-eye. Laying the baby flat on a white sheet in soft daylight solves almost all of these.",
  },
  {
    q: "What is the passport photo size for minors in India?",
    a: "Minors and newborn babies use the exact same digital dimensions as adults on Global Passport Seva 2.0: 630 × 810 pixels in JPEG format, up to 250 KB, on a plain white background. If you are submitting physical prints to VFS or BLS abroad, attach 2 × 2 inch (51 × 51 mm) prints as listed on your mission checklist.",
  },
  {
    q: "Are closed eyes acceptable for a newborn passport photo?",
    a: "Many countries accept closed eyes for newborns under 6 months when they cannot keep their eyes open, though open eyes are always safer to avoid automated portal flags. For Indian missions abroad, check your local embassy notice or aim for an awake photo using a quiet toy above the lens.",
  },
  {
    q: "Can I hold my baby in a white T-shirt instead of laying them down?",
    a: "Only if zero hands, fingers, or parent clothing appear inside the cropped passport frame and the baby's head stays straight. In practice, laying the baby on a white sheet and shooting from above gives a cleaner background and higher pass rate.",
  },
  {
    q: "Does Passport Seva's automated ICAO checker treat babies differently?",
    a: "The online upload checker runs the same face-detection and alignment algorithm on minor photos. Make sure the baby's head is not tilted sideways and shadows on the sheet are removed so the software detects one clean face.",
  },
];

export default function InfantAndBabyPassportPhotoPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "Baby & infant passport photo", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="ICAO guide · Babies & minors"
        breadcrumb="Baby & infant passport photo"
        title="Baby & infant passport photo: acceptable vs rejected ICAO guide"
        description="Get an acceptable newborn, baby or minor passport photo on the first try. See what gets infant photos rejected, age-by-age ICAO allowances, and minor photo sizes for India and worldwide."
        actions={
          <>
            <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
              Make baby passport photo
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#examples" variant="secondary" size="lg" className="w-full sm:w-auto">
              Acceptable vs rejected
            </ButtonLink>
          </>
        }
        aside={
          <div>
            <p className="mb-3 text-sm font-semibold text-black">Infant &amp; minor photo specs</p>
            <SpecList items={minorSpecs} />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <QuickAnswer title="The short answer" icon={<AlertIcon className="size-5" />}>
          Newborn and minor passport photos use the <strong>exact same dimensions</strong> as adult photos (630 × 810 px
          for India Passport Seva; 35 × 45 mm for UK/EU; 2 × 2 in for US/OCI), with zero parent hands, pacifiers, toys or
          car seats in view. Newborns get mild leniency on expression, so the easiest method is laying your baby on a
          smooth white sheet in daylight.
        </QuickAnswer>

        {/* Acceptable vs Rejected table */}
        <section id="examples" className="mt-16 scroll-mt-24">
          <h2 className={guideHeading}>Acceptable vs rejected infant passport photos</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Most baby rejections happen because of background objects or supporting hands, not the baby&apos;s pose.
            Check every row before submitting.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {acceptableVsRejected.map((item) => (
              <article key={item.topic} className="rounded-lg border border-border bg-white p-5 sm:p-6">
                <h3 className="font-semibold text-black">{item.topic}</h3>
                <p className="mt-3 flex items-start gap-2.5 text-sm leading-6 text-gray-700">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                  <span>
                    <strong className="font-semibold text-black">Acceptable: </strong>
                    {item.accepted}
                  </span>
                </p>
                <p className="mt-2.5 flex items-start gap-2.5 text-sm leading-6 text-gray-600">
                  <XIcon className="mt-1 size-4 shrink-0 text-red-600" />
                  <span>
                    <strong className="font-semibold text-black">Rejected: </strong>
                    {item.rejected}
                  </span>
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Age-by-age allowances */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className={guideHeading}>ICAO rules by child&apos;s age (newborn to minor)</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ageAllowances.map((group) => (
              <div key={group.age} className="rounded-lg border border-border bg-white p-5 sm:p-6">
                <p className="inline-block rounded-md bg-lime-600/10 px-2 py-0.5 text-xs font-semibold text-lime-700">
                  {group.rule}
                </p>
                <h3 className="mt-3 font-semibold text-black">{group.age}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{group.details}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Applying for an Indian minor passport or renewal abroad? Check{" "}
            <Link href="/icao-guide/indian-passport-renewal-photo-size" className="font-medium text-lime-700 hover:underline">
              Indian passport renewal &amp; VFS/BLS photo dimensions
            </Link>{" "}
            so you prepare both the 630 × 810 px upload and printed copy correctly.
          </p>
        </section>

        {/* Step-by-step white sheet method */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>How to take an infant passport photo at home</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Skip the stressful studio trip. You can get a clean newborn or baby photo in five minutes on your bedroom
              floor while your baby is relaxed.
            </p>
          </div>
          <NumberedSteps steps={sheetSteps} />
        </section>

        <IndiaPricing />

        <FaqSection faqs={faqs} title="Baby & minor passport photo FAQ" />

        <GuideCta
          title="Turn your baby's photo into an ICAO compliant file"
          body={`We clean up white sheet shadows, crop to exact minor dimensions, and verify ICAO framing for ${standard.amountFormatted} (India) or $${pricing.price}.`}
          label="Create baby photo"
        />

        <RelatedLinks
          paths={[
            "/icao-guide/take-icao-photo-at-home",
            "/icao-guide/passport-photo-rejected-reasons",
            "/icao-guide/indian-passport-photo-requirements",
          ]}
        />
      </div>
    </>
  );
}

