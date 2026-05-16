"use client";

import { motion } from "framer-motion";

import styles from "./ChatBot.module.scss";

interface ChatTriggerProps {
  onClick: () => void;
}

export function ChatTrigger({ onClick }: ChatTriggerProps) {
  return (
    <motion.button
      animate={{ scale: 1 }}
      aria-label="Open SOLARIS chat assistant"
      className={styles.triggerButton}
      exit={{ scale: 0 }}
      initial={{ scale: 0 }}
      key="trigger"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(255,0,0,0.5)",
            "0 0 0 12px rgba(255,0,0,0)",
          ],
        }}
        className={styles.triggerRing}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.img
        alt="Helios solar car"
        animate={{ rotate: [-10, -7, -10] }}
        className={styles.triggerImage}
        src="/assets/HeliosSideview.png"
        style={{ transform: "rotate(-10deg)" }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </motion.button>
  );
}
