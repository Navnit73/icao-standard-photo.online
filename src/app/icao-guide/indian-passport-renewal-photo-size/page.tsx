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
  path: "/icao-guide/indian-passport-renewal-photo-size",
  title: "Indian Passport Renewal Photo Size: 630×810 px vs 2×2 Inch",
  description:
    "Exact Indian passport renewal photo size in px, cm, mm, and inches for India, BLS Canada, VFS USA, UK, UAE, and Australia — including Passport Seva 630 × 810 px rules.",
};

export const metadata = pageMetadata(page);

const [standard] = indiaPlans;
const { pricing } = siteConfig;

const keySpecs = [
  { label: "Online upload (Passport Seva)", value: "630 × 810 px (3.5 × 4.5 cm)" },
  { label: "File format & size", value: "JPEG, 10–250 KB" },
  { label: "BLS Canada / VFS USA print", value: "2 × 2 in (5.1 × 5.1 cm)" },
  { label: "Face coverage", value: "80–85% of frame" },
  { label: "Background", value: "Plain white, no shadows" },
  { label: "Photo recency", value: "Taken within last 6 months" },
];

const channels = [
  {
    region: "Applying in India (PSK / POPSK)",
    onlineUpload: "Not required",
    physicalPrint: "Not required for normal applications",
    note: "An officer captures your digital ICAO photo live at the Passport Seva Kendra counter. Dress in a dark top and remove glasses on appointment day.",
  },
  {
    region: "Canada Renewal (BLS International)",
    onlineUpload: "630 × 810 px JPEG (≤ 250 KB)",
    physicalPrint: "2 × 2 in (51 × 51 mm) white background",
    note: "Do NOT submit Canadian 50 × 70 mm passport prints. Upload 630 × 810 px on Global Passport Seva 2.0 and attach 2 × 2 in prints to your BLS packet.",
  },
  {
    region: "USA Renewal (VFS Global)",
    onlineUpload: "630 × 810 px JPEG (≤ 250 KB)",
    physicalPrint: "2 × 2 in (51 × 51 mm) white background",
    note: "VFS USA checklists ask for 2 × 2 in prints pasted on the physical form, while the Global Passport Seva 2.0 portal strictly validates 630 × 810 px online.",
  },
  {
    region: "UK, Europe, UAE, Australia & Singapore",
    onlineUpload: "630 × 810 px JPEG (≤ 250 KB)",
    physicalPrint: "35 × 45 mm or 2 × 2 in (per mission checklist)",
    note: "All Indian embassies and consulates switched to Global Passport Seva 2.0, requiring 630 × 810 px online. Verify your local mission/VFS centre print size before printing.",
  },
  {
    region: "OCI Card / Indian e-Visa (for comparison)",
    onlineUpload: "Square 1:1 (min 200 × 200 px / 350 × 350 px)",
    physicalPrint: "2 × 2 in (51 × 51 mm)",
    note: "OCI and e-Visa portals still use square photos, which is why many outdated blogs wrongly tell passport renewal applicants to upload a square file.",
  },
];

const renewalRules = [
  {
    title: "Recent photo (do not reuse your old passport photo)",
    body: "Your renewal photo must be taken within the last 6 months and reflect your current appearance. Reusing the picture from an old passport or visa leads to rejection.",
  },
  {
    title: "Appearance changes (beard, hair, age)",
    body: "If you grew or shaved a beard, changed hair significantly, or are renewing a minor's passport after 5 years, your new photo must clearly match how you look today.",
  },
  {
    title: "Same strict ICAO rules for minors & seniors",
    body: "Minor renewals require the same 630 × 810 px online upload and plain white background. No parents or toys may appear in the frame.",
  },
  {
    title: "No glasses, filters or white shirts",
    body: "Remove eyeglasses completely to prevent glare rejections, wear a darker solid top so your shoulders stand out from the white wall, and disable phone beauty modes.",
  },
];

