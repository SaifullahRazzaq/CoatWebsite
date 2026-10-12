"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useMotionProfile } from "@/lib/useMotionProfile";
import type { Asset } from "@/lib/assets";

type Props = {
  asset: Asset;
  className?: string;
  /** How far the image drifts inside its frame, as a % of its overscan. */
  strength?: number;
  /** Slow push-in across the scroll range. */
  zoom?: boolean;
  /** Wipe the frame open as it enters. */
  clip?: boolean;
  priority?: boolean;
  sizes?: string;
  /** Multiplied into the image's own brightness — used to sink photos back. */
  tone?: number;
};

/**
 * A photograph in a fixed frame whose content moves slower than the page.
 * The image is overscanned so the drift never exposes an edge.
 */
export default function ParallaxImage({
  asset,
  className = "",
  strength = 12,
  zoom = false,
  clip = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw",
  tone = 0.86,
}: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const { full, reduced, still } = useMotionProfile();

  useIsomorphicLayoutEffect(() => {
    const frameEl = frame.current;
    const innerEl = inner.current;
    if (!frameEl || !innerEl || still) return;

    const travel = full ? strength : reduced ? strength * 0.6 : strength * 0.4;

    const ctx = gsap.context(() => {
      if (clip) {
        gsap.fromTo(
          frameEl,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.8,
            ease: "expo.out",
            scrollTrigger: { trigger: frameEl, start: "top 88%", once: true },
          },
        );
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: frameEl,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.fromTo(
        innerEl,
        { yPercent: -travel },
        { yPercent: travel, ease: "none" },
        0,
      );

      if (zoom) {
        tl.fromTo(
          innerEl,
          { scale: 1.24 },
          { scale: 1.06, ease: "none" },
          0,
        );
      }
    }, frameEl);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [full, reduced, still, strength, zoom, clip]);

  return (
    <div
      ref={frame}
      className={`relative overflow-hidden bg-charcoal ${className}`}
    >
      <div ref={inner} className="absolute -inset-y-[18%] inset-x-0">
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
          style={{
            objectPosition: asset.focal ?? "center",
            filter: `brightness(${tone}) contrast(1.04) saturate(0.88)`,
          }}
        />
      </div>
      {/* Just enough to seat the frame on the page — not a blanket. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-ink/10"
      />
    </div>
  );
}
