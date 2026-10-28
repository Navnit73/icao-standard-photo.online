// `||` (not `??`) so an empty NEXT_PUBLIC_SITE_URL= in .env still falls back
const url = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://icao-standard-photo.online").replace(/\/$/, "");

export const siteConfig = {
  name: "ICAO Standard Photo",
  url,
  title: "ICAO Standard Photograph Online — Passport & Visa Photos",
  description:
    "Turn a phone selfie into a passport or visa photo that meets ICAO 9303 in minutes. Checked before download, print-ready, with a money-back guarantee.",
  supportEmail: "support@icao-standard-photo.online",
  logo: `${url}/logo.png`,

  business: {
    locality: "Varanasi",
    region: "Uttar Pradesh",
    country: "India",
    countryCode: "IN",
  },

  pricing: {
    price: "7.99",
    currency: "USD",
    includes: "1 processed digital photo and a print-ready sheet",
  },

  refund: {
    claimDays: 3,
    processingDays: "5–10 business days",
  },

  privacy: {
    deleteAfterHours: 24,
    linkExpiryMinutes: 60,
  },

  /** Shown on each policy page and used for sitemap lastModified */
  lastUpdated: "2026-10-28",
};

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Requirements", href: "/#requirements" },
  { label: "FAQ", href: "/#faq" },
];

export const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "Requirements", href: "/#requirements" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact & support", href: "/contact" },
      { label: "Data security", href: "/data-security" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Refund policy", href: "/refund-policy" },
    ],
  },
];

/** Every indexable page, used by the sitemap */
export const sitePages = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/icao-photo-tool", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/data-security", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" as const },
];
