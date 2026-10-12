"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FABRICS } from "@/data/fabrics";
import SuitPlate from "@/components/hero/SuitPlate";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";

type Choice = {
  label: string;
  /** Shown on the summary docket. */
  short: string;
  /** Only the options that actually change the plate carry one. */
  accent?: string;
  fabric?: number;
};

type Row = { id: string; label: string; choices: Choice[] };

/**
 * The commission, as a docket.
 *
 * A configurator that pretended to re-render a bespoke garment from six
 * dropdowns would be lying — the whole argument of the site is that this
 * garment does not exist until it is cut. So the choices that can honestly be
 * shown are shown: the cloth behind the plate changes, the lining warms the
 * light, and everything else is recorded on the docket the way a cutter would
 * write it down. The visitor is composing an order, not previewing a product.
 */
const ROWS: Row[] = [
  {
    id: "lapel",
    label: "Lapel",
    choices: [
      { label: "Peak", short: "Peak" },
      { label: "Notch", short: "Notch" },
      { label: "Shawl", short: "Shawl" },
    ],
  },
  {
    id: "cloth",
    label: "Cloth",
    choices: FABRICS.slice(0, 4).map((f, i) => ({
      label: f.name,
      short: f.quality,
      fabric: i,
    })),
  },
  {
    id: "button",
    label: "Button",
    choices: [
      { label: "Horn", short: "Dark horn" },
      { label: "Pearl", short: "Mother of pearl" },
      { label: "Covered", short: "Silk covered" },
    ],
  },
  {
    id: "lining",
    label: "Lining",
    choices: [
      { label: "Oxblood", short: "Oxblood silk", accent: "#5e1f24" },
      { label: "Ivory", short: "Ivory silk", accent: "#c9c0ae" },
      { label: "Forest", short: "Forest silk", accent: "#23392f" },
      { label: "Champagne", short: "Champagne silk", accent: "#c8a96b" },
    ],
  },
  {
    id: "pocket",
    label: "Pocket",
    choices: [
      { label: "Jetted", short: "Jetted" },
      { label: "Flap", short: "Flapped" },
      { label: "Patch", short: "Patch" },
    ],
  },
  {
    id: "monogram",
    label: "Monogram",
    choices: [
      { label: "None", short: "No monogram" },
      { label: "Inside pocket", short: "Pocket monogram" },
      { label: "Under collar", short: "Collar monogram" },
    ],
  },
];

export default function Personalisation() {
  const section = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<Record<string, number>>(() =>
    Object.fromEntries(ROWS.map((row) => [row.id, 0])),
  );

  const choiceOf = (row: Row) => row.choices[picked[row.id] ?? 0];
  const clothRow = ROWS.find((r) => r.id === "cloth")!;
  const liningRow = ROWS.find((r) => r.id === "lining")!;
  const fabric = FABRICS[choiceOf(clothRow).fabric ?? 0];
  const accent = choiceOf(liningRow).accent ?? "#5e1f24";

  return (
    <section
      ref={section}
      id="personalise"
      className="relative overflow-hidden bg-ink py-[14vh] md:py-[18vh]"
    >
      <div className="mx-auto max-w-[1560px] px-6 md:px-10 lg:px-14">
        <div className="mb-[9vh] max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4">
              <span className="hairline inline-block h-px w-10" />
              Personalisation
            </p>
          </Reveal>
          <RevealText
            as="h2"
            className="display text-[clamp(2.5rem,7vw,5.5rem)] text-bone"
            lineClassName="pb-[0.06em]"
            lines={[
              <>Yours,</>,
              <>down to the</>,
              <span key="c" className="italic text-champagne/90">last detail.</span>,
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* The plate */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden bg-charcoal">
              {/* The chosen cloth, behind the garment. */}
              <div className="absolute inset-0">
                {FABRICS.map((item) => (
                  <Image
                    key={item.id}
                    src={item.asset.src}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    loading="lazy"
                    className="object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: fabric.id === item.id ? 1 : 0,
                      filter: `brightness(${item.tone * 0.5}) contrast(1.1) saturate(0.5)`,
                    }}
                  />
                ))}
              </div>

              {/* The lining, as light rather than as a swatch. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-[background] duration-[1200ms]"
                style={{
                  background: `radial-gradient(66% 54% at 50% 64%, ${accent}, transparent 72%)`,
                  opacity: 0.3,
                  mixBlendMode: "screen",
                }}
              />

              <div className="relative flex items-center justify-center p-8">
                <SuitPlate
                  plain
                  feather
                  className="h-[46vh] w-auto max-w-full lg:h-[52vh]"
                  sizes="(max-width: 1024px) 90vw, 34vw"
                />
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(76% 66% at 50% 50%, transparent 42%, rgba(8,8,10,0.66) 88%)",
                }}
              />
            </div>

            {/* The docket */}
            <p
              aria-live="polite"
              className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-mute"
            >
              {ROWS.map((row, i) => (
                <span key={row.id}>
                  <span className="text-bone-dim">{choiceOf(row).short}</span>
                  {i < ROWS.length - 1 && (
                    <span aria-hidden className="ml-3 text-champagne/40">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </p>
          </div>

          {/* The choices */}
          <div className="lg:col-span-7">
            <dl>
              {ROWS.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 gap-3 border-t border-bone/10 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <dt className="text-[10px] uppercase tracking-[0.26em] text-mute sm:col-span-3">
                    {row.label}
                  </dt>
                  <dd className="flex flex-wrap gap-x-7 gap-y-3 sm:col-span-9">
                    {row.choices.map((choice, i) => {
                      const on = (picked[row.id] ?? 0) === i;
                      return (
                        <button
                          key={choice.label}
                          type="button"
                          aria-pressed={on}
                          onClick={() =>
                            setPicked((prev) => ({ ...prev, [row.id]: i }))
                          }
                          className="group relative flex items-center gap-2.5 py-1"
                        >
                          {choice.accent && (
                            <span
                              aria-hidden
                              className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-bone/25"
                              style={{ backgroundColor: choice.accent }}
                            />
                          )}
                          <span
                            className={`display text-[1.35rem] transition-colors duration-500 ${
                              on
                                ? "text-champagne"
                                : "text-bone-dim group-hover:text-bone"
                            }`}
                          >
                            {choice.label}
                          </span>
                          <span
                            aria-hidden
                            className={`absolute -bottom-0.5 left-0 h-px bg-champagne transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              on ? "w-full" : "w-0 group-hover:w-full"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </dd>
                </div>
              ))}
            </dl>

            <Reveal className="mt-12" y={18}>
              <Magnetic strength={12}>
                <a
                  href="#contact"
                  data-cursor="Enter"
                  className="group relative inline-block overflow-hidden border border-champagne/50 px-10 py-5 text-[10px] uppercase tracking-[0.26em] text-champagne"
                >
                  <span className="relative z-10 transition-colors duration-700 group-hover:text-ink">
                    Begin your commission
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                  />
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
