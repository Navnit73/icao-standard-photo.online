export const siteConfig = {
  name: "ICAO Standard Photo",
  description:
    "Create passport and visa photos that meet ICAO standards in minutes. Upload a selfie, we handle the size, background and compliance checks.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://icao-standard-photo.online",
  supportEmail: "support@icao-standard-photo.online",
};

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
    ],
  },
  {
    title: "Documents",
    links: [
      { label: "Passport photos", href: "/#documents" },
      { label: "Visa photos", href: "/#documents" },
      { label: "ID card photos", href: "/#documents" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact us", href: "mailto:support@icao-standard-photo.online" },
    ],
  },
];
