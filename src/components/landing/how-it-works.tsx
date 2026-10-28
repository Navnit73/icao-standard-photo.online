import { DownloadIcon, SparkIcon, UploadIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

const steps = [
  {
    icon: UploadIcon,
    title: "Take your ICAO photo at home",
    body: "Stand 1–2 m from a plain wall, face a window and ask someone to shoot at eye level. Any recent phone photo works.",
    meta: "JPG, PNG or HEIC",
  },
  {
    icon: SparkIcon,
    title: "We apply photo ICAO standards",
    body: "We remove the background, crop to your country's size and check head height, eye position, lighting and expression.",
    meta: "6 compliance checks",
  },
  {
    icon: DownloadIcon,
    title: "Pay, download and print",
    body: `Pay $${siteConfig.pricing.price} once and get a digital ICAO standard photograph for online forms, plus a 4×6 in sheet for any photo lab.`,
    meta: "Digital file + print sheet",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 md:py-32">
      <SectionHeading
        eyebrow="How it works"
        title="How to get an ICAO compliant photo in 3 steps"
        body="All you need is a phone, a plain wall and good light. Our tool handles everything else."
      />

      <ol className="relative mt-10 grid gap-8 sm:mt-16 md:grid-cols-3">
        {/* Horizontal connector between steps on desktop */}
        <div className="absolute top-6 right-[16%] left-[16%] hidden border-t border-dashed border-gray-300 md:block" aria-hidden />

        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
            {/* Vertical connector on mobile */}
            {i < steps.length - 1 && (
              <span
                className="absolute top-14 -bottom-6 left-6 border-l border-dashed border-gray-300 md:hidden"
                aria-hidden
              />
            )}

            <span className="relative flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-lime-700 shadow-sm">
              <step.icon className="size-5" />
              <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-md bg-black font-mono text-[10px] font-semibold text-white">
                {i + 1}
              </span>
            </span>

            <div className="md:flex md:flex-col md:items-center">
              <h3 className="pt-1 text-lg font-semibold text-black md:mt-6 md:pt-0">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-gray-600 md:mt-2 md:max-w-xs">{step.body}</p>
              <p className="mt-3 inline-block rounded-md bg-gray-50 px-2.5 py-1 font-mono text-xs text-gray-500 md:mt-4">
                {step.meta}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
