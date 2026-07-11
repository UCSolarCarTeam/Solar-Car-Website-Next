/**
 * Framer Motion variant presets.
 */
import type { Variants } from "framer-motion";
import { DUR_MED, EASE_OUT_EXPO, STAGGER_FINE } from "./constants";

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

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_FINE,
      delayChildren: 0.1,
    },
  },
};
