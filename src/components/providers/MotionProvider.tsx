"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Lets Framer Motion respect OS reduced-motion settings without
 * stripping hover/magnetic effects in every component manually.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
