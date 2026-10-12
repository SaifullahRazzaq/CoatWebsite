"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Drives the page with Lenis and hands scroll updates to ScrollTrigger on the
 * same RAF tick, so pinned sequences never lag a frame behind the content.
 * Disabled entirely when the visitor prefers reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = "on";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        delete root.dataset.motion;
      };
    }

    const lenis = new Lenis({
      duration: 1.25,
      // Long, decelerating tail — the scroll should feel weighted, not springy.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.4,
      wheelMultiplier: 0.9,
    });

    lenis.on("scroll", ScrollTrigger.update);
    // Exposed so the screenshot harness can drive scroll deterministically.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links inside the page should ride Lenis rather than jump.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.6 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
