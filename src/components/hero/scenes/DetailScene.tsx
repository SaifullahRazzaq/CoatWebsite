"use client";

import Image from "next/image";
import { assets, type Asset } from "@/lib/assets";

type Plate = { asset: Asset; label: string; tone: number; focal?: string };

/**
 * Scene 04: the camera goes in.
 *
 * Three macro plates, each holding the full frame in turn. They are stacked,
 * not laid out — the hero wipes between them with a clip inset, so one plate
 * uncovers the next rather than dissolving into it. That is the closest a web
 * page gets to a match cut.
 */
const PLATES: Plate[] = [
  {
    asset: assets.detailButtons,
    label: "The button — horn, cut and matched to the weave",
    tone: 0.46,
  },
  {
    asset: assets.detailFastening,
    label: "The lapel — a line defined by hand",
    tone: 0.54,
    focal: "50% 42%",
  },
  {
    asset: assets.clothGrey,
    label: "The cloth — milled, rested, and cut once",
    tone: 0.4,
  },
];

export default function DetailScene() {
  return (
    <div
      data-scene="detail"
      className="pointer-events-none absolute inset-0 z-[2] opacity-0"
    >
      {PLATES.map((plate, i) => (
        <div
          key={plate.label}
          data-detail-plate={i}
          className="absolute inset-0 overflow-hidden"
          // Each plate is held below frame until the hero wipes it up over
          // the one before. The first sits open so the scene arrives on it.
          style={{ clipPath: i === 0 ? "inset(0%)" : "inset(100% 0% 0% 0%)" }}
        >
          <div data-detail-inner className="absolute inset-[-8%]">
            <Image
              src={plate.asset.src}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover"
              style={{
                objectPosition: plate.focal ?? plate.asset.focal ?? "center",
                filter: `brightness(${plate.tone}) contrast(1.12) saturate(0.5)`,
              }}
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(72% 62% at 50% 50%, rgba(8,8,10,0.18) 20%, rgba(8,8,10,0.72) 74%, var(--color-ink) 100%)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export const DETAIL_PLATE_COUNT = PLATES.length;
