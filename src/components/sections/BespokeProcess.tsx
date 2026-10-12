"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { assets, type Asset } from "@/lib/assets";
import ParallaxImage from "@/components/ui/ParallaxImage";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";

type Step = {
  index: string;
  title: string;
  body: string;
  meta: string;
  asset: Asset;
};

const STEPS: Step[] = [
  {
    index: "01",
    title: "Consultation",
    body: "An hour in the front room, mostly talking about nothing to do with clothes — how you travel, how you sit, what you do with your hands. A cutter is trying to learn your posture before he ever measures it.",
    meta: "One hour · Sackville Street",
    asset: assets.detailBunches,
  },
  {
    index: "02",
    title: "Fabric",
    body: "The bunches come out onto the cutting table. Worsteds from Huddersfield, flannels from Biella, a linen for August. The cloth decides half the garment before a pattern is drawn.",
    meta: "Nine hundred cloths · Two are right",
    asset: assets.detailSwatches,
  },
  {
    index: "03",
    title: "Measure",
    body: "Thirty-one measurements, and a note on every asymmetry: the lower shoulder, the forward neck, the way one arm hangs further back than the other. Nobody is symmetrical. Blocks pretend otherwise.",
    meta: "31 measurements · By eye and tape",
    asset: assets.editorialGlove,
  },
  {
    index: "04",
    title: "Baste Fitting",
    body: "A garment held together with white basting thread, deliberately unfinished. It is chalked on your body, taken apart at the seams, and cut again. This is the fitting that does the work.",
    meta: "Calico and chalk · Week four",
    asset: assets.atelierMachine,
  },
  {
    index: "05",
    title: "Final Fit",
    body: "Most houses fit twice. We fit three times, because the third is where a shoulder finally stops fighting you. Sleeve length, the break of the trouser, the roll of the lapel — settled here.",
    meta: "Third fitting · Week nine",
    asset: assets.detailRail,
  },
  {
    index: "06",
    title: "Delivery",
    body: "Two hundred and eighteen operations, almost all of them with a needle. Your paper pattern is then filed under your name and kept for life, against the second commission.",
    meta: "218 operations · Week eleven",
    asset: assets.collectionSignature,
  },
];

/**
 * The commission, told in six movements.
 *
 * Desktop pins a plate on the left while the six stages pass on the right,
 * cross-fading the image as each becomes current. Below `lg` the pin is
 * dropped entirely and the section is rebuilt as a stacked sequence — the
 * choreography survives, the layout does not carry over.
 */
export default function BespokeProcess() {
  const section = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const { full, still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el || !full || still) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-step]");

      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 62%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setCurrent(i),
        });

        gsap.fromTo(
          item,
          { opacity: 0.25 },
          {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 78%", once: true },
          },
        );
      });

      // Progress rule, drawn as the section is traversed.
      gsap.fromTo(
        "[data-progress]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: "[data-steps]",
            start: "top 60%",
            end: "bottom 70%",
            scrub: 0.6,
          },
        },
      );
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [full, still]);

  return (
    <section
      ref={section}
      id="bespoke"
      className="relative bg-ink py-[14vh] md:py-[18vh]"
    >
      <div className="mx-auto max-w-[1560px] px-6 md:px-10 lg:px-14">
        <div className="mb-[10vh] max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4">
              <span className="hairline inline-block h-px w-10" />
              The Bespoke Journey
            </p>
          </Reveal>
          <RevealText
            as="h2"
            className="display text-[clamp(2.5rem,7vw,5.5rem)] text-bone"
            lineClassName="pb-[0.06em]"
            lines={[
              <>Tailored to</>,
              <span key="b" className="italic text-champagne/90">perfection</span>,
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-12">
          {/* Pinned plate — desktop only */}
          <div className="hidden lg:col-span-5 lg:block">
            <div
              ref={sticky}
              className="sticky top-[16vh] h-[62vh] overflow-hidden"
            >
              {STEPS.map((step, i) => (
                <div
                  key={step.index}
                  aria-hidden={i !== current}
                  className="absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ opacity: i === current ? 1 : 0 }}
                >
                  <ParallaxImage
                    asset={step.asset}
                    strength={6}
                    tone={0.55}
                    className="h-full w-full"
                    sizes="40vw"
                  />
                </div>
              ))}

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between p-7">
                <span className="display text-[3.5rem] leading-none text-champagne/85">
                  {STEPS[current].index}
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-bone-dim">
                  {STEPS[current].meta}
                </span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div data-steps className="relative lg:col-span-7">
            <span
              aria-hidden
              className="absolute left-0 top-0 hidden h-full w-px bg-bone/10 lg:block"
            >
              <span
                data-progress
                className="block h-full w-px origin-top scale-y-0 bg-champagne/60"
              />
            </span>

            <ol className="lg:pl-12">
              {STEPS.map((step) => (
                <li
                  key={step.index}
                  data-step
                  className="border-b border-bone/10 py-12 last:border-b-0 md:py-16 lg:py-[9vh]"
                >
                  {/* Plate repeats inline below lg, where nothing is pinned. */}
                  <div className="mb-8 lg:hidden">
                    <ParallaxImage
                      asset={step.asset}
                      clip
                      strength={8}
                      tone={0.6}
                      className="aspect-16/10 w-full"
                      sizes="100vw"
                    />
                  </div>

                  <div className="flex items-baseline gap-5">
                    <span className="display text-[1.5rem] text-champagne/80 lg:text-[1.75rem]">
                      {step.index}
                    </span>
                    <span className="hairline h-px flex-1" />
                  </div>

                  <h3 className="display mt-5 text-[clamp(1.9rem,5vw,3.25rem)] text-bone">
                    {step.title}
                  </h3>
                  <p className="body-copy mt-5 max-w-xl">{step.body}</p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-mute lg:hidden">
                    {step.meta}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