const unitConversions = [
  { label: "Passport Seva digital upload (px)", value: "630 × 810 px" },
  { label: "Passport Seva equivalent (mm / cm)", value: "35 × 45 mm (3.5 × 4.5 cm)" },
  { label: "Passport Seva equivalent (inches)", value: "1.38 × 1.77 in (7:9 ratio)" },
  { label: "VFS / BLS physical print (inches)", value: "2 × 2 in (1:1 square)" },
  { label: "VFS / BLS physical print (mm / cm)", value: "51 × 51 mm (5.1 × 5.1 cm)" },
];

const steps = [
  {
    title: "Take one clean, high-resolution portrait",
    body: "Stand 50 cm in front of a plain wall facing a daylight window, with the rear phone camera 1.2–1.5 m away at eye level.",
  },
  {
    title: "Generate the 630 × 810 px upload first",
    body: "Select India in our ICAO Photo Tool to automatically whiten the background, position your face at 80–85%, and export the exact 630 × 810 px JPEG under 250 KB for Passport Seva.",
  },
  {
    title: "Prepare matching 2 × 2 in (or 35 × 45 mm) prints if applying abroad",
    body: "If BLS Canada or VFS requires physical photos in your postal/walk-in packet, download a US/2 × 2 in print sheet (or 35 × 45 mm sheet if requested by your embassy) from the same master photo.",
  },
  {
    title: "Upload on desktop Chrome",
    body: "Submit the 630 × 810 px file from a laptop or desktop browser to avoid mobile-device detection upload errors.",
  },
];

const faqs: Faq[] = [
  {
    q: "What is the Indian passport renewal photo size in cm and pixels?",
    a: "For online submission on Global Passport Seva 2.0, the digital photo must be exactly 630 × 810 pixels (matching a 3.5 × 4.5 cm or 35 × 45 mm portrait ratio) in JPEG format under 250 KB. Physical prints for BLS Canada or VFS USA application packets are usually 2 × 2 inches (5.1 × 5.1 cm).",
  },
  {
    q: "What photo size is required for Indian passport renewal in Canada (BLS)?",
    a: "You need two sizes from the same recent photo: upload a 630 × 810 px JPEG (≤ 250 KB) on the Passport Seva online portal, and attach 2 × 2 inch (51 × 51 mm) printed photos with a plain white background to your BLS Canada application form. Do not use the 50 × 70 mm Canadian passport size.",
  },
  {
    q: "Do I need to upload a photo when renewing my Indian passport inside India?",
    a: "No. If you apply at a Passport Seva Kendra (PSK) or Post Office PSK inside India, the counter officer captures your biometric photo live during your appointment. Online photo upload is for Indian missions and consulates abroad.",
  },
  {
    q: "Why does Passport Seva reject a 2 × 2 inch square photo during renewal?",
    a: "Since late 2025, Global Passport Seva 2.0 enforces a 7:9 vertical rectangle of exactly 630 × 810 px for digital uploads. Square 2 × 2 inch (e.g., 600 × 600 px) files are still used for physical VFS/BLS forms and OCI applications, but fail the online passport portal upload.",
  },
  {
    q: "Can I use the same photo from my previous Indian passport?",
    a: "No. Your renewal photo must have been taken within the last 6 months and must reflect your current appearance.",
  },
];

