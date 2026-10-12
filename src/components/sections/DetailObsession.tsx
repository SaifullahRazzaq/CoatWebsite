"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { assets, type Asset } from "@/lib/assets";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";

type Item = {
  index: string;
  title: string;
  body: string;
  asset: Asset;
  tone: number;
};

const ITEMS: Item[] = [
  {
    index: "01",
    title: "The Lapel",
    body: "A line defined by hand, not automation. Padded with a thousand small stitches so it rolls rather than folds, and holds that roll for thirty years.",
    asset: assets.detailFastening,
    tone: 0.4,
  },
  {
    index: "02",
    title: "The Button",
    body: "Horn. Mother of pearl. Chosen one at a time against the cloth, in daylight, because under a workroom lamp every brown is the same brown.",
    asset: assets.detailButtons,
    tone: 0.36,
  },
  {
    index: "03",
    title: "The Stitch",
    body: "Almost invisible. Entirely intentional. The pick stitch along an edge is not decoration — it is what stops that edge from ever going flat.",
    asset: assets.clothGrey,
    tone: 0.34,
  },
  {
    index: "04",
    title: "The Lining",
    body: "The detail seen by almost no one. Which is precisely why it is cut from the better cloth, and why we ask you to choose it yourself.",
    asset: assets.detailRail,
    tone: 0.3,
  },
];

/**
 * Four details, held one at a time.
 *
 * Desktop pins the section and scrubs through the four items: the text
 * cross-fades on the left while the plate on the right wipes upward, so each
 * detail uncovers the next rather than dissolving into it.
 *
 * Below `lg` the pin is dropped entirely — a pinned split screen on a phone is
 * a pinned column, which is worse than no pin at all — and the same four items
 * are rebuilt as a plain stacked sequence.
 */
export default function DetailObsession() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const { full, still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el || !full || still) return;

    const ctx = gsap.context(() => {
      const span = 1 / ITEMS.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * (ITEMS.length - 0.15) * 1.1}`,
          pin: stage.current,
          pinSpacing: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(
              ITEMS.length - 1,
              Math.floor(self.progress / span + 0.0001),
            );
            setCurrent(i);
          },
        },
        defaults: { ease: "none" },
      });

      // Each plate rises over the one before it.
      for (let i = 1; i < ITEMS.length; i += 1) {
        tl.fromTo(
          `[data-detail-frame="${i}"]`,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: span * 0.62,
            ease: "power2.inOut",
          },
          span * i - span * 0.31,
        );
      }

      // A slow push across the whole sequence keeps the held shots alive.
      tl.fromTo(
        "[data-detail-zoom]",
        { scale: 1.12 },
        { scale: 1, duration: 1 },
        0,
      );
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [full, still]);

  return (
    <section
      ref={section}
      id="detail"
      className="relative bg-pitch"
      aria-label="Detail"
    >
      {/* ---- Desktop: pinned split ---- */}
      <div ref={stage} className="hidden lg:block">
        <div className="relative flex h-[100svh] items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-[1560px] grid-cols-12 items-center gap-16 px-14">
            {/* Text */}
            <div className="relative col-span-5 h-[46vh]">
              <p className="eyebrow mb-10 flex items-center gap-4">
                <span className="hairline inline-block h-px w-10" />
                Detail
              </p>
              {ITEMS.map((item, i) => (
                <div
                  key={item.index}
                  aria-hidden={i !== current}
                  className="absolute inset-x-0 top-16 transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: i === current ? 1 : 0,
                    transform: `translateY(${(i - current) * 22}px)`,
                  }}
                >
                  <span className="display text-[1.5rem] text-champagne/80">
                    {item.index}
                  </span>
                  <h3 className="display mt-3 text-[clamp(2.4rem,4.2vw,4rem)] text-bone">
                    {item.title}
                  </h3>
                  <p className="body-copy mt-6 max-w-md">{item.body}</p>
                </div>
              ))}

              {/* Progress through the four. */}
              <div className="absolute bottom-0 left-0 flex items-center gap-3">
                {ITEMS.map((item, i) => (
                  <span
                    key={item.index}
                    aria-hidden
                    className={`h-px transition-all duration-700 ${
                      i === current
                        ? "w-10 bg-champagne"
                        : "w-5 bg-bone/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Plates */}
            <div className="col-span-7">
              <div className="relative aspect-4/5 w-full overflow-hidden">
                {ITEMS.map((item, i) => (
                  <div
                    key={item.index}
                    data-detail-frame={i}
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath:
                        i === 0 ? "inset(0%)" : "inset(100% 0% 0% 0%)",
                    }}
                  >
                    <div data-detail-zoom className="absolute inset-[-6%]">
                      <Image
                        src={item.asset.src}
                        alt={item.asset.alt}
                        fill
                        sizes="55vw"
                        className="object-cover"
                        style={{
                          objectPosition: item.asset.focal ?? "center",
                          filter: `brightness(${item.tone}) contrast(1.12) saturate(0.4)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(78% 70% at 50% 50%, transparent 40%, rgba(8,8,10,0.5) 84%, rgba(8,8,10,0.86) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Below lg: the same four, stacked ---- */}
      <div className="px-6 py-[13vh] md:px-10 lg:hidden">
        <div className="mb-[8vh]">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4">
              <span className="hairline inline-block h-px w-10" />
              Detail
            </p>
          </Reveal>
          <RevealText
            as="h2"
            className="display text-[clamp(2.4rem,8vw,4rem)] text-bone"
            lineClassName="pb-[0.06em]"
            lines={[<>Measured</>, <span key="b" className="italic text-champagne/90">in millimetres.</span>]}
          />
        </div>

        <ol className="space-y-[9vh]">
          {ITEMS.map((item) => (
            <li key={item.index}>
              <div className="relative aspect-4/5 w-full overflow-hidden">
                <Image
                  src={item.asset.src}
                  alt={item.asset.alt}
                  fill
                  sizes="100vw"
                  loading="lazy"
                  className="object-cover"
                  style={{
                    objectPosition: item.asset.focal ?? "center",
                    filter: `brightness(${item.tone}) contrast(1.12) saturate(0.4)`,
                  }}
                />
              </div>
              <span className="mt-6 block display text-[1.4rem] text-champagne/80">
                {item.index}
              </span>
              <h3 className="display mt-2 text-[clamp(1.9rem,7vw,2.75rem)] text-bone">
                {item.title}
              </h3>
              <p className="body-copy mt-4 max-w-md">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
