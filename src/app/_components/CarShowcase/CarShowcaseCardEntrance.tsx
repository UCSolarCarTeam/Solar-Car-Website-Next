"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function CarShowcaseCardEntrance({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
