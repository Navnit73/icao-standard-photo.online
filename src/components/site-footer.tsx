import Link from "next/link";
import { footerLinks, siteConfig } from "@/config/site";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-28 sm:px-6 sm:pt-14 md:pb-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="col-span-2 max-w-xs md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Passport, visa and ID photos that meet ICAO 9303 standards. Made online in minutes.
            </p>
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="mt-3 inline-block py-1 text-sm font-medium break-all text-gray-700 hover:text-lime-700"
            >
              {siteConfig.supportEmail}
            </a>
          </div>

          {footerLinks.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold text-black">{group.title}</h2>
              <ul className="mt-3 space-y-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="inline-block py-1.5 text-sm text-gray-600 transition-colors hover:text-lime-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 space-y-3 border-t border-border pt-6 text-sm text-gray-500 sm:mt-12">
          {/* Brand name kept out of this block so it doesn't inflate "icao standard photo" keyword counts */}
          <p>© 2026 All rights reserved.</p>
          <p className="text-xs leading-5 text-gray-400">
            This website is an independent service and is not affiliated with the International Civil Aviation
            Organization (ICAO) or any government agency. Final photo acceptance is at the discretion of the issuing
            authority.
          </p>
        </div>
      </div>
    </footer>
  );
}
