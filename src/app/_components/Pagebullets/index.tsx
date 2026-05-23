"use client";

import { memo, useCallback, useMemo, useState } from "react";

import styles from "@/app/_components/Pagebullets/index.module.scss";
import Dot from "@/app/_components/svgs/Dot";
import { useIntersectionObserver } from "@/app/_hooks/useIntersectionObserver";

interface PageBulletsProps {
  defaultCurrentId: string;
  pageIds: string[];
}

const PageBullets = ({ defaultCurrentId, pageIds }: PageBulletsProps) => {
  const [currentId, setCurrentId] = useState(defaultCurrentId);

  const dotsWithDistance = useMemo(() => {
    const currentIndex = pageIds.indexOf(currentId);
    return pageIds.map((id, index) => ({
      distanceFromActive: Math.abs(currentIndex - index),
      id,
    }));
  }, [currentId, pageIds]);

  useIntersectionObserver(pageIds, setCurrentId);

  const handleDotClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className={styles.pageBullets}>
      {dotsWithDistance.map(({ distanceFromActive, id }) => (
        <Dot
          distanceFromActive={distanceFromActive}
          handleDotClick={handleDotClick}
          id={id}
          isActive={currentId === id}
          key={id}
        />
      ))}
    </div>
  );
};

export default memo(PageBullets);
