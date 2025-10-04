// these images are placeholders for neow
import backsplash1 from "public/assets/cars/backsplash1.png";
import backsplash2 from "public/assets/cars/backsplash2.jpeg";
import backsplash3 from "public/assets/cars/backsplash3.jpeg";
import backsplash4 from "public/assets/cars/backsplash4.jpeg";
import backsplash5 from "public/assets/cars/backsplash5.jpeg";
import backsplash6 from "public/assets/cars/backsplash6.jpeg";
import { memo } from "react";

// import YearSection from "@/app/_components/OurWork/Timeline";
import YearSection from "@/app/_components/OurWork/YearSection";
import styles from "@/app/our-work/index.module.scss";

// ^^

// placeholder data
export const timelineData = [
  {
    months: [
      {
        description:
          "Frame design finalized and initial chassis welding completed.",
        image: backsplash1,
        month: "January",
      },
      {
        description:
          "Electrical system prototyping and solar array layout planning.",
        image: backsplash2,
        month: "February",
      },
      {
        description:
          "Frame design finalized and initial chassis welding completed.",
        image: backsplash1,
        month: "March",
      },
      {
        description:
          "Electrical system prototyping and solar array layout planning.",
        image: backsplash2,
        month: "April",
      },
      {
        description:
          "Frame design finalized and initial chassis welding completed.",
        image: backsplash1,
        month: "May",
      },
      {
        description:
          "Electrical system prototyping and solar array layout planning.",
        image: backsplash2,
        month: "June",
      },
      {
        description:
          "Frame design finalized and initial chassis welding completed.",
        image: backsplash1,
        month: "July",
      },
      {
        description:
          "Electrical system prototyping and solar array layout planning.",
        image: backsplash2,
        month: "August",
      },
    ],
    year: "2025",
  },
  {
    months: [
      {
        description: "Aerodynamic testing and battery cooling system upgrades.",
        image: backsplash3,
        month: "March",
      },
      {
        description:
          "Final assembly and race preparation for Formula Sun Grand Prix.",
        image: backsplash4,
        month: "April",
      },
    ],
    year: "2024",
  },
  {
    months: [
      {
        description: "Cruiser-class bodywork completed and first test drive.",
        image: backsplash5,
        month: "May",
      },
      {
        description: "Educational outreach and solar car demonstrations.",
        image: backsplash6,
        month: "June",
      },
    ],
    year: "2023",
  },
];

const Timeline = () => (
  <div className={styles.timeline}>
    {timelineData.map((yearData) => (
      <YearSection key={yearData.year} yearData={yearData} />
    ))}
  </div>
);

export default memo(Timeline);
