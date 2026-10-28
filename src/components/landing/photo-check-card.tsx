import { CheckIcon, ImageIcon, PrinterIcon } from "@/components/ui/icons";

const checks = [
  { label: "Background", value: "Plain white" },
  { label: "Head height", value: "34.2 mm" },
  { label: "Eye line", value: "Within range" },
  { label: "Lighting", value: "Even" },
  { label: "Expression", value: "Neutral" },
  { label: "Glasses", value: "No glare" },
];

/** Static preview of the compliance check UI shown in the hero. */
export function PhotoCheckCard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-lg border border-border bg-white shadow-sm">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <ImageIcon className="size-4 text-gray-400" />
            <span className="font-mono text-xs">portrait.jpg</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-lime-600/10 px-2 py-1 text-xs font-semibold text-lime-700">
            <CheckIcon className="size-3" /> 6 of 6 passed
          </span>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-5 p-5">
          {/* 35×45 mm frame with ICAO head-position guides */}
          <div className="relative aspect-[35/45] w-32 overflow-hidden rounded-md border border-gray-300 bg-gray-50 sm:w-36">
            <div className="absolute inset-x-0 top-[12%] border-t border-dashed border-lime-600" />
            <div className="absolute inset-x-0 top-[80%] border-t border-dashed border-lime-600" />
            <div className="absolute inset-x-0 top-[42%] border-t border-dotted border-gray-300" />
            <div className="absolute inset-y-0 left-1/2 border-l border-dotted border-gray-300" />
            <div className="absolute top-[14%] left-1/2 h-[64%] w-[62%] -translate-x-1/2 rounded-[50%] border-2 border-lime-600/70 bg-white/60" />
            <span className="absolute top-[12%] right-1 -translate-y-full pb-0.5 font-mono text-[9px] text-lime-700">top</span>
            <span className="absolute top-[80%] right-1 pt-0.5 font-mono text-[9px] text-lime-700">chin</span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] text-gray-500">35×45 mm</span>
          </div>

          <ul className="divide-y divide-gray-100 self-center">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0">
                <span className="flex items-center gap-2 text-gray-700">
                  <span className="flex size-4 items-center justify-center rounded-sm bg-lime-600 text-white">
                    <CheckIcon className="size-2.5" />
                  </span>
                  {c.label}
                </span>
                <span className="hidden text-xs text-gray-500 sm:inline">{c.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progress footer */}
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-700">ICAO 9303 score</span>
            <span className="font-mono font-semibold text-black">100%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-gray-100">
            <div className="h-full w-full rounded-sm bg-lime-600" />
          </div>
        </div>
      </div>

      {/* Floating status chips */}
      <div className="absolute -top-4 -left-6 hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm sm:flex">
        <span className="size-2 rounded-sm bg-lime-600" />
        Background replaced
      </div>
      <div className="absolute -right-6 -bottom-5 hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm sm:flex">
        <PrinterIcon className="size-4 text-lime-700" />
        4×6 in print sheet ready
      </div>
    </div>
  );
}
