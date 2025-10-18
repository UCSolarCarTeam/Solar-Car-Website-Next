import { memo } from "react";

import YearSection from "@/app/_components/OurWork/YearSection";
import styles from "@/app/our-work/index.module.scss";

interface TimelineMonth {
  description: string;
  image: string | null;
  month: string;
}

export interface TimelineYear {
  months: TimelineMonth[];
  year: string;
}

interface TimelineProps {
  data?: TimelineYear[];
}

const Timeline = ({ data }: TimelineProps) => {
  if (!data || data.length === 0) {
    return <div className={styles.timeline}>Loading timeline...</div>;
  }

  return (
    <div className={styles.timeline}>
      {data.map((yearData) => (
        <YearSection key={yearData.year} yearData={yearData} />
      ))}
    </div>
  );
};

export default memo(Timeline);
