import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon, SparkIcon } from "@/components/ui/icons";
import { getPlanPricing } from "@/lib/config/pricing";

/** Building blocks shared by the ICAO guide pages */

export type Faq = { q: string; a: string };

export const guideHeading = "text-2xl font-semibold tracking-tight text-black sm:text-3xl";

export function QuickAnswer({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex gap-4 rounded-lg border border-border bg-white p-5 sm:p-6">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
        {icon ?? <CheckIcon className="size-5" />}
      </span>
      <div>
        <h2 className="font-semibold text-black">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-gray-700">{children}</p>
      </div>
    </section>
  );
}

export function SpecList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="divide-y divide-border rounded-lg border border-border bg-white">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between gap-4 px-5 py-3 text-sm">
          <dt className="text-gray-600">{item.label}</dt>
          <dd className="text-right font-semibold text-black">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function NumberedSteps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
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
  );
}

export function FaqSection({ faqs, title = "Frequently asked questions" }: { faqs: Faq[]; title?: string }) {
  return (
    <section id="faq" className="mt-16 scroll-mt-24 border-t border-border pt-16">
      <h2 className={guideHeading}>{title}</h2>
      <dl className="mt-8 divide-y divide-border rounded-lg border border-border bg-white">
        {faqs.map((f) => (
          <div key={f.q} className="p-5 sm:p-6">
            <dt className="font-semibold text-black">{f.q}</dt>
            <dd className="mt-2 text-sm leading-6 text-gray-600">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Plan prices for visitors in India, read from the same config checkout charges */
export const indiaPlans = [getPlanPricing("standard", "INR"), getPlanPricing("expert_edit", "INR")];

export function IndiaPricing() {
  const usd = getPlanPricing("standard").amountFormatted;

  return (
    <section id="pricing" className="mt-16 scroll-mt-24 border-t border-border pt-16">
      <h2 className={guideHeading}>Passport photo price in India</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
        Upload and check your photo for free, then pay once when you download. There is no subscription.
      </p>
      <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
        {indiaPlans.map((p) => {
          const expert = p.planType === "expert_edit";
          return (
            <div key={p.planType} className="flex flex-col rounded-lg border border-border bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold text-black">
                  {p.title}
                  {expert && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-lime-600/10 px-2 py-0.5 text-xs font-semibold text-lime-700">
                      <SparkIcon className="size-3" />
                      Human review
                    </span>
                  )}
                </h3>
                <p className="text-2xl font-semibold tracking-tight text-black">{p.amountFormatted}</p>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm leading-6 text-gray-700">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-lime-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-gray-500">
        These prices apply to visitors in India. Applying from abroad? You pay in your local currency, from {usd}.
      </p>
    </section>
  );
}

export function GuideCta({ title, body, label }: { title: string; body: string; label: string }) {
  return (
    <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-gray-50 p-6 sm:flex-row sm:items-center sm:p-8">
      <div>
        <h2 className="text-xl font-semibold text-black">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{body}</p>
      </div>
      <ButtonLink href="/icao-photo-tool" size="lg" className="w-full shrink-0 sm:w-auto">
        {label}
        <ArrowRightIcon className="size-4" />
      </ButtonLink>
    </section>
  );
}
