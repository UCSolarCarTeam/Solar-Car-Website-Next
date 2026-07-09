import { useEffect, useState } from "react";

/**
 * Returns `true` when the user's OS/browser has
 * `prefers-reduced-motion: reduce` enabled.
 *
 * Listens for live changes (e.g. user toggles the setting while the
 * page is open).  Falls back to `false` during SSR.
 */
export default function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
