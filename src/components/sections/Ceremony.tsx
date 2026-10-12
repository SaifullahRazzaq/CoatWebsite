"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { assets } from "@/lib/assets";
import ParallaxImage from "@/components/ui/ParallaxImage";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";

/**
 * The ceremony commission.
 *
 * The one place on the site where the champagne is allowed to carry a whole
 * section rather than trim it — a wedding is the single garment most people
 * will ever have made, and the section is warmed accordingly. Everywhere else
 * the accent stays in the details.
 */
export default function Ceremony() {
  const section = useRef<HTMLElement>(null);
  const { still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el || still) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-ceremony-glow]",
        { opacity: 0.2 },
        {
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "center center",
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
      id="ceremony"
      className="relative overflow-hidden bg-pitch py-[14vh] md:py-[18vh]"
    >
      <div
        data-ceremony-glow
        aria-hidden
        className="pointer-events-none absolute -right-[12%] top-[14%] h-[70vh] w-[60vw] blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-champagne) 20%, transparent), transparent 74%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1560px] grid-cols-1 items-center gap-14 px-6 md:px-10 lg:grid-cols-12 lg:gap-20 lg:px-14">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4 text-champagne/70">
              <span
                aria-hidden
                className="inline-block h-px w-10 bg-champagne/40"
              />
              Ceremony Collection
            </p>
          </Reveal>

          <RevealText
            as="h2"
            className="display text-[clamp(2.4rem,6.5vw,5.25rem)] text-bone"
            lineClassName="pb-[0.06em]"
            lines={[
              <>For the moment</>,
              <>you&rsquo;ll remember</>,
              <span key="c" className="italic text-champagne/90">forever.</span>,
            ]}
          />

          <Reveal className="mt-9 max-w-lg" y={22}>
            <p className="body-copy">
              Morning coat, midnight tailcoat, or a dinner jacket cut so quietly
              that nobody photographs the suit. We begin nine months out, and we
              keep the pattern — because there is usually a second occasion.
            </p>
          </Reveal>

          <Reveal className="mt-12" y={18}>
            <Magnetic strength={12}>
              <a
                href="#contact"
                data-cursor="Enter"
                className="group relative inline-block overflow-hidden border border-champagne/50 px-10 py-5 text-[10px] uppercase tracking-[0.26em] text-champagne"
              >
                <span className="relative z-10 transition-colors duration-700 group-hover:text-ink">
                  Discover wedding tailoring
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                />
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <ParallaxImage
            asset={assets.collectionWedding}
            clip
            zoom
            strength={9}
            tone={0.78}
            className="aspect-4/5 w-full"
            sizes="(max-width: 1024px) 100vw, 48vw"
          />
          <Reveal className="mt-5" y={14}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-mute">
              Fig. 07 — Tobacco linen, ceremony cut
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