export default function IndianPassportRenewalPhotoSizePage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema(page),
          organizationSchema(),
          breadcrumbSchema([{ name: "Indian passport renewal photo size", path: page.path }]),
          faqSchema(page.path, faqs),
        )}
      />
      <PageHeader
        eyebrow="ICAO guide · India renewal"
        breadcrumb="Indian passport renewal photo size"
        title="Indian passport renewal photo size: 630 × 810 px vs 2 × 2 inch"
        description="Renewing an Indian passport in India, Canada, the US, UK or UAE? Avoid the #1 photo mismatch: see when you need 630 × 810 px (3.5 × 4.5 cm) online versus 2 × 2 inch (5.1 × 5.1 cm) physical prints."
        actions={
          <>
            <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
              Make renewal photo
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#by-country" variant="secondary" size="lg" className="w-full sm:w-auto">
              See size by country
            </ButtonLink>
          </>
        }
        aside={
          <div>
            <p className="mb-3 text-sm font-semibold text-black">Indian renewal photo specs</p>
            <SpecList items={keySpecs} />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <QuickAnswer title="The short answer" icon={<AlertIcon className="size-5" />}>
          For Indian passport renewals <strong>outside India</strong>, the Global Passport Seva 2.0 portal requires a{" "}
          <strong>630 × 810 px</strong> JPEG (under 250 KB) online, while VFS (USA) and BLS (Canada) checklists still
          ask for <strong>2 × 2 inch (51 × 51 mm)</strong> printed photos in your physical packet. Inside India, PSK
          officers take your photo live at your appointment.
        </QuickAnswer>

        {/* By country / channel */}
        <section id="by-country" className="mt-16 scroll-mt-24">
          <h2 className={guideHeading}>Renewal photo size by country and submission channel</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Online portals and physical application centres use different dimensions. Check your exact renewal route
            below so you do not upload a square photo to Passport Seva or bring a 50 × 70 mm print to BLS Canada.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-border bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Application route</th>
                  <th className="px-5 py-3.5 font-semibold">Online portal upload</th>
                  <th className="px-5 py-3.5 font-semibold">Physical print</th>
                  <th className="px-5 py-3.5 font-semibold">Important rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {channels.map((row) => (
                  <tr key={row.region}>
                    <td className="px-5 py-4 font-semibold text-black">{row.region}</td>
                    <td className="px-5 py-4 text-gray-700">{row.onlineUpload}</td>
                    <td className="px-5 py-4 text-gray-700">{row.physicalPrint}</td>
                    <td className="px-5 py-4 text-gray-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dimensions in cm / mm / px */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className={guideHeading}>Dimensions in px, cm, mm and inches</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Many applicants search for Indian passport photo dimensions in centimetres or inches before printing.
              Use this exact conversion table.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-gray-50 p-4 text-sm text-gray-700">
              <XIcon className="mt-0.5 size-4 shrink-0 text-red-600" />
              <p>
                <strong>Common Canada trap:</strong> Pharmacies in Canada default to 50 × 70 mm (Canadian passport
                size). BLS India in Canada rejects 50 × 70 mm prints — always request{" "}
                <strong>2 × 2 inches (51 × 51 mm)</strong> for the paper form and <strong>630 × 810 px</strong> for
                the online upload.
              </p>
            </div>
          </div>
          <SpecList items={unitConversions} />
        </section>

        {/* Renewal rules */}
        <section className="mt-16 border-t border-border pt-16">
          <h2 className={guideHeading}>Photo rules specific to Indian passport renewals</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {renewalRules.map((rule) => (
              <div key={rule.title} className="rounded-lg border border-border bg-white p-5 sm:p-6">
                <h3 className="flex items-start gap-2.5 font-semibold text-black">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                  {rule.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{rule.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Need the full list of appearance rules? See{" "}
            <Link href="/icao-guide/indian-passport-photo-requirements" className="font-medium text-lime-700 hover:underline">
              Indian passport photo requirements (2026)
            </Link>{" "}
            or{" "}
            <Link href="/icao-guide/infant-and-baby-passport-photo" className="font-medium text-lime-700 hover:underline">
              minor &amp; infant passport photo rules
            </Link>
            .
          </p>
        </section>

        {/* Steps */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className={guideHeading}>How to get both digital and print renewal photos</h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Start with one sharp photo at home so your digital Passport Seva upload and physical VFS/BLS prints match
              each other identically.
            </p>
          </div>
          <NumberedSteps steps={steps} />
        </section>

        <IndiaPricing />

        <FaqSection faqs={faqs} title="Indian passport renewal photo FAQ" />

        <GuideCta
          title="Get a 630 × 810 px renewal photo that passes Passport Seva"
          body={`Check head height, white background and file size for free. Pay ${standard.amountFormatted} (India) or $${pricing.price} only when you download.`}
          label="Make renewal photo"
        />

        <RelatedLinks
          paths={[
            "/icao-guide/indian-passport-photo-requirements",
            "/icao-guide/passport-seva-icao-check-errors",
            "/icao-guide/convert-photo-to-icao-standard",
          ]}
        />
      </div>
    </>
  );
}

