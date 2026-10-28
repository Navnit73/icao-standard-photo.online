type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "center" | "left";
};

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-sm font-semibold text-lime-700">
      <span className="h-px w-5 bg-lime-600" />
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, body, align = "center" }: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-black sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-base leading-7 text-pretty text-gray-600">{body}</p>}
    </div>
  );
}
