import { memo, useMemo } from "react";

import styles from "@/app/_components/Pagebullets/index.module.scss";
import Dot from "@/app/_components/svgs/Dot";

interface PageBulletsProps {
  currentId: string;
  pageIds: string[];
  handleDotClick: (id: string) => void;
}

const PageBullets = ({
  currentId,
  handleDotClick,
  pageIds,
}: PageBulletsProps) => {
  const dotsWithDistance = useMemo(() => {
    const currentIndex = pageIds.indexOf(currentId);
    return pageIds.map((id, index) => ({
      distanceFromActive: Math.abs(currentIndex - index),
      id,
    }));
  }, [currentId, pageIds]);

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
