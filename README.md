# Aldermay — bespoke tailoring

A cinematic single-page site for a fictional Savile Row tailoring house. It is
built to read as a digital fashion film that happens to be interactive: the
scroll is a camera.

Next.js (App Router) · TypeScript · Tailwind v4 · GSAP/ScrollTrigger · Lenis.

```bash
npm run dev     # http://localhost:3000
npm run build
```

Two companion documents carry the things that aren't code:

- **`DIRECTION.md`** — the art direction, the hero storyboard scene by scene,
  the section rhythm, and the motion tiers.
- **`ASSET_REQUIREMENTS.md`** — every photograph is a placeholder; this is the
  shot list that replaces them, and the upgrade path for the hero.

## The hero

Six scenes on one 0→1 timeline, scrubbed by a single pin over ~7 viewports:
the cloth, the cut, construction, details, assembly, the reveal — then a dive
into the jacket's own weave that becomes the next section's ground. Scenes
overlap at their seams so the camera is always already moving.

It is built from **one real photograph**, not artwork. `suit-layers.ts` renders
that photograph several times over, each copy clipped to a polygon tracing a
real seam — shirt, forepart, two sleeves, two coat fronts. Because every layer
is the same image at the same offset, the assembled frame is pixel-for-pixel
the original: it cannot look like a collage. Each part carries a `depth`, which
turns one set of offsets into foreground and background planes.

To re-time the film, edit `SCENE` in `hero/Hero.tsx`. To upgrade to true
separated garment plates or a 3D model, see `ASSET_REQUIREMENTS.md` — the
manifest is built so real assets drop in part by part with no code change.

## Structure

```
src/
  app/                    layout (fonts, chrome), page (section order), globals.css
  data/
    fabrics.ts            the bunch — cloths, weights, mills
  lib/
    assets.ts             image manifest — the single swap point
    entrance.ts           the gate the preloader opens
    gsap.ts               plugin registration + house defaults
    useMotionProfile.ts   breakpoint + reduced-motion aware motion tiers
    nav.ts                nav links, shared by header/curtain/footer
  components/
    layout/               Preloader, SmoothScroll (Lenis↔ScrollTrigger),
                          Navigation, Cursor, GrainOverlay, Footer
    hero/                 Hero (the film), SuitPlate, suit-layers (data),
                          Atmosphere, scenes/ (ClothScene, DetailScene)
    sections/             Manifesto, ClothSection, DetailObsession,
                          BespokeProcess, Collections, SuitAnatomy,
                          Personalisation, Atelier, Philosophy, Ceremony,
                          Invitation
    ui/                   RevealText (masked lines), Reveal (fade+rise),
                          ParallaxImage, Magnetic
```

Animation lives in `gsap.context()` per component, cleaned up on unmount, and
every pinned sequence uses `invalidateOnRefresh` so it re-measures on resize.

## Verifying

```bash
npm run build && npx next start -p 3210

# frames at given scroll positions and widths, plus an overflow assertion
VIEWPORTS='[["1440",1440,900],["390",390,844]]' STOPS='[0,4,8]' node scripts/shoot.mjs

# the same, tiled into one contact sheet — the fast way to review a sequence
OUT=./.sheets NAME=hero STOPS='[0,1,2,3,4,5,6,7]' node scripts/sheet.mjs

node scripts/interact.mjs   # curtain, hotspots, collection hover
node scripts/a11y.mjs       # the reduced-motion contract
node scripts/resize.mjs     # pins release and re-measure
```

Checked at 1920, 1600, 1440, 1366, 1280, 1100, 1024, 768, 430, 390 and 375 —
no horizontal overflow at any width, no console or page errors, pins re-measure
across resize with no gaps, and under `prefers-reduced-motion` no pin is created,
the preloader never plays, and every masked line is handed to the visitor.
