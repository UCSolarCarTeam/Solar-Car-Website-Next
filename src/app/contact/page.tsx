"use client";

import Head from "next/head";
import Image from "next/image";
import backsplash from "public/assets/contact/backsplash.png";
import { memo, useCallback, useState } from "react";

import Footer from "@/app/_components/Footer";
import Loader from "@/app/_components/Loader";
import Navbar from "@/app/_components/Navbar";
import styles from "@/app/contact/index.module.scss";

const Contact = () => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Calgary Solar Car - Contact Us</title>
      </Head>
      {isImageLoading && <Loader isImageLoading={isImageLoading} />}
      <main className={styles.main}>
        <>
          <Navbar />
          <div className={styles.container}>
            <div className={styles.pageHeading}>Contact Us</div>
            <div className={styles.descriptionContainer}>
              <div>
                <form id="contact-form" method="POST">
                  <div>
                    <label htmlFor="name">Name</label>
                    <input
                      className={styles.formInput}
                      id="name"
                      placeholder="Value"
                      type="text"
                    />
                  </div>
                  <div>
                    <label htmlFor="surname">Surname</label>
                    <input
                      className={styles.formInput}
                      id="surname"
                      placeholder="Value"
                      type="text"
                    />
                  </div>
                  <div>
                    <label htmlFor="inputEmail">Email address</label>
                    <input
                      className={styles.formInput}
                      id="inputEmail"
                      placeholder="Value"
                      type="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="message">Message</label>
                    <textarea
                      className={styles.formInput}
                      id="message"
                      placeholder="Value"
                    ></textarea>
                  </div>
                  <div>
                    <button className={styles.submitButton} type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <Image
              alt="backsplash"
              fill
              id="backsplashImage"
              loading="eager"
              onLoadingComplete={handleImageLoad}
              placeholder="blur"
              priority
              src={backsplash}
              style={{ objectFit: "cover" }}
            />
          </div>
        </>
      </main>
      <Footer />
    </>
  );
};

export default memo(Contact);
