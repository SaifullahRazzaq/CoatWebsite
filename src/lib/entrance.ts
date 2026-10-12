/**
 * The entrance gate.
 *
 * The preloader owns the first two seconds of the page. Everything that opens
 * the film — the hero titles, the navigation bar — has to wait for it rather
 * than play to an empty room behind a black plate.
 *
 * Components call `onEntered`, which fires immediately if the curtain is
 * already up (a client-side remount, or a visitor who prefers reduced motion
 * and never saw a preloader at all).
 */

const EVENT = "atelier:entered";

let entered = false;

export function hasEntered() {
  return entered;
}

export function markEntered() {
  if (entered) return;
  entered = true;
  window.dispatchEvent(new Event(EVENT));
}

/** Returns an unsubscribe function. Safe to call before mount. */
export function onEntered(callback: () => void): () => void {
  if (entered) {
    callback();
    return () => {};
  }
  window.addEventListener(EVENT, callback, { once: true });
  return () => window.removeEventListener(EVENT, callback);
}
