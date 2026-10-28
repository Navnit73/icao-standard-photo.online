import { Cta } from "@/components/landing/cta";
import { DocumentsStrip } from "@/components/landing/documents-strip";
import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MobileCtaBar } from "@/components/landing/mobile-cta-bar";
import { Requirements } from "@/components/landing/requirements";

export default function Home() {
  return (
    <>
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
