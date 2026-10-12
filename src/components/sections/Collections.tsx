"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { assets, type Asset } from "@/lib/assets";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";

type Collection = {
  index: string;
  name: string;
  cloth: string;
  note: string;
  asset: Asset;
  /** Per-image grade: [at rest, on hover] as {brightness, saturate}. */
  grade?: { rest: [number, number]; hot: [number, number] };
};

const COLLECTIONS: Collection[] = [
  {
    index: "01",
    name: "Signature Suits",
    cloth: "Worsted · 11oz",
    note: "The house cut. Soft shoulder, closed quarters, a long lapel roll.",
    asset: assets.collectionSignature,
  },
  {
    index: "02",
    name: "Evening Collection",
    cloth: "Barathea · Grosgrain",
    note: "Midnight rather than black. Silk facings, no vent, cut to be still.",
    asset: assets.collectionEvening,
    // A scarlet cloth photographed in daylight — pulled well down so it reads
    // as an accent rather than as a different website.
    grade: { rest: [0.6, 0.42], hot: [0.76, 0.56] },
  },
  {
    index: "03",
    name: "Business Collection",
    cloth: "Flannel · 13oz",
    note: "Built for eleven-hour days and the back of a car.",
    asset: assets.collectionBusiness,
    grade: { rest: [0.72, 0.45], hot: [0.9, 0.6] },
  },
  {
    index: "04",
    name: "Wedding Collection",
    cloth: "Linen · Mohair",
    note: "Photographed for fifty years. Cut accordingly.",
    asset: assets.collectionWedding,
  },
];

/**
 * Editorial rows rather than product cards.
 *
 * Each row is a full-bleed plate with the title laid over it. On wide screens
 * rows alternate their alignment and the image answers the pointer with a slow
 * push-in; on narrow screens the same rows stack as full-width plates.
 */
export default function Collections() {
  const section = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const { full, still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el || still) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-collection]").forEach((row) => {
        const frame = row.querySelector("[data-frame]");
        const media = row.querySelector("[data-media]");
        if (!frame || !media) return;

        // Wipe the plate open.
        gsap.fromTo(
          frame,
          { clipPath: "inset(14% 8% 14% 8%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 2,
            ease: "expo.out",
            scrollTrigger: { trigger: row, start: "top 82%", once: true },
          },
        );

        // Slow drift within the frame.
        gsap.fromTo(
          media,
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.02,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [full, still]);

  return (
    <section
      ref={section}
      id="collection"
      className="relative bg-ink py-[14vh] md:py-[18vh]"
    >
      <div className="mx-auto mb-[8vh] max-w-[1560px] px-6 md:px-10 lg:px-14">
        <Reveal>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="hairline inline-block h-px w-10" />
            The Collections
          </p>
        </Reveal>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <RevealText
            as="h2"
            className="display text-[clamp(2.5rem,7vw,5.5rem)] text-bone"
            lineClassName="pb-[0.06em]"
            lines={[<>Four ways to be</>, <span key="b" className="italic text-champagne/90">dressed</span>]}
          />
          <Reveal className="lg:pb-4" y={16}>
            <p className="body-copy max-w-xs">
              Every commission begins in one of these four registers, and then
              stops being any of them.
            </p>
          </Reveal>
        </div>
      </div>

      <div>
        {COLLECTIONS.map((item, i) => {
          const isHot = hovered === item.name;
          const flip = i % 2 === 1;
          const [bright, sat] = isHot
            ? (item.grade?.hot ?? [0.95, 0.82])
            : (item.grade?.rest ?? [0.78, 0.66]);

          return (
            <article
              key={item.name}
              data-collection
              data-cursor="Explore"
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
              className="group relative border-t border-bone/10 last:border-b"
            >
              <a href="#contact" className="block">
                <div
                  className={`mx-auto flex max-w-[1560px] flex-col gap-6 px-6 py-8 md:px-10 lg:flex-row lg:items-center lg:gap-14 lg:px-14 lg:py-10 ${
                    flip ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Plate */}
                  <div
                    data-frame
                    className="relative aspect-16/11 w-full overflow-hidden bg-charcoal sm:aspect-2/1 lg:aspect-4/3 lg:w-[46%]"
                  >
                    <div data-media className="absolute -inset-y-[10%] inset-x-0">
                      <Image
                        src={item.asset.src}
                        alt={item.asset.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 46vw"
                        className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          objectPosition: item.asset.focal ?? "center",
                          filter: `brightness(${bright}) contrast(1.1) saturate(${sat})`,
                          transform: isHot ? "scale(1.06)" : "scale(1)",
                          transition:
                            "transform 1600ms cubic-bezier(0.16,1,0.3,1), filter 1200ms cubic-bezier(0.16,1,0.3,1)",
                        }}
                      />
                    </div>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent"
                    />
                  </div>

                  {/* Caption */}
                  <div className="lg:w-[54%]">
                    <div className="flex items-baseline gap-5">
                      <span className="display text-[1.25rem] text-champagne/80">
                        {item.index}
                      </span>
                      <span className="hairline h-px flex-1" />
                      <span className="text-[10px] uppercase tracking-[0.22em] text-mute">
                        {item.cloth}
                      </span>
                    </div>

                    <h3
                      className="display mt-6 text-[clamp(2rem,6.5vw,4.75rem)] leading-[0.95] transition-colors duration-700"
                      style={{ color: isHot ? "var(--color-champagne)" : "var(--color-bone)" }}
                    >
                      {item.name}
                    </h3>

                    <p className="body-copy mt-5 max-w-sm">{item.note}</p>

                    <span className="mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-bone-dim">
                      Enquire
                      <span
                        aria-hidden
                        className="block h-px bg-champagne transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ width: isHot ? 64 : 24 }}
                      />
                    </span>
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
