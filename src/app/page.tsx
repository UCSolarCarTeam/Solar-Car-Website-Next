"use client";

import Image from "next/image";
import backsplash from "public/assets/home/backsplash.jpeg";
import { memo, useCallback, useState } from "react";

import Footer from "@/app/_components/Footer";
import Loader from "@/app/_components/Loader";
import Navbar from "@/app/_components/Navbar";
import styles from "@/app/index.module.scss";

const Home = () => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  return (
    <>
      {isImageLoading && <Loader isLoading={isImageLoading} />}
      <main className={styles.main}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.pageHeading}>EDUCATE. INNOVATE. INSPIRE.</div>
          <div className={styles.descriptionContainer}>
            <div className={styles.descriptionTitle}>Schulich Elysia</div>
            <div>
              Schulich Elysia started it’s design phase in 2016 and this
              catamaran style cruise car was completed in 2019. This design was
              implemented to improve battery cooling as well as increase
              aerodynamics. Elysia raced in the 2019 American Solar Challenge
              where it took first place in the Multi Occupant Vehicle Class.
            </div>
          </div>
          <Image
            alt="backsplash"
            fill
            id="backsplashImage"
            loading="eager"
            onLoad={handleImageLoad}
            placeholder="blur"
            priority
            src={backsplash}
            style={{ objectFit: "cover" }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(Home);
