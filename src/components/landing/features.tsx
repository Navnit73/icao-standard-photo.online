import { CheckIcon, CropIcon, ImageIcon, LockIcon, PrinterIcon, ShieldIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  {
    icon: ImageIcon,
    title: "Clean white background",
    body: "Busy or coloured backgrounds are replaced with an even, shadow-free white or off-white.",
  },
  {
    icon: CropIcon,
    title: "Exact sizing",
    body: "35×45 mm, 2×2 in and other official sizes, cropped to the millimetre for each country.",
  },
  {
    icon: PrinterIcon,
    title: "Print-ready sheets",
    body: "A 4×6 in sheet with multiple copies, so printing at any photo lab costs only a few cents.",
  },
  {
    icon: LockIcon,
    title: "Private by default",
    body: "Photos are processed securely and deleted automatically after your download.",
  },
];

const checks = ["Head size", "Eye position", "Background", "Lighting", "Expression", "Glasses glare"];

export function Features() {
  return (
    <section id="features" className="border-y border-border bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <SectionHeading
          eyebrow="Features"
          title="Everything an official photo needs"
          body="Built around the same rules passport offices use to accept or reject applications."
        />

        <div className="mt-10 grid gap-3 sm:mt-16 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Highlight card */}
          <div className="flex flex-col justify-between rounded-lg bg-black p-6 text-white sm:p-7 sm:col-span-2 lg:col-span-1 lg:row-span-2">
            <div>
              <span className="flex size-10 items-center justify-center rounded-lg bg-lime-600 text-white">
                <ShieldIcon className="size-5" />
              </span>
              <h3 className="mt-6 text-xl font-semibold">Automatic compliance check</h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Every photo is checked against ICAO 9303 before you download, so you can fix any problem before you apply.
              </p>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-2 sm:mt-8">
              {checks.map((c) => (
                <li key={c} className="flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-gray-300">
                  <CheckIcon className="size-3.5 text-lime-600" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {features.map((f) => (
            <div
              key={f.title}
              className="group flex gap-4 rounded-lg border border-border bg-white p-5 transition-colors hover:border-lime-600/50 sm:block sm:p-6"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700 transition-colors group-hover:bg-lime-600 group-hover:text-white">
                <f.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-black sm:mt-5">{f.title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600 sm:mt-2">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
