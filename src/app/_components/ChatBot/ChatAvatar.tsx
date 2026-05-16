"use client";

import { motion } from "framer-motion";

import styles from "./ChatBot.module.scss";

export function CarAvatar({
  isThinking = false,
  size = 48,
}: {
  size?: number;
  isThinking?: boolean;
}) {
  return (
    <motion.div
      animate={
        isThinking
          ? {
              filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
              y: [0, -4, 0],
            }
          : { y: [0, -2, 0] }
      }
      className={styles.avatarContainer}
      style={{ flexShrink: 0, height: size * 0.7, width: size }}
      transition={{
        duration: isThinking ? 1.5 : 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <img
        alt="Helios car"
        className={styles.avatarImage}
        src="/assets/HeliosSideview.png"
      />
    </motion.div>
  );
}

export function TypingDots() {
  return (
    <div className={styles.typingDotsContainer}>
      {[0, 1, 2].map((i) => (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], y: [0, -6, 0] }}
          className={styles.typingDot}
          key={i}
          transition={{
            delay: i * 0.2,
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
