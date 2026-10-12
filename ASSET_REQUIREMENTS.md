# Asset requirements

Every photograph on this site is a **placeholder**. They are stock frames,
chosen because they survive the site's grading, and they are all referenced
through one file — `src/lib/assets.ts` — so the whole art direction can be
re-shot in one place.

To swap in production photography: drop files into `public/assets/`, replace
the `src` values in `src/lib/assets.ts`, and delete the `remotePatterns` entry
in `next.config.ts` (it exists only for the placeholders).

## The one asset that is not a straight swap

`heroPlate` is cut into garment regions by `src/components/hero/suit-layers.ts`,
whose `clip` polygons trace *that specific frame's* seams. A replacement must be
front-on, sharp, evenly lit, shot against a plain ground, and the polygons must
be re-traced against it. See "Upgrading the hero" below.

## Shot list

Brief for all of it: charcoal to near-black, one directional key, no colour
that isn't cloth. Anything shot bright gets pulled down so hard in grading that
detail is lost — expose for the shadows.

### Hero
| Key | What it must be |
| --- | --- |
| `heroPlate` | Front-on half-figure, dinner jacket being fastened. Plain dark ground, no face. This one frame carries the entire hero. |

### Cloth — macro, filling the frame, raking light across the weave
| Key | Cloth |
| --- | --- |
| `clothDark` | Black wool suiting. Also used for the hero's closing dive and the final section. |
| `clothInk` | Dark twill / mohair, with a dry lustre. |
| `clothGrey` | Grey flannel, fine open weave. |
| `clothDrape` | Cashmere falling in folds. |
| `clothOpen` | Linen, open slubby weave. |

### Detail — true macro, shallow depth of field
| Key | Subject |
| --- | --- |
| `detailButtons` | Horn buttons, held or laid on cloth. |
| `detailFastening` | Lapel edge and waist button, fastened. |
| `detailSwatches` | A hand moving across a bunch. |
| `detailBunches` | Bunch books stacked on the cutting table. |
| `detailRail` | Half-made garments on a workroom rail. |
| `detailMovement` | Spare near-black object study. |

### Atelier — shot for black and white; the section desaturates them entirely
| Key | Subject |
| --- | --- |
| `atelierMachine` | A tailor at the machine. |
| `editorialGlove` | Hands, gloves, the drape of a coat. |

### Collections — full-height editorial campaigns, not product shots
`collectionSignature`, `collectionEvening`, `collectionBusiness`,
`collectionWedding`.

## Upgrading the hero

The hero currently builds the garment from **one photograph cut along its own
seams**. Every layer is the same image at the same offset, so the assembled
frame is pixel-for-pixel the original — it cannot look like a collage. This is
the right approach when only finished photography exists.

If you obtain **true separated garment plates**, the hero upgrades part by part
with no code change. Save transparent PNG/WebP files and uncomment the matching
line in `LAYER_SOURCES` in `src/components/hero/suit-layers.ts`:

```
public/assets/suit/
  shirt.png         → shirt
  forepart.png      → lower
  sleeve-left.png   → sleeveLeft
  sleeve-right.png  → sleeveRight
  lapel-left.png    → frontLeft
  lapel-right.png   → frontRight
```

Each plate must be shot **from the same camera position, at the same focal
length, under the same lighting**, and exported on the same canvas size, so
that all six stacked at their natural position reconstruct the whole garment
exactly. That constraint is the entire reason the cut-photograph approach was
used instead — it is very hard to satisfy without a studio day.

A **3D suit (`.glb`)** would allow real camera moves rather than simulated
ones. That is a larger change: it needs React Three Fiber, a dynamically
imported scene, and the assembly re-authored against the model's own parts.
Worth it only with a model whose cloth shading holds up in close-up — a
mediocre GLB will look worse than the photograph does now.
