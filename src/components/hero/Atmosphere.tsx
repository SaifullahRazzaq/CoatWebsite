"use client";

/**
 * The room the suit hangs in: a single key light from upper left, two soft
 * volumetric shafts, and drifting haze. All CSS — no canvas, no per-frame work
 * beyond compositor-only keyframes.
 */
export default function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Key light */}
      <div
        data-atmos="key"
        className="absolute -left-[18%] -top-[35%] h-[110vh] w-[80vw] rounded-full opacity-70 blur-[90px]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-champagne) 16%, transparent), transparent)",
        }}
      />
      {/* Cool fill from the right keeps the shadow side from going flat. */}
      <div
        data-atmos="fill"
        className="absolute -right-[22%] top-[12%] h-[80vh] w-[60vw] rounded-full opacity-40 blur-[100px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(120,134,158,0.16), transparent)",
        }}
      />

      {/* Volumetric shafts */}
      <div className="absolute inset-0 mix-blend-screen">
        <div
          data-atmos="ray"
          className="absolute -top-[40%] left-[8%] h-[190%] w-[26vw] origin-top opacity-[0.13] blur-[42px]"
          style={{
            transform: "rotate(14deg)",
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--color-champagne) 55%, transparent), transparent 72%)",
          }}
        />
        <div
          data-atmos="ray"
          className="absolute -top-[40%] left-[30%] h-[180%] w-[14vw] origin-top opacity-[0.09] blur-[36px]"
          style={{
            transform: "rotate(9deg)",
            background:
              "linear-gradient(to bottom, rgba(232,227,218,0.5), transparent 68%)",
          }}
        />
      </div>

      {/* Haze on the floor */}
      <div
        data-atmos="fog"
        className="absolute inset-x-[-20%] bottom-[-10%] h-[55vh] opacity-60 blur-[60px]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, rgba(46,48,56,0.75), transparent 70%)",
        }}
      />

      {/* Vignette — pulls the eye to the centre of frame. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 62% at 50% 46%, transparent 40%, var(--color-ink) 100%)",
        }}
      />
    </div>
  );
}
