import * as motion from "framer-motion/client";
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
 */
export default function SectionReveal({
  children,
  className,
  stagger = false,
  delay = 0,
  threshold = 0.15,
}: SectionRevealProps) {
  const variants = stagger ? staggerContainer : fadeUp;
  const childVariants = stagger ? fadeUp : undefined;

  return (
    <motion.div
      className={className}
      initial="hidden"
      transition={delay ? { delayChildren: delay } : undefined}
      variants={variants}
      viewport={{ once: true, amount: threshold }}
      whileInView="visible"
    >
      {stagger && childVariants ? (
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
