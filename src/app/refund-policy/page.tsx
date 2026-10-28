import { JsonLd } from "@/components/json-ld";
import { Callout, LegalDocument, List, MailLink, type LegalSection } from "@/components/legal-document";
import { PageHeader } from "@/components/page-header";
import { formatDate, siteConfig } from "@/config/site";
import { breadcrumbSchema, graph, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/refund-policy",
  title: "Refund Policy",
  description:
    "Our 100% money-back guarantee: if a government agency rejects your processed photo, we refund the full price. See requirements and how to claim.",
};

export const metadata = pageMetadata(page);

const { supportEmail, refund } = siteConfig;

const sections: LegalSection[] = [
  {
    id: "guarantee",
    title: "Our 100% money-back guarantee",
    content: (
      <p>
        We stand behind our photos. If a government agency rejects your processed photo for a passport, visa or ID
        application, you get a 100% refund of your original purchase price. No partial credits and no fine print.
      </p>
    ),
  },
  {
    id: "requirements",
    title: "Refund request requirements",
    content: (
      <>
        <p>To keep things fair and fast for everyone, we ask for a few simple things:</p>
        <List
          items={[
            `Request your refund within ${refund.claimDays} days of your original purchase.`,
            "Share a screenshot or official notice showing the government agency rejected the photo.",
            "Include the email address used for the purchase, or your transaction ID.",
          ]}
        />
      </>
    ),
  },
  {
    id: "no-deductions",
    title: "No hidden deductions",
    content: (
      <p>
        Unlike services that only offer partial refunds, we refund the full amount you paid every time your photo is
        rejected for official use. We absorb the processing costs ourselves.
      </p>
    ),
  },
  {
    id: "processing",
    title: "Processing time and method",
    content: (
      <List
        items={[
          `Approved refunds are processed within ${refund.processingDays} of approval.`,
          "Refunds go back to the original payment method. We can't refund to a different card or account.",
        ]}
      />
    ),
  },
  {
    id: "other-reasons",
    title: "Other refund reasons",
    content: (
      <p>
        Because our service delivers an instant digital download, we review requests for other reasons case by case.
        This includes changing your mind, accidental duplicate purchases or finding another service. Reach out and
        explain your situation, and we&rsquo;ll do our best to help.
      </p>
    ),
  },
  {
    id: "how-to-request",
    title: "How to request a refund",
    content: (
      <>
        <p>
          Email <MailLink email={supportEmail} /> with your transaction details and proof of the photo rejection. We aim
          to reply quickly and keep the process painless.
        </p>
        <Callout>
          <strong className="text-black">Tip:</strong> put &ldquo;Refund request&rdquo; and your transaction ID in the
          subject line so we can find your order faster.
        </Callout>
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd data={graph(webPageSchema(page), breadcrumbSchema([{ name: page.title, path: page.path }]))} />
      <PageHeader
        eyebrow="Legal"
        breadcrumb={page.title}
        title={page.title}
        description="If a government agency rejects your processed photo, we refund 100% of what you paid."
        updated={formatDate(siteConfig.lastUpdated)}
      />
      <LegalDocument sections={sections} related={["/terms", "/privacy-policy", "/contact"]} />
    </>
  );
}
