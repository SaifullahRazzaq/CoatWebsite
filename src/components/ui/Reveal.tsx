"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

type Props = {
  children: ReactNode;
  className?: string;
  /** Vertical travel in px. */
  y?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  /** When set, direct children animate individually. */
  splitChildren?: boolean;
};

/** Fade + rise, the quieter sibling of RevealText. */
export default function Reveal({
  children,
  className = "",
  y = 28,
  delay = 0,
  stagger = 0.12,
  start = "top 85%",
  splitChildren = false,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const targets = splitChildren ? Array.from(el.children) : [el];
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          delay,
          stagger: splitChildren ? stagger : 0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger, start, splitChildren]);

  return (
    <div
      ref={root}
      // When children animate individually, GSAP owns their opacity — the
      // root must stay visible or nothing ever shows.
      data-reveal-fade={splitChildren ? undefined : true}
      className={className}
    >
      {children}
    </div>
  );
}
