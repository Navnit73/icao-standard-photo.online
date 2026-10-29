import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { ButtonLink } from "@/components/ui/button-link";
import { AlertIcon, ArrowRightIcon, CheckIcon, XIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { absoluteUrl, breadcrumbSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/icao-compliant-passport-photo",
  title: "ICAO Compliant Passport Photo: Size, Rules and Photo Check",
  description:
    "Get an ICAO compliant passport photo that passes the first time. See the ICAO standard photo size, every rule, sizes by country and how to check your photo.",
};

export const metadata = pageMetadata(page);

const { pricing, refund } = siteConfig;

const rejectionGuide = "/icao-guide/photo-is-not-valid-as-per-icao-standard";

const sampleImage =
  "https://res.cloudinary.com/dipzpwbbk/image/upload/v1793075602/south-africa-visa-photo-girl-example_pkg7my.webp";

const specs = [
  { label: "Photo size", value: "35 × 45 mm (most countries)" },
  { label: "Head height", value: "32–36 mm, chin to crown" },
  { label: "Face in frame", value: "70–80% of the photo height" },
  { label: "Background", value: "Plain white, off-white or light grey" },
  { label: "Colour", value: "Full colour, natural skin tones" },
  { label: "Age of photo", value: "Taken in the last 6 months" },
  { label: "Print quality", value: "At least 300 dpi on photo paper" },
  { label: "Digital minimum", value: "90 px or more between the eyes" },
];

const requirements = [
  {
    title: "Framing and head position",
    rules: [
      "Face the camera squarely with your head level and shoulders straight.",
      "Centre your face and leave a small gap above your hair.",
      "Show your full head from crown to chin, plus the top of your shoulders.",
    ],
  },
  {
    title: "Expression and eyes",
    rules: [
      "Keep a neutral expression with your mouth closed.",
      "Open both eyes fully and look straight into the lens.",
      "Keep hair away from your eyes and eyebrows.",
    ],
  },
  {
    title: "Lighting and background",
    rules: [
      "Light your face evenly, with no shadows on either side.",
      "Avoid flash glare, hot spots and red-eye.",
      "Use one plain background colour with no patterns, objects or other people.",
    ],
  },
  {
    title: "Glasses",
    rules: [
      "Remove your glasses whenever you can. Many countries now require it.",
      "If you must wear them for medical reasons, avoid glare and tinted lenses.",
      "Make sure the frames never cover any part of your eyes.",
    ],
  },
  {
    title: "Head coverings",
    rules: [
      "Wear one only for religious or medical reasons.",
      "Keep your face visible from the bottom of the chin to the top of the forehead.",
      "Make sure the covering casts no shadow on your face.",
    ],
  },
  {
    title: "Image quality",
    rules: [
      "Submit a sharp photo with no blur, grain or pixelation.",
      "Never use filters, beauty modes or retouching that changes your face.",
      "Don't scan or photograph an old printed photo.",
    ],
  },
];

const accepted = [
  "Recent colour photo, taken in the last 6 months",
  "Plain light background, evenly lit",
  "Head straight, centred and 32–36 mm tall",
  "Neutral face, mouth closed, eyes open",
  "Sharp focus and true skin tones",
];

const rejected = [
  "Shadows on the face or behind the head",
  "Smiling with teeth or raised eyebrows",
  "Tinted lenses, glare or hair over the eyes",
  "Selfie-arm distortion or a tilted head",
  "Filters, background blur or beauty effects",
];

const countries = [
  { name: "United States passport", size: "2 × 2 in (51 × 51 mm)", head: "25–35 mm", note: "White background, no glasses" },
  { name: "United Kingdom passport", size: "35 × 45 mm", head: "29–34 mm", note: "Plain cream or light grey background" },
  { name: "Schengen visa", size: "35 × 45 mm", head: "32–36 mm", note: "Plain light background" },
  { name: "India passport (online)", size: "630 × 810 px", head: "Face fills 80–85%", note: "White background, JPEG up to 250 KB" },
  { name: "Canada passport", size: "50 × 70 mm", head: "31–36 mm", note: "Studio name and date on the back" },
  { name: "Australia passport", size: "35–40 × 45–50 mm", head: "32–36 mm", note: "Plain light background" },
  { name: "China visa", size: "33 × 48 mm", head: "28–33 mm", note: "White background, ears visible" },
];

const steps = [
  {
    title: "Find a plain wall and soft light",
    body: "Stand about 50 cm in front of a plain white or light grey wall. Face a window during the day so daylight falls evenly on your face.",
  },
  {
    title: "Set up the camera at eye level",
    body: "Ask someone to hold the phone 1–2 m away at your eye level. Use the main rear camera, because a close selfie stretches your nose and shrinks your ears.",
  },
  {
    title: "Pose and take several shots",
    body: "Square your shoulders, relax your face and look into the lens. Take five or six photos and keep the sharpest one.",
  },
  {
    title: "Crop, check and fix the background",
    body: "Crop to your document's size so your head is the right height, then replace any uneven background with plain white. Our tool does all of this for you.",
  },
  {
    title: "Download, upload or print",
    body: "Upload the digital file to your passport or visa portal, or print the 4 × 6 in sheet at any photo lab and cut out each photo.",
  },
];

const checks = [
  {
    title: "Measure the head height",
    body: "On a 35 × 45 mm photo, measure from the bottom of the chin to the top of the head. You need 32–36 mm. On a digital file, the head should fill 70–80% of the image height.",
  },
  {
    title: "Check that the eyes are level",
    body: "Draw an imaginary line through both pupils. It should run straight across, with both eyes the same distance from the edges.",
  },
  {
    title: "Zoom in to 100%",
    body: "Look for blur around the eyes, grain in dark areas and a halo where a background tool cut around your hair.",
  },
  {
    title: "Scan the background edges",
    body: "Check the corners and the area behind your shoulders for shadows, gradients or a coloured tint.",
  },
  {
    title: "Confirm the file details",
    body: "Compare the format, pixel dimensions and file size with the limits on the portal. A perfect photo still fails if the file is too large.",
  },
];

const comparison = [
  { feature: "Crops to your country's size", free: "Yes", studio: "Yes", ours: "Yes" },
  { feature: "Replaces the background with plain white", free: "Sometimes", studio: "Yes", ours: "Yes" },
  { feature: "Measures head height and eye position", free: "Rarely", studio: "By eye", ours: "Yes, automatically" },
  { feature: "Shows check results before you pay", free: "No check", studio: "No", ours: "Yes" },
  { feature: "Refund if an agency rejects the photo", free: "No", studio: "Varies", ours: `Yes, claim within ${refund.claimDays} days` },
];

const faqs = [
  {
    q: "What is an ICAO compliant passport photo?",
    a: "An ICAO compliant passport photo follows ICAO Doc 9303, the standard the International Civil Aviation Organization sets for machine-readable passports. It defines the photo size, head position, background, lighting and expression, so automated gates and officers can match the photo to your face. Some offices call it an ICAO standard photograph or a biometric photo.",
  },
  {
    q: "What is the ICAO standard photo size?",
    a: "Most countries use 35 × 45 mm with the head 32–36 mm tall from chin to crown. The United States uses 2 × 2 in (51 × 51 mm), and Canada uses 50 × 70 mm. Online portals set their own pixel sizes, such as 630 × 810 px for Indian passport applications.",
  },
  {
    q: "Is an ICAO compliant photo the same in every country?",
    a: "The core rules are the same everywhere: a plain background, even lighting, a neutral face and open eyes. Each country then adds its own photo size, head height, background colour and glasses rule. Always choose the exact document you are applying for.",
  },
  {
    q: "How can I run an ICAO photo check on my photo?",
    a: "Measure the head height, confirm your eyes are level, zoom in to check sharpness, scan the background for shadows and compare the file details with the portal's limits. Our tool runs these checks automatically and shows the results before you pay.",
  },
  {
    q: "What should I do if my photo does not comply with ICAO standards?",
    a: "Find out which rule it breaks. You can fix background, crop, size and file format problems from the same photo, but you need a new photo for shadows, a tilted head, glare, blur or the wrong expression. Our guide to the “photo is not valid as per ICAO standard” error covers each cause.",
  },
  {
    q: "Is there a free ICAO standards photo converter?",
    a: `Yes, several free converters crop and resize a photo, but most don't check head height, eye position or lighting, so the result can still fail. With our tool, you upload your photo and see the check results for free, and you pay $${pricing.price} only when you download.`,
  },
  {
    q: "Can I make an ICAO standard photo with my phone?",
    a: "Yes. Any recent phone takes a sharp enough photo. Ask someone to hold it at eye level 1–2 m away, stand in front of a plain wall facing a window, and then crop and check the photo before you use it.",
  },
  {
    q: "Can I wear glasses in an ICAO standard photograph?",
    a: "Remove them if you can. The United States and several other countries reject photos with glasses. Where glasses are allowed, the lenses must be clear with no glare, and the frames must not cover your eyes.",
  },
  {
    q: "Can I smile in an ICAO photo?",
    a: "No. Keep a neutral expression with your mouth closed. A smile changes the shape of your face and can cause face-matching software to fail.",
  },
  {
    q: "Is an ICAO compliant photo mandatory for Indian passport applications?",
    a: "Yes. Since 1 December 2025, Indian missions abroad require an ICAO compliant photo with every passport application on Global Passport Seva 2.0. The upload must be a 630 × 810 px JPEG of up to 250 KB on a white background.",
  },
  {
    q: "What does “ICAO foto standard” mean?",
    a: "It means the same thing as the ICAO photo standard. “Foto” is the spelling in German, Dutch, Spanish and several other languages, and the Doc 9303 rules don't change with the language.",
  },
  {
    q: "How long is an ICAO photo valid?",
    a: "Most passport offices accept a photo taken within the last 6 months. Take a new one sooner if your appearance changes, for example after shaving a beard or changing your hairstyle significantly.",
  },
];

const heading = "text-2xl font-semibold tracking-tight text-black sm:text-3xl";

export default function IcaoCompliantPassportPhotoPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "ICAO compliant passport photo", path: page.path }]),
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
        breadcrumb="ICAO compliant passport photo"
        title="ICAO compliant passport photo: size, rules and how to get one"
        description="Passport offices, visa portals and airport e-gates check your photo against ICAO Doc 9303. This guide gives you the exact size, every rule, the differences between countries and a simple way to check your photo before you submit it."
        actions={
          <>
            <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
              Make my ICAO photo
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#requirements" variant="secondary" size="lg" className="w-full sm:w-auto">
              See the requirements
            </ButtonLink>
          </>
        }
        aside={
          <figure className="mx-auto w-full max-w-md">
            <Image
              src={sampleImage}
              alt="ICAO compliant passport photo example: woman on a plain white background, head centred and 32–36 mm tall"
              width={1254}
              height={1254}
              sizes="(min-width: 1024px) 448px, 100vw"
              preload
              className="w-full rounded-lg border border-border bg-white shadow-sm"
            />
            <figcaption className="mt-3 text-sm text-gray-500">An ICAO compliant photo made with our tool.</figcaption>
          </figure>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Quick answer */}
        <section className="flex gap-4 rounded-lg border border-border bg-white p-5 sm:p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
            <CheckIcon className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold text-black">What is an ICAO compliant photo?</h2>
            <p className="mt-1 text-sm leading-6 text-gray-700">
              It’s a recent colour portrait, usually 35 × 45 mm, with your head 32–36 mm tall, a plain light
              background, even lighting, a neutral expression and both eyes open. Passport systems compare it with your
              live face, so even a small shadow or tilt can get it rejected.
            </p>
          </div>
        </section>

        {/* Size at a glance */}
        <section id="size" className="mt-16 grid scroll-mt-24 gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className={heading}>ICAO standard photo size at a glance</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              These passport photo ICAO standards come from Doc 9303 and ISO/IEC 19794-5, the face image standard it
              references. Most countries use them as they are. A few change the photo size or head height, as the
              country table below shows.
            </p>
          </div>
          <dl className="divide-y divide-border rounded-lg border border-border bg-white">
            {specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-4 px-5 py-3 text-sm">
                <dt className="text-gray-600">{spec.label}</dt>
                <dd className="text-right font-semibold text-black">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Requirements */}
        <section id="requirements" className="mt-16 scroll-mt-24 border-t border-border pt-16">
          <h2 className={heading}>ICAO standard photograph requirements</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Every ICAO standard photograph must meet these six groups of rules. Officers check them by eye, and
            portals and e-gates check them with software.
          </p>
          <ul className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requirements.map((group) => (
              <li key={group.title} className="rounded-lg border border-border bg-white p-5">
                <h3 className="font-semibold text-black">{group.title}</h3>
                <ul className="mt-3 space-y-2.5">
                  {group.rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-sm leading-6 text-gray-700">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            <span className="font-semibold text-black">Photographing a baby?</span> Most countries relax the
            expression and open-eye rules for children under one. Lay the baby on a plain white sheet, and keep hands,
            toys and dummies out of the frame.
          </p>
        </section>

        {/* Do and don't */}
        <section className="mt-16 grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-black">Your photo passes when it has</h2>
            <ul className="mt-4 space-y-3">
              {accepted.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-black">Your photo fails when it has</h2>
            <ul className="mt-4 space-y-3">
              {rejected.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                  <XIcon className="mt-1 size-4 shrink-0 text-red-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Countries */}
        <section id="countries" className="mt-16 scroll-mt-24 border-t border-border pt-16">
          <h2 className={heading}>ICAO photo sizes by country</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            The ICAO foto standard sets the shared rules, and each country picks its own size. Here are the most
            requested documents.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Document</th>
                  <th scope="col" className="px-5 py-3 font-medium">Photo size</th>
                  <th scope="col" className="px-5 py-3 font-medium">Head height</th>
                  <th scope="col" className="px-5 py-3 font-medium">Watch out for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {countries.map((c) => (
                  <tr key={c.name}>
                    <th scope="row" className="px-5 py-3 font-semibold text-black">{c.name}</th>
                    <td className="px-5 py-3 text-gray-700">{c.size}</td>
                    <td className="px-5 py-3 text-gray-700">{c.head}</td>
                    <td className="px-5 py-3 text-gray-600">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Governments update these rules from time to time. Confirm the current size with the issuing office before
            you print.
          </p>
        </section>

        {/* How to make one */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={heading}>How to make an ICAO standard photo at home</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              You don’t need a studio. A phone, a plain wall and daylight give you everything an ICAO compliant photo
              needs.
            </p>
          </div>
          <ol className="space-y-5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-lime-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-black">{step.title}</h3>
                  <p className="mt-1 text-base leading-7 text-gray-700">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Photo check */}
        <section id="photo-check" className="mt-16 scroll-mt-24 border-t border-border pt-16">
          <h2 className={heading}>How to run an ICAO photo check before you submit</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Portals reject photos automatically, and each rejection costs you time. Run these five checks first.
          </p>
          <ul className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {checks.map((c, i) => (
              <li key={c.title} className="rounded-lg border border-border bg-white p-5">
                <p className="font-mono text-xs text-gray-500">Check {i + 1}</p>
                <h3 className="mt-1 font-semibold text-black">{c.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{c.body}</p>
              </li>
            ))}
            <li className="flex flex-col justify-between gap-4 rounded-lg border border-lime-600/30 bg-lime-600/5 p-5">
              <div>
                <h3 className="font-semibold text-black">Skip the ruler</h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Our tool measures head height, eye position, top margin, background and file details for you, and
                  shows the results before you pay.
                </p>
              </div>
              <Link
                href="/icao-photo-tool"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-lime-700 underline-offset-4 hover:underline"
              >
                Check my photo
                <ArrowRightIcon className="size-4" />
              </Link>
            </li>
          </ul>

          <div className="mt-8 flex gap-4 rounded-lg border border-border bg-white p-5 sm:p-6">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
              <AlertIcon className="size-5" />
            </span>
            <div>
              <h3 className="font-semibold text-black">Did a portal say your photo does not comply with ICAO standards?</h3>
              <p className="mt-1 text-sm leading-6 text-gray-700">
                Our guide explains each cause of the rejection and shows you how to fix it.{" "}
                <Link href={rejectionGuide} className="font-semibold text-lime-700 underline-offset-4 hover:underline">
                  Read the rejection guide
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Free converters vs checked photo */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className={heading}>Free ICAO photo converters vs a checked photo</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            A free ICAO standards photo converter crops your image to size, but cropping alone doesn’t make a photo
            compliant. Here’s how the options compare.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Feature</th>
                  <th scope="col" className="px-5 py-3 font-medium">Free cropping tool</th>
                  <th scope="col" className="px-5 py-3 font-medium">Photo studio</th>
                  <th scope="col" className="px-5 py-3 font-medium text-lime-700">{siteConfig.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparison.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row" className="px-5 py-3 font-medium text-black">{row.feature}</th>
                    <td className="px-5 py-3 text-gray-600">{row.free}</td>
                    <td className="px-5 py-3 text-gray-600">{row.studio}</td>
                    <td className="px-5 py-3 font-semibold text-black">{row.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-16 scroll-mt-24 border-t border-border pt-16">
          <h2 className={heading}>ICAO compliant photo FAQ</h2>
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
            <h2 className="text-xl font-semibold text-black">Get an ICAO compliant passport photo in minutes</h2>
            <p className="mt-1 text-sm text-gray-600">
              Upload a phone photo, see the check results for free and pay ${pricing.price} only when you download.
            </p>
          </div>
          <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
            Make my photo
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        </section>

        <RelatedLinks paths={[rejectionGuide, "/refund-policy", "/data-security"]} />
      </div>
    </>
  );
}
