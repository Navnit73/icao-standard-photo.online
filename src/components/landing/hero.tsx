import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { PhotoCheckCard } from "./photo-check-card";

const highlights = ["Checked before download", "Ready in minutes", "Photos auto-deleted"];

const stats = [
  { value: "ICAO 9303", label: "Standard we follow" },
  { value: "6 checks", label: "On every photo" },
  { value: "600 dpi", label: "Print-ready output" },
  { value: "< 5 min", label: "From upload to download" },
];

export function Hero() {
  return (
    <section id="start" className="relative overflow-hidden border-b border-border">
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 md:pt-24 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <a
            href="#requirements"
            className="group inline-flex items-center gap-2 rounded-lg border border-border bg-white py-1 pr-3 pl-1 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300"
          >
            <span className="rounded-md bg-lime-600 px-2 py-0.5 font-semibold text-white">ICAO</span>
            Built on the official photo standard
            <ArrowRightIcon className="size-3.5 text-gray-400 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h1 className="mt-7 text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-black sm:text-5xl lg:text-6xl">
            Passport photos, <span className="text-lime-700">done right</span> the first time
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-pretty text-gray-600 lg:mx-0">
            Upload a photo from your phone. We fix the background, size and framing so it meets official
            requirements. No studio visit needed.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <ButtonLink href="/#start" size="lg">
              Create your photo
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="/#how-it-works" size="lg" variant="secondary">
              How it works
            </ButtonLink>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600 lg:justify-start">
            {highlights.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="size-4 text-lime-600" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <PhotoCheckCard />
      </div>

      {/* Stats */}
      <div className="relative border-t border-border bg-white">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col px-2 py-6 text-center md:py-8 ${i % 2 === 1 ? "border-l border-border" : ""} ${i > 1 ? "border-t border-border md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
            >
              <dt className="order-last mt-1 text-sm text-gray-500">{s.label}</dt>
              <dd className="font-mono text-xl font-semibold tracking-tight text-black md:text-2xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
