"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Whether this visitor should get the custom cursor at all, read as an external
 * store so it never has to be pushed into state from an effect. Returns false
 * on the server, which is also the correct first client render.
 */
function useWantsCustomCursor() {
  return useSyncExternalStore(
    (onChange) => {
      const queries = [FINE_POINTER, REDUCED].map((q) => window.matchMedia(q));
      queries.forEach((q) => q.addEventListener("change", onChange));
      return () =>
        queries.forEach((q) => q.removeEventListener("change", onChange));
    },
    () =>
      window.matchMedia(FINE_POINTER).matches &&
      !window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/**
 * Minimal two-part cursor: a small champagne dot that tracks precisely and a
 * ring that trails it. Over anything carrying `data-cursor="<label>"` the ring
 * expands and the label fades in.
 *
 * Pointer-coarse devices and reduced-motion visitors keep their native cursor.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const enabled = useWantsCustomCursor();

  // The cursor markup only mounts once the capability check passes, so the
  // motion wiring has to wait for it — otherwise quickTo() binds to refs that
  // are still null and the cursor never moves.
  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;

    document.documentElement.dataset.cursor = "on";

    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.16, ease: "power3" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.16, ease: "power3" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      setVisible(true);

      const el = event.target as HTMLElement | null;
      // A labelled ancestor wins over a nearer plain link — otherwise the <a>
      // wrapping a labelled card swallows its own label.
      const labelled = el?.closest?.("[data-cursor]") as HTMLElement | null;
      const plain = el?.closest?.("a, button") as HTMLElement | null;

      if (!labelled && !plain) {
        setActive(false);
        setLabel("");
        return;
      }
      const explicit = labelled?.getAttribute("data-cursor");
      setActive(true);
      setLabel(explicit && explicit !== "on" ? explicit : "");
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      delete document.documentElement.dataset.cursor;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ring}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-champagne/50 transition-[width,height,opacity,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: active ? 64 : 34,
          height: active ? 64 : 34,
          marginLeft: active ? -32 : -17,
          marginTop: active ? -32 : -17,
          opacity: visible ? (active ? 1 : 0.55) : 0,
          backgroundColor: "transparent",
          backdropFilter: active ? "blur(2px)" : "none",
        }}
      >
        <span
          className="font-sans text-[9px] uppercase tracking-[0.28em] text-champagne transition-opacity duration-300"
          style={{ opacity: active && label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 -ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-champagne transition-opacity duration-300"
        style={{ opacity: visible && !active ? 0.9 : 0 }}
      />
    </div>
  );
}
