import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

const pages = {
  "/icao-compliant-passport-photo": { title: "ICAO compliant passport photo", body: "Size, rules and how to check your photo." },
  "/icao-guide/photo-is-not-valid-as-per-icao-standard": {
    title: "Photo not valid as per ICAO?",
    body: "Why portals reject photos and how to fix them.",
  },
  "/icao-photo-checker": { title: "ICAO photo checker", body: "Check your photo free before you pay." },
  "/icao-guide/indian-passport-photo-requirements": {
    title: "Indian passport photo requirements",
    body: "630 × 810 px, 250 KB and every rule.",
  },
  "/icao-guide/passport-seva-photo-upload-error": {
    title: "Passport Seva upload errors",
    body: "Match your error message to its fix.",
  },
  "/icao-guide/passport-photo-rejected-reasons": {
    title: "Passport photo rejected?",
    body: "Common reasons and what to do next.",
  },
  "/icao-guide/take-icao-photo-at-home": {
    title: "Take an ICAO photo at home",
    body: "Phone setup, settings and a solo method.",
  },
  "/about": { title: "About us", body: "Who we are and why we built this service." },
  "/contact": { title: "Contact & support", body: "Get help with your photo or order." },
  "/data-security": { title: "Data security", body: "How we protect your photos and payments." },
  "/privacy-policy": { title: "Privacy policy", body: "What we collect and how we use it." },
  "/terms": { title: "Terms of service", body: "The rules for using our service." },
  "/refund-policy": { title: "Refund policy", body: "Our photo rejection guarantee." },
};

export type RelatedPath = keyof typeof pages;

export function RelatedLinks({ paths, title = "Related pages" }: { paths: RelatedPath[]; title?: string }) {
  return (
    <section aria-labelledby="related-heading" className="mt-16 border-t border-border pt-10">
      <h2 id="related-heading" className="text-lg font-semibold text-black">
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {paths.map((path) => (
          <li key={path}>
            <Link
              href={path}
              className="group flex h-full items-start justify-between gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-lime-600/50"
            >
              <span>
                <span className="block text-sm font-semibold text-black">{pages[path].title}</span>
                <span className="mt-1 block text-sm text-gray-600">{pages[path].body}</span>
              </span>
              <ArrowRightIcon className="mt-0.5 size-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-lime-700" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
