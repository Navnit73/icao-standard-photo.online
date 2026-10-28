import Link from "next/link";
import { footerLinks, siteConfig } from "@/config/site";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-28 sm:px-6 sm:pt-14 md:pb-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="col-span-2 max-w-xs md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Passport, visa and ID photos that meet ICAO 9303 standards. Made online in minutes.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-black">{group.title}</h3>
              <ul className="mt-3 space-y-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="inline-block py-1.5 text-sm text-gray-600 transition-colors hover:text-lime-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 sm:mt-12 sm:gap-4 border-t border-border pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.name}. All rights reserved.</p>
          <a href={`mailto:${siteConfig.supportEmail}`} className="hover:text-black">
            {siteConfig.supportEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
