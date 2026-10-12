"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum pull in px at the edge of the field. */
  strength?: number;
  /** How far outside the element the field reaches, as a fraction of its size. */
  field?: number;
};

/**
 * A magnetic field around a control: as the pointer approaches, the child
 * leans toward it and releases on exit.
 *
 * Deliberately understated — a few pixels. The effect should be felt before
 * it is noticed, which is also why the pull eases out over most of a second
 * rather than tracking the pointer exactly.
 *
 * Only fine pointers get it; touch has no hover to lean into, and a visitor
 * who asked for reduced motion gets a control that simply sits still.
 */
export default function Magnetic({
  children,
  className = "",
  strength = 14,
  field = 0.55,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const box = el.getBoundingClientRect();
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;

        // Normalised distance to the edge of the field, clamped to 1 so the
        // pull plateaus instead of growing without limit on a wide control.
        const reachX = (box.width / 2) * (1 + field);
        const reachY = (box.height / 2) * (1 + field);
        const away = Math.min(1, Math.hypot(dx / reachX, dy / reachY));

        if (away >= 1) {
          x(0);
          y(0);
          return;
        }
        // Falls off toward the edge, so the control settles rather than
        // snapping back the instant the pointer leaves the field.
        const pull = (1 - away) * strength;
        x((dx / reachX) * pull);
        y((dy / reachY) * pull);
      };

      const onLeave = () => {
        x(0);
        y(0);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    }, el);

    return () => ctx.revert();
  }, [strength, field]);

  return (
    <div ref={root} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
