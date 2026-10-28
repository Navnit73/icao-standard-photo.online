"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navLinks } from "@/config/site";
import { ButtonLink } from "./ui/button-link";
import { ArrowRightIcon, MenuIcon, XIcon } from "./ui/icons";
import { Logo } from "./logo";

const sectionIds = navLinks.map((link) => link.href.split("#")[1]);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Show the border and shadow only after the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Highlight the nav link for the section currently in view
  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((el) => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-[border-color,box-shadow] duration-200 ${
        scrolled || open ? "border-border shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-(--header-height) max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => {
            const isActive = link.href.endsWith(`#${active}`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/icao-photo-tool" size="sm">
            Create photo
            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
        >
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-200 md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0" inert={!open}>
          <div className="mx-auto flex max-w-6xl flex-col gap-1 border-t border-border px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink
              href="/icao-photo-tool"
              onClick={() => setOpen(false)}
              className="mt-2"
            >
              Create photo
            </ButtonLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
