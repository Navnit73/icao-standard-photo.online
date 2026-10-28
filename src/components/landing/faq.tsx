import { siteConfig } from "@/config/site";
import { PlusIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";

const { pricing, refund } = siteConfig;

export const faqs = [
  {
    q: "What is an ICAO standard photograph?",
    a: "An ICAO standard photograph is a passport-style portrait that follows Doc 9303 from the International Civil Aviation Organization. These photo ICAO standards set the size, framing, background, lighting and expression rules that most countries use for passports and visas.",
  },
  {
    q: "What are the ICAO photo requirements?",
    a: "In most countries, an ICAO standard photograph is a recent colour photo, 35×45 mm, with the head 32–36 mm tall from chin to crown. It needs a plain light background, even lighting, a neutral expression and open eyes. The US uses 2×2 in instead. We follow the ICAO guidelines for passport photographs and each country's own rules.",
  },
  {
    q: "Is an ICAO standard photo the same as a passport photo?",
    a: "Almost. Most passport offices start from the ICAO standard photo format, then add local rules such as size or background colour. Choose your document and we apply both.",
  },
  {
    q: "Can I get an ICAO standards photo online free?",
    a: `Many sites offer an ICAO standards photo online free, but many of them only crop the image and skip the compliance check, which leads to rejections. Our ICAO standards photo converter costs $${pricing.price} once, checks your photo against photo ICAO standards and comes with a money-back guarantee.`,
  },
  {
    q: "What if a passport office rejects my photo?",
    a: `If a government agency rejects your ICAO compliant passport photo, we refund 100% of what you paid. Contact us within ${refund.claimDays} days of purchase with the rejection notice. Our check also flags issues like shadows or a tilted head before you download, so you get an ICAO compliant photo the first time.`,
  },
  {
    q: "Can I take an ICAO photo with my phone?",
    a: "Yes. Any modern phone camera produces a sharp enough image for an official passport photo. Stand 1–2 m from a plain wall, face a window for soft light and keep the camera at eye level.",
  },
  {
    q: "Which countries do you support?",
    a: "We create an ICAO compliant photo for passports, visas and ID cards in the US, UK, Schengen area, India, Canada, Australia and most other countries that follow ICAO rules.",
  },
  {
    q: "How do I print my ICAO passport photo?",
    a: "Download the 4×6 in print sheet and print it at any pharmacy or photo lab. Then cut out each photo along the guide lines.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-border bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:gap-12 sm:py-24 md:py-32 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="ICAO photo questions, answered"
            body="Can't find what you're looking for? Our team usually replies within a day."
          />
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="mt-4 inline-flex py-2 text-sm font-semibold text-lime-700 underline-offset-4 hover:underline"
          >
            Contact support →
          </a>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group px-5 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium text-black [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border text-gray-500 transition-all group-open:rotate-45 group-open:border-lime-600 group-open:bg-lime-600 group-open:text-white">
                  <PlusIcon className="size-4" />
                </span>
              </summary>
              <p className="pr-10 pb-5 text-sm leading-6 text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
