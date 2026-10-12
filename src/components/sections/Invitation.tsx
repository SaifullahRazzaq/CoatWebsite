"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { assets } from "@/lib/assets";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";

/**
 * The close. A dark plate of cloth fills the frame and the invitation is set
 * over it — the last cinematic beat before the footer.
 */
export default function Invitation() {
  const section = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const { full, still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const el = section.current;
    if (!el || still) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        plate.current,
        { scale: 1.2, yPercent: -6 },
        {
          scale: 1,
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // The light in the room follows the visitor, well behind their hand.
      // Only on a fine pointer: on touch there is nothing to follow, and the
      // listener would run for no reason.
      if (
        light.current &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        const toX = gsap.quickTo(light.current, "xPercent", {
          duration: 1.4,
          ease: "power3.out",
        });
        const toY = gsap.quickTo(light.current, "yPercent", {
          duration: 1.4,
          ease: "power3.out",
        });

        const onMove = (event: PointerEvent) => {
          const box = el.getBoundingClientRect();
          if (box.bottom < 0 || box.top > window.innerHeight) return;
          toX(((event.clientX - box.left) / box.width - 0.5) * 46);
          toY(((event.clientY - box.top) / box.height - 0.5) * 46);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      }
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [full, still]);

  return (
    <section
      ref={section}
      id="contact"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink"
    >
      {/* Cloth */}
      <div ref={plate} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${assets.clothDark.src}")`,
            filter: "brightness(0.58) contrast(1.1) saturate(0.7)",
          }}
          role="img"
          aria-label={assets.clothDark.alt}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 50%, rgba(8,8,10,0.45), var(--color-ink) 88%)",
        }}
      />
      <div
        ref={light}
        aria-hidden
        className="pointer-events-none absolute inset-[-20%] blur-[110px]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-champagne) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1560px] px-6 py-[16vh] text-center md:px-10 lg:px-14">
        <Reveal>
          <p className="eyebrow mb-10">Your first fitting begins here</p>
        </Reveal>

        <RevealText
          as="h2"
          className="display mx-auto max-w-5xl text-[clamp(2.6rem,9vw,7.5rem)] text-bone"
          lineClassName="pb-[0.06em]"
          lines={[
            <>Let&rsquo;s make</>,
            <span key="b" className="italic text-champagne/90">yours.</span>,
          ]}
        />

        <Reveal className="mx-auto mt-10 max-w-lg" y={22}>
          <p className="body-copy">
            First fittings are held Tuesday to Saturday at Sackville Street,
            and twice yearly in New York, Milan and Hong Kong.
          </p>
        </Reveal>

        <Reveal className="mt-14" y={18}>
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-7">
            <Magnetic strength={14}>
            <a
              href="mailto:appointments@aldermay.example"
              data-cursor="Enter"
              className="group relative overflow-hidden border border-champagne/50 px-10 py-5 text-[10px] uppercase tracking-[0.26em] text-champagne"
            >
              <span className="relative z-10 transition-colors duration-700 group-hover:text-ink">
                Request an appointment
              </span>
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
              />
            </a>
            </Magnetic>
            <a
              href="https://wa.me/442075550108"
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="Message"
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-bone-dim transition-colors duration-500 hover:text-bone"
            >
              WhatsApp the atelier
              <span
                aria-hidden
                className="block h-px w-6 bg-bone/30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-10 group-hover:bg-champagne"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
