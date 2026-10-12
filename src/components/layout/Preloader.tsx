"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { markEntered } from "@/lib/entrance";

/** Never hold the visitor longer than this, whatever the network is doing. */
const MAX_HOLD = 1900;
/** Below this the curtain reads as a flash rather than an opening. */
const MIN_HOLD = 800;

/**
 * The curtain.
 *
 * A monogram, a count, and a rule that draws itself across the frame as the
 * page's own assets arrive. Progress is real — it tracks `document.readyState`
 * and the images the browser has actually decoded — but it is floored and
 * capped, because a fast connection should still get an opening and a slow one
 * should never be held hostage to a single large plate.
 *
 * At 100 the rule runs to full width and the frame splits, ivory line last.
 *
 * Reduced-motion visitors never see this at all: the component renders nothing
 * and the entrance gate opens on mount, so the hero is simply already there.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const rule = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const topHalf = useRef<HTMLDivElement>(null);
  const bottomHalf = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    // The curtain is always rendered, so the server and the first client
    // render agree and the page is covered from the very first paint. Whether
    // it plays is decided here, before the browser paints.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (root.current) root.current.style.display = "none";
      markEntered();
      return;
    }

    const started = performance.now();
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } })
      .__lenis;
    lenis?.stop();
    document.documentElement.classList.add("lenis-stopped");

    const ctx = gsap.context(() => {
      // `progress` is what we have measured; `shown` is what the counter is
      // easing toward, so the number never jumps even when a burst of images
      // resolves at once.
      const state = { shown: 0 };
      let measured = 0;
      let done = false;

      const readProgress = () => {
        const images = Array.from(document.images);
        const decoded = images.filter((img) => img.complete).length;
        const assetShare = images.length ? decoded / images.length : 0;
        const documentShare = document.readyState === "complete" ? 1 : 0.5;
        // The document reaching `complete` is worth as much as the imagery,
        // otherwise a page with one slow plate sits at 4% looking broken.
        return Math.max(measured, assetShare * 0.6 + documentShare * 0.4);
      };

      const render = () => {
        const value = Math.round(state.shown * 100);
        if (count.current) {
          count.current.textContent = String(value).padStart(3, "0");
        }
        if (rule.current) {
          gsap.set(rule.current, { scaleX: state.shown });
        }
        if (mark.current) {
          // The monogram resolves out of blur as the count climbs.
          gsap.set(mark.current, {
            filter: `blur(${(1 - state.shown) * 7}px)`,
            opacity: 0.35 + state.shown * 0.65,
          });
        }
      };

      const advance = () => {
        if (done) return;
        measured = readProgress();
        const elapsed = performance.now() - started;

        // Two ceilings: real progress, and the floor that keeps the opening
        // from flashing past. Whichever is lower is what we show.
        const paced = Math.min(measured, elapsed / MIN_HOLD);
        const forced = elapsed >= MAX_HOLD ? 1 : paced;
        const target = Math.max(forced, elapsed >= MAX_HOLD ? 1 : 0);

        gsap.to(state, {
          shown: Math.min(1, target),
          duration: 0.6,
          ease: "power2.out",
          onUpdate: render,
          onComplete: () => {
            if (state.shown >= 0.999 && !done) finish();
          },
        });
      };

      const finish = () => {
        if (done) return;
        done = true;
        window.clearInterval(poll);

        gsap
          .timeline({
            onComplete: () => {
              lenis?.start();
              document.documentElement.classList.remove("lenis-stopped");
              markEntered();
              if (root.current) root.current.style.display = "none";
            },
          })
          // The rule runs off the ends of the frame.
          .to(rule.current, { scaleX: 1, duration: 0.38, ease: "expo.inOut" })
          .to(
            [count.current, mark.current],
            { opacity: 0, duration: 0.34, ease: "power2.inOut" },
            "-=0.15",
          )
          .to(rule.current, { opacity: 0, duration: 0.3 }, "-=0.18")
          // Then the frame opens from the centre line.
          .to(
            topHalf.current,
            { yPercent: -100, duration: 0.95, ease: "expo.inOut" },
            "-=0.25",
          )
          .to(
            bottomHalf.current,
            { yPercent: 100, duration: 0.95, ease: "expo.inOut" },
            "<",
          );
      };

      render();
      const poll = window.setInterval(advance, 180);
      advance();

      const onLoad = () => advance();
      window.addEventListener("load", onLoad);

      // Hard stop, in case a plate never resolves at all.
      const bail = window.setTimeout(finish, MAX_HOLD + 250);

      return () => {
        window.clearInterval(poll);
        window.clearTimeout(bail);
        window.removeEventListener("load", onLoad);
        lenis?.start();
        document.documentElement.classList.remove("lenis-stopped");
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[150]"
    >
      {/* Two halves that part at the centre line. */}
      <div ref={topHalf} className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div ref={bottomHalf} className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={mark} className="display text-[2rem] tracking-[0.06em] text-bone">
          Aldermay
        </div>

        <span
          ref={rule}
          className="mt-8 block h-px w-[min(38vw,340px)] origin-left scale-x-0 bg-champagne/70"
        />

        <div className="mt-6 flex items-baseline gap-2 font-sans text-[10px] uppercase tracking-[0.3em] text-mute">
          <span ref={count}>000</span>
          <span>—</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
