"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import SuitPlate from "@/components/hero/SuitPlate";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";

type Hotspot = {
  id: string;
  label: string;
  detail: string;
  /** Position as a percentage of the 1000 × 1500 drawing. */
  x: number;
  y: number;
  /** Which side the callout opens toward on wide screens. */
  side: "left" | "right";
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "lapel",
    label: "The Lapel",
    detail:
      "A peak lapel, rolled rather than pressed, cut wide enough to carry the shoulder and finishing a fraction above the button so the chest reads long.",
    x: 30,
    y: 27,
    side: "left",
  },
  {
    id: "pocket",
    label: "Breast Pocket",
    detail:
      "A welted breast pocket set on the cloth's own angle, deep enough to hold a silk square without the mouth gaping.",
    x: 84,
    y: 34,
    side: "right",
  },
  {
    id: "cloth",
    label: "The Cloth",
    detail:
      "Barathea: a fine twill woven tight enough to read as matte black under light, which is why it has faced evening coats for a century.",
    x: 68,
    y: 55,
    side: "right",
  },
  {
    id: "stance",
    label: "The Stance",
    detail:
      "One covered button on the natural waist. On an evening coat the stance is the whole argument — a centimetre low and the line collapses.",
    x: 44.5,
    y: 70,
    side: "left",
  },
  {
    id: "cuff",
    label: "The Cuff",
    detail:
      "Four working buttonholes, kissing rather than spaced, on a sleeve finished to show a centimetre and a half of shirt linen.",
    x: 92,
    y: 90,
    side: "right",
  },
];

/**
 * An annotated garment. The same vector suit as the hero, at rest, with its
 * details available on hover, focus or tap.
 *
 * The wrapper is locked to the drawing's 2:3 ratio so the percentage-positioned
 * hotspots stay welded to the artwork at every width.
 */
export default function SuitAnatomy() {
  const section = useRef<HTMLElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const { full, still } = useMotionProfile();

  const current = HOTSPOTS.find((h) => h.id === active) ?? null;

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el || still) return;

    const ctx = gsap.context(() => {
      // The figure rises and settles as the section is entered.
      gsap.fromTo(
        figure.current,
        { yPercent: full ? 5 : 3, scale: 1.03, opacity: 0 },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 72%", once: true },
        },
      );

      gsap.fromTo(
        "[data-hotspot]",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          stagger: 0.14,
          delay: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [full, still]);

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-pitch py-[13vh] md:py-[16vh]"
    >
      <div className="mx-auto max-w-[1560px] px-6 md:px-10 lg:px-14">
        <div className="mb-[5vh] max-w-2xl md:mb-[7vh]">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4">
              <span className="hairline inline-block h-px w-10" />
              Anatomy
            </p>
          </Reveal>
          <RevealText
            as="h2"
            className="display text-[clamp(2.2rem,6vw,4.5rem)] text-bone"
            lineClassName="pb-[0.06em]"
            lines={[<>Read the garment.</>]}
          />
          <Reveal className="mt-6" y={18}>
            <p className="body-copy max-w-md">
              Five decisions that separate a bespoke coat from a bought one.
              Select a marker to read each.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:col-start-1">
            <div
              ref={figure}
              // SuitPlate carries the photograph's own aspect ratio, so the
              // percentage-placed markers stay welded to real seams at every
              // width.
              className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px]"
              onMouseLeave={() => setActive(null)}
            >
              <SuitPlate
                plain
                className="w-full"
                sizes="(max-width: 1024px) 80vw, 34vw"
              />

              {HOTSPOTS.map((spot) => {
                const isOn = spot.id === active;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    data-hotspot
                    data-cursor="on"
                    aria-pressed={isOn}
                    onMouseEnter={() => setActive(spot.id)}
                    onFocus={() => setActive(spot.id)}
                    onClick={() => setActive(isOn ? null : spot.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  >
                    <span className="sr-only">{spot.label}</span>
                    <span
                      aria-hidden
                      className={`relative block h-3 w-3 rounded-full border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOn
                          ? "scale-125 border-champagne bg-champagne"
                          : "border-champagne/60 bg-champagne/20"
                      }`}
                    >
                      <span
                        className={`absolute -inset-2 rounded-full border border-champagne/30 transition-opacity duration-700 ${
                          isOn ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </span>

                    {/* Callout — wide screens only; small screens read the panel. */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
                        spot.side === "left"
                          ? "right-6 text-right"
                          : "left-6 text-left"
                      } ${isOn ? "opacity-100" : "translate-x-0 opacity-0"}`}
                    >
                      <span className="block text-[10px] uppercase tracking-[0.24em] text-champagne">
                        {spot.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="min-h-[13rem] border-t border-bone/10 pt-8 lg:min-h-[16rem]">
              <p className="text-[10px] uppercase tracking-[0.24em] text-champagne/80">
                {current ? current.label : "Select a marker"}
              </p>
              <p
                key={current?.id ?? "empty"}
                className="body-copy mt-5 max-w-md animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
              >
                {current
                  ? current.detail
                  : "Each marker opens a note on how that part of the coat is made, and why it is made that way."}
              </p>
            </div>

            {/* A plain, always-available list — the hotspots are an enhancement. */}
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {HOTSPOTS.map((spot) => (
                <li key={spot.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setActive(spot.id === active ? null : spot.id)
                    }
                    className={`text-[10px] uppercase tracking-[0.22em] transition-colors duration-500 ${
                      spot.id === active
                        ? "text-champagne"
                        : "text-mute hover:text-bone"
                    }`}
                  >
                    {spot.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
