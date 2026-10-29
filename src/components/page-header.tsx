import type { ReactNode } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/section-heading";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb: string;
  updated?: string;
  /** Buttons shown under the description */
  actions?: ReactNode;
  /** Shown to the right of the text on large screens, below it on small ones */
  aside?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, breadcrumb, updated, actions, aside }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="transition-colors hover:text-black">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-gray-700">
              {breadcrumb}
            </li>
          </ol>
        </nav>

        <div className={`mt-8 ${aside ? "grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12" : ""}`}>
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance text-black sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-pretty text-gray-600 sm:text-lg sm:leading-8">
              {description}
            </p>
            {updated && <p className="mt-4 text-sm text-gray-500">Last updated: {updated}</p>}
            {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>}
          </div>
          {aside}
        </div>
      </div>
    </header>
  );
}
