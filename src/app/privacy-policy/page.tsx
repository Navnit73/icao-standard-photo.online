import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Callout, LegalDocument, List, MailLink, type LegalSection } from "@/components/legal-document";
import { PageHeader } from "@/components/page-header";
import { formatDate, siteConfig } from "@/config/site";
import { breadcrumbSchema, graph, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/privacy-policy",
  title: "Privacy Policy",
  description:
    "How ICAO Standard Photo collects, uses and protects your photos and personal data, including 24-hour auto-deletion and your GDPR and CCPA rights.",
};

export const metadata = pageMetadata(page);

const { name, supportEmail, business, privacy } = siteConfig;

const sections: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    content: (
      <p>
        {name} (&ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This
        Privacy Policy explains how we collect, use and protect your information when you use our photo validation and
        processing service at {siteConfig.url.replace("https://", "")}.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <>
        <h3 className="font-semibold text-black">Photos you upload</h3>
        <List
          items={[
            "Photos are uploaded solely for validation and processing.",
            "We analyse photos for compliance with official government specifications, including the US, UK, India and the Schengen area.",
            "Photos are never used for AI training, marketing or any other purpose.",
          ]}
        />
        <h3 className="pt-2 font-semibold text-black">Payment information</h3>
        <List
          items={[
            "Payments are handled by our third-party payment processor.",
            "We never store card numbers or full payment details on our servers.",
            "We receive only a transaction confirmation and payment status.",
          ]}
        />
        <h3 className="pt-2 font-semibold text-black">Usage data</h3>
        <List
          items={[
            "Browser type, device type and operating system.",
            "Pages visited and features used, in anonymised form.",
            "IP address, used only for security and fraud prevention.",
          ]}
        />
      </>
    ),
  },
  {
    id: "photo-handling",
    title: "Photo handling and retention",
    content: (
      <>
        <p>Our photo privacy commitments:</p>
        <List
          items={[
            <>
              <strong className="text-black">Auto-deletion:</strong> all uploaded photos are permanently deleted after{" "}
              {privacy.deleteAfterHours} hours.
            </>,
            <>
              <strong className="text-black">Expiring links:</strong> download links are signed and expire after{" "}
              {privacy.linkExpiryMinutes} minutes.
            </>,
            <>
              <strong className="text-black">No permanent storage:</strong> processed images are not kept after download.
            </>,
            <>
              <strong className="text-black">No sharing:</strong> photos are never shared with third parties.
            </>,
            <>
              <strong className="text-black">No AI training:</strong> photos are never used for machine learning.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <p>
        We use essential cookies to keep your session working while your photo is processed. We may also use analytics
        cookies to understand how the service is used. You can turn off non-essential cookies in your browser settings.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights under GDPR and CCPA",
    content: (
      <>
        <p>
          We comply with the General Data Protection Regulation (GDPR) for EU residents and the California Consumer Privacy
          Act (CCPA) for California residents. You have the right to:
        </p>
        <List
          items={[
            <><strong className="text-black">Access</strong> a copy of the personal data we hold about you.</>,
            <><strong className="text-black">Delete</strong> all of your data immediately and completely.</>,
            <><strong className="text-black">Port</strong> your data in a machine-readable format.</>,
            <><strong className="text-black">Object</strong> to any processing of your personal data.</>,
            <><strong className="text-black">Correct</strong> inaccurate personal data.</>,
          ]}
        />
        <p>
          To use any of these rights, email <MailLink email={supportEmail} />.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data security",
    content: (
      <p>
        We use industry-standard safeguards, including encrypted connections (TLS), secure cloud infrastructure and
        access controls. Photo transfers are encrypted in transit and at rest. Read more on our{" "}
        <Link href="/data-security" className="font-medium text-lime-700 underline underline-offset-4">
          data security page
        </Link>
        .
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    content: (
      <p>
        Some providers process limited data on our behalf: payment processors (for transactions), cloud hosting
        providers (for photo processing) and analytics services (for anonymous usage statistics). We only work with
        providers that meet GDPR requirements.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children's privacy",
    content: (
      <p>
        Our service is not directed to children under 13. A parent or guardian should use the service on behalf of a
        minor who needs a passport or visa photo.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. We will post a notice on our website about significant changes.
        Continuing to use the service after a change means you accept the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>
          For privacy questions, data deletion requests or GDPR and CCPA enquiries, email{" "}
          <MailLink email={supportEmail} />.
        </p>
        <Callout>
          <strong className="text-black">Business address:</strong> {business.locality}, {business.region},{" "}
          {business.country}
        </Callout>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={graph(webPageSchema(page), breadcrumbSchema([{ name: page.title, path: page.path }]))} />
      <PageHeader
        eyebrow="Legal"
        breadcrumb={page.title}
        title={page.title}
        description="What we collect, why we collect it, and how we keep your photos and personal data safe."
        updated={formatDate(siteConfig.lastUpdated)}
      />
      <LegalDocument sections={sections} related={["/terms", "/refund-policy", "/data-security"]} />
    </>
  );
}
