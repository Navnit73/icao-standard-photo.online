"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Bottom action bar on phones, shown once the hero buttons have scrolled above the viewport. */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const actions = document.getElementById("hero-actions");
    if (!actions) return;

    const observer = new IntersectionObserver(([entry]) =>
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(actions);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-black">ICAO passport photo</p>
          <p className="truncate text-xs text-gray-500">Ready in under 5 minutes</p>
        </div>
        <ButtonLink href="/icao-photo-tool" className="shrink-0">
          Create photo
          <ArrowRightIcon className="size-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
