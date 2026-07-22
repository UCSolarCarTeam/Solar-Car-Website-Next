import * as motion from "framer-motion/client";
import type { ReactNode } from "react";

export default function CarCardHover({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="h-full w-full"
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.div>
  );
}
