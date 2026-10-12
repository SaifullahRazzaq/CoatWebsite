import { assets, type Asset } from "@/lib/assets";

/**
 * The bunch. Each entry is a cloth the visitor can bring up on the table in
 * the cloth section — a macro plate plus the specification a cutter would
 * actually quote: mill, weight, and what the cloth is for.
 *
 * `tone` grades the plate down into the room; pale cloths need pulling
 * harder than dark ones so no swatch jumps off the page.
 */
export type Fabric = {
  id: string;
  name: string;
  /** Quoted the way a bunch book labels it. */
  quality: string;
  weight: string;
  mill: string;
  /** One line. Luxury houses do not explain twice. */
  note: string;
  asset: Asset;
  tone: number;
};

export const FABRICS: Fabric[] = [
  {
    id: "wool",
    name: "Wool",
    quality: "Super 150's Worsted",
    weight: "260g",
    mill: "Huddersfield, England",
    note: "The house cloth. Holds a crease through a season and forgives nothing.",
    asset: assets.clothDark,
    tone: 1.05,
  },
  {
    id: "cashmere",
    name: "Cashmere",
    quality: "Pure Cashmere",
    weight: "310g",
    mill: "Biella, Italy",
    note: "Weightless against the shoulder. Cut generously, or not at all.",
    asset: assets.clothDrape,
    tone: 0.52,
  },
  {
    id: "mohair",
    name: "Mohair",
    quality: "Kid Mohair & Wool",
    weight: "240g",
    mill: "Biella, Italy",
    note: "A dry, faint lustre. The evening cloth, and the only one that glints.",
    asset: assets.clothInk,
    tone: 1.0,
  },
  {
    id: "flannel",
    name: "Flannel",
    quality: "Milled Flannel",
    weight: "340g",
    mill: "Huddersfield, England",
    note: "Rested twelve months before it is cut. Winter, and nothing else.",
    asset: assets.clothGrey,
    tone: 0.58,
  },
  {
    id: "linen",
    name: "Linen",
    quality: "Irish Linen",
    weight: "290g",
    mill: "County Down, Ireland",
    note: "It will crease by noon. That is the point of it.",
    asset: assets.clothOpen,
    tone: 0.62,
  },
];
