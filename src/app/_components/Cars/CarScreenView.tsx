import classNames from "classnames";
import Image, { type StaticImageData } from "next/image";
import { memo, useEffect, useState } from "react";

import Navbar from "@/app/_components/Navbar";
import MinusIcon from "@/app/_components/svgs/MinusIcon";
import PlusIcon from "@/app/_components/svgs/PlusIcon";
import useViewport from "@/app/_hooks/useViewport";
import styles from "@/app/cars/index.module.scss";

import Footer from "../Footer";

const cx = classNames.bind(styles);

interface CarScreenViewProps {
  className: string | undefined;
  content: string;
  footerEnabled: boolean;
  handleImageLoad: (() => void) | undefined;
  id: string;
  image: StaticImageData;
  navbarEnabled: boolean;
  position: "left" | "right";
  title: string;
}

const CarScreenView = ({
  className,
  content,
  footerEnabled,
  handleImageLoad,
  id,
  image,
  navbarEnabled,
  position,
  title,
}: CarScreenViewProps) => {
  const { width } = useViewport();

  const [showContent, setShowContent] = useState<boolean | null>(null);

  useEffect(() => {
    if (width && width > 648) {
      setShowContent(true);
    } else if (width && width <= 648) {
      setShowContent(false);
    }
  }, [width]);

  if (!width || showContent === null) {
    return <div id={id}></div>;
  }

  return (
    <>
      <div className={cx(styles.container, className)} id={id}>
        {navbarEnabled && <Navbar />}
        <div
          className={cx(
            position === "right"
              ? styles.descriptionRight
              : styles.descriptionLeft,
            styles.descriptionContainer,
          )}
          onClick={() => setShowContent((prev) => !prev)}
        >
          <div className={styles.descriptionTitle}>
            <div>{title}</div>
            {width && width <= 648 && showContent ? (
              <MinusIcon />
            ) : width && width <= 648 && !showContent ? (
              <PlusIcon />
            ) : (
              <></>
            )}
          </div>
          <div
            className={cx(
              styles.descriptionContent,
              showContent ? styles.show : "",
            )}
          >
            {content}
          </div>
        </div>
        <Image
          alt="backsplash"
          className={styles.backSplashImage}
          fill
          loading="eager"
          onLoadingComplete={handleImageLoad}
          placeholder="blur"
          priority
          src={image}
          style={{ objectFit: "cover" }}
        />
      </div>
      {footerEnabled && <Footer />}
    </>
  );
};

export default memo(CarScreenView);
