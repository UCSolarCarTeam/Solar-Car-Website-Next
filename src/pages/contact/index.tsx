import Head from "next/head";
import Image from "next/image";
import backsplash from "public/assets/contact/backsplash.png";
import { memo } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import styles from "@/pages/contact/index.module.scss";

const Contact = () => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Contact Us</title>
      </Head>
      <main className={styles.main}>
        <>
          <Navbar />
          <div className={styles.container}>
            <div className={styles.pageHeading}>Contact Us</div>
            <div className={styles.descriptionContainer}>
              <div>
                <form id="contact-form" method="POST">
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
                    <label htmlFor="surname">Surname</label>
                    <input
                      className={styles.formInput}
                      id="surname"
                      placeholder="Surname"
                      type="text"
                    />
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
            </div>
            <Image
              alt="backsplash"
              fill
              id="backsplashImage"
              loading="eager"
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
