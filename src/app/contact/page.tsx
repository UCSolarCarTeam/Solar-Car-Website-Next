"use client";

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
      {isImageLoading && <Loader isLoading={isImageLoading} />}
      <main>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.pageHeading}>Contact Us</div>
          <div className={styles.descriptionTitle}>
            {`We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.`}
          </div>

          <div className={styles.descriptionContainer}>
            <form id="contact-form" method="POST">
              <div className={styles.rowGroup}>
                <div>
                  <label htmlFor="name">First Name</label>
                  <input
                    className={styles.formInput}
                    id="name"
                    placeholder="First Name"
                    type="text"
                  />
                </div>

                <div>
                  <label htmlFor="surname">Last Name</label>
                  <input
                    className={styles.formInput}
                    id="surname"
                    placeholder="Last Name"
                    type="text"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inputEmail">Email Address</label>
                <input
                  className={styles.formInput}
                  id="inputEmail"
                  placeholder="Email Address"
                  type="email"
                />
              </div>

              <div>
                <label htmlFor="message">Message</label>
                <textarea
                  className={styles.formInput}
                  id="message"
                  placeholder="Message"
                ></textarea>
              </div>

              <div>
                <button className={styles.submitButton} type="submit">
                  Submit
                </button>
              </div>
            </form>
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

export default memo(Contact);
