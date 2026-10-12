# Visual direction

## What this is

A digital fashion film for a bespoke tailoring house, which happens to be
interactive. The scroll is a camera, not a scrollbar.

**There is no reference video in this repository.** The direction below is
grounded in the brief's named references and in the material actually
available. If a reference film is added to `public/reference/`, the hero's
`SCENE` timings are the place to re-cut against it.

## The rules

**Dark, and genuinely dark.** Ground is `#08080a`. Every photograph is graded
down — `brightness` between 0.3 and 0.6 for anything shot bright — so that no
plate jumps out of the room. Two sections in a row that don't share a value are
a mistake.

**Champagne is trim, not colour.** `#c8a96b` appears on rules, indices, hover
states, one italic clause per headline, and the lining choices. Exactly one
section — Ceremony — is allowed to carry it across the whole frame, because a
wedding is the one commission that earns warmth.

**Type is composed with the image, not laid beside it.** Display serif
(Cormorant) for statements; sans (Jost) at 9–11px with 0.2–0.3em tracking for
everything structural. Headlines break where a line should break, not where the
container ends.

**Motion is deliberate.** Every reveal is a mask being drawn back. Nothing
bounces, nothing springs, nothing arrives at rest — scenes overlap so the
camera is already moving when the next one starts. Easing is long-tailed
(`expo.out`, `power2.inOut`); durations are measured in whole seconds.

**Nothing generic.** No cards, no glass, no gradient blobs, no three-column
feature grids. Rows, plates, rules and negative space.

## The film — hero storyboard

The hero is one 0→1 timeline scrubbed by a single pin over ~7 viewports.
Timings live in `SCENE` in `src/components/hero/Hero.tsx`; the numbers below
are that object.

| Range | Scene | What happens |
| --- | --- | --- |
| 0.00–0.07 | The room | Near black, one edge light. Title card rises: *The making of a presence.* Held until the preloader's curtain is up. |
| 0.05–0.21 | 01 · The Fabric | A bolt of black wool emerges from the dark and turns. A narrow band of light travels its full width, once. *It begins with the cloth.* |
| 0.19–0.34 | 02 · The Cut | The cutter's chalk is drawn on — shoulder, lapel roll, scye, waist suppression, hem — then the cloth opens out and falls away. *One length. One chance.* |
| 0.32–0.55 | 03 · Construction | Six garment parts surface on separate depth planes, blurred and scattered, drifting inward. *Structure becomes form.* |
| 0.55–0.70 | 04 · Details | The camera goes in. Three macro plates hold the full frame, each rising to cover the last. *The difference is measured in millimetres.* |
| 0.70–0.91 | 05 · Assembly | The parts close. Far plane lands first, lapels last, over everything. Nothing snaps. |
| 0.88–0.97 | 06 · The Reveal | Camera eases back off the finished garment. *Tailored to exist only once.* |
| 0.96–1.00 | Transition | The camera dives into the jacket's own weave, which becomes the ground the next section opens on. |

## Section rhythm

Loud and quiet alternate, and every pinned sequence is followed by something
that simply scrolls:

hero (pinned) → manifesto (breath) → cloth (interactive) → detail (pinned) →
journey (scroll) → collections (scroll) → anatomy (interactive) →
personalisation (interactive) → atelier (pinned, horizontal) →
philosophy (silence) → ceremony (emotion) → invitation (close).

## Motion tiers

`useMotionProfile()` returns `full` / `reduced` / `compact` / `still`.

- **full** (≥1024px) — everything: all pins, the seven-viewport hero, the
  horizontal atelier, magnetic controls, custom cursor.
- **reduced** (768–1023px) — same choreography, shorter travel, shorter pins.
- **compact** (<768px) — sections **rebuilt, not shrunk**. Pinned split screens
  become stacked sequences; the horizontal bench becomes a swipeable rail; the
  hero keeps its assembly on a shorter timeline with less scatter.
- **still** (`prefers-reduced-motion`) — Lenis never starts, no pin is ever
  created, the preloader never plays. The hero is a static composition of the
  finished garment. **All content remains present and readable** — every masked
  line is handed to the visitor rather than left hidden.
