import { CheckIcon, XIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";

const accepted = [
  "Taken within the last 6 months",
  "Plain white or light grey background",
  "Neutral expression, mouth closed",
  "Eyes open and clearly visible",
  "Face centred, looking straight ahead",
  "Head height 32–36 mm on a 35×45 mm photo",
];

const rejected = [
  "Shadows on the face or background",
  "Tilted head or turned shoulders",
  "Glare or tinted lenses on glasses",
  "Hats or head coverings*",
  "Filters, edits or beauty effects",
  "Blurry, grainy or over-exposed",
];

export function Requirements() {
  return (
    <section id="requirements" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 md:py-32">
      <SectionHeading
        eyebrow="Requirements"
        title="ICAO photo requirements at a glance"
        body="The ICAO guidelines for passport photographs cover size, framing, background, lighting and expression. Small details like a shadow or a slight tilt cause most rejections, so we check each one before your ICAO standard photograph is ready."
      />

      <div className="mt-10 grid gap-3 sm:mt-16 sm:gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-white">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
            <span className="flex size-7 items-center justify-center rounded-md bg-lime-600 text-white">
              <CheckIcon className="size-4" />
            </span>
            <h3 className="font-semibold text-black">Accepted</h3>
          </div>
          <ul className="space-y-3.5 p-5 sm:p-6">
            {accepted.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm text-gray-700">
                <CheckIcon className="mt-0.5 size-4 text-lime-600" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-gray-50">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
            <span className="flex size-7 items-center justify-center rounded-md bg-black text-white">
              <XIcon className="size-4" />
            </span>
            <h3 className="font-semibold text-black">Rejected</h3>
          </div>
          <ul className="space-y-3.5 p-5 sm:p-6">
            {rejected.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm text-gray-600">
                <XIcon className="mt-0.5 size-4 text-gray-400" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-gray-500">
        *Religious and medical exceptions apply in most countries.
      </p>
    </section>
  );
}
