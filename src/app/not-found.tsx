import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const links = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Photo requirements", href: "/#requirements" },
  { label: "Contact & support", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <p className="font-mono text-sm font-semibold text-lime-700">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">Page not found</h1>
      <p className="mt-4 text-gray-600">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
      <ButtonLink href="/" size="lg" className="mt-8">
        Back to home
      </ButtonLink>
      <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block py-1 text-gray-600 underline-offset-4 hover:text-lime-700 hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
