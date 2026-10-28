import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { ArrowRightIcon, ImageIcon, LockIcon, ShieldIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, graph, organizationSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/contact",
  title: "Contact & Support",
  description:
    "Get help with ICAO Standard Photo: photo compliance questions, technical support, refunds and privacy requests. Email our support team.",
};

export const metadata = pageMetadata(page);

const { name, supportEmail, business } = siteConfig;

const topics = [
  {
    icon: ImageIcon,
    title: "Photo & technical support",
    body: "Questions about photo compliance, uploads or downloads.",
    subject: "Photo support",
  },
  {
    icon: ShieldIcon,
    title: "Refunds & guarantee",
    body: "Claims under our 100% money-back guarantee.",
    subject: "Refund request",
  },
  {
    icon: LockIcon,
    title: "Privacy & data requests",
    body: "Data deletion, GDPR and CCPA requests.",
    subject: "Privacy request",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ ...page, type: "ContactPage" }),
          organizationSchema(),
          breadcrumbSchema([{ name: page.title, path: page.path }]),
        )}
      />
      <PageHeader
        eyebrow="Support"
        breadcrumb={page.title}
        title="We're here to help"
        description="Have a question about your photo, an order or your data? Email our team and we'll get back to you as soon as we can."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* Email topics */}
          <section aria-labelledby="email-heading">
            <h2 id="email-heading" className="text-2xl font-semibold tracking-tight text-black">
              Email support
            </h2>
            <p className="mt-2 text-gray-600">Pick a topic to open a pre-filled email.</p>

            <ul className="mt-6 space-y-3">
              {topics.map((t) => (
                <li key={t.title}>
                  <a
                    href={`mailto:${supportEmail}?subject=${encodeURIComponent(t.subject)}`}
                    className="group flex items-center gap-4 rounded-lg border border-border bg-white p-4 transition-colors hover:border-lime-600/50 sm:p-5"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700 transition-colors group-hover:bg-lime-600 group-hover:text-white">
                      <t.icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-black">{t.title}</span>
                      <span className="mt-0.5 block text-sm text-gray-600">{t.body}</span>
                    </span>
                    <ArrowRightIcon className="size-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-lime-700" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg border border-border bg-gray-50 p-5">
              <p className="text-sm text-gray-600">Or write to us directly at</p>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-1 inline-block py-1 font-semibold break-all text-lime-700 underline underline-offset-4 hover:text-lime-600"
              >
                {supportEmail}
              </a>
            </div>
          </section>

          {/* Business info + tips */}
          <aside className="space-y-4">
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="font-semibold text-black">Business information</h2>
              <address className="mt-3 text-sm leading-6 text-gray-600 not-italic">
                {name}
                <br />
                {business.locality}, {business.region}
                <br />
                {business.country}
              </address>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="font-semibold text-black">Help us help you faster</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                <li>Include the email you used to pay, or your transaction ID.</li>
                <li>For refunds, attach the rejection notice from the agency.</li>
                <li>Tell us which country and document the photo is for.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="font-semibold text-black">Quick answers</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Many questions are answered in our{" "}
                <Link href="/#faq" className="font-medium text-lime-700 underline underline-offset-4">
                  FAQ
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>

        <RelatedLinks paths={["/refund-policy", "/privacy-policy", "/about"]} title="You might also find these helpful" />
      </div>
    </>
  );
}
