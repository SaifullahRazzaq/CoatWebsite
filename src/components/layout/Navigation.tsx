"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { NAV_LINKS } from "@/lib/nav";

/**
 * Transparent over the hero, then a quiet blurred bar once the page moves.
 * The mobile panel is a full-height curtain that wipes down, with its links
 * rising behind it.
 */
export default function Navigation() {
  const [settled, setSettled] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSettled(window.scrollY > window.innerHeight * 0.35);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile curtain.
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;

    const links = el.querySelectorAll("[data-nav-item] > *");
    const ctx = gsap.context(() => {
      if (open) {
        gsap
          .timeline()
          .set(el, { pointerEvents: "auto" })
          .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "expo.inOut" })
          .to(links, { y: "0%", duration: 1.1, stagger: 0.06, ease: "expo.out" }, "-=0.55");
      } else {
        gsap
          .timeline()
          .to(links, { y: "110%", duration: 0.45, ease: "power2.in" })
          .to(
            el,
            { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" },
            "-=0.2",
          )
          .set(el, { pointerEvents: "none" });
      }
    }, el);
    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 transition-[background-color,backdrop-filter,border-color,padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          // The header owns its own stacking context, so it has to outrank the
          // curtain while the curtain is open or the close control is buried.
          open ? "z-[60]" : "z-50",
          settled && !open
            ? "border-b border-bone/10 bg-ink/70 py-4 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-6 md:py-8",
        ].join(" ")}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1560px] items-center justify-between px-6 md:px-10 lg:px-14"
        >
          <a
            href="#hero"
            data-cursor="Top"
            className="group flex items-baseline gap-2.5"
            aria-label="Aldermay, home"
          >
            <span className="display text-[1.35rem] tracking-[0.02em] text-bone md:text-[1.6rem]">
              Aldermay
            </span>
            <span className="hidden text-[9px] uppercase tracking-[0.3em] text-mute sm:inline">
              Tailors
            </span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-cursor="on"
                  className="group relative flex items-center gap-2 py-1 text-[11px] uppercase tracking-[0.22em] text-bone-dim transition-colors duration-500 hover:text-bone"
                >
                  {/* A champagne dot opens, and the tracking eases apart with
                      it — the two together read as one gesture. */}
                  <span
                    aria-hidden
                    className="block h-1 w-1 scale-0 rounded-full bg-champagne transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
                  />
                  <span className="block transition-[letter-spacing] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:tracking-[0.3em]">
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <a
              href="#contact"
              data-cursor="Book"
              className="hidden border border-bone/20 px-6 py-3 text-[10px] uppercase tracking-[0.24em] text-bone transition-colors duration-500 hover:border-champagne hover:text-champagne lg:block"
            >
              Book a Fitting
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span
                aria-hidden
                className={`block h-px w-6 bg-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "translate-y-[4px] rotate-45" : ""
                }`}
              />
              <span
                aria-hidden
                className={`block h-px w-6 bg-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile curtain */}
      <div
        id="mobile-menu"
        ref={panel}
        aria-hidden={!open}
        className="pointer-events-none fixed inset-0 z-[55] flex flex-col justify-between bg-pitch px-6 pb-12 pt-32 lg:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <ul>
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} className="border-b border-bone/10">
              <span data-nav-item className="block overflow-hidden">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex translate-y-[110%] items-baseline gap-4 py-5"
                  tabIndex={open ? 0 : -1}
                >
                  <span className="text-[10px] tracking-[0.2em] text-champagne/70">
                    0{i + 1}
                  </span>
                  <span className="display text-[2.4rem] text-bone">
                    {link.label}
                  </span>
                </a>
              </span>
            </li>
          ))}
        </ul>

        <div className="space-y-6">
          <span data-nav-item className="block overflow-hidden">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="block translate-y-[110%] border border-champagne/40 px-8 py-4 text-center text-[10px] uppercase tracking-[0.26em] text-champagne"
            >
              Book a Fitting
            </a>
          </span>
          <span data-nav-item className="block overflow-hidden">
            <p className="eyebrow translate-y-[110%] text-[9px]">
              14 Sackville Street · London
            </p>
          </span>
        </div>
      </div>
    </>
  );
}
