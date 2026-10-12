"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";

const LINES = [
  "A great suit",
  "should never",
  "enter the room",
  "before you do.",
];

/**
 * The quiet one.
 *
 * Nothing here but a sentence and the light behind it. Each line is released
 * on its own as the section is traversed, so the reader arrives at the last
 * clause rather than being handed the whole thought at once. The section is
 * deliberately under-filled — it is the pause between two loud movements.
 */
export default function Philosophy() {
  const section = useRef<HTMLElement>(null);
  const { still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el) return;

    // The lines start translated out of their masks in the markup, so a
    // reduced-motion visitor has to be handed them explicitly — otherwise the
    // quote is simply never shown.
    if (still) {
      gsap.set(el.querySelectorAll("[data-quote-line] > *"), { y: "0%" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 72%",
            end: "center 55%",
            scrub: 1.1,
          },
        })
        .to("[data-quote-line] > *", {
          y: "0%",
          duration: 1,
          stagger: 0.6,
          ease: "expo.out",
        });

      // The light behind the words swells as they land.
      gsap.fromTo(
        "[data-quote-light]",
        { opacity: 0.16, scale: 0.82 },
        {
          opacity: 0.5,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [still]);

  return (
    <section
      ref={section}
      className="relative flex min-h-[110svh] items-center overflow-hidden bg-ink"
    >
      <div
        data-quote-light
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 blur-[110px]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-champagne) 13%, transparent), transparent 72%)",
        }}
      />

      <blockquote className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-14">
        <p className="display text-[clamp(2.2rem,7vw,5.75rem)] text-bone">
          {LINES.map((line, i) => (
            <span key={line} data-quote-line className="block overflow-hidden">
              <span
                className={`block pb-[0.06em] ${
                  i === LINES.length - 1 ? "italic text-champagne/90" : ""
                }`}
                style={{ transform: "translateY(105%)" }}
              >
                {line}
              </span>
            </span>
          ))}
        </p>
      </blockquote>
    </section>
  );
}
