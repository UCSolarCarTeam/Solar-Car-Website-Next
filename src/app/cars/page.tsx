import { memo } from "react";

import CarScreenView from "@/app/_components/Cars/CarScreenView";
import Pagebullets from "@/app/_components/Pagebullets";
import { pageIds } from "@/app/cars/carInformation";
import styles from "@/app/cars/index.module.scss";

const Cars = () => {
  return (
    <>
      <main style={{ height: "auto" }}>
        <div className={styles.snapContainer}>
          <Pagebullets
            defaultCurrentId="Helios"
            pageIds={Object.keys(pageIds)}
          />
          {Object.entries(pageIds).map(([id, value], index) => (
            <CarScreenView
              className={styles.snapItem}
              content={value.content}
              footerEnabled={index === Object.keys(pageIds).length - 1}
              id={id}
              image={value.image}
              key={id}
              navbarEnabled={index === 0}
              position={value.position as "left" | "right"}
              title={value.title}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default memo(Cars);
