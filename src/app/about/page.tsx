import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon, CheckIcon, LockIcon, ShieldIcon, SparkIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/about",
  title: "About Us",
  description:
    "ICAO Standard Photo helps travellers create compliant passport and visa photos at home, with automated ICAO checks and privacy-first processing.",
};

export const metadata = pageMetadata(page);

const { name, privacy } = siteConfig;

const privacyPoints = [
  {
    title: "No permanent storage",
    body: `All uploaded photos are permanently deleted from our servers within ${privacy.deleteAfterHours} hours.`,
  },
  { title: "No model training", body: "We never use your face or personal photos to train any models." },
  { title: "Secure downloads", body: "Processed photos are delivered through secure links that expire automatically." },
  { title: "GDPR and CCPA aligned", body: "We follow global privacy regulations and never sell your personal data." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ ...page, type: "AboutPage" }),
          organizationSchema(),
          breadcrumbSchema([{ name: page.title, path: page.path }]),
        )}
      />
      <PageHeader
        eyebrow="About"
        breadcrumb={page.title}
        title="Making official photos simple and stress-free"
        description={`Our mission is to take the stress and uncertainty out of government photo requirements. ${name} gives you a fast, secure way to check and create passport and visa photos from home.`}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Who we are */}
        <section className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">Who we are</h2>
          <div className="space-y-4 text-base leading-7 text-gray-700">
            <p>
              Getting a compliant passport or visa photo shouldn&rsquo;t mean wasting time and money at a pharmacy or
              photo studio. Every year, a huge number of official applications are delayed because a photo had a faint
              shadow, the wrong head size or a background that wasn&rsquo;t quite white.
            </p>
            <p>
              We are technologists and frequent travellers who built {name} to fix exactly that. Our platform checks
              your photo against the technical standards immigration agencies use worldwide, including the ICAO 9303
              specification, the U.S. Department of State and HM Passport Office.
            </p>
          </div>
        </section>

        {/* Technology */}
        <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">Our technology</h2>
          <div className="space-y-6">
            <p className="text-base leading-7 text-gray-700">
              Our compliance engine runs a series of biometric checks in seconds. It measures your eye line and head
              height, detects problems like glasses glare or uneven lighting, and replaces messy backgrounds with a
              clean, pure white one.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: SparkIcon, title: "Automated checks", body: "Head size, eye line, lighting, expression and more." },
                { icon: ShieldIcon, title: "Up-to-date rules", body: "Requirements for passports, visas and ID cards in 50+ countries." },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-white p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-black">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="mt-16 rounded-lg bg-black p-6 text-white sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-lime-600">
              <LockIcon className="size-5" />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Our commitment to privacy</h2>
          </div>
          <p className="mt-4 max-w-2xl text-gray-400">
            Identity photos are sensitive. We built {name} with a privacy-first architecture.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {privacyPoints.map((p) => (
              <li key={p.title} className="flex gap-3 rounded-lg border border-gray-800 bg-gray-900 p-5">
                <CheckIcon className="mt-0.5 size-4 text-lime-600" />
                <span>
                  <span className="block font-semibold">{p.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-gray-400">{p.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/data-security"
            className="mt-8 inline-flex items-center gap-2 py-2 text-sm font-semibold text-lime-600 hover:text-white"
          >
            How we protect your data <ArrowRightIcon className="size-4" />
          </Link>
        </section>

        {/* CTA */}
        <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-gray-50 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-semibold text-black">Ready for a compliant photo?</h2>
            <p className="mt-1 text-sm text-gray-600">Upload a photo and get it checked in minutes.</p>
          </div>
          <ButtonLink href="/icao-photo-tool" size="lg" className="w-full sm:w-auto">
            Create your photo
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        </section>

        <RelatedLinks paths={["/contact", "/data-security", "/privacy-policy"]} />
      </div>
    </>
  );
}
