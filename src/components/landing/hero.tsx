import Image from "next/image";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

const highlights = ["Checked before download", "Money\u2011back guarantee", "Photos auto\u2011deleted"];

const stats = [
  { value: "ICAO 9303", label: "Standard we follow" },
  { value: "6 checks", label: "On every photo" },
  { value: "600 dpi", label: "Print-ready output" },
  { value: "< 5 min", label: "From upload to download" },
];

export function Hero() {
  return (
    <section id="start" className="relative overflow-hidden border-b border-border">
      <BackgroundBeamsWithCollision>
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-12 sm:gap-14 sm:px-6 sm:pt-16 sm:pb-20 md:pt-24 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
          <div className="text-center lg:text-left">
            <a
              href="#requirements"
              className="group inline-flex items-center gap-2 rounded-lg border border-border bg-white py-1.5 pr-3 pl-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300"
            >
              <span className="rounded-md bg-lime-600 px-2 py-0.5 font-semibold text-white">ICAO</span>
              Built on official photo ICAO standards
              <ArrowRightIcon className="size-3.5 text-gray-400 transition-transform group-hover:translate-x-0.5" />
            </a>

            <h1 className="mt-7 text-3xl leading-[1.1] font-semibold tracking-tight text-balance text-black sm:text-4xl md:text-5xl lg:text-4xl">
              Get an <span className="text-lime-700">ICAO standard photograph</span> online in minutes
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-pretty sm:mt-6 sm:text-base sm:leading-7 text-gray-500 lg:mx-0">
              Upload a selfie or portrait and our ICAO standards photo converter turns it into an ICAO compliant photo for your
              passport, visa or ID card. We fix the background, size and framing, then check every detail before
              you download.
            </p>

            <div id="hero-actions" className="mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row lg:justify-start">
              <ButtonLink href="/#start" size="lg">
                Create your photo
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink href="/#how-it-works" size="lg" variant="secondary">
                How it works
              </ButtonLink>
            </div>

            <ul className="mt-6 grid grid-cols-3 gap-2 text-xs leading-tight text-gray-600 sm:mt-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-6 sm:text-sm lg:justify-start">
              {highlights.map((t) => (
                <li key={t} className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2 sm:text-left">
                  <CheckIcon className="size-4 text-lime-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Crop the image's empty margins so the mockup fills the column */}
          <div className="relative -mx-4 aspect-[1080/740] overflow-hidden sm:mx-auto sm:w-full sm:max-w-2xl">
            <Image
              src="https://res.cloudinary.com/ddxu2wqfm/image/upload/v1793177051/ICAO_Passport_Photo_Checker_t99e98.png"
              alt="Passport photo with ICAO guide lines, all six compliance checks passed and a print sheet ready"
              width={1536}
              height={1024}
              sizes="(min-width: 1024px) 960px, 140vw"
              preload
              className="absolute top-[-16%] left-[-31.5%] w-[142%] max-w-none brightness-[1.02] mix-blend-multiply"
            />
          </div>
        </div>
      </BackgroundBeamsWithCollision>

      {/* Stats */}
      <div className="relative border-t border-border bg-white">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col px-2 py-5 text-center sm:py-6 md:py-8 ${i % 2 === 1 ? "border-l border-border" : ""} ${i > 1 ? "border-t border-border md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
            >
              <dt className="order-last mt-1 text-xs text-gray-500 sm:text-sm">{s.label}</dt>
              <dd className="font-mono text-lg font-semibold tracking-tight text-black sm:text-xl md:text-2xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
