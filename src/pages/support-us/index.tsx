import Head from "next/head";
import { memo } from "react";

import Footer from "@/components/Footer";
import SupportUsPage from "@/pages/support-us/SupportUsPage";

const SupportUs = () => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Support Us</title>
      </Head>
      <main style={{ height: "100vh" }}>
        <SupportUsPage />
      </main>
      <Footer />
    </>
  );
};

export default memo(SupportUs);
