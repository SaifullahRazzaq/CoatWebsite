/**
 * The garment, as data.
 *
 * The hero needs every part of the suit to be an independently transformable
 * object. There is no 3D model and there are no separated garment plates, so
 * each part is a copy of one real photograph clipped to a polygon tracing that
 * frame's own seams. Because the layers are identical underneath, the
 * assembled state is pixel-for-pixel the original photograph — tracing
 * accuracy only affects the mid-animation frames, never the final one. That is
 * why it reads as cloth rather than as artwork.
 *
 * THE UPGRADE PATH: if you have true transparent garment plates, name them in
 * `LAYER_SOURCES` below. A region with a source stops being clipped and simply
 * renders its own PNG, so real assets replace the cut photograph part by part
 * with no other change. See ASSET_REQUIREMENTS.md.
 */

/** Native proportions of the source photograph. */
export const SOURCE = { w: 900, h: 1350 };

/**
 * The crop we actually show, in source pixels — trims the model's chin so the
 * plate stays anonymous and editorial, and tightens the side margins.
 */
export const CROP = { x: 40, y: 160, w: 820, h: 1150 };

export const PLATE_ASPECT = `${CROP.w} / ${CROP.h}`;

/** Positions the source image inside a region box so every layer aligns. */
export const INNER = {
  width: `${(SOURCE.w / CROP.w) * 100}%`,
  height: `${(SOURCE.h / CROP.h) * 100}%`,
  left: `${(-CROP.x / CROP.w) * 100}%`,
  top: `${(-CROP.y / CROP.h) * 100}%`,
};

export type RegionId =
  | "shirt"
  | "lower"
  | "sleeveLeft"
  | "sleeveRight"
  | "frontLeft"
  | "frontRight";

export type Region = {
  id: RegionId;
  /** How the part is named in the pattern book — shown as it flies in. */
  label: string;
  /** Traced against this frame: lapel notches, the button point, sleeve seams. */
  clip: string;
  /**
   * Where the part begins, as a percentage of the plate. Construction throws
   * these much further than the final settle, so `depth` scales the same
   * offsets into foreground and background planes: a part on a near plane
   * travels further and faster than one behind it.
   */
  from: { x?: number; y?: number; rotate?: number };
  /** 0 = far plane, 1 = near plane. Drives travel, blur and parallax. */
  depth: number;
};

/** Paint order, back to front. The fronts close over everything. */
export const REGIONS: Region[] = [
  {
    id: "shirt",
    label: "Dress shirt · pleated bib",
    clip: "polygon(30.5% -1%, 66.5% -1%, 53.5% 61.5%, 46.5% 61.5%)",
    from: { y: -5 },
    depth: 0.15,
  },
  {
    id: "lower",
    label: "Forepart · skirt",
    clip: "polygon(14.5% 57%, 44% 66.5%, 86.5% 57%, 82.5% 101%, 19.5% 101%)",
    from: { y: 6 },
    depth: 0.3,
  },
  {
    id: "sleeveLeft",
    label: "Sleeve · left",
    clip: "polygon(-1% -1%, 17.5% -1%, 15.5% 58.5%, 20.5% 101%, -1% 101%)",
    from: { x: -7, rotate: -1.4 },
    depth: 0.75,
  },
  {
    id: "sleeveRight",
    label: "Sleeve · right",
    clip: "polygon(87.5% -1%, 101% -1%, 101% 101%, 81.5% 101%, 85.5% 58.5%)",
    from: { x: 7, rotate: 1.4 },
    depth: 0.75,
  },
  {
    id: "frontLeft",
    label: "Lapel · peak, left",
    clip: "polygon(16.5% -1%, 31.5% -1%, 47.5% 62%, 14.5% 58%)",
    from: { x: -5, y: -2, rotate: -1.8 },
    depth: 1,
  },
  {
    id: "frontRight",
    label: "Lapel · peak, right",
    clip: "polygon(65.5% -1%, 88.5% -1%, 86.5% 58%, 52.5% 62%)",
    from: { x: 5, y: -2, rotate: 1.8 },
    depth: 1,
  },
];

/**
 * Transparent garment plates, when they exist. Uncomment a line once the file
 * is in `/public/assets/suit/` and that part stops being a clipped copy of the
 * shared photograph.
 */
export const LAYER_SOURCES: Partial<Record<RegionId, string>> = {
  // shirt: "/assets/suit/shirt.png",
  // lower: "/assets/suit/forepart.png",
  // sleeveLeft: "/assets/suit/sleeve-left.png",
  // sleeveRight: "/assets/suit/sleeve-right.png",
  // frontLeft: "/assets/suit/lapel-left.png",
  // frontRight: "/assets/suit/lapel-right.png",
};
