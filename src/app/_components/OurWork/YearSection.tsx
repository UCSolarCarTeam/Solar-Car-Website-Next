import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import styles from "@/app/our-work/index.module.scss";

import { type timelineData } from "./Timeline";

const swipeVariants = {
  center: {
    position: "relative",
    x: 0,
  },
  enter: (direction: number) => ({
    position: "absolute",
    x: direction > 0 ? 700 : -700,
  }),
  exit: (direction: number) => ({
    position: "absolute",
    x: direction < 0 ? 700 : -700,
  }),
};

const YearSection = ({ yearData }: { yearData: (typeof timelineData)[0] }) => {
  const [[monthIdx, direction], setMonth] = useState<[number, number]>([0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const month = yearData.months[monthIdx];

  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const paginate = useCallback(
    (newIdx: number) => {
      if (newIdx === monthIdx) return;
      setMonth([newIdx, newIdx > monthIdx ? 1 : -1]);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [monthIdx],
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 20 && monthIdx < yearData.months.length - 1) {
          paginate(monthIdx + 1);
        } else if (e.deltaX < -20 && monthIdx > 0) {
          paginate(monthIdx - 1);
        }
      }
    };
    const node = imageWrapperRef.current;
    if (node) {
      node.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (node) node.removeEventListener("wheel", handleWheel);
    };
  }, [monthIdx, yearData.months.length, isAnimating, paginate]);

  return (
    <div className={styles.yearSection} id={yearData.year}>
      <div className={styles.yearContainer}>
        <div className={styles.yearLabelContainer}>
          <span className={styles.yearLabel}>{yearData.year}</span>
        </div>
        <LayoutGroup>
          <div className={styles.imageWrapper} ref={imageWrapperRef}>
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                animate="center"
                className={styles.monthCard}
                custom={direction}
                exit="exit"
                initial="enter"
                key={monthIdx}
                style={{ position: "absolute" }}
                transition={{
                  opacity: { duration: 0.4 },
                  x: {
                    damping: 30,
                    stiffness: 200,
                    type: "spring",
                  },
                }}
                variants={swipeVariants}
              >
                <Image
                  alt={month?.month ?? ""}
                  className={styles.monthImage}
                  src={month?.image ?? ""}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1 }}
              className={styles.monthContent}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={monthIdx}
              transition={{ duration: 0.4 }}
            >
              <h3 className={styles.monthTitle}>{month?.month}</h3>
              <p className={styles.monthDescription}>{month?.description}</p>
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
      </div>
      <div className={styles.horizontalDots}>
        {yearData.months.map((_, index) => (
          <button
            className={`${styles.horizontalDot} ${index === monthIdx ? styles.active : ""}`}
            key={index}
            onClick={() => paginate(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(YearSection);
