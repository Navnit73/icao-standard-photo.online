import type { ReactNode } from "react";
import { RelatedLinks, type RelatedPath } from "@/components/related-links";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

/** Numbered policy sections with a sticky table of contents on desktop. */
export function LegalDocument({ sections, related }: { sections: LegalSection[]; related: RelatedPath[] }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[220px_1fr] lg:gap-16">
      <aside className="hidden lg:block">
        <nav aria-label="On this page" className="sticky top-[calc(var(--header-height)+2rem)]">
          <p className="text-sm font-semibold text-black">On this page</p>
          <ol className="mt-4 space-y-1 border-l border-border">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-gray-600 transition-colors hover:border-lime-600 hover:text-black"
                >
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <article className="min-w-0 max-w-3xl">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="border-b border-border py-8 first:pt-0 last:border-0">
            <h2 className="text-xl font-semibold tracking-tight text-black sm:text-2xl">
              <span className="mr-2 font-mono text-base text-lime-700">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-gray-700">{s.content}</div>
          </section>
        ))}
        <RelatedLinks paths={related} />
      </article>
    </div>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-xs bg-lime-600" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-lime-600/30 bg-lime-600/5 p-4 text-sm leading-6 text-gray-800">{children}</div>;
}

export function MailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className="font-medium text-lime-700 underline underline-offset-4 hover:text-lime-600">
      {email}
    </a>
  );
}
