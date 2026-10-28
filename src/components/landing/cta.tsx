import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative overflow-hidden rounded-lg bg-lime-700 px-5 py-12 text-center sm:px-12 sm:py-16 md:py-20">
        <div
          className="bg-grid fade-edges pointer-events-none absolute inset-0 opacity-20 [--grid-line:var(--white)]"
          aria-hidden
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            Get your ICAO compliant passport photo today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/80">
            Skip the photo booth. Create an ICAO compliant photo from home in under 5 minutes for $
            {siteConfig.pricing.price}, backed by our money-back guarantee.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/#start" size="lg" variant="inverse">
              Create your photo
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink
              href="/#requirements"
              size="lg"
              variant="inverse-outline"
            >
              Check requirements
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
