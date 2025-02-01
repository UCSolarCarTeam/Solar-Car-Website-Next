import Head from "next/head";
import { memo } from "react";

import Footer from "@/components/Footer";
import SupportUsPage from "@/pages/support-us/SupportUsPage";
import styles from "@/pages/support-us/index.module.scss";

const SupportUs = () => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Support Us</title>
      </Head>
      <main className={styles.main}>
        <SupportUsPage />
      </main>
      <Footer />
    </>
  );
};

export default memo(SupportUs);
