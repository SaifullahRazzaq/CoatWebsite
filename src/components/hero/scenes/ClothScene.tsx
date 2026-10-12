"use client";

import Image from "next/image";
import { assets } from "@/lib/assets";

/**
 * Scenes 01 and 02: the cloth, and the cut.
 *
 * A single bolt of dark wool held very close, with a light that glides across
 * the weave, and — as the cut begins — the cutter's chalk lines drawn over it
 * in champagne: shoulder, lapel, waist suppression, sleevehead.
 *
 * The lines are one SVG with `pathLength="1"` on every path, so the hero can
 * draw them all with a single dashoffset tween regardless of their real
 * lengths. Geometry is plausible pattern-drafting, not decoration: the lapel
 * runs from the neck point down to the button stance, the waist line pinches
 * at the narrowest part of the forepart.
 */
export default function ClothScene() {
  return (
    <div
      data-scene="cloth"
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
    >
      <div
        data-cloth-frame
        className="relative h-[76svh] w-[86vw] max-w-[1100px] overflow-hidden"
      >
        {/* The weave */}
        <div data-cloth-image className="absolute inset-[-12%]">
          <Image
            src={assets.clothDark.src}
            alt={assets.clothDark.alt}
            fill
            sizes="90vw"
            className="object-cover"
            style={{ filter: "brightness(0.85) contrast(1.12) saturate(0.72)" }}
          />
        </div>

        {/* The light that travels across the cloth. Kept to a narrow band so
            it reads as a raking source moving, not as a global brightening. */}
        <div
          data-cloth-sheen
          aria-hidden
          className="absolute inset-y-0 -left-1/2 w-1/2 opacity-0 mix-blend-screen blur-[30px]"
          style={{
            background:
              "linear-gradient(105deg, transparent, rgba(232,227,218,0.34) 45%, rgba(200,169,107,0.22) 62%, transparent)",
          }}
        />

        {/* The chalk */}
        <svg
          data-cloth-lines
          aria-hidden
          viewBox="0 0 1000 1400"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          fill="none"
          stroke="var(--color-champagne)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        >
          <g opacity="0.85">
            {/* Shoulder line */}
            <path d="M232 300 L500 268 L768 300" pathLength={1} />
            {/* Neck point through to the button stance — the lapel roll */}
            <path d="M420 276 C404 402 452 520 500 660" pathLength={1} />
            <path d="M580 276 C596 402 548 520 500 660" pathLength={1} />
            {/* Armhole scyes */}
            <path
              d="M232 300 C196 420 200 520 246 610"
              pathLength={1}
              strokeDasharray="0"
            />
            <path d="M768 300 C804 420 800 520 754 610" pathLength={1} />
            {/* Waist suppression, pinched at the narrowest point */}
            <path d="M214 690 C360 742 640 742 786 690" pathLength={1} />
            {/* Hem */}
            <path d="M206 1080 L794 1080" pathLength={1} />
            {/* Sleevehead, drafted off to one side the way a pattern is laid */}
            <path
              d="M110 470 C150 560 150 700 118 800"
              pathLength={1}
              opacity="0.6"
            />
            <path
              d="M890 470 C850 560 850 700 882 800"
              pathLength={1}
              opacity="0.6"
            />
            {/* Balance marks */}
            <path d="M500 268 L500 300" pathLength={1} opacity="0.5" />
            <path d="M486 714 L514 714" pathLength={1} opacity="0.5" />
          </g>
        </svg>

        {/* Seats the bolt in the room. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(78% 70% at 50% 50%, transparent 30%, rgba(8,8,10,0.55) 78%, var(--color-ink) 100%)",
          }}
        />
      </div>
    </div>
  );
}
