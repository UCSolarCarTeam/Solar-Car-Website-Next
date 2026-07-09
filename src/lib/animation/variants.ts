/**
 * Framer Motion variant presets.
 * Import and spread onto `variants` prop of `motion.*` elements.
 */
import type { Variants } from "framer-motion";
import {
  DUR_MED,
  DUR_SLOW,
  EASE_OUT_EXPO,
  STAGGER_COARSE,
  STAGGER_FINE,
} from "./constants";

// ── Fade + upward translate (section reveal) ──────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DUR_MED,
      ease: EASE_OUT_EXPO,
    },
  },
};

// ── Staggered container wrapper ───────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_FINE,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerCoarse: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_COARSE,
      delayChildren: 0.15,
    },
  },
};

// ── Fade in only ──────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DUR_MED, ease: "easeOut" },
  },
};

// ── Slide from left ───────────────────────────────────────────
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DUR_MED, ease: EASE_OUT_EXPO },
  },
};

// ── Scale up (card hover reveal) ─────────────────────────────
export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DUR_MED, ease: EASE_OUT_EXPO },
  },
};

// ── Nav underline draw ────────────────────────────────────────
export const navUnderline: Variants = {
  rest: { scaleX: 0, originX: 0 },
  hover: {
    scaleX: 1,
    originX: 0,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
};

// ── Hero headline reveal (character by character) ─────────────
export const heroChar: Variants = {
  hidden: { opacity: 0, y: "110%", rotateX: -40 },
  visible: {
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: { duration: DUR_SLOW, ease: EASE_OUT_EXPO },
  },
};

// ── Data label pop-in ─────────────────────────────────────────
export const labelPop: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
