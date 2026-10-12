"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { assets } from "@/lib/assets";
import {
  INNER,
  LAYER_SOURCES,
  PLATE_ASPECT,
  REGIONS,
  type Region,
} from "./suit-layers";

export { PLATE_ASPECT, REGIONS } from "./suit-layers";
export type { Region, RegionId } from "./suit-layers";

/**
 * One part of the garment.
 *
 * Either a clipped copy of the shared photograph, or — where a transparent
 * plate has been supplied in `LAYER_SOURCES` — that plate on its own. Both
 * occupy the identical box, so the two can be mixed while real assets arrive
 * part by part.
 *
 * `priority` is set on one layer only; the clipped copies all resolve to the
 * same optimized URL, so the rest come from cache.
 */
function RegionLayer({
  region,
  priority,
  sizes,
}: {
  region: Region;
  priority: boolean;
  sizes: string;
}) {
  const override = LAYER_SOURCES[region.id];

  return (
    <div
      data-region={region.id}
      data-depth={region.depth}
      className="absolute inset-0 will-change-transform"
      style={override ? undefined : { clipPath: region.clip }}
    >
      {override ? (
        <Image
          src={override}
          alt=""
          aria-hidden
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain"
        />
      ) : (
        <div className="absolute" style={INNER}>
          <Image
            src={assets.heroPlate.src}
            alt=""
            aria-hidden
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes={sizes}
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

/** Used where the plate is only ever shown whole. */
const WHOLE: Region = {
  id: "lower",
  label: "",
  clip: "none",
  from: {},
  depth: 0,
};

const SuitPlate = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    sizes?: string;
    plain?: boolean;
    /** Defaults to on, except for a plain plate meant to read as a photograph. */
    feather?: boolean;
  }
>(
  function SuitPlate(
    {
      className = "",
      sizes = "(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 40vw",
      // `plain` skips the cutting entirely — used wherever the plate is only
      // ever shown assembled.
      plain = false,
      feather,
    },
    ref,
  ) {
    const layers = plain ? [WHOLE] : REGIONS;
    const soften = feather ?? !plain;
    // Sized to the frame rather than well outside it, so the fade actually
    // reaches the mid-edges instead of only rounding off the corners.
    const mask =
      "radial-gradient(62% 58% at 50% 46%, #000 56%, transparent 100%)";

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={{
          aspectRatio: PLATE_ASPECT,
          // Melts the plate's outer edges into the dark room so it reads as a
          // lit subject rather than a rectangle pasted onto the page.
          maskImage: soften ? mask : undefined,
          WebkitMaskImage: soften ? mask : undefined,
        }}
        role="img"
        aria-label={assets.heroPlate.alt}
      >
        {layers.map((region, i) => (
          <RegionLayer
            key={region.id}
            region={region}
            priority={i === 0}
            sizes={sizes}
          />
        ))}

        {/* Grade: the plate is shot high-key, so it is brought down to sit in
            the room and warmed very slightly toward the champagne accent. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(88% 80% at 50% 48%, transparent 44%, rgba(8,8,10,0.34) 80%, rgba(8,8,10,0.88) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,10,0.62) 0%, rgba(8,8,10,0) 24%, rgba(8,8,10,0) 76%, rgba(8,8,10,0.5) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            background:
              "radial-gradient(70% 55% at 34% 26%, var(--color-champagne), transparent 70%)",
            mixBlendMode: "soft-light",
          }}
        />
      </div>
    );
  },
);

export default SuitPlate;
