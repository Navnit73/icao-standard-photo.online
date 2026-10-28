import { siteConfig } from "@/config/site";
import { PlusIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  {
    q: "What is an ICAO standard photo?",
    a: "ICAO (International Civil Aviation Organization) Document 9303 sets the rules most countries use for passport and travel document photos, covering size, framing, background, lighting and expression.",
  },
  {
    q: "Can I take the photo with my phone?",
    a: "Yes. Stand about 1–2 m from a plain wall, face a window for soft light, and ask someone to take the photo at eye level. We handle the crop and background.",
  },
  {
    q: "Which countries are supported?",
    a: "We support passport, visa and ID photo sizes for most countries that follow ICAO guidelines, including the US, UK, Schengen area, India, Canada and Australia.",
  },
  {
    q: "What if my photo does not pass the check?",
    a: "We tell you exactly what to fix, such as tilting your head or removing glasses, so you can retake it straight away.",
  },
  {
    q: "How do I print my photos?",
    a: "Download the 4×6 in print sheet and print it at any pharmacy or photo lab. Then cut out the photos along the guide lines.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-border bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Common questions"
            body="Can't find what you're looking for? Our team usually replies within a day."
          />
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="mt-6 inline-flex text-sm font-semibold text-lime-700 underline-offset-4 hover:underline"
          >
            Contact support →
          </a>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6">
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
