import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/landing/cta";
import { DocumentsStrip } from "@/components/landing/documents-strip";
import { Faq, faqs } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MobileCtaBar } from "@/components/landing/mobile-cta-bar";
import { Requirements } from "@/components/landing/requirements";
import { siteConfig } from "@/config/site";
import { absoluteUrl, graph, ids, organizationSchema, websiteSchema } from "@/lib/seo";

export const metadata = {
  alternates: { canonical: "/" },
};

const homeSchema = graph(
  websiteSchema(),
  organizationSchema(),
  {
    "@type": "Service",
    "@id": `${absoluteUrl("/")}#service`,
    name: "Online ICAO passport and visa photo service",
    serviceType: "Passport photo processing",
    description: siteConfig.description,
    provider: { "@id": ids.organization },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      price: siteConfig.pricing.price,
      priceCurrency: siteConfig.pricing.currency,
      url: absoluteUrl("/"),
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/")}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
);

export default function Home() {
  return (
    <>
      <JsonLd data={homeSchema} />
      <Hero />
      <DocumentsStrip />
      <HowItWorks />
      <Features />
      <Requirements />
      <Faq />
      <Cta />
      <MobileCtaBar />
    </>
  );
}
