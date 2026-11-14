import Image from "next/image";
import Link from "next/link";
import {
  FaqSection,
  GuideCta,
  QuickAnswer,
  SpecList,
  guideHeading,
  type Faq,
} from "@/components/guide";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon, ImageIcon, XIcon } from "@/components/ui/icons";
import { breadcrumbSchema, faqSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/icao-guide/icao-standard-photo-examples",
  title: "ICAO Standard Photo Examples: Acceptable vs Rejected Samples",
  description:
    "See what an ICAO standard photo looks like with side-by-side acceptable and rejected examples, head-size diagrams, and ICAO Doc 9303 biometric rules.",
};

export const metadata = pageMetadata(page);

const sampleImage =
  "https://res.cloudinary.com/dipzpwbbk/image/upload/v1793075602/south-africa-visa-photo-girl-example_pkg7my.webp";

const doc9303Specs = [
  { label: "Standard", value: "ICAO Doc 9303 (MRTD)" },
  { label: "Standard print size", value: "35 × 45 mm (2 × 2 in US)" },
  { label: "Head height", value: "32–36 mm (70–80% of frame)" },
  { label: "India online size", value: "630 × 810 px (80–85% face)" },
  { label: "Background", value: "Plain white or light grey" },
  { label: "Eye distance", value: "At least 90 px between pupils" },
  { label: "Expression", value: "Neutral, mouth closed, eyes open" },
  { label: "Print / file tone", value: "Continuous-tone, no filters" },
];

type VisualKind =
  | "framing"
  | "tilt"
  | "shadow"
  | "lighting"
  | "expression"
  | "glasses"
  | "hair"
  | "quality";

const examples: {
  kind: VisualKind;
  rule: string;
  passLabel: string;
  passDetail: string;
  failLabel: string;
  failDetail: string;
}[] = [
  {
    kind: "framing",
    rule: "1. Head size & framing",
    passLabel: "Accepted: 70–85% head coverage",
    passDetail: "Full head from chin to hair plus top of shoulders centred, with a small 2–4 mm margin above the hair.",
    failLabel: "Rejected: Too small, too close or cut off",
    failDetail: "Waist-up shots, tight crops cutting off the top of hair or chin, or excessive blank wall above the head.",
  },
  {
    kind: "tilt",
    rule: "2. Head tilt & posture",
    passLabel: "Accepted: Straight & level eyes",
    passDetail: "Nose aligned with the vertical centreline, both ears equally visible, and shoulders square to the lens.",
    failLabel: "Rejected: Tilted or turned",
    failDetail: "Even a 5° sideways head tilt or turned shoulders triggers “Posture check failed” on Passport Seva.",
  },
  {
    kind: "shadow",
    rule: "3. Background & shadows",
    passLabel: "Accepted: Plain uniform white",
    passDetail: "Clean white or light neutral background with zero wall shadows, furniture, doors or colour gradients.",
    failLabel: "Rejected: Wall shadow or pattern",
    failDetail: "Standing flush against a wall casts a dark outline behind your head. Cream, blue or textured walls fail.",
  },
  {
    kind: "lighting",
    rule: "4. Facial lighting & flash",
    passLabel: "Accepted: Even daylight on both sides",
    passDetail: "Face illuminated evenly from front window light with natural skin tone, no hot spots and no dark eye sockets.",
    failLabel: "Rejected: Half-face shadow or red-eye",
    failDetail: "Overhead ceiling bulbs or side lamps darken one cheek and under the chin; direct flash causes red-eye.",
  },
  {
    kind: "expression",
    rule: "5. Facial expression",
    passLabel: "Accepted: Neutral, mouth closed",
    passDetail: "Relaxed jaw, lips gently closed, eyebrows natural and both eyes open looking straight into the lens.",
    failLabel: "Rejected: Smiling or open mouth",
    failDetail: "Showing teeth, grinning, squinting, raised eyebrows or looking off-camera breaks biometric matching.",
  },
  {
    kind: "glasses",
    rule: "6. Eyeglasses & glare",
    passLabel: "Accepted: No glasses worn",
    passDetail: "Taking glasses off completely guarantees zero lens reflection, tint issues or frames crossing the eye line.",
    failLabel: "Rejected: Glare, tint or thick frames",
    failDetail: "White screen/flash reflections on lenses, photochromic tint or frames covering eyelids fail automated checks.",
  },
  {
    kind: "hair",
    rule: "7. Hair & religious headwear",
    passLabel: "Accepted: Full face unobstructed",
    passDetail: "Hair tucked behind ears/away from eyebrows; turbans or hijabs allowed for religious reasons if chin-to-forehead is clear.",
    failLabel: "Rejected: Hair over eyes or fashion hat",
    failDetail: "Bangs covering eyebrows/eyes, caps, sunglasses on the head or scarves casting a shadow across the forehead.",
  },
  {
    kind: "quality",
    rule: "8. Sharpness & digital editing",
    passLabel: "Accepted: Sharp continuous-tone photo",
    passDetail: "Crisp focus around eyelashes and iris, natural skin pores intact, exported as a clean high-quality JPEG.",
    failLabel: "Rejected: Filters, blur or WhatsApp compression",
    failDetail: "Portrait-mode background blur, AI beauty smoothing, pixelation or photographing an older printed ID photo.",
  },
];

