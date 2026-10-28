import Link from "next/link";

const documents = [
  "US Passport",
  "UK Passport",
  "Schengen Visa",
  "Indian Passport",
  "Canada Passport",
  "Australia Passport",
];

const steps = [
  {
    title: "Take or upload a photo",
    body: "Use any recent photo taken against a plain wall in good light. A phone camera is enough.",
  },
  {
    title: "We check and fix it",
    body: "Background, size, head position and crop are adjusted automatically to the ICAO standard.",
  },
  {
    title: "Download and print",
    body: "Get a digital file for online applications and a print-ready sheet for any photo lab.",
  },
];

const features = [
  {
    title: "Automatic compliance check",
    body: "Every photo is checked against ICAO 9303 rules for head size, eye position and expression.",
    icon: "M5 13l4 4L19 7",
  },
  {
    title: "Clean white background",
    body: "Busy or coloured backgrounds are replaced with an even, shadow-free white or off-white.",
    icon: "M4 5h16v14H4z M4 15l5-5 4 4 3-3 4 4",
  },
  {
    title: "Exact sizing",
    body: "35×45 mm, 2×2 in and other official sizes, cropped to the millimetre for each country.",
    icon: "M4 8V4h4 M20 8V4h-4 M4 16v4h4 M20 16v4h-4",
  },
  {
    title: "Print-ready sheets",
    body: "Download a 4×6 in sheet with multiple copies so printing costs only a few cents.",
    icon: "M6 9V3h12v6 M6 18H4v-7h16v7h-2 M6 14h12v7H6z",
  },
  {
    title: "Private by default",
    body: "Your photos are processed securely and deleted automatically after your download.",
    icon: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z",
  },
  {
    title: "Ready in minutes",
    body: "No appointments and no queues. Get a compliant photo from home in under five minutes.",
    icon: "M12 7v5l3 2 M12 3a9 9 0 100 18 9 9 0 000-18z",
  },
];

const requirements = [
  "Photo taken within the last 6 months",
  "Plain white or light grey background",
  "Neutral expression, mouth closed",
  "Eyes open and clearly visible",
  "Face centred, looking straight at the camera",
  "No glasses glare, hats or head coverings*",
  "Even lighting with no shadows on face or background",
  "Head height 32–36 mm on a 35×45 mm photo",
];

const faqs = [
  {
    q: "What is an ICAO standard photo?",
    a: "ICAO (International Civil Aviation Organization) Document 9303 sets the rules most countries use for passport and travel document photos, covering size, framing, background, lighting and expression.",
  },
  {
    q: "Can I take the photo with my phone?",
    a: "Yes. Stand about 1–2 m from a plain wall, face a window for soft light, and ask someone else to take the photo at eye level. We handle the crop and background.",
  },
  {
    q: "Which countries are supported?",
    a: "We support passport, visa and ID photo sizes for most countries that follow ICAO guidelines, including the US, UK, Schengen area, India, Canada and Australia.",
  },
  {
    q: "What if my photo does not pass the check?",
    a: "We tell you exactly what to fix, such as tilting your head or removing glasses, so you can retake it straight away.",
  },
];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`size-4 shrink-0 ${className}`} aria-hidden>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold text-lime-700">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-base leading-7 text-gray-600">{body}</p>}
    </div>
  );
}

function PhotoPreview() {
  const checks = ["Background", "Head size", "Eye position", "Lighting", "Expression"];

  return (
    <div className="relative mx-auto w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-black">Compliance check</p>
        <span className="inline-flex items-center gap-1 rounded-md bg-lime-600/10 px-2 py-1 text-xs font-semibold text-lime-700">
          <Check className="size-3" /> Passed
        </span>
      </div>

      <div className="mt-6 grid grid-cols-[auto_1fr] gap-6">
        {/* 35×45 mm frame with ICAO head-position guides */}
        <div className="relative aspect-[35/45] w-32 overflow-hidden rounded-md border border-gray-300 bg-gray-50 sm:w-36">
          <div className="absolute inset-x-0 top-[12%] border-t border-dashed border-lime-600" />
          <div className="absolute inset-x-0 top-[80%] border-t border-dashed border-lime-600" />
          <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-gray-300" />
          <div className="absolute left-1/2 top-[14%] h-[64%] w-[62%] -translate-x-1/2 rounded-[50%] border-2 border-lime-600/60" />
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] text-gray-500">35×45 mm</span>
        </div>

        <ul className="space-y-3 self-center">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="flex size-5 items-center justify-center rounded-sm bg-lime-600 text-white">
                <Check className="size-3" />
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
        <div>
          <p className="text-gray-500">Head height</p>
          <p className="mt-1 font-mono font-semibold text-black">34.2 mm</p>
        </div>
        <div>
          <p className="text-gray-500">Format</p>
          <p className="mt-1 font-mono font-semibold text-black">JPG · 600 dpi</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section id="start" className="border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-md border border-border bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
              <span className="size-1.5 rounded-sm bg-lime-600" />
              Meets ICAO 9303 standards
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Passport and visa photos, <span className="text-lime-700">done right</span> the first time
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 lg:mx-0">
              Upload a photo from your phone. We fix the background, size and framing so it is accepted by
              official authorities. No studio visit needed.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/#start"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-lime-600 px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-lime-700"
              >
                Create your photo
              </Link>
              <Link
                href="/#requirements"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-base font-semibold text-black transition-colors hover:bg-gray-50"
              >
                See requirements
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600 lg:justify-start">
              {["Checked before download", "Ready in minutes", "Photos auto-deleted"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="text-lime-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <PhotoPreview />
        </div>
      </section>

      {/* Supported documents */}
      <section id="documents" className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="text-center text-sm font-medium text-gray-500">Correct size and format for</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {documents.map((d) => (
              <li key={d} className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-gray-700">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps to an accepted photo"
          body="No special equipment and no guesswork. Just a phone and a plain wall."
        />
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-lg border border-border bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-lime-600 font-mono text-sm font-semibold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-border bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeading
            eyebrow="Features"
            title="Everything an official photo needs"
            body="Built around the same rules passport offices use to accept or reject applications."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-white p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>
                    <path d={f.icon} />
                  </svg>
                </span>
                <h3 className="mt-5 text-base font-semibold text-black">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section id="requirements" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-lime-700">Requirements</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              What makes a photo ICAO compliant
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Most rejections come from small details like shadows, a tilted head or the wrong crop. We check every
              one of these before you download.
            </p>
            <p className="mt-4 text-sm text-gray-500">*Religious or medical exceptions apply in most countries.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {requirements.map((r) => (
              <li key={r} className="flex items-start gap-3 rounded-lg border border-border bg-white p-4 text-sm text-gray-700">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-lime-600 text-white">
                  <Check className="size-3" />
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="mt-12 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-lg border border-border bg-white p-5 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-black [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0 text-gray-500 transition-transform group-open:rotate-45" aria-hidden>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-6 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-lg bg-lime-700 px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Get your compliant photo today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/80">
            Skip the photo booth. Create a passport or visa photo from home in under five minutes.
          </p>
          <Link
            href="/#start"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-base font-semibold text-lime-700 shadow-sm transition-colors hover:bg-gray-100"
          >
            Create your photo
          </Link>
        </div>
      </section>
    </>
  );
}
