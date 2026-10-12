import { useEffect, useLayoutEffect } from "react";

/** `useLayoutEffect` that doesn't warn during SSR. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
