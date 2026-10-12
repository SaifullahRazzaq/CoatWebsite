"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/** Constrained so the forwarded ref is always a real DOM node. */
type Tag = "h1" | "h2" | "h3" | "p" | "div";

type Props = {
  /** Each entry becomes one masked line. */
  lines: ReactNode[];
  as?: Tag;
  className?: string;
  lineClassName?: string;
  /** Seconds between consecutive lines. */
  stagger?: number;
  delay?: number;
  /** Scroll position that releases the animation. */
  start?: string;
};

/**
 * Masked line reveal: each line sits inside an overflow-hidden block and rises
 * into place. This is the site's default way of introducing display type — the
 * text reads as fabric being drawn back rather than as a fade.
 */
export default function RevealText({
  lines,
  as: Element = "h2",
  className = "",
  lineClassName = "",
  stagger = 0.09,
  delay = 0,
  start = "top 82%",
}: Props) {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const inner = el.querySelectorAll("[data-reveal-line] > *");
      if (!inner.length) return;

      gsap.to(inner, {
        y: "0%",
        duration: 1.5,
        delay,
        stagger,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [delay, stagger, start]);

  return (
    <Element ref={root as React.Ref<never>} className={className}>
      {lines.map((line, i) => (
        <span key={i} data-reveal-line className={lineClassName}>
          <span>{line}</span>
        </span>
      ))}
    </Element>
  );
}
