"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { type ReactNode, useRef } from "react";
import useReducedMotion from "@/app/_hooks/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
  /** Pass onClick for the inner wrapper */
  onClick?: () => void;
}

/**
 * Wraps any element and makes it magnetically pulled toward the cursor
 * when hovered. The pull amount is controlled by `strength` (0–1).
 *
 * When prefers-reduced-motion is active, renders as a plain wrapper
 * with no spring-based tracking (the pull effect can cause nausea).
 */
export default function MagneticButton({
  children,
  className,
  style,
  strength = 0.35,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReduced) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Reduced motion: plain div, no spring tracking
  if (prefersReduced) {
    return (
      <div
        className={className}
        data-cursor="interactive"
        onClick={onClick}
        ref={ref}
        style={{ ...style, display: "inline-block" }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      data-cursor="interactive"
      onClick={onClick}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={ref}
      style={{ ...style, x: springX, y: springY, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
