import Image from "next/image";
import backsplash from "public/assets/contact/backsplash.png";
import { memo } from "react";

import Navbar from "@/components/Navbar";
import styles from "@/pages/contact/index.module.scss";

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.pageHeading}>Contact Us</div>
        <div className={styles.descriptionContainer}>
          <div>
            <form id="contact-form" method="POST" onSubmit="">
              <div>
                <label id="name">Name</label>
                <input
                  className={styles.formInput}
                  placeholder="Value"
                  type="text"
                />
              </div>
              <div>
                <label id="surname">Surname</label>
                <input
                  className={styles.formInput}
                  placeholder="Value"
                  type="text"
                />
              </div>
              <div>
                <label id="inputEmail">Email address</label>
                <input
                  className={styles.formInput}
                  placeholder="Value"
                  type="email"
                />
              </div>
              <div>
                <label id="message">Message</label>
                <textarea
                  className={styles.formInput}
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
          placeholder="blur"
          priority
          src={backsplash}
          style={{ objectFit: "cover" }}
        />
      </div>
    </>
  );
};

export default memo(ContactPage);
