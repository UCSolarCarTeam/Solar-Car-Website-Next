import classNames from "classnames";
import Image, { type StaticImageData } from "next/image";
import { memo } from "react";

import Navbar from "@/components/Navbar";
import styles from "@/pages/cars/index.module.scss";

const cx = classNames.bind(styles);

interface CarPageProps {
  content: string;
  className: string | undefined;
  id: string;
  image: StaticImageData;
  navbarEnabled: boolean;
  title: string;
}

const CarPage = ({
  className,
  content,
  id,
  image,
  navbarEnabled,
  title,
}: CarPageProps) => {
  return (
    <>
      <div className={cx(styles.container, className)} id={id}>
        {navbarEnabled && <Navbar />}
        <div className={styles.descriptionContainer}>
          <div className={styles.descriptionTitle}>{title}</div>
          <div>{content}</div>
        </div>
        <Image
          alt="backsplash"
          className={styles.backsplashImage}
          fill
          loading="eager"
          placeholder="blur"
          priority
          src={image}
          style={{ objectFit: "cover" }}
        />
      </div>
    </>
  );
};

export default memo(CarPage);
