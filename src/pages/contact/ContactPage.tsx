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
        <Image
          alt="backsplash"
          fill
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
