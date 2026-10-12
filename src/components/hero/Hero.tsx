"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { onEntered } from "@/lib/entrance";
import { assets } from "@/lib/assets";
import Atmosphere from "./Atmosphere";
import SuitPlate from "./SuitPlate";
import { REGIONS } from "./suit-layers";
import ClothScene from "./scenes/ClothScene";
import DetailScene, { DETAIL_PLATE_COUNT } from "./scenes/DetailScene";

/**
 * The hero is a six-scene film on one 0→1 master timeline, scrubbed by a
 * single pin. Scenes overlap at their seams so the camera is always already
 * moving when the next one arrives — nothing in here ever cuts.
 *
 *   00.00–00.07  the room. an edge light, and a title card
 *   00.05–00.21  SCENE 01 · THE FABRIC — a bolt of wool, held very close
 *   00.19–00.34  SCENE 02 · THE CUT — the chalk lines are drawn, the cloth opens
 *   00.32–00.55  SCENE 03 · CONSTRUCTION — parts arrive on separate planes
 *   00.55–00.70  SCENE 04 · DETAILS — the camera goes in; plates wipe past
 *   00.70–00.91  SCENE 05 · ASSEMBLY — the garment closes, part by part
 *   00.88–00.97  SCENE 06 · THE REVEAL — the camera eases back
 *   00.96–01.00  the push into the cloth that carries into the next section
 *
 * To re-time the film, move these numbers. Everything else reads from them.
 */
const SCENE = {
  open: [0.0, 0.07],
  cloth: [0.05, 0.21],
  cut: [0.19, 0.34],
  build: [0.32, 0.55],
  detail: [0.55, 0.7],
  assemble: [0.7, 0.91],
  reveal: [0.88, 0.97],
  outro: [0.96, 1.0],
} as const;

/** Scene captions, shown one at a time in the corner of frame. */
const MARKERS: { at: number; until: number; index: string; name: string }[] = [
  { at: 0.06, until: 0.2, index: "01", name: "The Fabric" },
  { at: 0.2, until: 0.33, index: "02", name: "The Cut" },
  { at: 0.33, until: 0.54, index: "03", name: "Construction" },
  { at: 0.55, until: 0.69, index: "04", name: "Details" },
  { at: 0.7, until: 0.9, index: "05", name: "Assembly" },
];

