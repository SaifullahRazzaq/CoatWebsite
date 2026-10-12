"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { assets } from "@/lib/assets";
import ParallaxImage from "@/components/ui/ParallaxImage";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";

/**
 * The breath after the hero. A single statement, set large, with one
 * photograph drifting behind it — the transition out of the assembly and into
 * the body of the site.
 */
export default function Manifesto() {
  const section = useRef<HTMLElement>(null);
  const { still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el || still) return;

    const ctx = gsap.context(() => {
      // The section's ground lifts from pitch to charcoal as it passes.
      gsap.fromTo(
        el,
        { backgroundColor: "#08080a" },
        {
          backgroundColor: "#0f0f12",
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
    return () => ctx.revert();
  }, [still]);

  return (
    <section
      ref={section}
      id="about"
      className="relative overflow-hidden bg-ink py-[13vh] md:py-[17vh]"
    >
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 items-center gap-14 px-6 md:px-10 lg:grid-cols-12 lg:gap-16 lg:px-14">
        <div className="lg:col-span-7 lg:pr-10">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4">
              <span className="hairline inline-block h-px w-10" />
              Our House
            </p>
          </Reveal>

          <RevealText
            as="h2"
            className="display text-[clamp(2.5rem,7vw,5.5rem)] text-bone"
            lineClassName="pb-[0.06em]"
            lines={[
              <>Crafted</>,
              <span key="2" className="italic text-champagne/90">for you</span>,
              <>alone.</>,
            ]}
          />

          <Reveal splitChildren className="mt-12 max-w-xl space-y-6" y={22}>
            <p className="body-copy">
              A suit is not a product. It is an argument about posture —
              about how a shoulder should fall, where a sleeve should end,
              how much of a cuff a man ought to show. We have been making
              that argument from the same three rooms on Sackville Street
              since 1908.
            </p>
            <p className="body-copy">
              Every garment begins as a paper pattern cut for one body and
              kept for life. Nothing is graded from a block. Nothing is
              fused. The canvas is floated by hand, the collar set by eye,
              and the buttonholes worked with silk in a single sitting.
            </p>
          </Reveal>

          <Reveal className="mt-14" y={18}>
            <dl className="grid grid-cols-3 gap-6 border-t border-bone/10 pt-8 md:max-w-lg">
              {[
                ["218", "Hand operations"],
                ["11", "Weeks to make"],
                ["1908", "On the Row since"],
              ].map(([figure, label]) => (
                <div key={label}>
                  <dt className="display text-[2rem] text-champagne md:text-[2.6rem]">
                    {figure}
                  </dt>
                  <dd className="mt-2 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-mute">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <ParallaxImage
            asset={assets.editorialGlove}
            clip
            zoom
            strength={9}
            tone={0.92}
            className="aspect-4/5 w-full lg:aspect-3/4"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <Reveal className="mt-5" y={14}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-mute">
              Fig. 01 — Charcoal flannel, cut on the half-canvas
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
