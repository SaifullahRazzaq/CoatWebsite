"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { FABRICS } from "@/data/fabrics";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";

/**
 * The bunch, on the table.
 *
 * One cloth fills the frame at a time. The selector along the foot of the
 * section is draggable rather than paged, because that is how a bunch book
 * actually behaves under the hand — you push it along and stop where you like.
 *
 * The plates are stacked and cross-faded rather than swapped, so changing
 * cloth is a dissolve between two weaves and never a flash of empty frame.
 * Specifications change on the same beat.
 */
export default function ClothSection() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { still } = useMotionProfile();

  const fabric = FABRICS[active];

  /* ---- Drag the rail, the way a bunch book is pushed along ----------- */
  useIsomorphicLayoutEffect(() => {
    const el = rail.current;
    if (!el) return;

    let down = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    const onDown = (event: PointerEvent) => {
      down = true;
      moved = 0;
      startX = event.clientX;
      startScroll = el.scrollLeft;
    };
    const onMove = (event: PointerEvent) => {
      if (!down) return;
      const dx = event.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      down = false;
    };
    // A drag must not also register as a click on whichever swatch it ended
    // over, or pushing the rail along silently changes the cloth.
    const onClickCapture = (event: MouseEvent) => {
      if (moved > 6) {
        event.stopPropagation();
        event.preventDefault();
        moved = 0;
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClickCapture, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  /* ---- The plate breathes as the section passes ---------------------- */
  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el || still) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-cloth-plate]",
        { scale: 1.16 },
        {
          scale: 1,
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
      id="cloth"
      className="relative min-h-[100svh] overflow-hidden bg-ink"
    >
      {/* The cloth, full bleed */}
      <div className="absolute inset-0">
        <div data-cloth-plate className="absolute inset-[-8%]">
          {FABRICS.map((item, i) => (
            <Image
              key={item.id}
              src={item.asset.src}
              alt={i === active ? item.asset.alt : ""}
              aria-hidden={i !== active}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                objectPosition: item.asset.focal ?? "center",
                opacity: i === active ? 1 : 0,
                filter: `brightness(${item.tone}) contrast(1.1) saturate(0.66)`,
              }}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,10,0.86) 0%, rgba(8,8,10,0.34) 34%, rgba(8,8,10,0.5) 66%, rgba(8,8,10,0.94) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1560px] flex-col justify-between px-6 py-[14vh] md:px-10 lg:px-14">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4">
              <span className="hairline inline-block h-px w-10" />
              The Cloth
            </p>
          </Reveal>
          <RevealText
            as="h2"
            className="display text-[clamp(2.5rem,8vw,6rem)] text-bone"
            lineClassName="pb-[0.06em]"
            lines={[
              <>From mills chosen</>,
              <>not for reputation,</>,
              <span key="c" className="italic text-champagne/90">but for character.</span>,
            ]}
          />
        </div>

        {/* Specification + selector */}
        <div className="mt-[10vh] grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            {/* aria-live so the specification is announced when the cloth
                changes — the swatch names alone do not say what changed. */}
            <dl aria-live="polite" className="border-t border-bone/15 pt-7">
              <div className="flex items-baseline justify-between gap-6">
                <dt className="sr-only">Quality</dt>
                <dd className="display text-[clamp(1.5rem,3vw,2.25rem)] text-bone">
                  {fabric.quality}
                </dd>
              </div>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.24em] text-mute">
                <span>
                  <dt className="sr-only">Weight</dt>
                  <dd className="inline text-champagne/80">{fabric.weight}</dd>
                </span>
                <span>
                  <dt className="sr-only">Mill</dt>
                  <dd className="inline">{fabric.mill}</dd>
                </span>
              </div>
              <p className="body-copy mt-6 max-w-md">{fabric.note}</p>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-mute">
              Drag the bunch
            </p>
            <div
              ref={rail}
              data-cursor="Drag"
              className="flex touch-pan-y select-none gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {FABRICS.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(i)}
                  onPointerEnter={() => setActive(i)}
                  aria-pressed={i === active}
                  className={[
                    "group relative shrink-0 border px-7 py-5 text-left transition-colors duration-700",
                    i === active
                      ? "border-champagne/60 bg-ink/50"
                      : "border-bone/15 bg-ink/25 hover:border-bone/35",
                  ].join(" ")}
                >
                  <span className="block text-[10px] tracking-[0.2em] text-champagne/70">
                    0{i + 1}
                  </span>
                  <span className="display mt-2 block text-[1.6rem] text-bone">
                    {item.name}
                  </span>
                  <span
                    aria-hidden
                    className={[
                      "absolute bottom-0 left-0 h-px bg-champagne transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      i === active ? "w-full" : "w-0 group-hover:w-full",
                    ].join(" ")}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
