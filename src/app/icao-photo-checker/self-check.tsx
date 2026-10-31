"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/icons";

const items = [
  "Both eyes are open and looking at the camera",
  "My mouth is closed and my expression is neutral",
  "I'm not wearing glasses, or the lenses show no glare",
  "There are no shadows on my face",
  "My head is straight, not tilted or turned",
  "No hair covers my eyes or eyebrows",
  "The photo has no filters, beauty effects or portrait blur",
  "I took the photo in the last 6 months",
];

/** Checklist for the things the automated check doesn't report */
export function SelfCheck() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const done = checked.size === items.length;

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="rounded-lg border border-border bg-white">
      <ul className="divide-y divide-border">
        {items.map((item, i) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-3 px-5 py-3.5 text-sm leading-6 text-gray-700 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={checked.has(i)}
                onChange={() => toggle(i)}
                className="mt-1 size-4 shrink-0 accent-lime-600"
              />
              {item}
            </label>
          </li>
        ))}
      </ul>
      <p
        aria-live="polite"
        className={`flex items-center gap-2 border-t border-border px-5 py-3.5 text-sm font-semibold ${done ? "text-lime-700" : "text-gray-600"}`}
      >
        {done && <CheckIcon className="size-4" />}
        {done
          ? "All checks passed. Your photo is ready for the automated check."
          : `${checked.size} of ${items.length} checks passed. Retake the photo if any item doesn't apply.`}
      </p>
    </div>
  );
}
