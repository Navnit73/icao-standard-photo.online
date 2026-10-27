export const site = {
  name: "ICAO Standard Photo",
  domain: "icao-standard-photo.online",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://icao-standard-photo.online",
  supportEmail: "support@icao-standard-photo.online",
  tagline: "ICAO-compliant passport photos in seconds",
  description:
    "Create ICAO 9303 compliant passport photos online. Upload a selfie, we crop, align and fix the background to your country's official size — ready to print or submit.",
  lastUpdated: "October 27, 2026",
};

export const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#requirements", label: "ICAO rules" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
];

export const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact Us" },
];
