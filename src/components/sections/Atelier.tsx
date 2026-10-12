"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { assets, type Asset } from "@/lib/assets";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";

type Plate = { asset: Asset; caption: string; tone: number };

const PLATES: Plate[] = [
  { asset: assets.atelierMachine, caption: "The machine, used sparingly", tone: 0.42 },
  { asset: assets.detailSwatches, caption: "Chalk, and a decision", tone: 0.46 },
  { asset: assets.detailRail, caption: "Half-made, resting", tone: 0.44 },
  { asset: assets.detailBunches, caption: "The ledger of every commission", tone: 0.4 },
  { asset: assets.editorialGlove, caption: "The hand that finishes it", tone: 0.5 },
];

/**
 * The workroom, travelled sideways.
 *
 * On desktop the section pins and the plates move horizontally against the
 * scroll — the visitor walks the length of the bench. The statement sits over
 * the top of it in black and white, so the type belongs to the room rather
 * than to the page.
 *
 * Below `lg` a horizontal pin fights the touch gesture, so the plates become
 * an ordinary swipeable rail the visitor drives themselves.
 */
export default function Atelier() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { full, still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    const trackEl = track.current;
    if (!el || !trackEl || !full || still) return;

    const ctx = gsap.context(() => {
      const distance = () =>
        Math.max(0, trackEl.scrollWidth - window.innerWidth + 120);

      gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          pin: stage.current,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [full, still]);

  const heading = (
    <>
      <Reveal>
        <p className="eyebrow mb-8 flex items-center gap-4">
          <span className="hairline inline-block h-px w-10" />
          The Atelier
        </p>
      </Reveal>
      <RevealText
        as="h2"
        className="display text-[clamp(2.6rem,9vw,7rem)] text-bone"
        lineClassName="pb-[0.06em]"
        lines={[<>Made</>, <span key="b" className="italic text-champagne/90">by hand.</span>]}
      />
      <Reveal className="mt-8 max-w-sm" y={20}>
        <p className="body-copy">
          Machines produce consistency. Hands produce character. Three rooms,
          nine cutters, and no shortcut that has ever survived a fitting.
        </p>
      </Reveal>
    </>
  );

  return (
    <section ref={section} id="atelier" className="relative bg-ink">
      {/* ---- Desktop: the bench, travelled sideways ---- */}
      <div ref={stage} className="hidden lg:block">
        <div className="relative h-[100svh] overflow-hidden">
          <div className="absolute inset-y-0 left-0 z-[2] flex w-[38vw] flex-col justify-center px-14">
            {heading}
          </div>
          {/* Keeps the type legible as plates pass behind it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[46vw]"
            style={{
              background:
                "linear-gradient(90deg, var(--color-ink) 34%, rgba(8,8,10,0.72) 66%, transparent 100%)",
            }}
          />

          <div className="flex h-full items-center">
            <div
              ref={track}
              className="flex shrink-0 items-center gap-8 pl-[42vw] will-change-transform"
            >
              {PLATES.map((plate) => (
                <figure key={plate.caption} className="w-[30vw] shrink-0">
                  <div className="relative aspect-3/4 w-full overflow-hidden">
                    <Image
                      src={plate.asset.src}
                      alt={plate.asset.alt}
                      fill
                      sizes="30vw"
                      loading="lazy"
                      className="object-cover"
                      style={{
                        objectPosition: plate.asset.focal ?? "center",
                        // The workroom is remembered in black and white.
                        filter: `grayscale(1) brightness(${plate.tone}) contrast(1.16)`,
                      }}
                    />
                  </div>
                  <figcaption className="mt-4 text-[10px] uppercase tracking-[0.22em] text-mute">
                    {plate.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Below lg: a rail the visitor drives ---- */}
      <div className="py-[13vh] lg:hidden">
        <div className="mb-[7vh] px-6 md:px-10">{heading}</div>
        <div
          data-cursor="Drag"
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PLATES.map((plate) => (
            <figure key={plate.caption} className="w-[74vw] shrink-0 snap-start">
              <div className="relative aspect-3/4 w-full overflow-hidden">
                <Image
                  src={plate.asset.src}
                  alt={plate.asset.alt}
                  fill
                  sizes="74vw"
                  loading="lazy"
                  className="object-cover"
                  style={{
                    objectPosition: plate.asset.focal ?? "center",
                    filter: `grayscale(1) brightness(${plate.tone}) contrast(1.16)`,
                  }}
                />
              </div>
              <figcaption className="mt-4 text-[10px] uppercase tracking-[0.22em] text-mute">
                {plate.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
