/**
 * Central image manifest.
 *
 * Every photograph on the site is referenced through this file so the whole
 * art direction can be re-shot in one place. To use your own assets, drop the
 * files into `/public/assets/` and replace the `src` values with e.g.
 * `/assets/collection-signature.jpg`. Nothing else needs to change — the
 * `remotePatterns` entry in `next.config.ts` only exists for the placeholders.
 *
 * `focal` biases next/image's object-position so a crop keeps its subject.
 */

export type Asset = {
  src: string;
  alt: string;
  /** CSS object-position value. Defaults to "center". */
  focal?: string;
};

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

export const assets = {
  /** Near-black woven cloth — used as ambient texture behind dark sections. */
  clothDark: {
    src: unsplash("1637004732258-4b792ce8f474", 1800),
    alt: "Close weave of black wool suiting cloth",
  },
  /** Matte charcoal weave — secondary ambient texture. */
  clothInk: {
    src: unsplash("1592719235009-e497ad008268", 1400),
    alt: "Dark twill fabric in raking light",
  },
  /** Cool grey flannel — used in the fabric detail grid. */
  clothGrey: {
    src: unsplash("1643313262988-cdc5f50c6019", 1400),
    alt: "Grey flannel suiting with a fine, open weave",
  },

  /**
   * The hero plate. This one photograph is cut into garment regions and
   * reassembled on scroll, and it is also the subject of the anatomy section,
   * so it needs to be front-on, sharp, and shot against a plain ground.
   * If you replace it, re-check `CROP` and `REGIONS` in
   * `src/components/hero/SuitPlate.tsx` — those trace this frame's seams.
   */
  heroPlate: {
    src: unsplash("1522968439036-e6338d0ed84f", 1600),
    alt: "A dinner jacket being fastened: peak lapels, bow tie and pocket square",
  },

  /** Hero-adjacent editorial: charcoal overcoat, tan glove. */
  editorialGlove: {
    src: unsplash("1695291649448-8b4144361014", 1600),
    alt: "A gloved hand resting against the drape of a charcoal overcoat",
    focal: "50% 40%",
  },

  detailButtons: {
    src: unsplash("1633655442017-3b2a701ec705", 1200),
    alt: "Horn buttons held in an open palm",
  },
  detailSwatches: {
    src: unsplash("1633655442356-ab2dbc69c772", 1400),
    alt: "A hand moving across a bunch of suiting swatches",
    focal: "50% 55%",
  },
  detailBunches: {
    src: unsplash("1788416715133-33735381afc8", 1200),
    alt: "Cloth merchant bunch books stacked on a workroom table",
  },
  detailRail: {
    src: unsplash("1673201230274-c4dbd20c3f79", 1400),
    alt: "Half-finished camel coats hanging on a workroom rail",
  },

  /* ---------------------------------------------------------------- *
   * Cloth macros — the fabric selector inspects these.
   * ---------------------------------------------------------------- */

  /** Soft drape with a visible pile — stands in for cashmere. */
  clothDrape: {
    src: unsplash("1558769132-cb1aea458c5e", 1400),
    alt: "Soft undyed cloth falling in deep folds",
    focal: "50% 45%",
  },
  /** Open, slubby weave — stands in for linen. */
  clothOpen: {
    src: unsplash("1543076447-215ad9ba6923", 1400),
    alt: "An open weave photographed close, raking light across the grain",
  },

  /* ---------------------------------------------------------------- *
   * Detail macros — the pinned detail sequence.
   * ---------------------------------------------------------------- */

  /** Dark, high-contrast: a coat being fastened. Reads as lapel and stance. */
  detailFastening: {
    src: unsplash("1507679799987-c73779587ccf", 1600),
    alt: "A dark jacket being fastened at the waist button",
    focal: "50% 45%",
  },
  /** Near-black object study — used where a section needs a held beat. */
  detailMovement: {
    src: unsplash("1524805444758-089113d48a6d", 1400),
    alt: "A mechanical watch face lit against black",
  },

  /* ---------------------------------------------------------------- *
   * The atelier.
   * ---------------------------------------------------------------- */

  atelierMachine: {
    src: unsplash("1534126511673-b6899657816a", 1600),
    alt: "A tailor working at a machine in a cutting room",
    focal: "50% 45%",
  },

  collectionSignature: {
    src: unsplash("1603394151492-5e9b974b090b", 1600),
    alt: "Hands fastening the waist button of a navy hopsack jacket",
    focal: "50% 45%",
  },
  collectionEvening: {
    src: unsplash("1775831726936-c8fb3698645f", 1600),
    alt: "A seated figure in a deep red evening suit and spotted tie",
    focal: "50% 40%",
  },
  collectionBusiness: {
    src: unsplash("1519085360753-af0119f7cbe7", 1600),
    alt: "A figure in a dark single-breasted suit, arms folded, against stone",
    focal: "50% 30%",
  },
  collectionWedding: {
    src: unsplash("1784749615306-10675f31bae2", 1600),
    alt: "A tobacco linen suit hanging in the light of a shuttered window",
    focal: "50% 50%",
  },
} as const satisfies Record<string, Asset>;

export type AssetKey = keyof typeof assets;
