"use client";

import { useEffect, useState } from "react";

export type MotionProfile = {
  /** Full cinematic treatment: pinning, parallax, 3D. */
  full: boolean;
  /** Tablet band — same choreography, shorter distances. */
  reduced: boolean;
  /** Phone band — sections rebuilt, 3D dropped. */
  compact: boolean;
  /** User asked for less motion, or we haven't measured yet. */
  still: boolean;
};

const DESKTOP = "(min-width: 1024px)";
const TABLET = "(min-width: 768px)";
const REDUCED = "(prefers-reduced-motion: reduce)";

const read = (): MotionProfile => {
  if (typeof window === "undefined") {
    return { full: true, reduced: false, compact: false, still: false };
  }
  const still = window.matchMedia(REDUCED).matches;
  const desktop = window.matchMedia(DESKTOP).matches;
  const tablet = window.matchMedia(TABLET).matches;
  return {
    full: desktop && !still,
    reduced: tablet && !desktop && !still,
    compact: !tablet && !still,
    still,
  };
};

/**
 * Breakpoint + preference aware motion profile. Returns the desktop profile on
 * the server so markup matches, then corrects on mount.
 */
export function useMotionProfile(): MotionProfile {
  const [profile, setProfile] = useState<MotionProfile>(() => ({
    full: true,
    reduced: false,
    compact: false,
    still: false,
  }));

  useEffect(() => {
    const update = () => setProfile(read());
    update();
    const queries = [DESKTOP, TABLET, REDUCED].map((q) => window.matchMedia(q));
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  return profile;
}
