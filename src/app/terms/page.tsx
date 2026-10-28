import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Callout, LegalDocument, List, MailLink, type LegalSection } from "@/components/legal-document";
import { PageHeader } from "@/components/page-header";
import { formatDate, siteConfig } from "@/config/site";
import { breadcrumbSchema, graph, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/terms",
  title: "Terms of Service",
  description:
    "The terms for using ICAO Standard Photo: service description, pricing, refunds, your responsibilities, data retention and governing law.",
};

export const metadata = pageMetadata(page);

const { name, supportEmail, business, pricing, refund, privacy } = siteConfig;
const price = `$${pricing.price} (${pricing.currency})`;

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    content: (
      <p>
        By accessing or using {name} (&ldquo;the Service&rdquo;), you agree to these Terms of Service. If you do not
        agree, you may not use the Service. The Service is available at {siteConfig.url.replace("https://", "")} and
        includes all photo validation, processing and download features.
      </p>
    ),
  },
  {
    id: "service",
    title: "Description of service",
    content: (
      <>
        <p>
          {name} provides automated validation and processing of passport, visa and ID photos. The Service checks photos
          against official government specifications, including those for the US, UK, India and the Schengen area.
        </p>
        <List
          items={[
            <><strong className="text-black">Free:</strong> photo validation and a compliance report at no cost.</>,
            <>
              <strong className="text-black">Paid:</strong> one processed, compliant photo download for {price} per
              purchase, delivered instantly after successful payment.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "responsibilities",
    title: "Your responsibilities",
    content: (
      <List
        items={[
          "Only upload photos of yourself, or photos you have legal permission to process.",
          "You are responsible for the accuracy and authenticity of the photos you upload.",
          "Do not use the Service for fraud or identity theft.",
          "Do not upload inappropriate, offensive or illegal content.",
          "Do not attempt to reverse-engineer, hack or disrupt the Service.",
        ]}
      />
    ),
  },
  {
    id: "payment",
    title: "Payment terms",
    content: (
      <List
        items={[
          `The photo processing and download fee is ${price} per photo.`,
          `Each purchase includes ${pricing.includes}, compliant, cropped and ready to submit.`,
          "Payment is a one-time charge. There are no subscriptions or recurring fees.",
          "Payments are processed securely by our third-party payment provider.",
        ]}
      />
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    content: (
      <>
        <p>
          <strong className="text-black">Photo rejection guarantee:</strong> if a government agency rejects your
          processed photo for a passport, visa or national ID application, you can claim a 100% refund of your purchase
          price.
        </p>
        <List
          items={[
            <>
              Contact <MailLink email={supportEmail} /> within {refund.claimDays} days of purchase.
            </>,
            "Include your transaction ID and evidence of the rejection, such as a screenshot of the notice.",
            `Refunds go back to your original payment method within ${refund.processingDays}.`,
          ]}
        />
        <p>
          Full details are in our{" "}
          <Link href="/refund-policy" className="font-medium text-lime-700 underline underline-offset-4">
            Refund Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "independence",
    title: "Independence and affiliation disclaimer",
    content: (
      <Callout>
        <strong className="text-black">Important:</strong> {name} is an independent, private service. We are not
        affiliated with, endorsed by or connected to the International Civil Aviation Organization (ICAO), the U.S.
        Department of State, USCIS, HM Passport Office or any other government agency. Final acceptance of your photo is
        entirely at the discretion of the reviewing agency.
      </Callout>
    ),
  },
  {
    id: "data-retention",
    title: "Data retention and privacy",
    content: (
      <List
        items={[
          "You keep full ownership of every photo you upload. You grant us a temporary, limited licence to process them only to provide the Service.",
          `All uploaded and processed images are deleted automatically within ${privacy.deleteAfterHours} hours.`,
          "Deleted photos cannot be recovered, so please download your processed photo promptly.",
          "We do not sell, share or use your photos for anything other than providing the Service.",
          "We do not keep facial biometric data beyond the processing session.",
        ]}
      />
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <p>
        To the maximum extent permitted by law, {name} is not liable for any indirect, incidental, special,
        consequential or punitive damages arising from your use of the Service. This includes visa or passport
        application rejections, delayed applications and other immigration-related consequences.
      </p>
    ),
  },
  {
    id: "availability",
    title: "Service availability",
    content: (
      <p>
        We aim to keep the Service available at all times but do not guarantee uninterrupted access. We may modify,
        suspend or discontinue the Service with reasonable notice, and will announce scheduled maintenance in advance
        where possible.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    content: (
      <p>
        We may suspend or end your access to the Service for violating these Terms, abusive behaviour or suspected
        fraud. When access ends, all data linked to your session is permanently deleted.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    content: (
      <p>
        These Terms are governed by the laws of {business.country}. Any dispute arising from these Terms or the Service
        falls under the jurisdiction of the courts of {business.locality}, {business.region}, {business.country}.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these Terms from time to time and will post a notice on our website about significant changes.
        Continuing to use the Service after a change means you accept the updated Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        For questions about these Terms, email <MailLink email={supportEmail} />.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd data={graph(webPageSchema(page), breadcrumbSchema([{ name: page.title, path: page.path }]))} />
      <PageHeader
        eyebrow="Legal"
        breadcrumb={page.title}
        title={page.title}
        description="The agreement between you and us when you use our photo validation and processing service."
        updated={formatDate(siteConfig.lastUpdated)}
      />
      <LegalDocument sections={sections} related={["/privacy-policy", "/refund-policy", "/contact"]} />
    </>
  );
}
