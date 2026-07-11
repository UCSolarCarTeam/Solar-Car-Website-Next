import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

/**
 * Returns `true` when the OS requests reduced motion.
 * Use only for vestibular-heavy effects (smooth scroll, parallax).
 * Decorative hovers and reveals should stay enabled — Framer Motion's
 * `MotionConfig reducedMotion="user"` handles shortening those automatically.
 */
export default function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
