"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import useReducedMotion from "@/app/_hooks/useReducedMotion";
import { fadeUp, staggerContainer } from "@/lib/animation/variants";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Use stagger container so direct children animate one by one */
  stagger?: boolean;
  delay?: number;
  /** Amount of element that must be visible before triggering (0–1) */
  threshold?: number;
}

/**
 * Wraps any section content and fades + slides it up when scrolled into view.
 * Add `stagger` to have each direct child animate sequentially.
 *
 * When prefers-reduced-motion is active, renders children immediately
 * without any animation wrapper.
 */
export default function SectionReveal({
  children,
  className,
  stagger = false,
  delay = 0,
  threshold = 0.15,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const prefersReduced = useReducedMotion();

  // Reduced motion: render content immediately, no animation
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const variants = stagger ? staggerContainer : fadeUp;
  const childVariants = stagger ? fadeUp : undefined;

  return (
    <motion.div
      animate={isInView ? "visible" : "hidden"}
      className={className}
      initial="hidden"
      ref={ref}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      variants={variants}
    >
      {stagger && childVariants ? (
        // Wrap each child in a motion.div with the fadeUp variant
        Array.isArray(children) ? (
          children.map((child, i) => (
            <motion.div key={i} variants={childVariants}>
              {child}
            </motion.div>
          ))
        ) : (
          <motion.div variants={childVariants}>{children}</motion.div>
        )
      ) : (
        children
      )}
    </motion.div>
  );
}