/** One masked line of hero copy. */
function Line({ children }: { children: ReactNode }) {
  return (
    <span data-hero-line className="block overflow-hidden">
      <span className="block">{children}</span>
    </span>
  );
}

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const plateWrap = useRef<HTMLDivElement>(null);
  const scrollHint = useRef<HTMLDivElement>(null);

  const { full, reduced, still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const sectionEl = section.current;
    const plateEl = plate.current;
    if (!sectionEl || !plateEl) return;

    const q = gsap.utils.selector(sectionEl);
    const copy = (id: string) => sectionEl.querySelector(`[data-copy="${id}"]`);
    const copyLines = (id: string) =>
      sectionEl.querySelectorAll(`[data-copy="${id}"] [data-hero-line] > *`);

    // Held outside the context so the cleanup below can release it.
    let release: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const layers = new Map<string, HTMLElement>();
      REGIONS.forEach(({ id }) => {
        const node = plateEl.querySelector<HTMLElement>(`[data-region="${id}"]`);
        if (node) layers.set(id, node);
      });
      const allLayers = [...layers.values()];
      const allLines = q("[data-hero-line] > *");

      /* ---- Reduced motion: the finished garment, no film, no pin. ---- */
      if (still) {
        gsap.set(allLayers, {
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          scale: 1,
          filter: "none",
        });
        gsap.set(plateEl, { opacity: 1, scale: 1 });
        gsap.set(allLines, { y: "0%" });
        gsap.set([copy("open"), copy("cloth"), copy("build"), copy("detail")], {
          display: "none",
        });
        gsap.set(copy("reveal"), { opacity: 1 });
        gsap.set(q("[data-scene]"), { display: "none" });
        gsap.set(q("[data-marker]"), { display: "none" });
        gsap.set(scrollHint.current, { opacity: 0, display: "none" });
        return;
      }

      /* ---- Initial state ---------------------------------------------- */
      gsap.set(allLines, { y: "105%" });
      gsap.set(q("[data-copy]"), { opacity: 0 });
      gsap.set(q("[data-marker]"), { opacity: 0 });
      gsap.set(plateEl, { opacity: 0 });
      gsap.set(plateWrap.current, { scale: 1.16 });
      gsap.set(q("[data-cloth-lines] path"), {
        strokeDasharray: 1,
        strokeDashoffset: 1,
      });
      gsap.set(q('[data-scene="outro"]'), { opacity: 0 });
      gsap.set(q("[data-outro-weave]"), { scale: 2.6 });

      const spread = full ? 1 : reduced ? 0.72 : 0.5;
      const maxBlur = full ? 16 : 9;

      REGIONS.forEach(({ id, from, depth }) => {
        const node = layers.get(id);
        if (!node) return;
        // Depth turns one set of offsets into planes: a near part is thrown
        // further and comes back slower, so the camera appears to sit inside
        // the garment rather than in front of it.
        const plane = 0.55 + depth * 1.35;
        gsap.set(node, {
          opacity: 0,
          xPercent: (from.x ?? 0) * spread * plane * 2.4,
          yPercent: (from.y ?? 0) * spread * plane * 2.4,
          rotate: (from.rotate ?? 0) * spread * plane * 2.2,
          scale: 1 + depth * 0.06 * spread,
          filter: `blur(${maxBlur}px)`,
          force3D: true,
        });
      });

      /* ---- Opening titles, held until the curtain is up ---------------- */
      const opening = gsap
        .timeline({ paused: true })
        .to(copy("open"), { opacity: 1, duration: 0.4 })
        .to(
          copyLines("open"),
          { y: "0%", duration: 1.8, stagger: 0.11, ease: "expo.out" },
          "-=0.2",
        )
        .to(scrollHint.current, { opacity: 1, duration: 1.4 }, "-=1.1");

      release = onEntered(() => opening.play());

      /* ---- The film ---------------------------------------------------- */
      const scrollLength = full ? 7 : reduced ? 5.8 : 4.6;

      const film = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: () => `+=${window.innerHeight * scrollLength}`,
          pin: stage.current,
          pinSpacing: true,
          scrub: full ? 1.15 : 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      /** Brings a block of copy in, holds it, and takes it out again. */
      const beat = (id: string, at: number, out: number) => {
        film
          .to(copy(id), { opacity: 1, duration: 0.012 }, at)
          .to(
            copyLines(id),
            { y: "0%", duration: 0.05, stagger: 0.012, ease: "expo.out" },
            at,
          )
          .to(copy(id), { opacity: 0, duration: 0.025 }, out);
      };

      /* Title card out. */
      film
        .to(copy("open"), { opacity: 0, y: -60, duration: 0.03 }, 0.03)
        // `overwrite` matters: the opening timeline may still be fading this
        // hint IN when the visitor starts scrolling, and the film has to win.
        .to(
          scrollHint.current,
          { opacity: 0, duration: 0.02, overwrite: "auto" },
          0.02,
        );

      /* --- SCENE 01 · THE FABRIC --- */
      const cloth = q('[data-scene="cloth"]');
      film
        .to(cloth, { opacity: 1, duration: 0.04 }, SCENE.cloth[0])
        .fromTo(
          q("[data-cloth-image]"),
          { scale: 1.34, rotate: -1.4, yPercent: 4 },
          { scale: 1.06, rotate: 0.6, yPercent: -2, duration: 0.28 },
          SCENE.cloth[0],
        )
        // The light travels the full width of the bolt exactly once.
        .fromTo(
          q("[data-cloth-sheen]"),
          { xPercent: 0, opacity: 0 },
          { xPercent: 460, opacity: 1, duration: 0.2, ease: "power1.inOut" },
          SCENE.cloth[0] + 0.01,
        )
        .to(q("[data-cloth-sheen]"), { opacity: 0, duration: 0.04 }, SCENE.cut[0]);

      beat("cloth", SCENE.cloth[0] + 0.02, SCENE.cut[0] - 0.01);

      /* --- SCENE 02 · THE CUT --- */
      film
        // The chalk is drawn on, line by line.
        .to(
          q("[data-cloth-lines] path"),
          { strokeDashoffset: 0, duration: 0.09, stagger: 0.008, ease: "power1.inOut" },
          SCENE.cut[0],
        )
        // Then the cloth opens out and falls away, taking the chalk with it.
        .to(
          q("[data-cloth-frame]"),
          { scale: 1.3, opacity: 0, duration: 0.09, ease: "power2.in" },
          SCENE.cut[1] - 0.08,
        )
        .set(cloth, { opacity: 0 }, SCENE.cut[1] + 0.005);

      beat("cut", SCENE.cut[0] + 0.03, SCENE.cut[1] - 0.03);

      /* --- SCENE 03 · CONSTRUCTION --- */
      film.to(plateEl, { opacity: 1, duration: 0.05 }, SCENE.build[0]);

      REGIONS.forEach(({ id, from, depth }, i) => {
        const node = layers.get(id);
        if (!node) return;
        // Far parts surface first; the lapels are last to appear.
        const at = SCENE.build[0] + i * 0.018;
        // Parts surface, then keep drifting toward the centre for the rest of
        // the scene — a quarter of the way home, so construction reads as
        // motion arrested rather than as a static exploded diagram.
        film
          .to(node, { opacity: 1, duration: 0.06, ease: "power1.out" }, at)
          .to(
            node,
            {
              xPercent: `-=${(from.x ?? 0) * spread * (0.55 + depth * 1.35) * 0.6}`,
              yPercent: `-=${(from.y ?? 0) * spread * (0.55 + depth * 1.35) * 0.6}`,
              filter: `blur(${maxBlur * 0.55}px)`,
              duration: 0.16,
              ease: "power2.out",
            },
            at,
          );
      });

      // The camera drifts through the scattered parts.
      film.to(
        plateWrap.current,
        { scale: 1.04, duration: 0.22, ease: "power1.inOut" },
        SCENE.build[0],
      );

      beat("build", SCENE.build[0] + 0.05, SCENE.build[1] - 0.02);

      /* --- SCENE 04 · DETAILS --- */
      const detail = q('[data-scene="detail"]');
      film
        .to(detail, { opacity: 1, duration: 0.03 }, SCENE.detail[0])
        .to(detail, { opacity: 0, duration: 0.03 }, SCENE.detail[1] - 0.03)
        // The wide shot goes with it. Leaving the garment faintly visible
        // under a macro plate reads as a layering mistake, not as depth.
        .to(plateWrap.current, { opacity: 0, duration: 0.03 }, SCENE.detail[0])
        .to(
          plateWrap.current,
          { opacity: 1, duration: 0.03 },
          SCENE.detail[1] - 0.03,
        );

      // Each plate wipes the previous one open, and pushes very slightly in
      // while it holds — a held macro shot is never completely still.
      const detailSpan = SCENE.detail[1] - SCENE.detail[0];
      const per = detailSpan / DETAIL_PLATE_COUNT;
      for (let i = 1; i < DETAIL_PLATE_COUNT; i += 1) {
        film.fromTo(
          q(`[data-detail-plate="${i}"]`),
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: per * 0.8,
            ease: "power2.inOut",
          },
          SCENE.detail[0] + per * i,
        );
      }
      film.fromTo(
        q("[data-detail-inner]"),
        { scale: 1.14 },
        { scale: 1.0, duration: detailSpan, ease: "none" },
        SCENE.detail[0],
      );

      beat("detail", SCENE.detail[0] + 0.03, SCENE.detail[1] - 0.035);

      /* --- SCENE 05 · ASSEMBLY --- */
      REGIONS.forEach(({ id, depth }) => {
        const node = layers.get(id);
        if (!node) return;
        const span = SCENE.assemble[1] - SCENE.assemble[0];
        // Parts on the far plane land first; the lapels close last, over
        // everything. Weight, not choreography for its own sake.
        const at = SCENE.assemble[0] + (1 - depth) * span * 0.16;
        const travel = span * (0.62 + depth * 0.3);

        film
          .to(
            node,
            {
              xPercent: 0,
              yPercent: 0,
              rotate: 0,
              scale: 1,
              duration: travel,
              ease: "power2.inOut",
            },
            at,
          )
          .to(
            node,
            { filter: "blur(0px)", duration: travel * 0.8, ease: "power2.out" },
            at,
          );
      });

      // Atmosphere lifts with the garment.
      film
        .fromTo(
          q('[data-atmos="ray"]'),
          { opacity: 0.02, scaleY: 0.72 },
          { opacity: 0.12, scaleY: 1, duration: 0.3, ease: "power1.inOut" },
          SCENE.build[0],
        )
        .fromTo(
          q('[data-atmos="key"]'),
          { opacity: 0.22, xPercent: -10 },
          { opacity: 0.7, xPercent: 0, duration: 0.34, ease: "power1.inOut" },
          SCENE.build[0],
        );

      /* --- SCENE 06 · THE REVEAL --- */
      film.to(
        plateWrap.current,
        { scale: 0.93, duration: 0.12, ease: "power2.out" },
        SCENE.reveal[0],
      );
      film
        .to(copy("reveal"), { opacity: 1, duration: 0.015 }, SCENE.reveal[0] + 0.01)
        .to(
          copyLines("reveal"),
          { y: "0%", duration: 0.06, stagger: 0.014, ease: "expo.out" },
          SCENE.reveal[0] + 0.01,
        );

      /* --- The push into the cloth ------------------------------------- */
      // The camera does not cut away from the finished garment; it goes into
      // it, and the weave it lands on is the ground the next section opens on.
      film
        .to(
          q('[data-scene="outro"]'),
          { opacity: 1, duration: 0.035, ease: "power2.in" },
          SCENE.outro[0],
        )
        .to(
          q("[data-outro-weave]"),
          { scale: 1, duration: 0.04, ease: "power2.out" },
          SCENE.outro[0],
        )
        .to(
          [plateWrap.current, copy("reveal")],
          { opacity: 0, duration: 0.025 },
          SCENE.outro[0] + 0.012,
        );

      /* --- Scene markers ------------------------------------------------ */
      MARKERS.forEach((marker, i) => {
        const el = q(`[data-marker="${i}"]`);
        film
          .to(el, { opacity: 1, duration: 0.012 }, marker.at)
          .to(el, { opacity: 0, duration: 0.012 }, marker.until);
      });
    }, sectionEl);

    ScrollTrigger.refresh();
    return () => {
      release?.();
      ctx.revert();
    };
  }, [full, reduced, still]);

  return (
    <section
      ref={section}
      id="hero"
      className="relative bg-ink"
      aria-label="The making of a bespoke dinner jacket"
    >
      <div
        ref={stage}
        className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden"
      >
        <Atmosphere />
        <ClothScene />

        {/* The garment */}
        <div
          ref={plateWrap}
          className="relative z-[1] flex items-center justify-center will-change-transform"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-[18%] -inset-y-[10%] blur-[70px]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(200,169,107,0.09), transparent 72%)",
            }}
          />
          <SuitPlate
            ref={plate}
            className="relative h-[62svh] w-auto max-w-[78vw] shrink-0 sm:h-[68svh] lg:h-[72svh]"
          />
        </div>

        <DetailScene />

        {/* The weave the film lands on. */}
        <div
          data-scene="outro"
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
        >
          <div
            data-outro-weave
            className="absolute inset-[-6%] origin-center"
            style={{
              backgroundImage: `url("${assets.clothDark.src}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.5) contrast(1.14) saturate(0.66)",
            }}
          />
        </div>

        {/* ---------------------------------------------------------- *
         * Copy. Every block sits in the same centred frame and is
         * brought up by the film, so type is composed with the image
         * rather than laid beside it.
         * ---------------------------------------------------------- */}
        <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center px-6 text-center">
          <div data-copy="open" className="max-w-4xl">
            <p className="eyebrow mb-8 text-[10px]">
              <Line>Bespoke Tailoring · Est. MCMVIII</Line>
            </p>
            <p className="display text-[clamp(2.2rem,7.5vw,5.5rem)] text-bone">
              <Line>The making</Line>
              <Line>
                of a <span className="italic text-champagne/90">presence.</span>
              </Line>
            </p>
          </div>

          <div data-copy="cloth" className="absolute max-w-3xl">
            <p className="display text-[clamp(2rem,6.5vw,4.75rem)] text-bone">
              <Line>It begins</Line>
              <Line>with the cloth.</Line>
            </p>
          </div>

          <div data-copy="cut" className="absolute max-w-3xl">
            <p className="display text-[clamp(2rem,6.5vw,4.75rem)] text-bone">
              <Line>One length.</Line>
              <Line>
                <span className="italic text-champagne/90">One chance.</span>
              </Line>
            </p>
          </div>

          <div data-copy="build" className="absolute max-w-4xl">
            <p className="display text-[clamp(2.1rem,7vw,5.25rem)] text-bone/85">
              <Line>Structure</Line>
              <Line>becomes form.</Line>
            </p>
          </div>

          <div data-copy="detail" className="absolute max-w-3xl">
            <p className="display text-[clamp(1.9rem,5.6vw,4rem)] text-bone">
              <Line>The difference</Line>
              <Line>is measured</Line>
              <Line>
                in <span className="italic text-champagne/90">millimetres.</span>
              </Line>
            </p>
          </div>

          <div data-copy="reveal" className="pointer-events-auto absolute max-w-4xl">
            <h1 className="display text-[clamp(2.4rem,8vw,6.5rem)] text-bone">
              <Line>Tailored</Line>
              <Line>to exist</Line>
              <Line>
                <span className="italic text-champagne/90">only once.</span>
              </Line>
            </h1>
            <p className="mt-9 text-[10px] uppercase tracking-[0.3em] text-mute">
              <Line>Bespoke · Hand finished · Made for you</Line>
            </p>
            <p className="mt-10">
              <Line>
                <a
                  href="#bespoke"
                  data-cursor="Enter"
                  className="group relative inline-block overflow-hidden border border-champagne/45 px-9 py-4 text-[10px] uppercase tracking-[0.26em] text-champagne"
                >
                  <span className="relative z-10 transition-colors duration-700 group-hover:text-ink">
                    Discover Bespoke
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                  />
                </a>
              </Line>
            </p>
          </div>
        </div>

        {/* Scene markers */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-6 z-[5] md:bottom-10 md:left-10 lg:left-14"
        >
          {MARKERS.map((marker, i) => (
            <div
              key={marker.index}
              data-marker={i}
              className="absolute bottom-0 left-0 flex items-baseline gap-3 whitespace-nowrap opacity-0"
            >
              <span className="display text-[1.4rem] text-champagne/80">
                {marker.index}
              </span>
              <span className="h-px w-8 bg-champagne/30" />
              <span className="text-[9px] uppercase tracking-[0.28em] text-bone-dim">
                {marker.name}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHint}
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 z-[5] -translate-x-1/2 opacity-0 md:bottom-10"
        >
          <span className="mb-3 block text-center text-[9px] uppercase tracking-[0.3em] text-mute">
            Scroll
          </span>
          <span className="mx-auto block h-10 w-px bg-gradient-to-b from-champagne/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
