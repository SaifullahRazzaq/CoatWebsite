/**
 * Fixed film-grain plate. Rendered as an inline SVG data URI so it costs no
 * request and stays crisp at any density.
 */
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="220" height="220" filter="url(#n)" opacity="0.55"/>
    </svg>`,
  );

export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="grain"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "220px" }}
    />
  );
}
