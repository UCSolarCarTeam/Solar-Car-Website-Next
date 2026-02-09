import { type Metadata } from "next";
import { memo } from "react";

import CarScreenView from "@/app/_components/Cars/CarScreenView";
import Pagebullets from "@/app/_components/Pagebullets";

import { pageIds } from "./carInformation";
import styles from "./index.module.scss";

export const metadata: Metadata = {
  description:
    "Explore the evolution of the University of Calgary Solar Car Team's vehicles. From our first car to our latest innovations, see how we've pushed the boundaries of solar racing technology.",
  title: "Our Cars | University of Calgary Solar Car Team",
};

const Cars = () => {
  return (
    <div className={styles.snapContainer}>
      <Pagebullets defaultCurrentId="Helios" pageIds={Object.keys(pageIds)} />
      {Object.entries(pageIds).map(([id, value], index) => (
        <CarScreenView
          className={styles.snapItem}
          content={value.content}
          footerEnabled={index === Object.keys(pageIds).length - 1}
          id={id}
          image={value.image}
          key={id}
          navbarEnabled={index === 0}
          position={value.position}
          title={value.title}
        />
      ))}
    </div>
  );
};

export default memo(Cars);