function ExampleDiagram({ kind, valid }: { kind: VisualKind; valid: boolean }) {
  const bg = valid ? "#ffffff" : kind === "shadow" ? "#e5e7eb" : "#f9fafb";
  const borderColor = valid ? "border-lime-600/40" : "border-red-500/40";

  return (
    <div className={`relative overflow-hidden rounded-md border ${borderColor} bg-white`}>
      <svg viewBox="0 0 140 180" className="block w-full" aria-hidden>
        <rect width="140" height="180" fill={bg} />

        {/* Wall shadow behind head for rejected shadow */}
        {!valid && kind === "shadow" && (
          <g opacity="0.28">
            <ellipse cx="82" cy="78" rx="34" ry="42" fill="#111827" />
            <path d="M30 180 C30 132 126 132 126 180 Z" fill="#111827" />
          </g>
        )}

        {/* Framing transform */}
        <g
          transform={
            !valid && kind === "framing"
              ? "translate(28, 48) scale(0.6)"
              : !valid && kind === "tilt"
                ? "rotate(-11 70 90)"
                : undefined
          }
        >
          {/* Shoulders */}
          <path d="M24 180 C24 134 116 134 116 180 Z" fill="#374151" />
          {/* Neck */}
          <rect x="57" y="112" width="26" height="28" rx="8" fill="#e5b899" />
          {/* Ears */}
          <ellipse cx="38" cy="78" rx="5" ry="9" fill="#e5b899" />
          <ellipse cx="102" cy="78" rx="5" ry="9" fill="#e5b899" />
          {/* Head */}
          <ellipse cx="70" cy="76" rx="31" ry="41" fill="#f3cbb0" />
          {/* Lighting shadow across half face */}
          {!valid && kind === "lighting" && (
            <path d="M70 35 A31 41 0 0 1 70 117 L70 35 Z" fill="#111827" opacity="0.28" />
          )}
          {/* Hair */}
          <path d="M39 70 C39 36 101 36 101 70 C95 52 45 52 39 70 Z" fill="#1f2937" />
          {!valid && kind === "hair" && (
            <path d="M41 56 Q62 84 86 68 L96 54 Z" fill="#1f2937" />
          )}

          {/* Eyebrows */}
          <path d="M51 64 Q57 61 63 64" stroke="#1f2937" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M77 64 Q83 61 89 64" stroke="#1f2937" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Eyes */}
          <circle cx="57" cy="73" r="3" fill={!valid && kind === "lighting" ? "#dc2626" : "#111827"} />
          <circle cx="83" cy="73" r="3" fill={!valid && kind === "lighting" ? "#dc2626" : "#111827"} />

          {/* Glasses glare */}
          {!valid && kind === "glasses" && (
            <g>
              <rect x="45" y="65" width="22" height="15" rx="3" fill="#ffffff" fillOpacity="0.65" stroke="#111827" strokeWidth="2.5" />
              <rect x="73" y="65" width="22" height="15" rx="3" fill="#ffffff" fillOpacity="0.65" stroke="#111827" strokeWidth="2.5" />
              <line x1="67" y1="72" x2="73" y2="72" stroke="#111827" strokeWidth="2.5" />
              <line x1="48" y1="77" x2="62" y2="67" stroke="#ffffff" strokeWidth="3" />
              <line x1="76" y1="77" x2="90" y2="67" stroke="#ffffff" strokeWidth="3" />
            </g>
          )}

          {/* Nose */}
          <path d="M70 74 L68 87 L73 88" stroke="#c89678" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Mouth */}
          {!valid && kind === "expression" ? (
            <path d="M58 96 Q70 108 82 96 Z" fill="#ffffff" stroke="#991b1b" strokeWidth="2" />
          ) : (
            <path d="M61 98 Q70 100 79 98" stroke="#9f5a4a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          )}
        </g>

        {/* Pixelated / blurred overlay for quality failure */}
        {!valid && kind === "quality" && (
          <g opacity="0.22">
            <rect x="0" y="0" width="140" height="180" fill="#6b7280" />
            <line x1="0" y1="45" x2="140" y2="45" stroke="#ffffff" strokeWidth="1" />
            <line x1="0" y1="90" x2="140" y2="90" stroke="#ffffff" strokeWidth="1" />
            <line x1="0" y1="135" x2="140" y2="135" stroke="#ffffff" strokeWidth="1" />
          </g>
        )}

        {/* Ideal alignment guide on valid framing */}
        {valid && kind === "framing" && (
          <g stroke="#65a30d" strokeWidth="1" strokeDasharray="3 3">
            <line x1="15" y1="35" x2="125" y2="35" />
            <line x1="15" y1="117" x2="125" y2="117" />
          </g>
        )}
      </svg>
      <span
        className={`absolute top-2 left-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold ${
          valid ? "bg-lime-600 text-white" : "bg-red-600 text-white"
        }`}
      >
        {valid ? <CheckIcon className="size-3" /> : <XIcon className="size-3" />}
        {valid ? "Pass" : "Fail"}
      </span>
    </div>
  );
}

const faqs: Faq[] = [
  {
    q: "What is an ICAO standard photo?",
    a: "An ICAO standard photo is a biometric passport or visa photograph that follows International Civil Aviation Organization (ICAO) Document 9303. It specifies a front-facing, neutral portrait on a plain light background with strict head-to-frame proportions so border control software can verify your identity accurately.",
  },
  {
    q: "What does a real ICAO compliant photo look like?",
    a: "It shows a crisp, evenly lit colour portrait from the top of your shoulders to just above your hair, against a solid white or light neutral background. Your head is level, centred, takes up 70–80% of the vertical height (80–85% for India Passport Seva), mouth closed, eyes open, and free of shadows or glasses glare.",
  },
  {
    q: "Why do different countries call it ICAO foto, fototessera ICAO, or biyometrik fotoğraf?",
    a: "All of those terms refer to the same ICAO Doc 9303 biometric photo specification used globally for e-passports and visas, including Schengen, Italian (fototessera formato ICAO), Spanish (formato ICAO), Turkish (biyometrik fotoğraf), and Indian Passport Seva applications.",
  },
  {
    q: "Are minor smiles or tilted heads ever acceptable in an ICAO example?",
    a: "No. Automated ICAO validators reject visible teeth, open mouths, raised eyebrows, and even minor sideways head tilts because facial recognition measures fixed distances between your pupils, nose bridge, and mouth corners.",
  },
  {
    q: "Can I see if my own photo matches the acceptable example?",
    a: "Yes. Upload your photo to our free ICAO Photo Checker to see your exact head height, eye position, top margin, and background test results before paying anything.",
  },
];

export default function IcaoStandardPhotoExamplesPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "ICAO standard photo examples", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="ICAO guide · Visual examples"
        breadcrumb="ICAO standard photo examples"
        title="What is an ICAO standard photo? Acceptable vs rejected examples"
        description="See exact sample proportions, biometric framing lines, and side-by-side acceptable vs rejected photo examples under ICAO Doc 9303 so you know what passes before you upload."
        actions={
          <>
            <ButtonLink href="/icao-photo-checker" size="lg" className="w-full sm:w-auto">
              Check my photo free
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#examples" variant="secondary" size="lg" className="w-full sm:w-auto">
              See pass vs fail examples
            </ButtonLink>
          </>
        }
        aside={
          <figure className="mx-auto w-full max-w-sm">
            <Image
              src={sampleImage}
              alt="Sample acceptable ICAO standard passport photograph with neutral expression and plain white background"
              width={1254}
              height={1254}
              sizes="(min-width: 768px) 384px, 100vw"
              preload
              className="w-full rounded-lg border border-border bg-white shadow-sm"
            />
            <figcaption className="mt-3 text-sm text-gray-500">
              Acceptable ICAO standard photo sample: straight gaze, even light, plain white background.
            </figcaption>
          </figure>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <QuickAnswer title="What is ICAO standard for a photo?" icon={<ImageIcon className="size-5" />}>
          Set by the International Civil Aviation Organization in <strong>ICAO Doc 9303</strong>, an ICAO standard
          photo is a sharp, unfiltered colour portrait facing straight into the camera on a plain white or light
          background, with a neutral mouth-closed expression and the head occupying 70–85% of the frame height.
        </QuickAnswer>

        {/* Biometric framing diagram + specs */}
        <section className="mt-16 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="mx-auto w-full max-w-xs rounded-lg border border-border bg-white p-5">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              ICAO Doc 9303 Geometry (35 × 45 mm)
            </p>
            <svg viewBox="0 0 280 340" className="mt-4 w-full" role="img" aria-label="ICAO passport photo biometric dimensions diagram">
              {/* Frame */}
              <rect x="40" y="20" width="175" height="225" fill="#ffffff" stroke="#111827" strokeWidth="2" />
              {/* Centerline */}
              <line x1="127.5" y1="20" x2="127.5" y2="245" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 4" />
              {/* Crown & Chin lines */}
              <line x1="40" y1="44" x2="265" y2="44" stroke="#65a30d" strokeWidth="1.2" strokeDasharray="4 3" />
              <line x1="40" y1="208" x2="265" y2="208" stroke="#65a30d" strokeWidth="1.2" strokeDasharray="4 3" />
              {/* Eye band */}
              <rect x="40" y="102" width="175" height="28" fill="#84cc16" fillOpacity="0.14" />
              <line x1="40" y1="116" x2="215" y2="116" stroke="#4d7c0f" strokeWidth="1" strokeDasharray="3 3" />

              {/* Silhouette */}
              <path d="M72 245 C72 204 183 204 183 245 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5" />
              <ellipse cx="127.5" cy="126" rx="52" ry="70" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1.5" />
              <circle cx="107" cy="116" r="4" fill="#374151" />
              <circle cx="148" cy="116" r="4" fill="#374151" />
              <path d="M115 156 Q127.5 158 140 156" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Measurement annotations */}
              <line x1="252" y1="44" x2="252" y2="208" stroke="#4d7c0f" strokeWidth="1.5" />
              <text x="220" y="37" fontSize="11" fill="#4d7c0f" fontWeight="600">Top gap 2–4 mm</text>
              <text x="195" y="130" fontSize="11" fill="#4d7c0f" fontWeight="600">32–36 mm</text>
              <text x="195" y="144" fontSize="10" fill="#6b7280">(70–80%)</text>
              <text x="48" y="275" fontSize="12" fill="#111827" fontWeight="600">Width: 35 mm (630 px India)</text>
              <text x="48" y="294" fontSize="11" fill="#4b5563">Height: 45 mm (810 px India)</text>
              <text x="48" y="314" fontSize="11" fill="#4d7c0f">Green band: ideal eye-line zone</text>
            </svg>
          </div>

          <div>
            <h2 className={guideHeading}>Core ICAO photo specifications</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Every machine-readable passport uses these baseline numbers so border e-gates can align your eyes and
              measure facial landmarks accurately.
            </p>
            <div className="mt-6">
              <SpecList items={doc9303Specs} />
            </div>
          </div>
        </section>

        {/* Side-by-side acceptable vs rejected examples */}
        <section id="examples" className="mt-16 scroll-mt-24 border-t border-border pt-16">
          <h2 className={guideHeading}>Acceptable vs rejected ICAO photo examples</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Compare each rule side by side. Even if your background is white, failing any single check below causes a
            portal rejection.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {examples.map((ex) => (
              <article key={ex.kind} className="rounded-lg border border-border bg-white p-5 sm:p-6">
                <h3 className="text-base font-semibold text-black">{ex.rule}</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <ExampleDiagram kind={ex.kind} valid={true} />
                    <p className="mt-2.5 text-xs font-semibold text-lime-700">{ex.passLabel}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-600">{ex.passDetail}</p>
                  </div>
                  <div>
                    <ExampleDiagram kind={ex.kind} valid={false} />
                    <p className="mt-2.5 text-xs font-semibold text-red-700">{ex.failLabel}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-600">{ex.failDetail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-600">
            Taking a baby or toddler photo? Infants have separate exceptions for closed eyes and expressions — see our{" "}
            <Link href="/icao-guide/infant-and-baby-passport-photo" className="font-medium text-lime-700 hover:underline">
              acceptable vs rejected infant passport photo guide
            </Link>
            .
          </p>
        </section>

        <FaqSection faqs={faqs} title="ICAO photo standards & examples FAQ" />

        <GuideCta
          title="Test your own photo against ICAO examples"
          body="Upload your picture to check head height, eye line, background, and pixel dimensions for free before you pay."
          label="Check & fix my photo"
        />

        <RelatedLinks
          paths={[
            "/icao-compliant-passport-photo",
            "/icao-guide/convert-photo-to-icao-standard",
            "/icao-guide/take-icao-photo-at-home",
          ]}
        />
      </div>
    </>
  );
}

