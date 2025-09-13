import classNames from "classnames";
import Image, { type StaticImageData } from "next/image";
import { memo, useEffect, useState } from "react";

import ArrowButton from "@/app/_components/ArrowButton/ArrowButton";
import Navbar from "@/app/_components/Navbar";
import MinusIcon from "@/app/_components/svgs/MinusIcon";
import PlusIcon from "@/app/_components/svgs/PlusIcon";
import useViewport from "@/app/_hooks/useViewport";
import styles from "@/app/our-work/index.module.scss";

import Footer from "../Footer";

const cx = classNames.bind(styles);

interface MonthViewProps {
  content: string;
  footerEnabled: boolean;
  handleImageLoad: (() => void) | undefined;
  id: string;
  images: StaticImageData[];
  navbarEnabled: boolean;
  position: "left" | "right";
  title: string;
}

const MonthView = ({
  content,
  footerEnabled,
  handleImageLoad,
  id,
  images,
  navbarEnabled,
  position,
  title,
}: MonthViewProps) => {
  const { width } = useViewport();
  const [showContent, setShowContent] = useState<boolean | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

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

  const handlePrev = () => {
    setCurrentImageIdx((idx) => (idx > 0 ? idx - 1 : images.length - 1));
  };
  const handleNext = () => {
    setCurrentImageIdx((idx) => (idx < images.length - 1 ? idx + 1 : 0));
  };

  return (
    <>
      <div className={cx(styles.container)} id={id}>
        {navbarEnabled && <Navbar />}
        <div
          className={cx(styles.monthViewRow)}
          style={{
            alignItems: "stretch",
            alignItems: "stretch",
            display: "flex",
            flexDirection: position === "left" ? "row" : "row-reverse",
            gap: "2rem",
            gap: "2rem",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flex: 1,
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            <div
              style={{ maxWidth: "50%", position: "relative", width: "100%" }}
            >
              <Image
                alt="backsplash"
                loading="eager"
                onLoad={handleImageLoad}
                placeholder="blur"
                priority
                src={
                  images[currentImageIdx] ? images[currentImageIdx] : images[0]
                }
                style={{
                  borderRadius: "24px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                  display: "block",
                  height: "auto",
                  maxHeight: "300px",
                  objectFit: "cover",
                  paddingBottom: "24px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  width: "100%",
                }}
              />
              <ArrowButton
                ariaLabel="Previous image"
                direction="left"
                onClick={handlePrev}
                size={40}
                style={{
                  left: position === "left" ? 8 : undefined,
                  position: "absolute",
                  right: position === "right" ? 8 : undefined,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                }}
              />
              <ArrowButton
                ariaLabel="Next image"
                direction="right"
                onClick={handleNext}
                size={40}
                style={{
                  left: position === "right" ? 8 : undefined,
                  position: "absolute",
                  right: position === "left" ? 8 : undefined,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                }}
              />
            </div>
          </div>
          <div
            className={cx(
              position === "right"
                ? styles.descriptionRight
                : styles.descriptionLeft,
              styles.descriptionContainer,
            )}
            onClick={() => setShowContent((prev) => !prev)}
            style={{
              boxSizing: "border-box",
              flex: 1,
              maxHeight: "400px",
              minWidth: 0,
              overflowY: "auto",
              padding: "1rem",
            }}
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
        </div>
      </div>
      {footerEnabled && <Footer />}
    </>
  );
};

export default memo(MonthView);
