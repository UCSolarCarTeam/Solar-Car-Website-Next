import Head from "next/head";
import { memo } from "react";

import Footer from "@/components/Footer";
import ContactPage from "@/pages/contact/ContactPage";

const Contact = () => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Contact Us</title>
      </Head>
      <main style={{ height: "100vh" }}>
        <ContactPage />
      </main>
      <Footer />
    </>
  );
};

export default memo(Contact);
