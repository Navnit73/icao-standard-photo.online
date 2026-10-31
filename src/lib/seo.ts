import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const { url, name, business, supportEmail } = siteConfig;

export const ids = {
  organization: `${url}/#organization`,
  website: `${url}/#website`,
};

export const absoluteUrl = (path: string) => (path === "/" ? url : `${url}${path}`);

// Page-level openGraph replaces the inherited one, so the share image is set explicitly
const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${name} — passport and visa photos online that meet ICAO 9303 standards`,
};

/** Title, description, canonical and social tags for a page. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${name}`,
      description,
      url: path,
      siteName: name,
      type: "website",
      locale: "en_US",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${name}`,
      description,
      images: [shareImage],
    },
  };
}

// Structured data (schema.org), following Google Search Central guidance:
// Organization and WebSite on the home page, BreadcrumbList on inner pages.

export function organizationSchema() {
  return {
    "@type": "OnlineBusiness",
    "@id": ids.organization,
    name,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: siteConfig.logo,
      width: 512,
      height: 512,
    },
    description: siteConfig.description,
    email: supportEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.locality,
      addressRegion: business.region,
      addressCountry: business.countryCode,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: supportEmail,
      availableLanguage: ["English"],
      url: absoluteUrl("/contact"),
    },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    name,
    alternateName: ["ICAO Photo", "icao-standard-photo.online"],
    url: absoluteUrl("/"),
    inLanguage: "en",
    publisher: { "@id": ids.organization },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPageSchema({
  type = "WebPage",
  title,
  description,
  path,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage";
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: "en",
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.organization },
    dateModified: siteConfig.lastUpdated,
  };
}

export function faqSchema(path: string, faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Wraps nodes in a single @graph so entities can reference each other by @id. */
export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
